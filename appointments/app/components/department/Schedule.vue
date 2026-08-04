<template>
    <div>
        <v-dialog v-model="model" max-width="800" persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    {{ department?.name }}
                    <v-spacer />
                    <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
                </v-card-title>

                <v-card-text>
                    <v-row class="justify-end">
                        <v-col cols="auto">
                            <v-btn color="green" @click="openScheduleForm(null)" class="float-right"
                                :loading="isLoading" prepend-icon="mdi-plus" variant="tonal">
                                Add Schedule
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-data-table class="mt-5" :headers="schedules.headers" :items="department?.schedules">
                        <template v-slot:item.type="{ item }">
                            {{ getApptType(item.type) }}
                        </template>

                        <template v-slot:item.days="{ item }">
                            <v-chip v-for="day in item.days" :key="day" size="x-small">
                                {{ day }}
                            </v-chip>
                        </template>

                        <template v-slot:item.start="{ item }">
                            {{ item.start ? formatUTCDate(item.start, 'h:mm A') : 'N/A' }}
                        </template>

                        <template v-slot:item.end="{ item }">
                            {{ item.end ? formatUTCDate(item.end, 'h:mm A') : 'N/A' }}
                        </template>

                        <template v-slot:item.options="{ item }">
                            <v-row justify="center">
                                <v-col cols="auto">
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-icon @click="openScheduleForm(item)" color="blue"
                                                v-bind="props">mdi-lead-pencil</v-icon>
                                        </template>
                                        <span>Edit</span>
                                    </v-tooltip>
                                </v-col>

                                <v-col cols="auto">
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-icon @click="openDeleteDialog(item.id!)" color="red"
                                                v-bind="props">mdi-delete</v-icon>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </template>

                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>

        <DepartmentScheduleForm v-model="dialog.schedule.isVisible" :departmentId="department?.id"
            :schedule="dialog.schedule.data" @add-schedule="handleNewSchedule"
            @update-schedule="handleUpdateSchedule" />

        <DialogConfirm v-model="dialog.delete.isVisible" label="Are you sure you want to delete this schedule?"
            color="red" positive-text="DELETE" @confirm="deleteSchedule" />
    </div>
</template>

<script setup lang="ts">
const { token } = useUser();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    department: Department | null;
}>();

const dialog = reactive({
    delete: {
        isVisible: false,
        scheduleId: 0
    },
    schedule: {
        isVisible: false,
        data: <DeptSchedule | null>{},
    },
})

const isLoading = ref(false);

const snackbar = useSnackbar();

const schedules = reactive({
    headers: <any[]>[
        { title: 'Type', align: 'start', key: 'type', sortable: false },
        { title: 'Days', align: 'start', key: 'days', sortable: false, width: "150" },
        { title: 'Start time', align: 'center', key: 'start', sortable: false },
        { title: 'End time', align: 'center', key: 'end', sortable: false },
        { title: 'Pax per hour', align: 'center', key: 'pax', sortable: false },
        { title: 'Options', align: 'center', key: 'options', sortable: false, width: "200" },
    ],
})

const closeDialog = () => {
    model.value = false;
};

const deleteSchedule = async () => {
    const data = await deleteJsonData(`/departments/${props.department?.id}/schedules/${dialog.delete.scheduleId}`, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    const index = props.department!.schedules.findIndex((s) => s.id === dialog.delete.scheduleId);
    if (index !== -1) {
        props.department!.schedules.splice(index, 1);
    }

    snackbar.show({
        message: "Schedule successfully deleted",
        title: "Success",
        type: "success",
    });

    dialog.delete.isVisible = false;
}

const handleNewSchedule = (schedule: DeptSchedule) => {
    props.department?.schedules.push(schedule);

    snackbar.show({
        message: "Schedule successfully added",
        title: "Success",
        type: "success",
    })
}

const handleUpdateSchedule = (schedule: DeptSchedule) => {
    if (props.department) {
        const index = props.department.schedules.findIndex((s) => s.id === schedule.id);
        if (index !== -1) {
            props.department.schedules[index] = schedule;
        }

        snackbar.show({
            message: "Schedule successfully updated",
            title: "Success",
            type: "success",
        })
    }
}

const openScheduleForm = (schedule: DeptSchedule | null) => {
    dialog.schedule.data = schedule;
    dialog.schedule.isVisible = true;
}

const openDeleteDialog = (scheduleId: number) => {
    dialog.delete.scheduleId = scheduleId;
    dialog.delete.isVisible = true;
}

</script>