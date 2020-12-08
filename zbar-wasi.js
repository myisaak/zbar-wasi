export { createZbar, scanImage };

import zbarBinaryPath from "./zbar.wasm";
import { WASI } from "@wasmer/wasi";
import wasiBindings from "@wasmer/wasi/lib/bindings/browser";
import { WasmFs } from "@wasmer/wasmfs";

const wasmFs = new WasmFs();
let wasi = new WASI({
  args: [],
  env: {},
  bindings: {
    ...wasiBindings,
    fs: wasmFs.fs
  }
});

const getImports = wasi => {
  const {
    clock_time_get,
    fd_close,
    fd_seek,
    fd_write,
  } = wasi.wasiImport;

  return {
    wasi_snapshot_preview1: {
      clock_time_get,
      fd_close,
      fd_seek,
      fd_write,
    },
    env: { memory: wasi.memory },
  }
};

let ZBAR = {};

const createGrayscaleBuffer = ({ buffer, width, height }) => {
  const len = width * height;
  const ptrBuff = ZBAR.malloc(len);
  const heap = new Uint8Array(ZBAR.memory.buffer); 
  const data = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    const i4 = i * 4;
    const r = data[i4];
    const g = data[i4 + 1];
    const b = data[i4 + 2];
    // converts to grayscale using Gray = R*0.299 + G*0.587 + B*0.114
    heap[ptrBuff + i] = (r * 19595 + g * 38469 + b * 7472) >> 16;
  }
  return ptrBuff;
};

const createZbarImage = imgData => {
  const { width, height } = imgData;
  const ptrBuffer = createGrayscaleBuffer({
    width,
    height,
    buffer: imgData.data.buffer,
  });
  const length = width * height;
  const sequenceNo = 0;
  const ptrImage = ZBAR.Image_create(
    width,
    height,
    0x30303859 /* Y800 */,
    ptrBuffer,
    length,
    sequenceNo,
  );
  return ptrImage;
};

const getScanResult = ptrImage => {
  const results = [];
  const heap8 = new Uint8Array(ZBAR.memory.buffer);
  const decoder = new TextDecoder("utf-8");
  let symbol = ZBAR.ImageScanner_first_symbol(ptrImage);
  while (symbol !== 0) {
    const ptrResult = ZBAR.ImageScanner_get_data(symbol);
    const len = heap8.subarray(ptrResult).indexOf(0);
    const result = decoder.decode(heap8.subarray(ptrResult, ptrResult + len));
    results.push(result);
    symbol = ZBAR.ImageScanner_next_symbol(symbol);
  };

  return results;
};

let ptrScannerDefault;
const useDefaultScannerIfNull = ptrScanner => {
  if (ptrScanner) {
    return ptrScanner;
  }
  if (!ptrScannerDefault) {
    ptrScannerDefault = ZBAR.ImageScanner_create();
  }
  return ptrScannerDefault;
};

const scanImage = (imgData, ptrScanner) => {
  ptrScanner = useDefaultScannerIfNull(ptrScanner);
  const ptrImage = createZbarImage(imgData); 
  const nResults = ZBAR.ImageScanner_scan(ptrScanner, ptrImage);
  const result = getScanResult(ptrImage);
  ZBAR.Image_destroy(ptrImage);
  return result;
};

const createZbar = async ({ wasmpath }) => {
  const file = fetch(wasmpath || zbarBinaryPath);
  const imports = getImports(wasi);
  const { instance } = await WebAssembly.instantiateStreaming(file, imports);
  wasi.memory = instance.exports.memory;
  ZBAR = instance.exports;
  return instance.exports;
};
