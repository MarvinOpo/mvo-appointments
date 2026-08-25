<template>
    <v-dialog v-model="model" max-width="600" persistent>
        <v-card>
            <v-card-title>{{ isEdit ? 'Edit Monitor' : 'Add Monitor' }}</v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="isValid">
                    <v-text-field v-model="formData.name" label="Monitor Name" :rules="[rules.required]" />

                    <v-select v-model="formData.dept_ids" :items="departments" item-title="name" item-value="id"
                        label="Departments (max 10)" multiple chips closable-chips
                        :rules="[rules.required, rules.maxDepts]" />
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
                <v-btn color="accent" variant="flat" :loading="isSaving" @click="save">Save</v-btn>
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
const isSaving = ref(false);
const form = ref();

const isEdit = computed(() => !!props.monitor?.id);

const formData = reactive<{ id?: number; name: string; dept_ids: number[] }>({
    name: '',
    dept_ids: [],
});

const rules = {
    required: (v: any) => (v && (Array.isArray(v) ? v.length > 0 : true)) || 'Required',
    maxDepts: (v: number[]) => (v?.length ?? 0) <= 10 || 'Maximum of 10 departments per monitor',
};

watch(() => props.monitor, (val) => {
    formData.id = val?.id;
    formData.name = val?.name ?? '';
    formData.dept_ids = val?.dept_ids ? [...val.dept_ids] : [];
}, { immediate: true });

const closeDialog = () => {
    model.value = false;
}

const save = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;

    isSaving.value = true;

    const payload = { name: formData.name, dept_ids: formData.dept_ids };

    // TODO: swap for your actual POST/PATCH helpers
    const data = isEdit.value
        ? await updateJsonData(`/monitors/${formData.id}`, payload, token.value)
        : await postJsonData('/monitors', payload, token.value);

    isSaving.value = false;

    if (data.error) {
        snackbar.show({ message: 'Failed to save monitor.', type: 'error', title: 'Error' });
        return;
    }

    snackbar.show({ message: `Monitor ${isEdit.value ? 'updated' : 'created'}.`, type: 'success', title: 'Success' });
    emit('saved');
    closeDialog();
}
</script>