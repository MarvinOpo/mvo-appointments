<template>
    <div>
        <v-dialog v-model="model" max-width="800" persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    Appointment Information
                    <v-spacer />
                    <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
                </v-card-title>

                <v-card-text class="pt-0">
                    <v-stepper v-model="step" alt-labels>
                        <v-stepper-header>
                            <v-stepper-item :value="1" title="Information" :color="step > 1 ? 'green' : 'blue'"
                                :complete="step > 1" />
                            <v-divider />
                            <v-stepper-item :value="2" title="Schedule" :color="step > 2 ? 'green' : 'blue'"
                                :disabled="!canGoToSchedule" />
                        </v-stepper-header>

                        <v-stepper-window v-model="step">
                            <v-stepper-window-item :value="1">
                                <v-form ref="formInfo">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-divider></v-divider>
                                            <br>
                                            <template v-if="!form.type || form.type == 'T'">
                                                <label>
                                                    <b>TELECONSULT</b> - Pagpakonsulta/check up pinaagi sa telepono.
                                                    Dili kinahanglan nga moanhi sa hospital. Huwaton ang tawag sa
                                                    doktor sa adlaw na imo schedule
                                                </label><br><br>
                                            </template>
                                            <template v-if="!form.type || form.type == 'F'">
                                                <label>
                                                    <b>FACE TO FACE</b> - Pagpakonsulta/checkup nga personal nga
                                                    magkita mo sa inyong doctor diri sa hospital sa adlaw nga na
                                                    schedule
                                                </label><br><br>
                                            </template>
                                            <v-divider></v-divider>
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-autocomplete v-model="form.patient_id" :items="patients"
                                                item-title="name" item-value="id" label="Select Patient"
                                                variant="outlined" :rules="[rules.required]" autocomplete="off"
                                                clearable>
                                                <template v-slot:item="{ props, item }">
                                                    <v-list-item v-bind="props" :subtitle="item.relationship"
                                                        :title="item.name"></v-list-item>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-select v-model="form.type" :items="options.appointmentTypes"
                                                item-title="title" item-value="value" label="Appointment Type"
                                                variant="outlined" :rules="[rules.required]" autocomplete="off" />
                                        </v-col>

                                        <v-col cols="12">
                                            <v-textarea v-model="form.complaint" label="Chief Complaint"
                                                variant="outlined" :rules="[rules.required]" counter="500" rows="3"
                                                autocomplete="off" />
                                        </v-col>

                                        <v-col v-if="selectedDepartment" cols="12">
                                            <v-alert border="start" color="blue-lighten-2"
                                                :title="selectedDepartment.name" variant="tonal">
                                                {{ selectedDepartment.description }}
                                            </v-alert>
                                        </v-col>

                                        <template v-if="form.complaint && form.patient_id">
                                            <v-col v-if="form.type" cols="12">
                                                <v-row no-gutters>
                                                    <v-col cols="12">
                                                        <v-autocomplete v-model="form.department_id"
                                                            :items="filteredDepartments" item-title="name"
                                                            item-value="id" label="Department" variant="outlined"
                                                            :rules="[rules.required]" autocomplete="off" clearable />
                                                    </v-col>

                                                    <v-col cols="auto" class="ml-auto">
                                                        <v-btn color="accent" class="ml-auto"
                                                            @click="dialog.deptAssistant.isVisible = true"
                                                            variant="tonal">
                                                            <u>Dili sure sa department? CLICK HERE</u>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </template>
                                    </v-row>
                                </v-form>
                            </v-stepper-window-item>

                            <v-stepper-window-item :value="2">
                                <v-row>
                                    <v-col cols="12">
                                        <v-alert border="start" color="blue-lighten-2" variant="tonal"
                                            density="compact">
                                            <strong>{{ selectedPatient?.name }}</strong> &mdash;
                                            {{ selectedDepartment?.name }}
                                        </v-alert>
                                    </v-col>

                                    <v-col v-if="availableSchedules.length" cols="12" class="pt-0">
                                        <fieldset class="pa-3">
                                            <legend class="pl-2 pr-2">Available Schedule</legend>

                                            <v-data-iterator :items="availableSchedules" :items-per-page="-1"
                                                hide-default-footer>
                                                <template v-slot:default="{ items }">
                                                    <v-radio-group v-model="selectedSchedule"
                                                        @update:model-value="checkAvailability">
                                                        <v-row no-gutters>
                                                            <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6"
                                                                md="4">
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

                                    <v-col v-if="bookingError" cols="12">
                                        <v-alert border="start" color="red" title="Error" variant="tonal"
                                            density="compact">
                                            {{ bookingError }}
                                        </v-alert>
                                    </v-col>

                                    <v-col v-if="selectedSchedule" cols="12" class="pt-0">
                                        <v-data-table :headers="timeHeaders" :items="availableTime"
                                            :loading="isLoadingSchedule" item-key="hour" disable-sort
                                            hide-default-footer>
                                            <template #item.pax="{ item }">
                                                {{ item.scheduled }} / {{ item.pax }}
                                            </template>

                                            <template #item.options="{ item }">
                                                <v-row justify="center">
                                                    <v-col cols="auto">
                                                        <v-btn v-if="!item.isFull" color="green" @click="bookSlot(item)"
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
                            </v-stepper-window-item>
                        </v-stepper-window>
                    </v-stepper>
                </v-card-text>

                <v-card-actions class="sticky-bottom bg-white">
                    <v-container>
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-btn color="grey" @click="step = 1" :disabled="step === 1"
                                    prepend-icon="mdi-arrow-left" variant="tonal">
                                    Previous
                                </v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="green" @click="goToSchedule" append-icon="mdi-arrow-right"
                                    :disabled="step === 2" variant="tonal">
                                    Next
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <AppointmentDepartmentAssistant v-model="dialog.deptAssistant.isVisible" :patient="selectedPatient"
            :departments="departments" :complaint="form.complaint" :type="form.type" @confirm="setDepartment" />
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token, user } = useUser();
const { getScheduledAppointments } = useAppointment();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    patients: PatientOption[];
    departments: Department[];
}>();

const emit = defineEmits<{
    addAppointment: [appointment: Appointment];
}>();

const step = ref(1);

const appointments = reactive({
    scheduled: <Appointment[]>[]
})

const bookingError = ref('');

const dialog = reactive({
    deptAssistant: { isVisible: false }
});

const defaultForm = (): AppointmentFormData => (
    {
        user_id: null,
        patient_id: null,
        department_id: null,
        step: 1,
        scheduled_at: null,
        complaint: null,
        type: null,
        subjective: null,
        objective: null,
        assessment: null,
        plan: null,
        assessed_by: null,
        ai_dept_matched: false
    }
)

const form = ref<AppointmentFormData>(defaultForm());

const formInfo = ref();

const filteredDepartments = computed(() => {
    form.value.department_id = null;
    return props.departments.filter(dept =>
        dept.schedules?.some(schedule => schedule.type === form.value.type)
    )
})

const canGoToSchedule = computed(() => {
    return !!(form.value.patient_id && form.value.type && form.value.complaint && form.value.department_id);
})

const isLoading = ref(false);

const isLoadingSchedule = ref(false);

const selectedDepartment = computed(() => {
    bookingError.value = '';
    return props.departments.find(dept => dept.id === form.value.department_id);
})

const selectedPatient = computed(() => {
    return props.patients.find(patient => patient.id === form.value.patient_id);
})

const selectedSchedule = ref(null);

const timeHeaders = [
    { title: 'Time', key: 'label' },
    { title: 'Slots', key: 'pax' },
    { title: '', key: 'options', sortable: false },
];


const isBooking = ref(false);

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

const bookSlot = async (item: any) => {
    bookingError.value = '';
    isBooking.value = true;

    form.value.scheduled_at = moment(selectedSchedule.value, 'MMM. DD, YYYY (ddd)').set({
        hour: item.hour,
        minute: 0,
        second: 0,
    }).format('YYYY-MM-DD HH:mm:ss');

    if (user.value) {
        form.value.user_id = user.value.id;
    }

    const data = await postJsonData('/appointments', form.value, token.value);
    if (data.error) {
        isBooking.value = false;
        bookingError.value = data.message;
        return;
    }

    emit('addAppointment', data);
    isBooking.value = false;

    closeDialog();
};

const goToSchedule = async () => {
    const { valid } = await formInfo.value.validate();
    if (!valid) return;

    step.value = 2;
};

const checkAvailability = async () => {
    isLoadingSchedule.value = true;

    const schedule = moment(selectedSchedule.value, 'MMM. DD, YYYY (ddd)')
    const data = await getScheduledAppointments(form.value.department_id!, schedule);
    if (data.error) return;

    appointments.scheduled = data;
    isLoadingSchedule.value = false;
}

const setDepartment = (id: number) => {
    form.value.ai_dept_matched = true;
    form.value.department_id = id;
}

const closeDialog = () => {
    model.value = false;
    step.value = 1;
    form.value = defaultForm();
};

watch(() => form.value.department_id, () => {
    selectedSchedule.value = null;
});
</script>