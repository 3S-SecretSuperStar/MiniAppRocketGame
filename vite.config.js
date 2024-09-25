import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import envCompatible from 'vite-plugin-env-compatible'

export default defineConfig({
  plugins: [react(), envCompatible(), svgrPlugin({ icon: true })],

  build: {
    outDir:"build",
  },

  server:{
    port:4000,
    open:true,
  },

})