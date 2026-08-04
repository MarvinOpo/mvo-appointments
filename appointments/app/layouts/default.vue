<template>
    <div>
        <v-toolbar class="app-toolbar" color="primary">
            <v-app-bar-nav-icon class="d-sm-none">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" class="fs-30"> mdi-menu</v-icon>
                    </template>

                    <div class="sidebar-scroll">
                        <LayoutNavList :user="user" @logout="logout" />
                    </div>
                </v-menu>
            </v-app-bar-nav-icon>

            <v-toolbar-title>
                <div class="d-flex align-center">
                    <v-icon size="25" class="me-2">mdi-heart-pulse</v-icon>

                    <span class="fs-20 fw-900"> VSMMC APPOINTMENTS </span>

                    <span class="text-grey-lighten-2 fs-12 ms-2"> V{{ VERSION }} </span>
                </div>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-row v-if="!hasLoggedIn">
                <v-col v-for="item in toolbar.menu" :key="item.label" cols="auto">
                    <v-btn :href="item.href" variant="text">
                        {{ item.label }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-spacer></v-spacer>

            <v-btn v-if="!hasLoggedIn" @click="dialog.login.isVisible = true" size="x-large" variant="tonal">
                Login
            </v-btn>

            <template v-else>
                <!-- <Notification /> -->

                <v-btn stacked>
                    <v-row align="center" no-gutters>
                        <v-avatar image="/images/default-profile.png" size="50" class="mr-2"></v-avatar>
                        <div class="d-none d-sm-inline flex-column text-left">
                            <div class="fs-18">
                                {{ fullname }}
                            </div>
                            <div v-if="user?.email" class="text-grey-lighten-2 fs-12">
                                {{ user.email }}
                            </div>
                        </div>
                    </v-row>
                </v-btn>
            </template>

        </v-toolbar>

        <v-navigation-drawer v-if="route.name != 'index'" class="sidebar-menu pr-0 pb-10" rail-width="80"
            expand-on-hover permanent rail>
            <div class="sidebar-scroll">
                <v-divider></v-divider>

                <LayoutNavList :user="user" @logout="logout" />
            </div>
        </v-navigation-drawer>

        <v-main class="main-container">
            <slot />
        </v-main>

        <footer>
            <span class="text-white text-center fs-14 w-100">
                © Copyright 2022-2026 VSMMC | MVO
            </span>
        </footer>

        <v-snackbar v-model="snackbar.isVisible" :timeout="snackbar.timeout" width="400" :color="snackbar.color"
            location="bottom right" class="mr-5 mb-13">
            <div class="d-flex">
                <v-icon size="50">{{ snackbar.icon }}</v-icon>
                <div class="align-self-center position-relative">
                    <v-card-title class="pt-0 pb-0">
                        {{ snackbar.title }}
                    </v-card-title>
                    <v-card-text class="pb-0">
                        {{ snackbar.message }}
                    </v-card-text>
                </div>
            </div>
        </v-snackbar>

        <AuthLogin v-model="dialog.login.isVisible" @login="login" />

        <v-dialog v-model="isLoggingIn" width="400">
            <LayoutLoader label="Logging in. Please wait." />
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
const {
    hasLoggedIn,
    fullname,
    user,
    logout,
    setUser,
    setToken,
    setAccess,
} = useUser();
const route = useRoute();
const router = useRouter();

const dialog = reactive({
    login: {
        isVisible: false,
    },
});

const isLoggingIn = ref(false);

const snackbar = useSnackbar();

const toolbar = ref({
    menu: [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#use", label: "How to Use" },
        { href: "#contact", label: "Contact" },
    ],
});

const login = (data: { user: User; accessToken: string; access: AccessRights }) => {
    isLoggingIn.value = true;

    setUser(data.user);
    setAccess(data.access);
    setToken(data.accessToken);

    router.push("/my/appointments").then(() => {
        isLoggingIn.value = false;
        snackbar.show({
            message: `Welcome back ${data.user.fname}`,
            title: `Hello!`,
            type: "greeting",
        });
    });
};

onMounted(() => {
    if (hasLoggedIn.value && route.name == "index") {
        isLoggingIn.value = true;

        router.push("/my/appointments").then(() => {
            isLoggingIn.value = false;
        });
        return;
    }

    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();

            const href = anchor.getAttribute("href");
            if (!href) return;

            const target = document.querySelector<HTMLElement>(href);
            target?.scrollIntoView({
                behavior: "smooth",
            });
        });
    });
});
</script>
