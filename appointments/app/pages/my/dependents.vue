<template>
    <v-card class="child-component" flat>
        <v-card-title class="d-flex align-center">
            My Dependents
            <v-spacer />
            <v-btn color="accent" prepend-icon="mdi-plus" variant="elevated">
                Add Dependent
            </v-btn>
        </v-card-title>

        <v-card-text>
            <v-data-table :items="dependents"></v-data-table>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
const dependents = ref([]);

const snackbar = useSnackbar();

const getDependents = async () => {
    const data = await fetchJsonData("/dependents/mine");

    if (data.error) {
        snackbar.show({
            message: data.error.message,
            title: "Error",
            type: "error",
        });
        return;
    }

    dependents.value = data.dependents;
};

onMounted(() => {
    getDependents();
});
</script>

<style scoped></style>
