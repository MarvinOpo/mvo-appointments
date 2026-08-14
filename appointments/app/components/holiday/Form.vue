<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Holiday
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formHoliday">
                    <v-row>
                        <v-col cols="12">
                            <v-select v-model="form.dept_ids" :items="departments" item-title="name" item-value="id"
                                label="Departments (Leave empty if for all)" variant="outlined" multiple chips
                                clearable />
                        </v-col>

                        <v-col cols="12">
                            <v-date-input v-model="form.date" label="Holiday Date" prepend-icon="" variant="outlined"
                                autocomplete="off" clearable />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="form.description" label="Description" variant="outlined"
                                :rules="[rules.required]" counter="255" autocomplete="off" />
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
                            <v-btn color="green" @click="saveHoliday" :loading="isLoading" variant="tonal">SAVE</v-btn>
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
    holiday: Holiday | null;
}>();

const emit = defineEmits<{
    addHoliday: [holiday: Holiday];
    updateHoliday: [holiday: Holiday];
}>();

const isLoading = ref(false);
const departments = ref<{ id: number; name: string }[]>([]);

const rules = {
    required: (v: any) => !!v || 'Required',
};

const defaultForm = (): HolidayFormData => ({
    date: '',
    description: '',
    dept_ids: [],
});

const form = ref<HolidayFormData>(defaultForm());

const formHoliday = ref();

const closeDialog = () => {
    model.value = false;
};

const getDepartments = async () => {
    const data = await fetchJsonData('/departments', token.value);
    if (!data.error) departments.value = data;
};

const insertHoliday = async () => {
    const data = await postJsonData('/holidays', form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('addHoliday', data);
    isLoading.value = false;
    closeDialog();
}

const updateHoliday = async () => {
    const data = await updateJsonData(`/holidays/${props.holiday?.id}`, form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('updateHoliday', data);
    isLoading.value = false;
    closeDialog();
}

const saveHoliday = async () => {
    const { valid } = await formHoliday.value.validate();
    if (!valid) return;

    isLoading.value = true;

    form.value.date = formatDate(form.value.date!, 'YYYY-MM-DD');

    if (props.holiday?.id) await updateHoliday();
    else await insertHoliday();
}

watch(() => props.holiday, () => {
    if (props.holiday) form.value = {
        date: formatDate(props.holiday.date, 'YYYY-MM-DD'),
        description: props.holiday.description,
        dept_ids: props.holiday.dept_ids ?? [],
    };
    else form.value = defaultForm();
});

onMounted(() => {
    getDepartments();
});
</script>