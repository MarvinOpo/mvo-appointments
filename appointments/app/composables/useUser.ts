import { useUserStore } from "~/stores/pinia";

export const useUser = () => {
    const store = useUserStore();

    const { access, fullname, hasLoggedIn, token, user } = storeToRefs(store);
    const { resetStore, setAccess, setToken, setUser } = store;

    const fetchUser = async (id: number) => {
        return await $fetch(`/users/${id}`);
    };

    const logout = () => {
        const router = useRouter();
        resetStore();
        router.push("/");

        const snackbar = useSnackbar();
        snackbar.show({
            message: "See you again soon.",
            title: "Good Bye!",
            type: "bye",
        });
    };

    return {
        access,
        token,
        user,
        hasLoggedIn,
        fullname,
        resetStore,
        setAccess,
        setToken,
        setUser,
        fetchUser,
        logout,
    };
};
