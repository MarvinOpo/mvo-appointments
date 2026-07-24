import { defineStore } from "pinia";
import type { AccessRights } from "~/types/access-rights";
import type { User } from "~/types/user";

interface UserState {
    access: AccessRights;
    user: User | null;
    token: string;
    hasLoggedIn: boolean;
}

export const useUserStore = defineStore("appt-services", {
    state: (): UserState => ({
        access: {},
        user: null,
        token: "",
        hasLoggedIn: false,
    }),

    getters: {
        fullname(state): string {
            if (!state.user) return "";

            const { fname, mname, lname, ext_name } = state.user;
            const middleInitial = mname ? `${mname.charAt(0)}. ` : "";
            const extension = ext_name ?? "";

            return `${fname} ${middleInitial}${lname} ${extension}`.trim();
        },
    },

    actions: {
        resetStore() {
            this.access = {};
            this.user = null;
            this.token = "";
            this.hasLoggedIn = false;
        },

        setAccess(data: AccessRights) {
            this.access = data;
        },

        setToken(data: string) {
            this.token = data;
            this.hasLoggedIn = true;
        },

        setUser(data: User) {
            this.user = data;
        },
    },

    persist: true,
});

interface SnackbarState {
    isVisible: boolean;
    timeout: number;
    color: string;
    icon: string;
    message: string;
}

export const useSnackbarStore = defineStore("appt-snackbar", {
    state: (): SnackbarState => ({
        isVisible: false,
        timeout: 2000,
        color: "success",
        icon: "mdi-check-circle",
        message: "",
    }),

    actions: {
        showSnackbar(data: any) {
            this.isVisible = true;
            this.timeout = data.timeout ?? 2000;
            this.color = data.color ?? "success";
            this.icon = data.icon ?? "mdi-check-circle";
            this.message = data.message ?? "";
        },
    },
});
