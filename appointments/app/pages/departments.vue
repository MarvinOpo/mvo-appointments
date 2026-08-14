<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Departments
                <v-spacer />
                <v-btn @click="openDepartmentForm(null)" color="accent" prepend-icon="mdi-plus" variant="elevated">
                    Add Department
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-row class="mt-5">
                    <v-col cols="12" md="6" lg="4">
                        <v-text-field v-model="departments.search" prepend-inner-icon="mdi-magnify" label="Search"
                            variant="outlined" hide-details clearable />
                    </v-col>
                </v-row>

                <v-data-table :headers="departments.headers" :items="departments.list" :loading="departments.isLoading"
                    :search="departments.search">

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDepartmentForm(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-lead-pencil</v-icon>
                                    </template>
                                    <span>Edit</span>
                                </v-tooltip>
                            </v-col>

                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDepartmentSchedule(item)" color="green" v-bind="props"
                                            size="x-large">mdi-calendar</v-icon>
                                    </template>
                                    <span>View Schedules</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>

                </v-data-table>
            </v-card-text>
        </v-card>

        <DepartmentForm v-model="dialog.department.isVisible" :department="dialog.department.data"
            @add-department="handleNewDept" @update-department="handleUpdateDept" />

        <DepartmentSchedule v-model="dialog.schedule.isVisible" :department="dialog.schedule.data" />
    </div>
</template>

<script setup lang="ts">
const { token } = useUser();
const snackbar = useSnackbar();

const dialog = reactive({
    department: {
        isVisible: false,
        data: <Department | null>{}
    },
    schedule: {
        isVisible: false,
        data: <Department | null>{}
    },
})

const departments = reactive({
    headers: <any[]>[
        { title: '', align: 'center', key: 'track', sortable: false },
        { title: 'Name', align: 'start', key: 'name', sortable: false },
        { title: 'Code', align: 'start', key: 'code', sortable: false },
        { title: 'Description', align: 'start', key: 'description', sortable: false },
        { title: 'Options', align: 'center', key: 'options', sortable: false, width: "200" },
    ],
    list: <Department[]>[],
    isLoading: true,
    search: '',
})

const getDepartments = async () => {
    departments.isLoading = true;
    const data = await fetchJsonData("/departments", token.value);
    if (data.error) return;

    departments.list = data;
    departments.isLoading = false;
}

const handleNewDept = (data: Department) => {
    departments.list.push(data);
    snackbar.show({
        message: "Department successfully added",
        title: "Success",
        type: "success",
    })
}

const handleUpdateDept = (data: Department) => {
    const index = departments.list.findIndex(dept => dept.id === data.id);
    departments.list[index] = data;
    snackbar.show({
        message: "Department successfully updated",
        title: "Success",
        type: "success",
    })
}

const openDepartmentForm = (data: Department | null) => {
    dialog.department.data = data;
    dialog.department.isVisible = true;
}

const openDepartmentSchedule = (data: Department | null) => {
    dialog.schedule.data = data;
    dialog.schedule.isVisible = true;
}

onMounted(() => {
    getDepartments();
})

definePageMeta({
    middleware: 'require-access',
    requiredAccess: ['can_manage_departments']
});
</script>

<style scoped></style>
