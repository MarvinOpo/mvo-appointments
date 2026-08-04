<template>
    <div>
        <v-row class="mt-5">
            <v-col cols="12" md="6" lg="4">
                <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" variant="outlined"
                    hide-details />
            </v-col>
        </v-row>
        <v-data-table :headers="headers" :items="list" :loading="isLoading" class="mt-5" :search="search">
            <template v-slot:item.track="{ item }">
                <v-btn @click="trackAppointment(item.id!, item.step!, item.type!)" color="green"
                    prepend-icon="mdi-magnify" variant="tonal">Track</v-btn>
            </template>

            <template v-slot:item.patient.name="{ item }">
                {{ getFullName(item.patient) }}
            </template>

            <template v-slot:item.patient.birth_date="{ item }">
                <span style="white-space: pre-line;">
                    {{ item.patient?.birth_date ?
                        formatDate(item.patient.birth_date, 'MMM. DD, YYYY') : 'N/A' }}
                </span>
            </template>

            <template v-slot:item.patient.age="{ item }">
                {{ item.patient?.birth_date ? getAge(item.patient?.birth_date) : 'N/A' }}
            </template>

            <template v-slot:item.scheduled_at="{ item }">
                <span style="white-space: pre-line;">
                    {{ item.scheduled_at ?
                        formatDate(item.scheduled_at, 'MMM. DD, YYYY[\n]h:mmA') : 'N/A' }}
                </span>
            </template>

            <template v-slot:item.type="{ item }">
                {{ getApptType(item.type) }}
            </template>

            <template v-slot:item.status="{ item }">
                <template v-if="item.step" v-for="config in [getApptStatus(item.step)]" :key="item.step">
                    <v-chip :color="config?.color">{{ config?.label }}</v-chip>
                </template>
            </template>

            <template v-slot:item.options="{ item }">
                <v-row justify="center">
                    <v-col v-if="status?.includes('P')" cols="auto">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon @click="openDialogApprove(item)" color="blue" v-bind="props"
                                    size="x-large">mdi-thumb-up</v-icon>
                            </template>
                            <span>Approve</span>
                        </v-tooltip>
                    </v-col>

                    <template v-if="status?.includes('P') || status?.includes('O')">
                        <v-col cols="auto">
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon color="green" v-bind="props" size="x-large">mdi-calendar</v-icon>
                                </template>
                                <span>Resched</span>
                            </v-tooltip>
                        </v-col>

                        <v-col cols="auto">
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon color="red" v-bind="props" size="x-large">mdi-cancel</v-icon>
                                </template>
                                <span>Cancel</span>
                            </v-tooltip>
                        </v-col>
                    </template>
                </v-row>
            </template>
        </v-data-table>

        <AppointmentApproval v-model="dialog.approve.isVisible" :appointment="dialog.approve.data"
            @approve-appointment="approveAppointment" />
    </div>
</template>

<script setup lang="ts">
const { access, token } = useUser();
const { trackAppointment } = useAppointment();

const props = defineProps<{
    status: string[] | undefined
}>();

const ACTIVE_STATUS = ['P', 'O'];

const dialog = reactive({
    approve: {
        isVisible: false,
        data: <Appointment>{},
    }
})

const headers = ref<any[]>([
    { title: '', align: 'center', key: 'track', sortable: false },
    { title: "Patient Name", align: "start", value: "patient.name", sortable: false },
    { title: "Date of Birth", align: "start", value: "patient.birth_date", sortable: false },
    { title: "Age", align: "start", value: "patient.age", sortable: false },
    { title: "Email", align: "center", value: "patient.email", sortable: false },
    { title: "Contact No.", align: "center", value: "patient.mobile_no", sortable: false },
    { title: "Department", align: "start", value: "department.name", sortable: false },
    { title: "Type", align: "center", value: "type", sortable: false },
    { title: "Chief Complaint", align: "center", value: "complaint", sortable: false, width: "400" },
    { title: "Schedule", align: "center", value: "scheduled_at", sortable: false },
    { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
])

const isLoading = ref(false);

const list = ref<Appointment[]>([]);

const search = ref('');

const snackbar = useSnackbar();

const approveAppointment = (id: number) => {
    const index = list.value.findIndex(item => item.id === id);
    if (index !== -1) {
        list.value.splice(index, 1);

        snackbar.show({
            message: "Appointment successfully approved",
            title: "Success",
            type: "success",
        })
    }
}

const getData = async () => {
    isLoading.value = true;

    const statusParam = props.status?.join(',');
    const param = `?status=${statusParam}`

    const data = await fetchJsonData(`/appointments` + param, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    list.value = data;
    isLoading.value = false;
}

const openDialogApprove = (item: Appointment) => {
    dialog.approve.data = item;
    dialog.approve.isVisible = true;
};

watch(() => props.status, () => {
    const isAutoFetch = props.status?.some(s => ACTIVE_STATUS.includes(s));
    if (isAutoFetch) {
        getData();
    } else list.value = [];

}, { immediate: true });

</script>

<style scoped></style>