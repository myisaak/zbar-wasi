FROM alpine:latest

ENV SYSROOT "/opt/wasi-sysroot"
ENV RANLIB "llvm-ranlib"
ENV AR "llvm-ar"
ENV LD "wasm-ld"
ENV CC "clang"
ENV CCX "clang"
ENV CFLAGS "--target=wasm32-wasi -Oz -flto --sysroot=$SYSROOT -Wunused-variable"
ENV CXXFLAGS "${CFLAGS} -fno-exceptions"
ENV LD_LIBRARY_PATH "$SYSROOT"
ENV LIBNBIS "no"

RUN apk add clang libtool make pkgconf curl wget autoconf gettext-dev git automake lld llvm10 binaryen \
  && wget -q "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-11/wasi-sysroot-11.0.tar.gz" \
  && mkdir -p $SYSROOT && tar -xf "wasi-sysroot-11.0.tar.gz" --strip 1 -C $SYSROOT \
  && rm -f "wasi-sysroot-11.0.tar.gz" \
  && wget -q "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-11/libclang_rt.builtins-wasm32-wasi-11.0.tar.gz" \
  && mkdir /usr/lib/clang/10.0.0/lib/ \
  && tar -xf "libclang_rt.builtins-wasm32-wasi-11.0.tar.gz" --strip 1 -C "/usr/lib/clang/10.0.0/lib/" \
  && rm -f "libclang_rt.builtins-wasm32-wasi-11.0.tar.gz" \
  && mkdir /src && adduser -h /src -D alpine

USER alpine
WORKDIR /src
CMD ["sh", "-c", "make -j`nproc`"]
