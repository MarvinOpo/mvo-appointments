<template>
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
                            {{
                                queueStat?.now_serving ?
                                    `${session?.dept_code}-${queueStat?.now_serving}` : 'Not Started'
                            }}
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
                                        <v-btn v-bind="props" color="success" icon="mdi-check" />
                                    </template>
                                </v-tooltip>
                            </v-col>

                            <v-col cols="auto" class="mx-1">
                                <v-tooltip text="Skip / No Show" location="top">
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
                            <v-btn icon="mdi-minus" size="x-large" color="error" variant="tonal" />
                            <span class="now-serving-number text-primary pl-5 pr-5">
                                {{ session?.doctors_on_duty }}
                            </span>
                            <v-btn icon="mdi-plus" size="x-large" color="primary" variant="tonal" />
                        </div>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-card>
                            <v-card-title class="pa-5">Waiting List</v-card-title>
                            <v-card-text>
                                <v-data-table :headers="appointments.headers" :items="filteredAppointments">
                                    <template v-slot:item.queue_no="{ item }">
                                        {{ session?.dept_code }}-{{ item.queue_no }}
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
</template>

<script setup lang="ts">
import moment, { type Moment } from 'moment';

const { token } = useUser();

const { getScheduledAppointments } = useAppointment();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    role: string;
    session: QueueSession | null;
}>();

const queueRole = computed(() => {
    return options.queueRoles.find(item => item.value === props.role);
})

const emit = defineEmits<{
    confirm: [];
}>();

const isLoading = ref(false);

const currentCall = ref<AppointmentQueue | null>();
const callStart = ref<Moment | null>(null);

const queueStat = computed(() => props.session?.stats?.find(item => item.step === queueRole.value?.step));

const appointments = reactive({
    headers: <any[]>([
        { title: "Queue No.", align: "start", value: "queue_no", sortable: false },
        { title: "Schedule", align: "center", value: "scheduled_at", sortable: false },
        { title: "Status", align: "center", value: "status", sortable: false },
        { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
    ]),
    list: <AppointmentQueue[]>[],
})

const filteredAppointments = computed(() => {
    return appointments.list.filter(item => item.step === queueRole.value?.step);
})

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

const getQueueItems = async () => {
    if (props.session) {
        const schedule = moment(props.session.session_date);
        const data = await getScheduledAppointments(props.session.dept_id, schedule);

        if (!data.error)
            appointments.list = data;
    }
};

const callNext = async () => {
    if (filteredAppointments.value.length) {
        const next = filteredAppointments.value[0];

        if (next) {
            let skipped_appointment_id = null;
            const index = appointments.list.findIndex(item => item.id === next.id);
            if (index !== -1) {
                if (currentCall.value) {
                    skipped_appointment_id = Number(currentCall.value.id);
                    appointments.list.push(currentCall.value);
                }
                currentCall.value = appointments.list.splice(index, 1)[0];
                callStart.value = moment();
            }

            if (queueStat.value && currentCall.value) {

                const body = {
                    skipped_appointment_id,
                    now_serving: Number(currentCall.value.queue_no)
                };

                const data = await updateJsonData(`/queue/stat/${queueStat.value.id}/skip`, body, token.value);
                if (data.error) return;

                queueStat.value.now_serving = currentCall.value.queue_no;
                callQueueNo();
            }
        }
    }
}

const callQueueNo = () => {
    if (queueStat.value?.now_serving) {
        const code = spellOutCode(`${props.session?.dept_code}-${queueStat.value?.now_serving}`);
        const msg = new SpeechSynthesisUtterance(`Now serving, ${code}`);
        msg.lang = 'fil-PH';
        msg.rate = 0.9;
        speechSynthesis.speak(msg);
    }
}

watch(() => props.session, () => {
    if (props.session) {
        getQueueItems();
    }
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
    font-size: clamp(2.5rem, 15vw, 10rem);
    line-height: 1.5;
}
</style>