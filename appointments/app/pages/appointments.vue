<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Appointments
            </v-card-title>

            <v-card-text>
                <v-tabs v-model="appointments.tab" color="primary">
                    <v-tab :value="1">Pending</v-tab>
                    <v-tab :value="2">Ongoing</v-tab>
                    <v-tab :value="3">Completed</v-tab>
                    <v-tab :value="4">Cancelled/No Show</v-tab>
                </v-tabs>

                <AppointmentList :status="status" />
            </v-card-text>
        </v-card>

        <AppointmentLogs v-model="appt.isVisible" :appointment-id="appt.appointmentId" :step="appt.appointmentStep"
            :type="appt.appointmentType"  :status="appt.appointmentStatus"/>
    </div>
</template>

<script setup lang="ts">
const appt = useAppointment();
const snackbar = useSnackbar();

const appointments = reactive({
    tab: 1
})

const statusMap: Record<number, string[]> = {
    1: ['P'],
    2: ['O'],
    3: ['C'],
    4: ['X', 'NS'],
};

const status = computed(() => statusMap[appointments.tab]);

</script>

<style scoped></style>
