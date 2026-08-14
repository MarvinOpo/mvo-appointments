<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                My Dependents
                <v-spacer />
                <v-btn @click="openDialogPatient(null)" color="accent" prepend-icon="mdi-plus" variant="elevated">
                    Add Dependent
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="dependents.headers" :items="dependents.list" :loading="isLoading"
                    :mobile="smAndDown">
                    <template v-slot:item.name="{ item }">
                        {{ getFullName(item) }}
                    </template>

                    <template v-slot:item.birth_date="{ item }">
                        <span style="white-space: pre-line;">
                            {{ item.birth_date ?
                                formatDate(item.birth_date, 'MMM. DD, YYYY') : 'N/A' }}
                        </span>
                    </template>

                    <template v-slot:item.age="{ item }">
                        {{ item.birth_date ? getAge(item.birth_date) : 'N/A' }}
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogPatient(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-lead-pencil</v-icon>
                                    </template>
                                    <span>Edit</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <PatientForm v-model="dialog.patient.isVisible" :patient="dialog.patient.data" type="dependent"
            @add-patient="handleNewPatient" @update-patient="handleUpdatePatient" />
    </div>
</template>

<script setup lang="ts">
const { smAndDown } = useDisplay();
const { token } = useUser();

const dependents = reactive({
    headers: <any[]>[
        { title: "Patient Name", align: "start", value: "name", sortable: false },
        { title: "Date of Birth", align: "start", value: "birth_date", sortable: false },
        { title: "Age", align: "start", value: "age", sortable: false },
        { title: "Email", align: "center", value: "email", sortable: false },
        { title: "Contact No.", align: "center", value: "mobile_no", sortable: false },
        { title: "Relation", align: "center", value: "relationship", sortable: false },
        { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
    ],
    list: <Patient[]>[],
});

const dialog = reactive({
    patient: {
        isVisible: false,
        data: <Patient>{},
    },
})

const isLoading = ref(true);

const snackbar = useSnackbar();

const getDependents = async () => {
    isLoading.value = true;

    const data = await fetchJsonData("/dependents/mine", token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    dependents.list = data;

    isLoading.value = false;
};

const handleNewPatient = (patient: Patient) => {
    dependents.list.push(patient);
    snackbar.show({
        message: "Dependent successfully added",
        title: "Success",
        type: "success",
    })
};

const handleUpdatePatient = (patient: Patient) => {
    const index = dependents.list.findIndex(item => item.id === patient.id);
    dependents.list[index] = patient;
    snackbar.show({
        message: "Dependent successfully updated",
        title: "Success",
        type: "success",
    })
};


const openDialogPatient = (patient: Patient | null) => {
    dialog.patient.isVisible = true;
    dialog.patient.data = patient ?? ({} as Patient);
};

onMounted(() => {
    getDependents();
});
</script>

<style scoped></style>
