CODEC_URL := https://github.com/mchehab/zbar/archive/master.tar.gz
CODEC_DIR := node_modules/zbar
CODEC_OUT_RELATIVE := zbar/.libs/libzbar.a
CODEC_OUT := $(addprefix $(CODEC_DIR)/, $(CODEC_OUT_RELATIVE))
OUT_JS := zbar.wasm
OUT_WASM := $(OUT_JS:.js=.wasm)

all: $(OUT_JS)

zbar.wasm: zbar.c $(CODEC_OUT)
	clang \
		-v \
	  -I $(CODEC_DIR)/include \
		${CXXFLAGS} \
		-nostartfiles \
		${LDFLAGS} \
	  -Wl,--no-entry \
		-o $@ \
		$+

$(CODEC_DIR)/zbar/.libs/libzbar.a: $(CODEC_DIR)/Makefile
	$(MAKE) -C $(CODEC_DIR)

$(CODEC_DIR)/Makefile: $(CODEC_DIR)/configure
	cd $(CODEC_DIR) && ./configure \
		--without-java \
		--enable-video=no \
		--with-python=no \
		--with-gir=no \
		--with-gtk=no \
		--with-dbus=no \
		--enable-doc=no \
		--with-x=no \
		--with-qt=no \
		--with-xshm=no \
		--without-imagemagick \
		--without-npapi \
		--disable-assert \
		--without-xv \
		--without-jpeg \
		--host=wasm32 \
		--disable-pthread

$(CODEC_DIR)/configure: $(CODEC_DIR)/configure.ac
	cd $(CODEC_DIR) && autoreconf -vfi

$(CODEC_DIR)/configure.ac: $(CODEC_DIR)

$(CODEC_DIR):
	mkdir -p $@ && \
	curl -sL $(CODEC_URL) | tar xz --strip 1 -C $@;

clean:
	$(RM) $(OUT_JS) $(OUT_WASM)
	$(RM) $(CODEC_DIR)/Makefile
	$(MAKE) -C $(CODEC_DIR) clean
