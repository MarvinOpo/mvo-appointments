<template>
    <v-list color="blue" nav>
        <v-list-item v-if="access?.can_manage_appts" to="/dashboard" prepend-icon="mdi-view-dashboard" title="Dashboard"
            link />

        <v-list-item v-if="access?.can_manage_appts" to="/appointments" prepend-icon="mdi-account-group"
            title="Appointments" link />

        <v-list-item to="/my/appointments" prepend-icon="mdi-account" title="My Appointments" link />

        <v-list-item to="/my/dependents" prepend-icon="mdi-human-male-child" title="My Dependents" link />

        <v-list-item v-if="access?.can_manage_departments" to="/departments" prepend-icon="mdi-hospital-building"
            title="Departments" link />

        <v-list-item v-if="access?.can_manage_appts" to="/teleconsult" prepend-icon="mdi-phone" title="Teleconsult"
            link />

        <v-list-item v-if="access?.can_manage_queue" to="/queue/sessions" prepend-icon="mdi-human-queue"
            title="Queue Sessions" link />

        <v-list-item v-if="access?.can_manage_queue" to="/monitors" prepend-icon="mdi-television" title="Queue Monitors"
            link />

        <v-list-item v-if="access?.can_manage_holidays" to="/holidays" prepend-icon="mdi-sun-clock-outline"
            title="Holidays" link />

        <v-list-item v-if="access?.can_manage_access" to="/user/access" prepend-icon="mdi-account-group"
            title="User Access" link />

        <v-list-item @click="logout" prepend-icon="mdi-logout" title="Logout" link />

    </v-list>
</template>

<script setup>
const { access } = useUser();

const emit = defineEmits(["logout"]);

const logout = () => {
    emit("logout");
};
</script>