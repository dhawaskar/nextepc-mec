#define TRACE_MODULE _mme_s10_inf

#include "core_lib.h"
#include "core_debug.h"
#include "3gpp_types.h"

#include "gtp/gtp_types.h"
#include "gtp/gtp_conv.h"
#include "gtp/gtp_message.h"
#include "gtp/gtp_node.h"
#include "gtp/gtp_xact.h"

#include "mme_context.h"
#include "mme_kdf.h"
#include "mme_gtp_path.h"

#include "mme_s10_inf.h"

static status_t encode_mm_context(gtp_mm_context_eps_t *mm_context, mme_ue_t *mme_ue)
{
    d_assert(mm_context && mme_ue, return CORE_ERROR,"Null Param");

    memset(mm_context, 0, sizeof(gtp_mm_context_eps_t));

    mm_context->security_mode = 4; /*FIXME : Only supports EPS Security mode */
    mm_context->nhi = 1;
    mm_context->drxi = 0;
    mm_context->ksi_asme = mme_ue->nas_eps.ksi;

    mm_context->num_quintuplets = 0;
    mm_context->num_quardruplet = 1;
    mm_context->uambri = 0;
    mm_context->osci = 0;

    mm_context->sambri = 1;

    /* Integrity algorithms */
    mm_context->nas_int_algo = mme_ue->selected_int_algorithm;
    /* Ciphering  algorithms */
    mm_context->nas_cipher_algo = mme_ue->selected_enc_algorithm;

    /* NAS DL Count */
    mm_context->nas_dl_count[0] = (mme_ue->dl_count >> 16) & 0xff;
    mm_context->nas_dl_count[1] = (mme_ue->dl_count >> 8) & 0xff;
    mm_context->nas_dl_count[2] = (mme_ue->dl_count ) & 0xff;

    /* NAS UL Count */
    mm_context->nas_ul_count[0] = (mme_ue->ul_count.i32 >> 16) & 0xff;
    mm_context->nas_ul_count[1] = (mme_ue->ul_count.i32 >> 8) & 0xff;
    mm_context->nas_ul_count[2] = (mme_ue->ul_count.i32 ) & 0xff;

    /* Kasme */
    memcpy(mm_context->kasme, mme_ue->kasme, 32);

    /* Authentication Quadruplet  */
    memcpy(mm_context->auth_quadruplet[0].rand, mme_ue->rand, RAND_LEN);
    mm_context->auth_quadruplet[0].xres_len =  mme_ue->xres_len;
    memcpy(mm_context->auth_quadruplet[0].xres, mme_ue->xres, mme_ue->xres_len);
    mm_context->auth_quadruplet[0].autn_len = AUTN_LEN;
    memcpy(mm_context->auth_quadruplet[0].autn, mme_ue->autn, AUTN_LEN);
    memcpy(mm_context->auth_quadruplet[0].kasme, mme_ue->kasme, 32);

    /* NH */
    memcpy(mm_context->nh, mme_ue->nh, 32);

    /* NCC */
    mm_context->ncc.ncc_v = mme_ue->nhcc;

    /* AMBR */
    mm_context->uplink_subscribed_ue_ambr = htonl(mme_ue->subscription_data.ambr.uplink/1000);
    mm_context->downlink_subscribed_ue_ambr = htonl(mme_ue->subscription_data.ambr.downlink/1000);

    /* UE network capability */
    memcpy(&mm_context->ue_network_capability, &mme_ue->ue_network_capability, 
            sizeof(mme_ue->ue_network_capability.length)+mme_ue->ue_network_capability.length);
    memcpy(&mm_context->ms_network_capability, &mme_ue->ms_network_capability, 
            sizeof(mme_ue->ms_network_capability.length)+mme_ue->ms_network_capability.length);

    return CORE_OK;
}

status_t mme_s10_build_ue_context_transfer(
        pkbuf_t **pkbuf, c_uint8_t type, mme_ue_t *mme_ue)
{
    status_t rv;
    gtp_message_t gtp_message;
    gtp_f_teid_t f_teid,pgw_s5c_teid;
    int len;
    enb_ue_t *enb_ue =  mme_ue->enb_ue;
    gtp_mm_context_eps_t mm_context_eps = {0};
    gtp_ue_context_transfer_t *msg = &gtp_message.ue_context_transfer;
    char mm_context_buf[1024];
    c_int8_t apn[MAX_APN_LEN];
    gtp_ambr_t ambr;
    gtp_bearer_qos_t bearer_qos;
    char bearer_qos_buf[GTP_BEARER_QOS_LEN];
    gtp_uli_t uli;
    char uli_buf[GTP_MAX_ULI_LEN];
    mme_sess_t *sess = NULL;
    mme_bearer_t *bearer = NULL;
    pdn_t *pdn = NULL;

    d_trace(3, "[MME] Build UE CONTEXT TRANSFER\n");
    memset(&gtp_message, 0, sizeof(gtp_message_t));

    /* IMSI */
    d_assert(mme_ue->imsi_len, return CORE_ERROR, "Null param");
    msg->imsi.presence = 1;
    msg->imsi.data = mme_ue->imsi;
    msg->imsi.len = mme_ue->imsi_len;

    /* Sender F-TEID for control plane */
    memset(&f_teid, 0, sizeof(gtp_f_teid_t));
    f_teid.interface_type = GTP_F_TEID_S10_MME_GTP_C;
    f_teid.teid = htonl(mme_ue->index);
    rv = gtp_sockaddr_to_f_teid(
            mme_self()->gtpc_addr, mme_self()->gtpc_addr6, &f_teid, &len);
    d_assert(rv == CORE_OK, return CORE_ERROR,);
    msg->sender_f_teid_for_control_plane.presence = 1;
    msg->sender_f_teid_for_control_plane.data = &f_teid;
    msg->sender_f_teid_for_control_plane.len = len;

    /* PDN Connections */
    {
        tlv_pdn_connection_t *pdn_connections = 
            &msg->mme_sgsn_ue_eps_pdn_connections;

        sess = mme_sess_first(mme_ue);
        pdn = sess->pdn;
        d_assert(pdn, return CORE_ERROR, "Null param");
        bearer = mme_default_bearer_in_sess(sess);

        /* APN */
        pdn_connections->apn.presence = 1;
        pdn_connections->apn.len = apn_build(apn, pdn->apn, strlen(pdn->apn));
        pdn_connections->apn.data = apn;

        /* IPv4 */

        /* IPv6 */

        /* Linked EPS Bearer ID : Default bearer of PDN connection */
        pdn_connections->linked_eps_bearer_id.presence = 1;
        pdn_connections->linked_eps_bearer_id.u8 = bearer->ebi;
        

        /* PGW S5 IP addres for control plane */
        memset(&pgw_s5c_teid, 0, sizeof(gtp_f_teid_t));
        pgw_s5c_teid.interface_type = GTP_F_TEID_S5_S8_PGW_GTP_C;
        if (pdn->pgw_ip.ipv4 || pdn->pgw_ip.ipv6)
        {
            pgw_s5c_teid.ipv4 = pdn->pgw_ip.ipv4;
            pgw_s5c_teid.ipv6 = pdn->pgw_ip.ipv6;
            if (pgw_s5c_teid.ipv4 && pgw_s5c_teid.ipv6)
            {
                pgw_s5c_teid.both.addr = pdn->pgw_ip.both.addr;
                memcpy(pgw_s5c_teid.both.addr6, pdn->pgw_ip.both.addr6,
                        sizeof pdn->pgw_ip.both.addr6);
                pdn_connections->pgw_s5s8_ip_address.len =
                    GTP_F_TEID_IPV4V6_LEN;
            }
            else if (pgw_s5c_teid.ipv4)
            {
                /* pdn->pgw_ip always uses both ip address memory */
                pgw_s5c_teid.addr = pdn->pgw_ip.both.addr;
                pdn_connections->pgw_s5s8_ip_address.len =
                    GTP_F_TEID_IPV4_LEN;
            }
            else if (pgw_s5c_teid.ipv6)
            {
                /* pdn->pgw_ip always uses both ip address memory */
                memcpy(pgw_s5c_teid.addr6, pdn->pgw_ip.both.addr6,
                        sizeof pdn->pgw_ip.both.addr6);
                pdn_connections->pgw_s5s8_ip_address.len =
                    GTP_F_TEID_IPV6_LEN;
            }
            pdn_connections->pgw_s5s8_ip_address.presence = 1;
            pdn_connections->pgw_s5s8_ip_address.data =
                &pgw_s5c_teid;
        }
        else
        {
            rv = gtp_sockaddr_to_f_teid(
                mme_self()->pgw_addr, mme_self()->pgw_addr6, &pgw_s5c_teid, &len);
            d_assert(rv == CORE_OK, return CORE_ERROR,);
            pdn_connections->pgw_s5s8_ip_address.presence = 1;
            pdn_connections->pgw_s5s8_ip_address.data = &pgw_s5c_teid;
            pdn_connections->pgw_s5s8_ip_address.len = len;
        }

        /* Bearer Contexts */
        //tlv_bearer_context_t bearer_contexts;
        pdn_connections->bearer_contexts.presence = 1;

        pdn_connections->bearer_contexts.eps_bearer_id.presence = 1;
        pdn_connections->bearer_contexts.eps_bearer_id.u8 = bearer->ebi;

        memset(&bearer_qos, 0, sizeof(bearer_qos));
        bearer_qos.qci = pdn->qos.qci;
        bearer_qos.priority_level = pdn->qos.arp.priority_level;
        bearer_qos.pre_emption_capability = pdn->qos.arp.pre_emption_capability;
        bearer_qos.pre_emption_vulnerability =
            pdn->qos.arp.pre_emption_vulnerability;
        pdn_connections->bearer_contexts.bearer_level_qos.presence = 1;
        gtp_build_bearer_qos(&pdn_connections->bearer_contexts.bearer_level_qos,
                &bearer_qos, bearer_qos_buf, GTP_BEARER_QOS_LEN);

        /* APN-AMBR */
        if (pdn->ambr.uplink || pdn->ambr.downlink)
        {
            memset(&ambr, 0, sizeof(gtp_ambr_t));
            ambr.uplink = htonl(pdn->ambr.uplink);
            ambr.downlink = htonl(pdn->ambr.downlink);
            pdn_connections->ambr.presence = 1;
            pdn_connections->ambr.data = &ambr;
            pdn_connections->ambr.len = sizeof(ambr);
        }
    
    }

    /* SGW F-TEID */
    memset(&f_teid, 0, sizeof(gtp_f_teid_t));
    f_teid.interface_type = GTP_F_TEID_S11_S4_SGW_GTP_C;
    f_teid.teid = htonl(mme_ue->sgw_s11_teid);
    rv = gtp_sockaddr_to_f_teid(
            mme_self()->gtpc_addr, mme_self()->gtpc_addr6, &f_teid, &len);
    d_assert(rv == CORE_OK, return CORE_ERROR,);
    msg->sender_f_teid_for_control_plane.presence = 1;
    msg->sender_f_teid_for_control_plane.data = &f_teid;
    msg->sender_f_teid_for_control_plane.len = len;

    /* MM Context */ 
    encode_mm_context(&mm_context_eps, mme_ue);
    gtp_build_mm_context(&msg->mme_sgsn_ue_mm_context,
            &mm_context_eps, mm_context_buf, 1024);

    /* Serving network */
    msg->serving_network.presence = 1;
    msg->serving_network.data = &mme_ue->visited_plmn_id;
    msg->serving_network.len = sizeof(mme_ue->visited_plmn_id);

    /* GUTI */
    msg->guti.presence = 1;
    msg->guti.data = &mme_ue->guti;
    msg->guti.len = sizeof(guti_t);


    /* MME UE S1AP ID */
    if (enb_ue) 
    {
        msg->mme_ue_s1ap_id_t.presence = 1;
        msg->mme_ue_s1ap_id_t.u32 = htonl(enb_ue->mme_ue_s1ap_id);

        /* ENB UE S1AP ID */
        msg->enb_ue_s1ap_id_t.presence = 1;
        msg->enb_ue_s1ap_id_t.u32 = htonl(enb_ue->enb_ue_s1ap_id);
    }
    else
    {
        d_error("Can not encode s1ap_id(enb_ue is NULL)");
        return CORE_ERROR;
    }

    /* ULI */
    memset(&uli, 0, sizeof(gtp_uli_t));
    uli.flags.e_cgi = 1;
    uli.flags.tai = 1;
    memcpy(&uli.tai.plmn_id, &mme_ue->tai.plmn_id, sizeof(uli.tai.plmn_id));
    uli.tai.tac = mme_ue->tai.tac;
    memcpy(&uli.e_cgi.plmn_id, &mme_ue->e_cgi.plmn_id, 
            sizeof(uli.e_cgi.plmn_id));
    uli.e_cgi.cell_id = mme_ue->e_cgi.cell_id;
    msg->user_location_information.presence = 1;
    gtp_build_uli(&msg->user_location_information, &uli, 
            uli_buf, GTP_MAX_ULI_LEN);

    /* PDN Type */
    d_assert(sess->request_type.pdn_type ==
            NAS_PDN_CONNECTIVITY_PDN_TYPE_IPV4 ||
            sess->request_type.pdn_type ==
            NAS_PDN_CONNECTIVITY_PDN_TYPE_IPV6 ||
            sess->request_type.pdn_type ==
            NAS_PDN_CONNECTIVITY_PDN_TYPE_IPV4V6, return CORE_ERROR,
            "UE PDN Configuration Error(%d)", sess->request_type.pdn_type);
    if (pdn->pdn_type == HSS_PDN_TYPE_IPV4 ||
        pdn->pdn_type == HSS_PDN_TYPE_IPV6 ||
        pdn->pdn_type == HSS_PDN_TYPE_IPV4V6)
    {
        msg->pdn_type.u8 = ((pdn->pdn_type + 1) & sess->request_type.pdn_type);
        d_assert(msg->pdn_type.u8 != 0, return CORE_ERROR,
                "PDN Configuration Error:(%d, %d)",
                pdn->pdn_type, sess->request_type.pdn_type);
    }
    else if (pdn->pdn_type == HSS_PDN_TYPE_IPV4_OR_IPV6)
    {
        msg->pdn_type.u8 = sess->request_type.pdn_type;
    }
    else
        d_assert(0, return CORE_ERROR,
                "HSS PDN Confiugration Error(%d)", pdn->pdn_type);
    msg->pdn_type.presence = 1;


    gtp_message.h.type = type;
    rv = gtp_build_msg(pkbuf, &gtp_message);
    d_assert(rv == CORE_OK, return CORE_ERROR, "gtp build failed");

    return CORE_OK;
}

status_t mme_s10_send_ue_context_transfer(mme_ue_t *mme_ue)
{
    status_t rv;
    gtp_header_t h;
    pkbuf_t *pkbuf = NULL;
    gtp_xact_t *xact = NULL;
    gtp_node_t *gnode = NULL;

    d_assert(mme_ue, return CORE_ERROR, "Null param");

    /*  Send ue_context_transfer to remote MME */
    for (gnode = list_first(&mme_self()->remote_mme_list);
            gnode; gnode = list_next(gnode))
    {
        memset(&h, 0, sizeof(gtp_header_t));
        h.type = GTP_UE_CONTEXT_TRANSFER;

        rv = mme_s10_build_ue_context_transfer(&pkbuf, h.type, mme_ue);
        d_assert(rv == CORE_OK, continue,
                "S10 build error");

        d_print_hex(pkbuf->payload, pkbuf->len);

        xact = gtp_xact_local_create(gnode, &h, pkbuf);
        d_assert(xact, continue, "Null param");

        rv = gtp_xact_commit(xact);
        d_assert(rv == CORE_OK, continue, "xact_commit error");
    }


    return CORE_OK;
}

status_t mme_s10_handle_ue_context_transfer(gtp_ue_context_transfer_t *msg)
{
    status_t rv = CORE_OK;
    gtp_f_teid_t *mme_s10_f_teid = NULL;
    ip_t addr;
    mme_remote_context_t *mme_remote_context = NULL;
    mme_remote_ue_t *mme_remote_ue = NULL;
    c_int8_t        imsi_bcd[MAX_IMSI_BCD_LEN+1];
    gtp_mm_context_eps_t mm_context;
    c_uint16_t decoded;
    gtp_uli_t uli;

    d_assert(msg, return CORE_ERROR, "Null param");


    core_buffer_to_bcd(msg->imsi.data, msg->imsi.len, imsi_bcd);
    d_trace(3,"[MME] Recv UE_CONTEXT_TRANSFER(imsi: %s, f_teid(P:%d, len:%d))\n",
            imsi_bcd,
            msg->sender_f_teid_for_control_plane.presence,
            msg->sender_f_teid_for_control_plane.len
            );

    /* Extract F_TEID */
    mme_s10_f_teid = msg->sender_f_teid_for_control_plane.data;
    rv = gtp_f_teid_to_ip(mme_s10_f_teid, &addr);
    d_assert(rv == CORE_OK, return rv, "gtp_f_teid_to_ip failed");

    /* Search MME based on IP address in F_TEID */
    mme_remote_context = mme_remote_context_find_by_ip(&addr);
    if (mme_remote_context == NULL)
    {
        mme_remote_context = mme_remote_context_create(&addr);
    }

    /* Search mme_remote_ue. If not exists, create one */
    mme_remote_ue = mme_remote_ue_find_by_imsi(mme_remote_context, 
            msg->imsi.data, msg->imsi.len);
    if (mme_remote_ue == NULL)
    {
        mme_remote_ue = mme_remote_ue_create(mme_remote_context, 
                msg->imsi.data, msg->imsi.len);
    }

    d_assert(mme_remote_ue, return CORE_ERROR, "mme_remote_ue is NULL");

    /* Add(or Update) mme_ue into remote mme lists */

    /* IMSI BCD */
    snprintf(mme_remote_ue->imsi_bcd,MAX_IMSI_BCD_LEN+1,"%s",imsi_bcd);

    /* Updte GUTI */
    if (msg->guti.presence)
    {
        memcpy(&mme_remote_ue->guti, msg->guti.data, msg->guti.len);
    }

    /* SGW F-TEID */
    //tlv_f_teid_t sgw_s11_s4_ip_address_and_teid_for_control_plane;

    /* MME_UE_S1AP_ID */
    mme_remote_ue->mme_ue_s1ap_id = ntohl(msg->mme_ue_s1ap_id_t.u32);
    /* ENB_UE_S1AP_ID */
    mme_remote_ue->enb_ue_s1ap_id = ntohl(msg->enb_ue_s1ap_id_t.u32);

    /* PDN Connections */
    if (msg->mme_sgsn_ue_eps_pdn_connections.presence)
    {
        tlv_apn_t *apn;

        apn = &msg->mme_sgsn_ue_eps_pdn_connections.apn;

        if (apn->presence)
        {
            apn_parse(mme_remote_ue->session[0].pdn.apn, apn->data, apn->len);
            mme_remote_ue->num_of_session++;
        }

    }

    /** MM Context for EPS */
    decoded = gtp_parse_mm_context(&mm_context, &msg->mme_sgsn_ue_mm_context);
    d_assert(decoded == msg->mme_sgsn_ue_mm_context.len, return CORE_ERROR,
            "gtp_parse_mm_context decode error(decoded = %d, tlvlen = %d",
            decoded,msg->mme_sgsn_ue_mm_context.len);

    mme_remote_ue->selected_int_algorithm = mm_context.nas_int_algo;
    mme_remote_ue->selected_enc_algorithm = mm_context.nas_cipher_algo;


    mme_remote_ue->dl_count = (mm_context.nas_dl_count[0] << 16 |
                               mm_context.nas_dl_count[1] << 8 |
                               mm_context.nas_dl_count[2]);
    mme_remote_ue->ul_count = (mm_context.nas_ul_count[0] << 16 |
                               mm_context.nas_ul_count[1] << 8 |
                               mm_context.nas_ul_count[2]);

    memcpy(mme_remote_ue->kasme, mm_context.kasme, 32);

#if 0
    /* kenb : ul_count shoud be one from service request or attach_req */
    mme_kdf_enb(mme_remote_ue->kasme, mme_remote_ue->ul_count, 
            mme_remote_ue->kenb);
#endif

    /* knas */
    mme_kdf_nas(MME_KDF_NAS_INT_ALG, mme_remote_ue->selected_int_algorithm,
            mme_remote_ue->kasme, mme_remote_ue->knas_int);
    mme_kdf_nas(MME_KDF_NAS_ENC_ALG, mme_remote_ue->selected_enc_algorithm,
            mme_remote_ue->kasme, mme_remote_ue->knas_enc);


    /* security */
    memcpy(mme_remote_ue->rand, mm_context.auth_quadruplet[0].rand, RAND_LEN);

    mme_remote_ue->xres_len = mm_context.auth_quadruplet[0].xres_len;
    memcpy(mme_remote_ue->xres, mm_context.auth_quadruplet[0].xres, mme_remote_ue->xres_len);
    memcpy(mme_remote_ue->autn, mm_context.auth_quadruplet[0].autn, AUTN_LEN);


    memcpy(mme_remote_ue->nh, mm_context.nh, 32);

    mme_remote_ue->nhcc = mm_context.ncc.ncc_v;

    /* AMBR */
    mme_remote_ue->ambr_uplink = ntohl(mm_context.uplink_subscribed_ue_ambr);
    mme_remote_ue->ambr_downlink = ntohl(mm_context.downlink_subscribed_ue_ambr);

    /* Network capability */
    memcpy(&mme_remote_ue->ue_network_capability, &mm_context.ue_network_capability,
            mm_context.ue_network_capability.length + 1);
    memcpy(&mme_remote_ue->ms_network_capability, &mm_context.ms_network_capability,
            mm_context.ms_network_capability.length + 1);

    /* Serving network */
    if (msg->serving_network.presence)
    {
        memcpy(&mme_remote_ue->visited_plmn_id, msg->serving_network.data, 
                msg->serving_network.len);
    }

    /* ULI */
    decoded = gtp_parse_uli(&uli, &msg->user_location_information);
    d_assert(msg->user_location_information.len == decoded, return CORE_ERROR,
            "gtp_parse_uli error");
    memcpy(&mme_remote_ue->tai.plmn_id, &uli.tai.plmn_id, sizeof(uli.tai.plmn_id));
    mme_remote_ue->tai.tac = uli.tai.tac;
    memcpy(&mme_remote_ue->e_cgi.plmn_id, &uli.e_cgi.plmn_id, sizeof(uli.e_cgi.plmn_id));
    mme_remote_ue->e_cgi.cell_id = uli.e_cgi.cell_id;

    /* PDN type - 1:IPv4, 2: IPv6, 3:IPv4IPv6 */
    if (msg->pdn_type.presence)
    {
        mme_remote_ue->session[0].pdn.pdn_type = msg->pdn_type.u8;
    }

#if 1
    mme_remote_ue_print(mme_remote_ue);
#endif

    return rv;
}

status_t mme_remote_restore(mme_remote_context_t *mme_remote)
{
    mme_remote_ue_t *iter = NULL;
    mme_ue_t *mme_ue = NULL;
    status_t rv = CORE_OK;

    d_assert(mme_remote, return CORE_ERROR, "Null param");

    for (iter = list_first(&mme_remote->ue_list); iter; iter = list_next(iter))
    {
        mme_sess_t *sess = NULL;

        /* create mme_ue_context */
        mme_ue = mme_ue_add_by_remote_ue(iter);
        d_assert(mme_ue, continue, "mme_ue is NULL");

        /* Send create_session_request */
        sess = mme_sess_first(mme_ue);
        if (sess->pdn)
        {
            d_trace(5, "    APN[%s]\n", sess->pdn->apn);
            rv = mme_gtp_send_create_session_request(sess);
            d_assert(rv == CORE_OK, return CORE_ERROR, "gtp send failed");
        }

    }

    return CORE_OK;
}



















