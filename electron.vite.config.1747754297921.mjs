// electron.vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin, swcPlugin } from "electron-vite";
import { resolve } from "path";
var electron_vite_config_default = defineConfig({
  main: {
    entry: "src/main/index.ts",
    plugins: [externalizeDepsPlugin(), swcPlugin()],
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@shared": resolve("src/shared")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
