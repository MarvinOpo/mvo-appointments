export default defineNuxtRouteMiddleware((to) => {
    const { access } = useUser();
    const requiredAccess = to.meta.requiredAccess as string[] | undefined;

    if (!requiredAccess) return;

    const required = Array.isArray(requiredAccess)
        ? requiredAccess
        : [requiredAccess];

    const hasAccess = required.some((key) => access.value[key]);

    if (!hasAccess) {
        return navigateTo("/unauthorized");
    }
});
