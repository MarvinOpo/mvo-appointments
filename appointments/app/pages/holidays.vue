<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Holidays
                <v-spacer />
                <v-btn @click="openDialogHoliday(null)" color="accent" prepend-icon="mdi-plus" variant="elevated">
                    Add Holiday
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="holidays.headers" :items="holidays.list" :loading="isLoading"
                    :mobile="smAndDown">
                    <template v-slot:item.holiday="{ item }">
                        <span style="white-space: pre-line;">
                            {{ item.date ? formatDate(item.date, 'MMM. DD, YYYY') : 'N/A' }}
                        </span>
                    </template>

                    <template v-slot:item.dept_ids="{ item }">
                        {{ getDeptLabel(item.dept_ids) }}
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogHoliday(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-lead-pencil</v-icon>
                                    </template>
                                    <span>Edit</span>
                                </v-tooltip>
                            </v-col>

                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogCancel(item.id!)" color="red" v-bind="props"
                                            size="x-large">mdi-delete</v-icon>
                                    </template>
                                    <span>Delete</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <HolidayForm v-model="dialog.holiday.isVisible" :holiday="dialog.holiday.data" @add-holiday="handleNewHoliday"
            @update-holiday="handleUpdateHoliday" />

        <DialogConfirm v-model="dialog.cancel.isVisible" :label="dialog.cancel.label" color="red" positive-text="DELETE"
            @confirm="deleteHoliday" />
    </div>
</template>

<script setup lang="ts">
const { smAndDown } = useDisplay();
const { token } = useUser();

const holidays = reactive({
    headers: <any[]>[
        { title: "Description", align: "start", value: "description", sortable: false },
        { title: "Date", align: "start", value: "holiday", sortable: false },
        { title: "Departments", align: "center", value: "dept_ids", sortable: false },
        { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
    ],
    list: <Holiday[]>[],
});

const dialog = reactive({
    cancel: {
        id: 0,
        isVisible: false,
        label: "Are you sure you want to delete this holiday?",
    },
    holiday: {
        isVisible: false,
        data: <Holiday>{},
    },
})

const isLoading = ref(true);

const snackbar = useSnackbar();

const deleteHoliday = async () => {
    isLoading.value = true;

    const data = await deleteJsonData(`/holidays/${dialog.cancel.id}`, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    holidays.list = holidays.list.filter(item => item.id !== dialog.cancel.id);

    snackbar.show({
        message: "Holiday successfully deleted",
        title: "Success",
        type: "success",
    })

    dialog.cancel.isVisible = false;
    isLoading.value = false;
}

const getHolidays = async () => {
    isLoading.value = true;

    const data = await fetchJsonData("/holidays", token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    holidays.list = data;

    isLoading.value = false;
};

const getDeptLabel = (dept_ids: number[] | null) => {
    if (!dept_ids || dept_ids.length === 0) return "All Departments";
    return `${dept_ids.length} Department${dept_ids.length > 1 ? "s" : ""}`;
};

const handleNewHoliday = (holiday: Holiday) => {
    holidays.list.push(holiday);
    snackbar.show({
        message: "Holiday successfully added",
        title: "Success",
        type: "success",
    })
};

const handleUpdateHoliday = (holiday: Holiday) => {
    const index = holidays.list.findIndex(item => item.id === holiday.id);
    holidays.list[index] = holiday;
    snackbar.show({
        message: "Holiday successfully updated",
        title: "Success",
        type: "success",
    })
};

const openDialogHoliday = (holiday: Holiday | null) => {
    dialog.holiday.isVisible = true;
    dialog.holiday.data = holiday ?? ({} as Holiday);
};

const openDialogCancel = (id: number) => {
    dialog.cancel.id = id;
    dialog.cancel.isVisible = true;
};

onMounted(() => {
    getHolidays();
});

definePageMeta({
    middleware: 'require-access',
    requiredAccess: ['can_manage_holidays']
});
</script>

<style scoped></style>