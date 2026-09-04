<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Department
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formDepartment">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="form.name" label="Name" count="150" variant="outlined"
                                :rules="[rules.required]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="form.code" label="Code" count="50" variant="outlined"
                                :rules="[rules.required]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="form.description" label="Description" variant="outlined"
                                :rules="[rules.required]" counter="255" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.min_age" label="Min Age (Empty if no limit)" type="number"
                                variant="outlined" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.max_age" label="Max Age (Empty if no limit)" type="number"
                                variant="outlined" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="form.allowed_gender" :items="options.sex"
                                label="Allowed sex (Empty for both)" variant="outlined" />
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
                            <v-btn color="green" @click="saveDepartment" :loading="isLoading"
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
    department: Department | null;
}>();

const emit = defineEmits<{
    addDepartment: [department: Department];
    updateDepartment: [department: Department];
}>();

const isLoading = ref(false);

const defaultForm = (): DepartmentFormData => ({
    name: '',
    code: '',
    description: '',
});

const form = ref<DepartmentFormData>(defaultForm());

const formDepartment = ref();

const closeDialog = () => {
    model.value = false;
};

const insertDepartment = async () => {
    const data = await postJsonData('/departments', form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('addDepartment', data);
    isLoading.value = false;
    closeDialog();
}

const updateDepartment = async () => {
    const data = await updateJsonData(`/departments/${props.department?.id}`, form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('updateDepartment', data);
    isLoading.value = false;
    closeDialog();
}

const saveDepartment = async () => {
    const { valid } = await formDepartment.value.validate();
    if (!valid) return;

    isLoading.value = true;

    if (props.department?.id) await updateDepartment();
    else await insertDepartment();
}

watch(() => props.department, () => {
    if (props.department) form.value = { ...props.department };
    else form.value = defaultForm();
});

</script>