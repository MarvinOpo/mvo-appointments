<template>
    <v-list color="blue" nav>
        <v-list-item v-if="access?.can_manage_appts" to="/appointments" prepend-icon="mdi-account-group"
            title="Appointments" link />

        <v-list-item to="/my/appointments" prepend-icon="mdi-account" title="My Appointments" link />

        <v-list-item to="/my/dependents" prepend-icon="mdi-human-male-child" title="My Dependents" link />

        <v-list-item v-if="access?.can_manage_departments" to="/departments" prepend-icon="mdi-hospital-building"
            title="Departments" link />

        <v-list-item v-if="access?.can_manage_queue" to="/queue/sessions" prepend-icon="mdi-human-queue"
            title="Queue Sessions" link />

        <v-list-item to="/forms" prepend-icon="mdi-file-document-multiple" title="Forms" link />

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