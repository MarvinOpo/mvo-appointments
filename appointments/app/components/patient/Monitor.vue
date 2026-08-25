<template>
    <v-dialog v-model="model" width="1000" :fullscreen="mobile" persistent>
        <v-card>
            <v-card-title class="d-flex align-center py-4">
                <span class="queue-title">QUEUE ({{ apptSchedule }})</span>
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
                <v-alert type="info" variant="tonal" density="comfortable" class="mb-5">
                    Please arrive at least 1 hour before your scheduled time for initial assessment.
                </v-alert>

                <!-- <v-alert type="info" variant="tonal" density="comfortable" class="mb-5">
                    <strong>"Ahead of you"</strong> shows how many patients in your
                    <strong>{{ timeRange }}</strong> time slot are still waiting
                    before your turn — patients from other time slots aren't counted.
                    Numbers update automatically as the queue moves.
                </v-alert> -->

                <v-row>
                    <v-col v-for="item in headers" :key="item.title" cols="6" lg="3">
                        <v-card variant="tonal" color="primary" class="pa-3 pa-sm-4 text-center h-100">
                            <div class="stat-label">{{ item.title }}</div>
                            <div class="stat-value">{{ item.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row justify="center" class="text-center mb-6">
                    <v-col cols="12">
                        <div class="now-serving-label">Now Serving</div>
                        <div class="now-serving-number font-weight-bold text-primary my-2">
                            <template v-if="!session?.has_started">Not Started</template>
                            <template v-else>
                                {{ nowServing }}
                            </template>
                        </div>
                        <v-chip v-if="isMyTurn" color="success" size="large" prepend-icon="mdi-bell-ring">
                            It's your turn — please proceed
                        </v-chip>
                        <v-chip v-else-if="queueStat && queueStat.now_serving > props.appointment.queue_no!"
                            color="error" size="large" prepend-icon="mdi-bell-ring">
                            A patient was prioritized due to special circumstances.
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
import moment, { now } from 'moment';

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
    { title: 'My Number', value: myQueueNo.value },
    { title: `Ahead of you`, value: isMyTurn.value ? 'Your Turn' : aheadOfYou.value },
    { title: 'Doctors on Duty', value: session.value?.doctors_on_duty ?? 0 },
    { title: 'Avg. time per Patient', value: formatAvgTime(queueStat.value?.avg_seconds) },
]);

const myQueueNo = computed(() => `${department.value?.code}${props.appointment.queue_no}-${formatDate(props.appointment.scheduled_at!, 'hA').replace(/M$/, '')}`);

const scheduledAppointments = ref<AppointmentQueue[]>([]);

const session = ref<QueueSession | null>(null);

const socket = ref<ReturnType<typeof connectSocket> | null>(null);

const walkin = reactive({
    list: <WalkInPatient[]>[{
        name: 'John X. Doe',
        type: 'R',
        queue_no: 'WIR-1'
    }],
});

const apptSchedule = computed(() => {
    const start = moment(props.appointment.scheduled_at);
    const end = start.clone().add(1, 'hours');

    return `${start.format('MMM.DD hA')}-${end.format('hA')}`;
})

const queueStat = computed(() => session.value?.stats?.find(item => item.step === props.appointment.step));

const aheadOfYou = computed(() => {
    const filteredQueue = scheduledAppointments.value.filter(item => item.step === props.appointment.step);

    const index = filteredQueue.findIndex(item => item.id === props.appointment.id);
    return index > 0 ? index : `You're Next`;
});

const isLoading = ref(false);

const nowServing = computed(() => {
    if (queueStat.value) {
        return `${department.value?.code}${queueStat.value?.now_serving}-${queueStat.value.served_sched}`;
    }

    return '-';
});

const isMyTurn = computed(() =>
    !!myQueueNo.value && nowServing.value === myQueueNo.value
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

const handleQueueUpdate = (payload: QueueUpdate) => {
    if (payload.action == 'updateDoctorCount') {
        if (session.value)
            session.value.doctors_on_duty = payload.session.doctors_on_duty;

        return;
    }

    scheduledAppointments.value = payload.queue;

    if (session.value?.stats) {
        const statIndex = session.value.stats.findIndex(s => s.step === payload.stat.step);
        if (statIndex !== -1) {
            session.value.stats[statIndex] = payload.stat;
        }

        const index = scheduledAppointments.value.findIndex(item => item.queue_no === payload.stat.now_serving);
        if (index !== -1) {
            scheduledAppointments.value.splice(index, 1);
        }
    }
};

const leaveQueue = () => {
    if (socket.value) {
        socket.value.emit('leaveQueue', { step: props.appointment.step, deptId: props.appointment.department_id });
        socket.value.off('queue:update', handleQueueUpdate);
    }
}

watch(model, async (isOpen) => {
    if (isOpen) {
        isLoading.value = true;
        await getQueueItems();
        await getQueueSession();

        if (session.value?.has_started) {
            socket.value = connectSocket();
            socket.value.emit('joinQueue', { step: props.appointment.step, deptId: props.appointment.department_id });
            socket.value.on('queue:update', handleQueueUpdate);
        }

        if (queueStat.value?.now_serving) {
            const index = scheduledAppointments.value.findIndex(item => item.queue_no === queueStat.value!.now_serving);
            if (index !== -1) {
                scheduledAppointments.value.splice(index, 1)[0];
            }
        }

        isLoading.value = false;
    } else leaveQueue();
});

watch(isMyTurn, (myTurn) => {
    if (myTurn) {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        const audio = new Audio('/sounds/notification-bell.mp3');
        audio.play().catch(() => { });

        audio.onended = () => {
            const msg = new SpeechSynthesisUtterance(
                `It's your turn. Please proceed.`
            );
            msg.lang = 'en-US';
            msg.rate = 0.9;
            speechSynthesis.speak(msg);
        };
    }
});

onUnmounted(() => {
    leaveQueue();
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
    font-size: clamp(1.5rem, 3vw, 2rem);
    opacity: 0.7;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.now-serving-number {
    font-size: clamp(7rem, 15vw, 10rem);
    line-height: 1.2;
}
</style>