<template>
    <v-dialog v-model="model" width="1000" :fullscreen="mobile" persistent>
        <v-card>
            <v-card-title class="d-flex align-center py-4">
                <span class="queue-title">QUEUE {{ timeRange }}</span>
                <v-chip size="small" color="primary" variant="tonal" class="ml-3">
                    {{ getQueueStep(appointment.step) }}
                </v-chip>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-divider />

            <v-card-text v-if="isLoading">
                <v-row>
                    <v-col v-for="item in headers" :key="item.title" cols="6" lg="3">
                        <v-skeleton-loader type="card"></v-skeleton-loader>
                    </v-col>

                    <v-col cols="12">
                        <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-text v-else class="pa-4 pa-sm-6">
                <v-row>
                    <v-col v-for="item in headers" :key="item.title" cols="6" lg="3">
                        <v-card variant="tonal" color="primary" class="pa-3 pa-sm-4 text-center h-100">
                            <div class="stat-label">{{ item.title }}</div>
                            <div class="stat-value">{{ item.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row justify="center" class="text-center mb-6">
                    <v-col cols="12" sm="6">
                        <div class="now-serving-label">Now Serving</div>
                        <div class="now-serving-number font-weight-bold text-primary my-2">
                            {{
                                queueStat?.now_serving ? `${department?.code}-${queueStat?.now_serving}` : 'Not Started'
                            }}
                        </div>
                        <v-chip v-if="isMyTurn" color="success" size="large" prepend-icon="mdi-bell-ring">
                            It's your turn — please proceed
                        </v-chip>
                    </v-col>
                </v-row>

                <v-alert v-if="walkin.list.length" variant="tonal" color="warning" density="compact"
                    icon="mdi-account-clock-outline" class="mt-6">
                    <span class="font-weight-medium">{{ walkin.list.length }} walk-in patient(s)</span>
                    waiting — may be called if a scheduled patient doesn't show.
                </v-alert>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import moment from 'moment';

const { mobile } = useDisplay();
const { connectSocket } = useQueueSocket();
const { getScheduledAppointments } = useAppointment();
const { token } = useUser();

const props = defineProps<{
    appointment: Appointment;
}>();

const model = defineModel<boolean>({ default: false });

const department = computed(() => props.appointment.department);

const headers = computed(() => [
    { title: 'My Number', value: `${department.value?.code}-${queueNo.value}` },
    { title: `Position in Queue(${timeRange.value})`, value: queuePosition.value },
    { title: 'Doctors on Duty', value: session.value.doctors_on_duty },
    { title: 'Average Wait Time', value: `${avgWaitTime.value} min` },
]);

const queueNo = computed(() => props.appointment.queue_no);

const scheduledAppointments = ref<AppointmentQueue[]>([]);

const session = ref<QueueSession>({
    id: 0,
    dept_id: props.appointment.department_id || 0,
    session_date: moment(props.appointment.scheduled_at).format('YYYY-MM-DD'),
    doctors_on_duty: 0,
    has_started: false,
    stats: [],
});

const socket = ref<ReturnType<typeof connectSocket> | null>(null);

const walkin = reactive({
    list: <WalkInPatient[]>[{
        name: 'John X. Doe',
        type: 'R',
        queue_no: 'WIR-1'
    }],
});

const timeRange = computed(() => {
    const start = moment(props.appointment.scheduled_at);
    const end = start.clone().add(1, 'hours');

    return `${start.format('hA')}-${end.format('hA')}`;
})

const queueStat = computed(() => session.value?.stats?.find(item => item.step === props.appointment.step));
const avgWaitTime = ref<number>(0);

const queuePosition = computed(() => {
    const filteredQueue = scheduledAppointments.value.filter(item => item.step === props.appointment.step &&
        item.scheduled_at === props.appointment.scheduled_at);

    const index = filteredQueue.findIndex(item => item.queue_no === queueNo.value);
    return index + 1;
});

const isLoading = ref(false);

const isMyTurn = computed(() =>
    !!queueNo.value && queueStat.value?.now_serving === queueNo.value
);

const getQueueItems = async () => {
    if (props.appointment.department_id) {
        const schedule = moment(props.appointment.scheduled_at);
        const data = await getScheduledAppointments(props.appointment.department_id, schedule);

        if (!data.error)
            scheduledAppointments.value = data;
    }
};

const getQueueSession = async () => {
    const date = moment(props.appointment.scheduled_at).format('YYYY-MM-DD');
    const param = `?deptId=${props.appointment.department_id}&date=${date}`

    const data = await fetchJsonData(`/queue/session` + param, token.value);
    if (data.error) return;
    if (Object.keys(data).length) session.value = data;
}

const closeDialog = () => {
    model.value = false;
};

const handleQueueUpdate = (data: any) => {

};

watch(model, async (isOpen) => {

    if (isOpen) {
        isLoading.value = true;
        await getQueueItems();
        await getQueueSession();

        if (session.value.has_started) {
            socket.value = connectSocket();
            socket.value.emit('joinQueue', { step: props.appointment.step, deptId: props.appointment.department_id });
            socket.value.on('queue:update', handleQueueUpdate);
        }

        isLoading.value = false;
    } else {
        if (socket.value) {
            socket.value.emit('leaveQueue', { step: props.appointment.step, deptId: props.appointment.department_id });
            socket.value.off('queue:update', handleQueueUpdate);
        }
    }
});

onUnmounted(() => {
    if (socket.value) {
        socket.value.off('queue:update', handleQueueUpdate);
    }
});
</script>

<style scoped>
.queue-title {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 700;
}

.stat-label {
    font-size: clamp(0.75rem, 1.2vw, 0.9rem);
    opacity: 0.7;
    margin-bottom: 4px;
}

.stat-value {
    font-size: clamp(1.25rem, 3vw, 2rem);
    font-weight: 700;
}

.now-serving-label {
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    opacity: 0.7;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.now-serving-number {
    font-size: clamp(2.5rem, 8vw, 6rem);
    line-height: 1.1;
}
</style>