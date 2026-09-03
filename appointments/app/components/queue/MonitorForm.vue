<template>
    <v-dialog v-model="model" max-width="600" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                {{ isEdit ? 'Edit Monitor' : 'Add Monitor' }}
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formMonitor" v-model="isValid">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="formData.name" label="Monitor Name" :rules="[rules.required]"
                                variant="outlined" autocomplete="off" />
                        </v-col>

                        <v-col cols="12">
                            <v-autocomplete v-model="formData.dept_ids" :items="departments" item-title="name" item-value="id"
                                label="Departments (max 10)" multiple chips closable-chips
                                :rules="[rules.required, rules.maxDepts]" variant="outlined" autocomplete="off" />
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
                            <v-btn color="blue" @click="save" :loading="isLoading" variant="tonal">SAVE</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const { token } = useUser();
const snackbar = useSnackbar();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    monitor: QueueMonitor | null;
    departments: { id: number; name: string }[];
}>();

const emit = defineEmits<{ saved: [] }>();

const isValid = ref(false);
const isLoading = ref(false);
const formMonitor = ref();

const isEdit = computed(() => !!props.monitor?.id);

const formData = reactive<{ id?: number; name: string; dept_ids: number[] }>({
    name: '',
    dept_ids: [],
});

watch(() => props.monitor, (val) => {
    formData.id = val?.id;
    formData.name = val?.name ?? '';
    formData.dept_ids = val?.dept_ids ? [...val.dept_ids] : [];
}, { immediate: true });

const closeDialog = () => {
    model.value = false;
}

const save = async () => {
    const { valid } = await formMonitor.value.validate();
    if (!valid) return;

    isLoading.value = true;

    const payload = { name: formData.name, dept_ids: formData.dept_ids };

    const data = isEdit.value
        ? await updateJsonData(`/monitors/${formData.id}`, payload, token.value)
        : await postJsonData('/monitors', payload, token.value);

    isLoading.value = false;

    if (data.error) return;

    snackbar.show({ message: `Monitor ${isEdit.value ? 'updated' : 'created'}.`, type: 'success', title: 'Success' });
    emit('saved');
    closeDialog();
}
</script>