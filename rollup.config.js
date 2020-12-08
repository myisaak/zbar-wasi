import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import path from "path";
import { readFileSync } from "fs";

const isDev = process.env.NODE_ENV !== "production";

const pluginBinary = ({ src, distfolder = "./" }) => {
 const { name, base } = path.parse(src);
 return {
    name: "fetch-binary",
    resolveId (id) {
      // skip usual import for 'path'
      if (id === src) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === src) {
        let distpath = path.join(distfolder, base);
        if (distpath.startsWith("/")) {
          distpath = `.${distpath}`;
        }

        return `export default "${distpath}";`;
      }
      return null;
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: base,
        source: readFileSync(src),
      });
    },
  };
};

const distfolder = isDev && "/dist/" || "/";

export default [{
  input: "zbar-wasi.js",
  output: {
    file: "dist/zbar-wasi.esm.js",
    format: "esm",
    sourcemap: isDev,
  },
  plugins: [
    pluginBinary({ src: "./zbar.wasm", distfolder }),
    commonjs(),
    builtins(),
    globals(),
    resolve({ preferBuiltins: true, browser: true }),
  ],
}];
