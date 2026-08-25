<template>
    <div>
        <v-dialog v-model="model" fullscreen persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    Queue Station ({{ queueRole?.label }})
                    <v-spacer />
                    <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6" lg="8" class="bg-blue-lighten-5 text-center pa-5">
                            <div class="section-header">Now Serving</div>
                            <div class="now-serving-number font-weight-bold text-primary my-2">
                                <template v-if="!session?.has_started">
                                    Not Started
                                </template>
                                <template v-else>
                                    {{ nowServing }}
                                </template>
                            </div>

                            <v-row class="mt-10" justify="center">
                                <v-col cols="auto" class="mx-1">
                                    <v-tooltip text="Recall" location="top">
                                        <template #activator="{ props }">
                                            <v-btn @click="callQueueNo" v-bind="props" color="warning"
                                                :disabled="!queueStat?.now_serving" icon="mdi-bell-ring-outline" />
                                        </template>
                                    </v-tooltip>
                                </v-col>

                                <v-col cols="auto" class="mx-1">
                                    <v-tooltip text="Complete" location="top">
                                        <template #activator="{ props }">
                                            <v-btn @click="openDialogComplete" v-bind="props" color="success"
                                                icon="mdi-check" />
                                        </template>
                                    </v-tooltip>
                                </v-col>

                                <v-col cols="auto" class="mx-1">
                                    <v-tooltip text="No Show" location="top">
                                        <template #activator="{ props }">
                                            <v-btn v-bind="props" color="error" icon="mdi-account-off-outline" />
                                        </template>
                                    </v-tooltip>
                                </v-col>

                                <v-col cols="auto" class="mx-1">
                                    <v-tooltip text="Call Next" location="top">
                                        <template #activator="{ props }" location="top">
                                            <v-btn @click="callNext" v-bind="props" color="primary"
                                                :disabled="!filteredAppointments.length" icon="mdi-skip-next" />
                                        </template>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" md="6" lg="4" class="bg-blue-lighten-5 text-center pa-5">
                            <div class="section-header">Doctors On Duty</div>

                            <div class="d-flex align-center justify-center ga-3 mt-1">
                                <v-btn @click="updateDoctorCount(-1)" icon="mdi-minus" size="x-large" color="error"
                                    variant="tonal" />
                                <span class="now-serving-number text-primary pl-5 pr-5">
                                    {{ session?.doctors_on_duty }}
                                </span>
                                <v-btn @click="updateDoctorCount(1)" icon="mdi-plus" size="x-large" color="primary"
                                    variant="tonal" />
                            </div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="6">
                            <v-card>
                                <v-card-title class="pa-5">Waiting List</v-card-title>
                                <v-card-text>
                                    <v-data-table :headers="appointments.headers" :items="filteredAppointments"
                                        :items-per-page="-1" :group-by="[{ key: 'scheduled_at', order: 'asc' }]"
                                        hide-default-footer>
                                        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
                                            <tr class="bg-blue-lighten-5">
                                                <td :colspan="columns.length">
                                                    {{ formatDate(item.value, 'h:mmA') }}

                                                    <span style="display:none">
                                                        {{ !isGroupOpen(item) && toggleGroup(item) }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </template>

                                        <template v-slot:item.queue_no="{ item }">
                                            {{ session?.dept_code }}{{ item.queue_no }}-
                                            {{ formatDate(item.scheduled_at, 'hA').replace(/M$/, '') }}
                                        </template>

                                        <template v-slot:item.name="{ item }">
                                            {{ getFullName(item.patient) }}
                                        </template>

                                        <template v-slot:item.scheduled_at="{ item }">
                                            <span style="white-space: pre-line;">
                                                {{ item.scheduled_at ?
                                                    formatDate(item.scheduled_at, 'h:mmA') : 'N/A' }}
                                            </span>
                                        </template>

                                        <template v-slot:item.status="{ item }">
                                            <v-chip color="primary">{{ getQueueStep(item.step) }}</v-chip>
                                        </template>

                                        <template v-slot:item.options="{ item }">
                                            <v-col cols="auto">
                                                <v-tooltip location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon @click="callPriority(item)" color="red" v-bind="props"
                                                            size="x-large">mdi-priority-high</v-icon>
                                                    </template>
                                                    <span>Prioritize</span>
                                                </v-tooltip>
                                            </v-col>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-card>
                                <v-card-title class="pa-5">Walk-In List</v-card-title>
                                <v-card-text>
                                    <v-data-table :headers="walkin.headers" :items="walkin.list">
                                        <template v-slot:item.status="{ item }">
                                            <v-chip color="primary">{{ getQueueStep(item.step) }}</v-chip>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <DialogConfirm v-model="dialog.confirm.isVisible" :label="dialog.confirm.label" color="green"
            positive-text="COMPLETE" @confirm="dialog.confirm.action" />
    </div>
</template>

<script setup lang="ts">
import moment, { type Moment } from 'moment';

const { token } = useUser();

const { connectSocket, reconnectWithFreshToken } = useQueueSocket();
const { getScheduledAppointments } = useAppointment();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    role: string;
    session: QueueSession | null;
}>();

const dialog = reactive({
    confirm: {
        isVisible: false,
        label: '',
        action: () => { },
    }
})

const queueRole = computed(() => {
    return options.queueRoles.find(item => item.value === props.role);
})

const socket = ref<ReturnType<typeof connectSocket> | null>(null);

const emit = defineEmits<{
    confirm: [];
    updateDoctorCount: [doctorCount: number];
}>();

const isLoading = ref(false);

const currentCall = ref<AppointmentQueue | null>();
const callStart = ref<Moment | null>(null);

const queueStat = computed(() => props.session?.stats?.find(item => item.step === queueRole.value?.step));

const appointments = reactive({
    headers: <any[]>([
        { title: "Queue No.", align: "start", value: "queue_no", sortable: false },
        { title: "Schedule", align: " d-none", value: "scheduled_at", sortable: false },
        { title: "Name", align: "start", value: "name", sortable: false },
        { title: "Status", align: "center", value: "status", sortable: false },
        { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
    ]),
    list: <AppointmentQueue[]>[],
})

const filteredAppointments = computed(() => {
    return appointments.list.filter(item => item.step === queueRole.value?.step);
})


const nowServing = computed(() => {
    if (props.session && queueStat.value) {
        return `${props.session.dept_code}${queueStat.value?.now_serving}-${queueStat.value.served_sched}`;
    }

    return '-';
});

const snackbar = useSnackbar();

const walkin = reactive({
    headers: <any[]>([
        { title: "Queue No.", align: "start", value: "queue_no", sortable: false },
        { title: "Type", align: "center", value: "type", sortable: false },
        { title: "Status", align: "center", value: "step", sortable: false },
        { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
    ]),
    list: <AppointmentWalkin[]>[],
})

const closeDialog = () => {
    model.value = false;
};

const updateDoctorCount = (delta: number) => {
    if (!props.session) return;

    const current = props.session.doctors_on_duty ?? 0;
    const newCount = Math.max(0, current + delta); // never go below 0

    if (socket.value) {
        socket.value.emit('queue:updateDoctorCount', {
            step: queueRole.value?.step,
            deptId: props.session.dept_id,
            sessionId: props.session.id,
            doctorsOnDuty: newCount,
        });
    }
};

const getQueueItems = async () => {
    if (props.session) {
        const schedule = moment(props.session.session_date);
        const data = await getScheduledAppointments(props.session.dept_id, schedule);

        if (!data.error)
            appointments.list = data;
    }
};

const callComplete = () => {
    if (socket.value && currentCall.value) {
        socket.value.emit('queue:callComplete', {
            step: queueRole.value?.step,
            deptId: props.session?.dept_id,
            appointmentId: currentCall.value?.id,
            statId: queueStat.value?.id,
            payload: {
                duration: moment().diff(callStart.value!, 'seconds'),
            }
        }, (res: any) => {
            if (res.error) {
                console.error(res.error);
                return;
            }

            snackbar.show({
                message: 'Marked complete. You may now call the next patient.',
                title: 'Success',
                type: 'success',
            })

            currentCall.value = null;
            dialog.confirm.isVisible = false;
        })
    }
}

const callNext = () => {
    if (!filteredAppointments.value.length || !queueStat.value) return;

    const next = filteredAppointments.value[0];
    if (!next) return;

    const skipped_appointment_id = currentCall.value ? Number(currentCall.value.id) : null;

    if (socket.value) {
        socket.value.emit('queue:callSkip', {
            step: queueRole.value?.step,
            deptId: props.session?.dept_id,
            statId: queueStat.value.id,
            payload: {
                skipped_appointment_id,
                now_serving: Number(next.queue_no),
                served_sched: formatDate(next.scheduled_at, 'hA').replace(/M$/, ''),
            },
        }, (res: any) => {
            if (res.error) {
                console.error(res.error);
                return;
            }

            callStart.value = moment();
            callQueueNo();
        });
    }
};

const callPriority = (item: AppointmentQueue) => {
    if (!filteredAppointments.value.length || !queueStat.value) return;

    const next = item;
    if (!next) return;

    const skipped_appointment_id = currentCall.value ? Number(currentCall.value.id) : null;

    if (socket.value) {
        socket.value.emit('queue:callSkip', {
            step: queueRole.value?.step,
            deptId: props.session?.dept_id,
            statId: queueStat.value.id,
            payload: {
                skipped_appointment_id,
                now_serving: Number(next.queue_no),
                served_sched: formatDate(next.scheduled_at, 'hA').replace(/M$/, ''),
            },
        }, (res: any) => {
            if (res.error) {
                console.error(res.error);
                return;
            }

            callStart.value = moment();
            callQueueNo();
        });
    }
};

const callQueueNo = () => {
    if (queueStat.value?.now_serving) {
        const code = spellOutCode(`${props.session?.dept_code}${queueStat.value?.now_serving}-${queueStat.value.served_sched}`);
        const msg = new SpeechSynthesisUtterance(`Now serving, ${code}`);
        msg.lang = 'fil-PH';
        msg.rate = 0.9;
        speechSynthesis.speak(msg);
    }
}

const handleQueueUpdate = (payload: QueueUpdate) => {
    if (payload.action == 'updateDoctorCount') {
        if (props.session)
            props.session.doctors_on_duty = payload.session.doctors_on_duty;

        return;
    }

    appointments.list = payload.queue;

    if (props.session?.stats) {
        const statIndex = props.session.stats.findIndex(s => s.step === payload.stat.step);
        if (statIndex !== -1) {
            props.session.stats[statIndex] = payload.stat;
        }

        if (payload.stat.now_serving) {
            const index = appointments.list.findIndex(
                item => {
                    const schedTime = formatDate(item.scheduled_at, 'hA').replace(/M$/, '');
                    return item.queue_no === payload.stat.now_serving && schedTime === payload.stat.served_sched;
                });

            if (index !== -1) {
                currentCall.value = appointments.list.splice(index, 1)[0];
            } else {
                currentCall.value = null;
            }
        } else {
            currentCall.value = null;
        }
    }
}

const handleSocketException = async (err: any) => {
    if (err?.message === 'TokenExpired') {
        const newToken = await refreshAccessToken();
        if (newToken) {
            reconnectWithFreshToken(newToken);
        } else {
            snackbar.show({
                message: 'Session expired. Please login again.',
                type: 'error',
                title: 'Error',
            });
            navigateTo('/login');
        }
    } else {
        console.error('Socket exception:', err);
    }
};

const leaveQueue = () => {
    if (socket.value && props.session) {
        socket.value.emit('leaveQueue', { step: queueRole.value?.step, deptId: props.session.dept_id });
        socket.value.off('queue:update', handleQueueUpdate);
    }
}

const openDialogComplete = () => {
    dialog.confirm.label = `Are you sure you want to mark this as completed?`;
    dialog.confirm.action = callComplete;
    dialog.confirm.isVisible = true;
}

watch(model, async (isOpen) => {
    if (isOpen) {
        if (props.session) {
            await getQueueItems();
            socket.value = connectSocket();
            socket.value.emit('joinQueue', { step: queueRole.value?.step, deptId: props.session.dept_id });
            socket.value.on('queue:update', handleQueueUpdate);
            socket.value.on('exception', handleSocketException);

            if (queueStat.value?.now_serving) {
                const index = appointments.list.findIndex(item => {
                    const schedTime = formatDate(item.scheduled_at, 'hA').replace(/M$/, '');
                    return item.queue_no === queueStat.value!.now_serving && schedTime === queueStat.value!.served_sched;
                });
                if (index !== -1) {
                    currentCall.value = appointments.list.splice(index, 1)[0];
                }
            }
        }
    } else {
        leaveQueue();
    }
});

onUnmounted(() => {
    leaveQueue();
})

</script>

<style scoped>
:deep(.v-icon:hover) {
    transform: none !important;
}

.v-btn:hover {
    transform: scale(1.2);
}

.section-header {
    font-size: clamp(1rem, 3vw, 2rem);
    opacity: 0.7;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.now-serving-number {
    font-size: clamp(2.5rem, 13vw, 10rem);
    line-height: 1.5;
}
</style>