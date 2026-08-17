<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Teleconsult Appointments
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="teleconsult.headers" :items="teleconsult.list" :loading="isLoading"
                    :mobile="smAndDown">
                    <template v-slot:item.patient="{ item }">
                        {{ getFullName(item.patient) }}
                    </template>

                    <template v-slot:item.phone_number="{ item }">
                        {{ item.patient?.mobile_no ?? 'N/A' }}
                    </template>

                    <template v-slot:item.scheduled_at="{ item }">
                        {{ item.scheduled_at ? formatDate(item.scheduled_at, 'MMM. DD, YYYY hh:mm A') : 'N/A' }}
                    </template>

                    <template v-slot:item.status="{ item }">
                        <v-chip :color="getStatusColor(item.status)" size="small">
                            {{ item.status }}
                        </v-chip>
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogConsult(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-clipboard-pulse</v-icon>
                                    </template>
                                    <span>Consultation</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <TeleconsultForm v-model="dialog.consult.isVisible" :appointment="dialog.consult.data"
            @update-appointment="handleUpdateAppointment" />
    </div>
</template>

<script setup lang="ts">
const { smAndDown } = useDisplay();
const { token } = useUser();
const snackbar = useSnackbar();

const teleconsult = reactive({
    headers: <any[]>[
        { title: "Patient", align: "start", value: "patient", sortable: false },
        { title: "Phone Number", align: "start", value: "phone_number", sortable: false },
        { title: "Scheduled", align: "start", value: "scheduled_at", sortable: false },
        { title: "Complaint", align: "start", value: "complaint", sortable: false },
        { title: "Status", align: "center", value: "status", sortable: false },
        { title: "Options", align: "center", value: "options", sortable: false, width: "150" },
    ],
    list: <Appointment[]>[],
});

const dialog = reactive({
    consult: {
        isVisible: false,
        data: <Appointment | null>null,
    },
})

const isLoading = ref(true);

const getStatusColor = (status: string | null) => {
    switch (status) {
        case 'completed': return 'green';
        case 'ongoing': return 'blue';
        case 'cancelled': return 'red';
        default: return 'grey';
    }
};

const getTeleconsultAppointments = async () => {
    isLoading.value = true;

    const data = await fetchJsonData("/appointments?type=teleconsult", token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    teleconsult.list = data;

    isLoading.value = false;
};

const handleUpdateAppointment = (appointment: Appointment) => {
    const index = teleconsult.list.findIndex(a => a.id === appointment.id);
    if (index !== -1) teleconsult.list[index] = appointment;

    snackbar.show({
        message: "Appointment updated with SOAP notes",
        title: "Success",
        type: "success",
    })
};

const openDialogConsult = (item: Appointment) => {
    dialog.consult.isVisible = true;
    dialog.consult.data = item;
};

onMounted(() => {
    getTeleconsultAppointments();
});
</script>

<style scoped></style>