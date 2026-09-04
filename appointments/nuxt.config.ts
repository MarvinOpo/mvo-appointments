// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    nitro: {
        preset: "static",
    },
    compatibilityDate: "2025-07-15",
    css: [
        "~/assets/styles/styles.css",
        "@mdi/font/css/materialdesignicons.css",
    ],
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "vuetify-nuxt-module",
    ],
    vuetify: {
        vuetifyOptions: "./vuetify.options.ts",
        moduleOptions: {
            styles: true,
        },
    },
    runtimeConfig: {
        public: {
            API_BASE: process.env.API_BASE || "http://localhost:3000/api",
            WS_BASE: process.env.WS_BASE || "http://localhost:9004",
        },
    },
    imports: {
        dirs: ["types"],
    },
    vite: {
        optimizeDeps: {
            include: ["@vue/devtools-core", "@vue/devtools-kit", "moment"],
        },
    },
});
