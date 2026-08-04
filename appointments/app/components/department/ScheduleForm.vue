<template>
    <v-dialog v-model="model" max-width="600" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                {{ isEdit ? 'Edit' : 'Add' }} Schedule
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formSchedule">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-autocomplete v-model="form.start" :items="timeSlots" density="compact" label="Start"
                                :rules="[rules.required]" variant="outlined" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-autocomplete v-model="form.end" :items="timeSlots" density="compact" label="End"
                                :rules="[rules.required]" variant="outlined" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.pax" density="compact" label="Pax per hour" type="number"
                                variant="outlined" :rules="[rules.required]" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-select v-model="form.type" :items="options.appointmentTypes" density="compact"
                                label="Appointment Type" :rules="[rules.required]" variant="outlined" />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="form.days" :items="days" density="compact" label="Days"
                                :rules="[rules.required]" variant="outlined" chips multiple />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="sticky-bottom bg-white">
                <v-container>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn color="grey" @click="closeDialog" variant="tonal">CANCEL</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn color="green" @click="saveSchedule" :loading="isLoading" variant="tonal">SAVE</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token } = useUser();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    departmentId: number | undefined;
    schedule: DeptSchedule | null;
}>();

const emit = defineEmits<{
    addSchedule: [schedule: DeptSchedule];
    updateSchedule: [schedule: DeptSchedule];
}>();

const isEdit = computed(() => !!props.schedule?.id);

const isLoading = ref(false);


const days = [
    { title: 'Monday', value: 'Mon' },
    { title: 'Tuesday', value: 'Tue' },
    { title: 'Wednesday', value: 'Wed' },
    { title: 'Thursday', value: 'Thu' },
    { title: 'Friday', value: 'Fri' },
    { title: 'Saturday', value: 'Sat' },
    { title: 'Sunday', value: 'Sun' },
]

const defaultForm = (): DeptSchedule => ({
    dept_id: null,
    days: null,
    start: null,
    end: null,
    type: null,
    pax: null,
});

const form = ref<DeptSchedule>(defaultForm());

const formSchedule = ref();

const timeSlots = computed(() => {
    const slots = [];
    for (let h = 6; h <= 18; h++) {
        const time = moment().hour(h).minute(0);
        slots.push({
            title: time.format('h:mm a'),
            value: time.format('HH:mm'),
        });
    }
    return slots;
});

const closeDialog = () => {
    model.value = false;
};

const insertSchedule = async () => {
    const data = await postJsonData(`/departments/${props.departmentId}/schedules`, form.value, token.value);
    console.log(data);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('addSchedule', data);
    isLoading.value = false;
    closeDialog();
};

const updateSchedule = async () => {
    const data = await updateJsonData(`/departments/${props.departmentId}/schedules/${props.schedule?.id}`, form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit('updateSchedule', data);
    isLoading.value = false;
    closeDialog();
};

const saveSchedule = async () => {
    const { valid } = await formSchedule.value.validate();
    if (!valid) return;

    isLoading.value = true;

    if (isEdit.value) await updateSchedule();
    else await insertSchedule();
};

watch(() => props.schedule, () => {
    if (props.schedule) {
        form.value = { ...props.schedule };
        form.value.start = moment.utc(props.schedule.start).format('HH:mm');
        form.value.end = moment.utc(props.schedule.end).format('HH:mm');
    } else form.value = defaultForm();

    if (props.departmentId) {
        form.value.dept_id = props.departmentId;
    }
}, { immediate: true });
</script>