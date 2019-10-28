#ifndef __MME_S10_INF_H__
#define __MME_S10_INF_H__

#include "gtp/gtp_message.h"

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

CORE_DECLARE(status_t)      mme_s10_send_ue_context_transfer(mme_ue_t *mme_ue);
CORE_DECLARE(status_t)      mme_s10_handle_ue_context_transfer(gtp_ue_context_transfer_t *msg);
CORE_DECLARE(status_t)      mme_remote_restore(mme_remote_context_t *mme_remote);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* __MME_S10_INF_H__ */
