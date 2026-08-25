<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Live Monitors
                <v-spacer />
                <v-btn color="accent" prepend-icon="mdi-plus" variant="flat" @click="openDialogForm()">
                    Add Monitor
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="monitors.headers" :items="monitors.list" :loading="monitors.isLoading">
                    <template v-slot:item.dept_ids="{ item }">
                        <v-chip v-for="deptId in item.dept_ids" :key="deptId" size="small" class="mr-1 mb-1">
                            {{ getDeptName(deptId) }}
                        </v-chip>
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openMonitorView(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-monitor-eye</v-icon>
                                    </template>
                                    <span>View Monitor</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogForm(item)" color="amber" v-bind="props"
                                            size="x-large">mdi-pencil</v-icon>
                                    </template>
                                    <span>Edit</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="confirmDelete(item)" color="red" v-bind="props"
                                            size="x-large">mdi-delete</v-icon>
                                    </template>
                                    <span>Delete</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <MonitorForm v-model="dialog.form.isVisible" :monitor="dialog.form.data" :departments="departments.list"
            @saved="getMonitors" />

        <DialogConfirm v-model="dialog.confirm.isVisible" :label="dialog.confirm.label" color="red"
            positive-text="DELETE" @confirm="dialog.confirm.action" />
    </div>
</template>

<script setup lang="ts">
const { token } = useUser();
const snackbar = useSnackbar();

const dialog = reactive({
    form: {
        isVisible: false,
        data: <QueueMonitor | null>null,
    },
    confirm: {
        isVisible: false,
        label: '',
        action: () => { },
    },
})

const monitors = reactive({
    headers: <any[]>[
        { title: 'Name', align: 'start', key: 'name', sortable: false },
        { title: 'Departments', align: 'start', key: 'dept_ids', sortable: false },
        { title: 'Options', align: 'center', key: 'options', sortable: false, width: '200' },
    ],
    list: <QueueMonitor[]>[],
    isLoading: true,
})

const departments = reactive({
    list: <{ id: number; name: string }[]>[],
})

const getDeptName = (id: number) => departments.list.find(d => d.id === id)?.name ?? `#${id}`;

const getMonitors = async () => {
    monitors.isLoading = true;

    const data = await fetchJsonData('/monitors', token.value);
    if (!data.error) monitors.list = data;

    monitors.isLoading = false;
}

// TODO: point this at your actual department list endpoint/composable
const getDepartments = async () => {
    const data = await fetchJsonData('/departments', token.value);
    if (!data.error) departments.list = data;
}

const openDialogForm = (item?: QueueMonitor) => {
    dialog.form.data = item ? { ...item } : null;
    dialog.form.isVisible = true;
}

const openMonitorView = (item: QueueMonitor) => {
    window.open(`/monitors/${item.id}`, '_blank');
}

const confirmDelete = (item: QueueMonitor) => {
    dialog.confirm.label = `Delete monitor "${item.name}"?`;
    dialog.confirm.action = async () => {
        // TODO: swap for your actual DELETE helper
        const data = await deleteJsonData(`/monitors/${item.id}`, token.value);

        if (data.error) {
            snackbar.show({ message: 'Failed to delete monitor.', type: 'error', title: 'Error' });
            return;
        }

        snackbar.show({ message: 'Monitor deleted.', type: 'success', title: 'Success' });
        dialog.confirm.isVisible = false;
        getMonitors();
    };
    dialog.confirm.isVisible = true;
}

onMounted(() => {
    getMonitors();
    getDepartments();
})

definePageMeta({
    middleware: 'require-access',
    requiredAccess: ['can_manage_queue'], // TODO: swap for a dedicated can_manage_monitors flag if you add one
});
</script>

<style scoped></style>