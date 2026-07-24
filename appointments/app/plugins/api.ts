export default defineNuxtPlugin((nuxtApp) => {
    const { token, resetStore } = useUser();
    const config = useRuntimeConfig();

    const api = $fetch.create({
        baseURL: config.public.API_BASE || "http://localhost:9004",

        onRequest({ options }) {
            if (token.value) {
                options.headers.set("Authorization", `Bearer ${token.value}`);
            }
        },

        onResponseError({ response }) {
            if (response.status === 401) {
                resetStore();
                navigateTo("/");
            }
        },
    });

    return {
        provide: {
            api,
        },
    };
});
