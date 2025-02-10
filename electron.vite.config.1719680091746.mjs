// electron.vite.config.ts
import { resolve } from "path";
import rawPlugin from 'vite-plugin-raw';

import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "C:\\Users\\SISTEMA\\Documents\\apps\\AplicacionEscritorioCelifrutTypeScript";
var electron_vite_config_default = defineConfig({
  main: {
    envPrefix: "MAIN_VITE_",
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__electron_vite_injected_dirname, "src/main/index.ts"),
          imprimir: resolve(__electron_vite_injected_dirname, "src/main/imprimir.js"),
          imprimirPallet: resolve(__electron_vite_injected_dirname, "src/main/imprimirPallet.js"),
          crearDocumentos: resolve(__electron_vite_injected_dirname, "src/main/crearDocumentos.js")
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__electron_vite_injected_dirname, "src/preload/index.ts"),
          login: resolve(__electron_vite_injected_dirname, "src/preload/login.js")
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          login: resolve(__electron_vite_injected_dirname, "src/renderer/login.html"),
          Main: resolve(__electron_vite_injected_dirname, "src/renderer/index.html")
        }
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
