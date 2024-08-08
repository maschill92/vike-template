import md from "unplugin-vue-markdown/vite";
import vue from "@vitejs/plugin-vue";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import { telefunc } from "telefunc/vite";

export default defineConfig({
  plugins: [
    vike({}),
    telefunc(),
    devServer({
      entry: "server/index.ts",

      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],

      injectClientScript: false,
    }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    md({}),
  ],
  resolve: {
    alias: {
      "#app": __dirname,
    },
  },
});
