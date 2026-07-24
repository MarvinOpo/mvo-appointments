// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    css: ["~/assets/styles/styles.css"],
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "vuetify-nuxt-module",
    ],
    vuetify: {
        vuetifyOptions: "./vuetify.options.ts",
    },
    runtimeConfig: {
        public: {
            API_BASE: process.env.API_BASE || "http://localhost:3000/api",
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
