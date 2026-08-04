<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Queue Session
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formSession">
                    <v-row>
                        <v-col cols="12">
                            <v-autocomplete v-model="form.dept_id" :items="departments.list" item-title="title"
                                item-value="id" label="SelectOption" variant="outlined" :rules="[rules.required]"
                                autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="form.doctors_on_duty" label="Doctors on Duty" type="number"
                                variant="outlined" :rules="[rules.required]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-date-input v-model="form.session_date" label="Date" prepend-icon="" variant="outlined"
                                :rules="[rules.required]" autocomplete="off" />
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
                            <v-btn color="green" @click="openSession" :loading="isLoading" variant="tonal">OPEN</v-btn>
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

const emit = defineEmits<{
    confirm: [];
}>();

const departments = reactive({
    list: <Department[]>[]
});

const defaultForm = (): QueueSessionFormData => ({
    dept_id: null,
    session_date: null,
    doctors_on_duty: null,
    has_started: false
});

const form = ref<QueueSessionFormData>(defaultForm());

const formSession = ref();

const isLoading = ref(false);

const getDepartments = async () => {
    const data = await fetchJsonData("/departments", token.value);
    if (data.error) return;

    departments.list = data;
}

const closeDialog = () => {
    model.value = false;
};

const openSession = async () => {
    const { valid } = formSession.value.validate();
    if (!valid) return

    isLoading.value = true;

    const data = await postJsonData("/queue/sessions", form.value, token.value);
    if (data.error) return;

    emit("confirm");
    isLoading.value = false;
    closeDialog();
};

onMounted(() => {
    getDepartments();
});
</script>