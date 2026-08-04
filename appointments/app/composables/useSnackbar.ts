type SnackbarType = "success" | "error" | "info" | "greeting" | "bye";

const color = ref("success");
const isVisible = ref(false);
const icon = ref("mdi-check-circle");
const message = ref("");
const timeout = ref(2000);
const title = ref("");

export const useSnackbar = () => {
    const show = (data: any) => {
        setType(data.type ?? "success");

        timeout.value = data.timeout ?? 2000;
        title.value = data.title ?? "";
        message.value = data.message ?? "";
        isVisible.value = true;
    };

    return reactive({
        isVisible,
        timeout,
        title,
        color,
        icon,
        message,
        show,
    });
};

const setType = (type: SnackbarType) => {
    const icons: Record<SnackbarType, string> = {
        success: "mdi-check-circle",
        error: "mdi-close-circle",
        info: "mdi-alert-circle",
        greeting: "mdi-hand-wave",
        bye: "mdi-hand-wave",
    };

    const colors: Record<SnackbarType, string> = {
        success: "success",
        error: "error",
        info: "blue",
        greeting: "success",
        bye: "grey",
    };

    icon.value = icons[type] ?? "mdi-check-circle";
    color.value = colors[type] ?? "success";
};
