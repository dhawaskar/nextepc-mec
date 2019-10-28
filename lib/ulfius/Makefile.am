## Process this file with automake to produce Makefile.in

pkglib_LTLIBRARIES = libulfius.la

libulfius_la_SOURCES = \
	include/ulfius.h include/u_private.h \
	src/u_map.c src/u_response.c src/u_websocket.c \
	src/ulfius.c src/u_request.c src/u_send_request.c \
	$(NULL)

libulfius_la_DEPENDENCIES = \
	$(top_srcdir)/lib/orcania/liborcania.la \
	$(top_srcdir)/lib/yder/libyder.la \
	$(NULL)

AM_LDFLAGS = \
	-version-info @LIBVERSION@ \
	$(top_srcdir)/lib/orcania/liborcania.la \
	$(top_srcdir)/lib/yder/libyder.la \
	-lmicrohttpd \
	-lpthread \
	-ljansson \
	-lcurl \
	-lgnutls \
	$(NULL)

AM_CPPFLAGS = \
	-I$(top_srcdir)/lib/orcania/include \
	-I$(top_srcdir)/lib/yder/include \
	-I$(top_srcdir)/lib/ulfius/include \
	$(NULL)

AM_CFLAGS = \
	-Wall -Werror -D_REENTRANT \
	$(NULL)

MAINTAINERCLEANFILES = Makefile.in
MOSTLYCLEANFILES = *.stackdump
