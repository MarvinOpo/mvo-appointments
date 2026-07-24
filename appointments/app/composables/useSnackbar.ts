import { useSnackbarStore } from "~/stores/pinia";

export const useSnackbar = () => {
    const snackbarStore = useSnackbarStore();
    return snackbarStore;
};
