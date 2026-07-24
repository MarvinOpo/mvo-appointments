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
                <v-data-table :items="appointments"></v-data-table>
            </v-card-text>
        </v-card>

        <PatientForm v-model="dialog.patientForm.isVisible" type="self" :user="user" />
        <AppointmentForm v-model="dialog.appointmentForm.isVisible" :patients="patients.list"
            :departments="departments.list" />
    </div>
</template>

<script setup lang="ts">
const { hasLoggedIn, user, token } = useUser();

const appointments = ref([]);

const dialog = reactive({
    appointmentForm: {
        isVisible: false,
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

const getAppointments = async () => {
    const data = await fetchJsonData("/appointments/mine", token.value);
    if (data.error) return;

    appointments.value = data.appointments;
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
    // getAppointments();
};

onMounted(() => {
    getPatientSelf();
})
</script>

<style scoped></style>
