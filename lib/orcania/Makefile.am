## Process this file with automake to produce Makefile.in

pkglib_LTLIBRARIES = liborcania.la

liborcania_la_SOURCES = \
	include/orcania.h \
	src/base64.c \
	src/memory.c \
	src/orcania.c \
	$(NULL)

liborcania_la_DEPENDENCIES = \
	$(NULL)

liborcania_la_LIBADD = \
	$(NULL)

AM_LDFLAGS = \
	-version-info @LIBVERSION@ \
	-ljansson \
	$(NULL)

AM_CPPFLAGS = \
	$(NULL)

AM_CFLAGS = \
	-Wall -Werror -Wextra -D_REENTRANT \
	$(NULL)

MAINTAINERCLEANFILES = Makefile.in 
MOSTLYCLEANFILES = *.stackdump
