## Process this file with automake to produce Makefile.in

pkglib_LTLIBRARIES = libyder.la

libyder_la_SOURCES = \
	include/yder.h \
	src/yder.c \
	$(NULL)

libyder_la_DEPENDENCIES = \
	$(NULL)

libyder_la_LIBADD = \
	$(NULL)

AM_LDFLAGS = \
	-version-info @LIBVERSION@ \
	$(top_srcdir)/lib/orcania/liborcania.la \
	-lsystemd
	$(NULL)

AM_CPPFLAGS = \
	-I$(top_srcdir)/lib/orcania/include \
	$(NULL)

AM_CFLAGS = \
	-Wall -Werror -D_REENTRANT \
	$(NULL)

MAINTAINERCLEANFILES = Makefile.in 
MOSTLYCLEANFILES = *.stackdump
