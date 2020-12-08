docker build -t zbar-wasi - < ./wasm.Dockerfile
docker run --rm -v $PWD:/src zbar-wasi
