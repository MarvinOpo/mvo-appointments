<template>
    <v-list color="blue" nav>
        <!-- <v-list-group
            v-if="access.can_view_division_report || access.can_view_hospital_report || access.can_create_ipcr"
            value="ipcr" class="bg-green-lighten-5" fluid>
            <template #activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-view-list" title="IPCR" />
            </template>

            <v-list-item v-if="access.can_view_division_report || access.can_view_hospital_report" to="/dashboard/ipcr"
                prepend-icon="mdi-view-dashboard" title="Dashboard" link />
            <v-list-item v-if="access.can_create_ipcr" to="/bucket/ipcr" prepend-icon="mdi-pail" title="Bucket" link />
        </v-list-group>

        <v-list-group
            v-if="access.can_view_division_report || access.can_view_hospital_report || access.can_create_ipcr || access.can_manage_competency"
            value="idp" class="bg-purple-lighten-5" fluid>
            <template #activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-view-list" title="IDP" />
            </template>

            <v-list-item
                v-if="access.can_view_division_report || access.can_view_hospital_report || access.can_manage_competency"
                to="/dashboard/idp" prepend-icon="mdi-view-dashboard" title="Dashboard" link />
            <v-list-item v-if="access.can_create_ipcr" to="/bucket/idp" prepend-icon="mdi-pail" title="Bucket" link />
            <v-list-item v-if="access.can_manage_competency" to="/competency/idp" prepend-icon="mdi-target"
                title="Competency" link />
        </v-list-group> -->

        <v-list-item to="/appointments" prepend-icon="mdi-account-group" title="Appointments" link />

        <v-list-item to="/my/appointments" prepend-icon="mdi-account" title="My Appointments" link />

        <v-list-item to="/my/dependents" prepend-icon="mdi-human-male-child" title="My Dependents" link />

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