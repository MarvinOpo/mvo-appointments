<template>
    <v-dialog v-model="model" max-width="600" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                User Access
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formUserAccess">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="form.email" label="Email" variant="outlined"
                                :rules="[rules.required]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="form.access_right" :items="filteredAccessRights" item-title="description"
                                item-value="id" label="Access Right" variant="outlined" :rules="[rules.required]" />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="form.dept_ids" :items="departments" item-title="name" item-value="id"
                                label="Departments (Leave empty if for all)" variant="outlined" multiple chips
                                clearable />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="sticky-bottom bg-white">
                <v-container>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn color="grey" @click="closeDialog" variant="tonal">CANCEL</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn color="green" @click="saveUserAccess" :loading="isLoading"
                                variant="tonal">SAVE</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const { token } = useUser();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    userAccess: UserAccess | null;
    accessRights: AccessRights[];
    departments: Department[];
}>();

const emit = defineEmits<{
    addUserAccess: [item: UserAccess];
    updateUserAccess: [item: UserAccess];
}>();

const isLoading = ref(false);

const defaultForm = (): UserAccessFormData => ({
    email: null,
    access_right: null,
    dept_ids: [],
});

const form = ref<UserAccessFormData>(defaultForm());

const formUserAccess = ref();

const filteredAccessRights = computed(() => {
    return props.accessRights.filter(accessRight => accessRight.id !== 1);
})

const closeDialog = () => {
    model.value = false;
};

const insertUserAccess = async () => {
    const data = await postJsonData('/user-access', form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('addUserAccess', data);
    isLoading.value = false;
    closeDialog();
}

const updateUserAccess = async () => {
    const data = await updateJsonData(`/user-access/${props.userAccess?.id}`, form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('updateUserAccess', data);
    isLoading.value = false;
    closeDialog();
}

const saveUserAccess = async () => {
    const { valid } = await formUserAccess.value.validate();
    if (!valid) return;

    isLoading.value = true;

    if (props.userAccess?.id) await updateUserAccess();
    else await insertUserAccess();
}

watch(() => props.userAccess, () => {
    if (props.userAccess) form.value = {
        email: props.userAccess.email,
        access_right: props.userAccess.access_right,
        dept_ids: props.userAccess.dept_ids ?? [],
    };
    else form.value = defaultForm();
});

</script>