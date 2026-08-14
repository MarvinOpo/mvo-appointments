    <template>
        <div>
            <v-card class="child-component" flat>
                <v-card-title class="d-flex align-center">
                    My Appointments
                    <v-spacer />
                    <v-btn v-if="hasLoggedIn" @click="dialog.appointmentForm.isVisible = true" color="accent"
                        prepend-icon="mdi-plus" variant="flat">
                        Make Appointment
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-data-table :headers="appointments.headers" :items="appointments.list"
                        :loading="appointments.isLoading">
                        <template v-slot:item.track="{ item }">
                            <v-btn @click="trackAppt(item)" color="green" prepend-icon="mdi-magnify"
                                variant="tonal">Track</v-btn>
                        </template>

                        <template v-slot:item.patient.name="{ item }">
                            {{ getFullName(item.patient) }}
                        </template>

                        <template v-slot:item.scheduled_at="{ item }">
                            <span style="white-space: pre-line;">
                                {{ item.scheduled_at ? formatDate(item.scheduled_at, 'MMM. DD, YYYY[\n]h:mmA') : 'N/A'
                                }}
                            </span>
                        </template>

                        <template v-slot:item.type="{ item }">
                            {{ getApptType(item.type) }}
                        </template>

                        <template v-slot:item.status="{ item }">
                            <template v-if="item.step"
                                v-for="config in [getApptStatus(item.step, item.status, item.type)]" :key="item.step">
                                <v-chip :color="config?.color">{{ config?.label }}</v-chip>
                            </template>
                        </template>

                        <template v-slot:item.options="{ item }">
                            <v-row justify="center">
                                <v-col v-if="item.step >= 2 && item.step < 5 && item.type == 'F'" cols="auto">
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-icon @click="openDialogMonitor(item)" color="blue" v-bind="props"
                                                size="x-large">mdi-monitor-eye</v-icon>
                                        </template>
                                        <span>Check Queue</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>

            <PatientForm v-model="dialog.patientForm.isVisible" type="self" :user="user" />
            <AppointmentForm v-model="dialog.appointmentForm.isVisible" :patients="patients.list"
                :departments="departments.list" @add-appointment="handleNewAppt" />
            <AppointmentLogs v-model="dialog.logs.isVisible" :appointment-id="dialog.logs.appointmentId"
                :step="dialog.logs.appointmentStep" :type="dialog.logs.appointmentType"
                :status="dialog.logs.appointmentStatus" />

            <PatientMonitor v-model="dialog.monitor.isVisible" :appointment="dialog.monitor.appointment" />
        </div>
    </template>

<script setup lang="ts">
const { access, hasLoggedIn, user, token } = useUser();

const appointments = reactive({
    headers: <any[]>[
        { title: '', align: 'center', key: 'track', sortable: false },
        { title: 'Patient Name', align: 'start', key: 'patient.name', sortable: false },
        { title: 'Department', align: 'start', key: 'department.name', sortable: false },
        { title: 'Chief Complaint', align: 'start', key: 'complaint', sortable: false },
        { title: 'Schedule', align: 'center', key: 'scheduled_at', sortable: false },
        { title: 'Type', align: 'center', key: 'type', sortable: false },
        { title: 'Status', align: 'center', key: 'status', sortable: false },
        { title: 'Options', align: 'center', key: 'options', sortable: false },
    ],
    list: <Appointment[]>[],
    isLoading: true
})

const dialog = reactive({
    appointmentForm: {
        isVisible: false,
    },
    logs: {
        isVisible: false,
        appointmentId: 0,
        appointmentStep: 1,
        appointmentType: <AppointmentType>'T',
        appointmentStatus: 'P',
    },
    monitor: {
        isVisible: false,
        appointment: <Appointment>{},
    },
    patientForm: {
        isVisible: false,
    },
})

const departments = reactive({
    list: <Department[]>[]
})

const patients = reactive({
    list: <PatientOption[]>[]
})

const snackbar = useSnackbar();

const getAppointments = async () => {
    const data = await fetchJsonData("/appointments/mine", token.value);
    if (data.error) {
        appointments.isLoading = false;
        return;
    }

    appointments.list = data;
    appointments.isLoading = false;
};

const getDepartments = async () => {
    const data = await fetchJsonData("/departments", token.value);
    if (data.error) return;

    departments.list = data;
}

const getPatients = async () => {
    const data = await fetchJsonData("/patients/mine", token.value);
    if (data.error) return;

    patients.list = data.map((patient: any) => ({
        id: patient.id,
        name: getFullName(patient),
        relationship: patient.relationship,
        birth_date: patient.birth_date,
        sex: patient.sex
    }));
}

const getPatientSelf = async () => {
    const data = await fetchJsonData("/patients/self", token.value);
    if (data.error) return;

    if (!data.id) {
        dialog.patientForm.isVisible = true;
        return;
    }

    getPatients();
    getDepartments();
    getAppointments();
};

const handleNewAppt = (appt: Appointment) => {
    appointments.list.unshift(appt);

    snackbar.show({
        message: 'You have successfully made an appointment.',
        title: 'Success',
        type: 'success',
    });

}

const openDialogMonitor = (appt: Appointment) => {
    dialog.monitor.appointment = appt;
    dialog.monitor.isVisible = true;
}

const trackAppt = (appt: Appointment) => {
    if (appt.id) dialog.logs.appointmentId = appt.id;
    if (appt.step) dialog.logs.appointmentStep = appt.step;
    if (appt.type) dialog.logs.appointmentType = appt.type;
    if (appt.status) dialog.logs.appointmentStatus = appt.status;

    dialog.logs.isVisible = true;
}

onMounted(() => {
    getPatientSelf();
})
</script>

<style scoped></style>
