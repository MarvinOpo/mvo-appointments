<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Patient: {{ getFullName(props.appointment.patient) }}
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formResched">
                    <v-row>
                        <v-col cols="12">
                            <v-textarea v-model="form.complaint" label="Chief Complaint" variant="outlined"
                                :rules="[rules.required]" counter="500" rows="3" autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-select v-model="form.type" :items="options.appointmentTypes" item-title="title"
                                item-value="value" label="Appointment Type" variant="outlined" :rules="[rules.required]"
                                autocomplete="off" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-autocomplete v-model="form.department_id" :items="filteredDepartments"
                                        item-title="name" item-value="id" label="Department" variant="outlined"
                                        :rules="[rules.required]" autocomplete="off" clearable />
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col v-if="availableSchedules.length" cols="12" class="pt-0">
                            <fieldset class="pa-3">
                                <legend class="pl-2 pr-2">Available Schedule</legend>

                                <v-data-iterator :items="availableSchedules" :items-per-page="-1" hide-default-footer>
                                    <template v-slot:default="{ items }">
                                        <v-radio-group v-model="selectedSchedule"
                                            @update:model-value="checkAvailability">
                                            <v-row no-gutters>
                                                <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4">
                                                    <v-radio :label="item.raw" :value="item.raw">
                                                    </v-radio>
                                                </v-col>
                                            </v-row>
                                        </v-radio-group>
                                    </template>

                                    <template v-slot:no-data>
                                        <v-row class="pa-5" justify="center" no-gutter>
                                            <label class="grey--text">
                                                NO AVAILABLE SCHEDULE
                                            </label>
                                        </v-row>
                                    </template>
                                </v-data-iterator>
                            </fieldset>
                        </v-col>

                        <v-col v-if="selectedSchedule" cols="12" class="pt-0">
                            <v-data-table :headers="timeHeaders" :items="availableTime" :loading="isLoadingSchedule"
                                item-key="hour" disable-sort hide-default-footer>
                                <template #item.pax="{ item }">
                                    {{ item.scheduled }} / {{ item.pax }}
                                </template>

                                <template #item.options="{ item }">
                                    <v-row justify="center">
                                        <v-col cols="auto">
                                            <v-btn v-if="!item.isFull" color="green" @click="reschedAppointment(item)"
                                                :loading="isBooking" :disabled="isBooking" small>
                                                <v-icon start size="small">mdi-book</v-icon>Book
                                            </v-btn>
                                            <v-btn v-else color="red-lighten-2" small variant="text">
                                                Full
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token } = useUser();
const { getScheduledAppointments } = useAppointment();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    appointment: Appointment;
    departments: Department[];
}>();

const emit = defineEmits<{
    reschedAppointment: [data: Appointment];
}>();

const appointments = reactive({
    scheduled: <Appointment[]>[]
})

const bookingError = ref('');

const defaultForm = (): AppointmentReschedForm => ({
    id: null,
    department_id: null,
    scheduled_at: null,
    complaint: null,
    type: null,
} as unknown as AppointmentReschedForm);

const form = ref<AppointmentReschedForm>(defaultForm());

const formResched = ref();

const filteredDepartments = computed(() => {
    form.value.department_id = null;
    return props.departments.filter(dept =>
        dept.schedules?.some(schedule => schedule.type === form.value.type)
    )
})

const isBooking = ref(false);

const isLoading = ref(false);
const isLoadingSchedule = ref(false);

const selectedDepartment = computed(() => {
    bookingError.value = '';
    return props.departments.find(dept => dept.id === form.value.department_id);
})

const selectedSchedule = ref(null);

const timeHeaders = [
    { title: 'Time', key: 'label' },
    { title: 'Slots', key: 'pax' },
    { title: '', key: 'options', sortable: false },
];

const typeSchedule = computed(() => {
    return selectedDepartment.value?.schedules?.find(
        schedule => schedule.type === form.value.type
    )
})

const availableSchedules = computed(() => {
    const days = typeSchedule.value?.days as string[] | undefined

    if (!days?.length) return []

    const scheduleDayNumbers = days.map(d => options.dayMap[d.toUpperCase()])

    const dates = []
    const start = moment().startOf('day')
    const end = moment().add(1, 'months').endOf('day')

    const cursor = start.clone()
    while (cursor.isSameOrBefore(end, 'day')) {
        if (scheduleDayNumbers.includes(cursor.day())) {
            dates.push(cursor.clone().format('MMM. DD, YYYY (ddd)'))
        }
        cursor.add(1, 'day')
    }

    return dates
})

const availableTime = computed(() => {
    if (!typeSchedule.value || !selectedSchedule.value) return [];

    const start = moment.utc(typeSchedule.value.start);
    const end = moment.utc(typeSchedule.value.end);
    const pax = typeSchedule.value.pax;

    const selectedDate = moment(selectedSchedule.value, 'MMM. DD, YYYY (ddd)');
    const isToday = selectedDate.isSame(moment(), 'day');

    const slots = [];
    const cursor = start.clone();

    while (cursor.isBefore(end)) {
        const next = cursor.clone().add(1, 'hour');

        const slotDateTime = selectedDate.clone().set({
            hour: cursor.hour(),
            minute: cursor.minute(),
            second: 0,
        });

        if (isToday && slotDateTime.isBefore(moment())) {
            cursor.add(1, 'hour');
            continue;
        }

        const scheduledCount = appointments.scheduled.filter((a) =>
            moment.utc(a.scheduled_at).isSame(moment.utc(slotDateTime), 'hour')
        ).length;

        slots.push({
            label: `${cursor.format('h:mma')} - ${next.format('h:mma')}`,
            hour: cursor.hour(),
            pax,
            scheduled: scheduledCount,
            remaining: pax! - scheduledCount,
            isFull: scheduledCount >= pax!,
        });

        cursor.add(1, 'hour');
    }

    return slots;
});

const checkAvailability = async () => {
    isLoadingSchedule.value = true;

    const schedule = moment(selectedSchedule.value, 'MMM. DD, YYYY (ddd)')
    const data = await getScheduledAppointments(form.value.department_id!, schedule);
    if (data.error) return;

    appointments.scheduled = data;
    isLoadingSchedule.value = false;
}

const closeDialog = () => {
    model.value = false;
};

const reschedAppointment = async (item: any) => {
    const { valid } = await formResched.value.validate();
    if (!valid) return;

    isLoading.value = true;

    form.value.scheduled_at = moment(selectedSchedule.value, 'MMM. DD, YYYY (ddd)').set({
        hour: item.hour,
        minute: 0,
        second: 0,
    }).format('YYYY-MM-DD HH:mm:ss');

    const data = await updateJsonData(`/appointments/${props.appointment.id}/resched`, form.value, token.value);
    if (data.error) return;

    emit('reschedAppointment', data);
    isLoading.value = false;
    closeDialog();
}

watch(model, (isOpen) => {

    form.value = defaultForm();

    if (isOpen) {
        if (props.appointment) {
            form.value.id = props.appointment.id!;
            form.value.department_id = props.appointment.department_id!;
            form.value.scheduled_at = props.appointment.scheduled_at!;
            form.value.type = props.appointment.type!;
            form.value.complaint = props.appointment.complaint!;
        }
    }
});
</script>