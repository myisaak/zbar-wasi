rm zbar.wasm
docker build -t zbar-wasi - < ./wasm.Dockerfile
docker run --rm -it -v $PWD:/src zbar-wasi make clean
docker run --rm -v $PWD:/src zbar-wasi