import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import envCompatible from 'vite-plugin-env-compatible'
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), envCompatible(), svgrPlugin({ icon: true })],
  optimizeDeps: {
    esbuildOptions: {
        define: {
            global: "globalThis",
        },
        plugins: [
            GlobalPolyFill({
                process: true,
                buffer: true,
            }),
        ],
    },
  },
  resolve: {
    alias: {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
    },
},
  build: {
    outDir:"build",
  },

  server:{
    port:4000,
    open:true,
  },


})