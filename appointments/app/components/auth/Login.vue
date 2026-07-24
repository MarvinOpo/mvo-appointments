<template>
    <v-dialog v-model="model" max-width="500" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Login
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-title class="text-center fs-20 pt-0">
                <v-avatar image="/images/vsmmc-logo.png" size="120" class="mr-2"></v-avatar>

                <div class="mt-3">VSMMC ONLINE APPOINTMENTS</div>
                <div class="text-grey fs-14">VERSION {{ VERSION }}</div>
            </v-card-title>

            <v-card-text>
                <div v-if="error" class="text-white bg-red pa-3 mb-5 w-100">
                    {{ error }}
                </div>

                <v-form ref="formLogin">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="credential.email" label="Email" variant="outlined"
                                :rules="[rules.required, rules.email]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="credential.password" type="password" label="Password"
                                variant="outlined" :rules="[rules.required]" autocomplete="off" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="sticky-bottom bg-white">
                <v-container>
                    <v-row justify="center" class="mb-10">
                        <v-col cols="12">
                            <v-btn class="w-100" color="primary" @click="login" :loading="isLoading" size="x-large"
                                variant="flat">
                                LOGIN
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-center">
                            <NuxtLink to="/register" class="text-primary">Forgot Password?</NuxtLink>
                        </v-col>

                        <v-col cols="6" class="text-center">
                            <NuxtLink to="/register" class="text-primary">Create an Account</NuxtLink>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false });

const emit = defineEmits<{
    confirm: [
        data: {
            user: User;
            accessToken: string;
            access: AccessRights;
        }
    ];
}>();

const credential = reactive({
    email: "ohayog4@gmail.com",
    password: "nodemon123",
});

const error = ref("");

const formLogin = ref();

const isLoading = ref(false);

const closeDialog = () => {
    model.value = false;
};

const login = async () => {
    const form = await formLogin.value.validate();
    if (!form.valid) return;

    isLoading.value = true;

    const data = await postJsonData("/auth/login", credential);

    if (data.error) {
        error.value = data.error;
        isLoading.value = false;
        return;
    }

    emit("confirm", data);
    isLoading.value = false;
    closeDialog();
};
</script>
