<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Queue Sessions
                <v-spacer />
                <!-- <v-btn color="accent" prepend-icon="mdi-plus" variant="flat">
                    Open Session
                </v-btn> -->
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="sessions.headers" :items="sessions.list" :loading="sessions.isLoading">
                    <template v-slot:item.session_date="{ item }">
                        <span style="white-space: pre-line;">
                            {{
                                item.session_date ? formatDate(item.session_date, 'MMM. DD, YYYY') : 'N/A'
                            }}
                        </span>
                    </template>

                    <template v-slot:item.has_started="{ item }">
                        <v-chip :color="item.has_started ? 'green' : 'red'">
                            {{ item.has_started ? 'Yes' : 'No' }}
                        </v-chip>
                    </template>

                    <template v-slot:item.doctors_on_duty="{ item }">
                        {{ item.doctors_on_duty ?? 'N/A' }}
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip v-if="item.has_started" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogSessionForm(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-monitor-eye</v-icon>
                                    </template>
                                    <span>View Session</span>
                                </v-tooltip>

                                <v-tooltip v-else location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon color="blue" v-bind="props" size="x-large">mdi-clock-start</v-icon>
                                    </template>
                                    <span>Start Queue</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <QueueSessionForm v-model="dialog.session.isVisible" :session="dialog.session.data" @open-session="openSession"
            @open-monitor="openMonitor" />

        <QueueStation v-model="dialog.station.isVisible" :role="dialog.station.role" :session="dialog.station.data" />
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token } = useUser();
const snackbar = useSnackbar();

const dialog = reactive({
    session: {
        isVisible: false,
        data: <QueueSession | null>{},
    },
    station: {
        isVisible: false,
        data: <QueueSession | null>{},
        role: '',
    },
})

const sessions = reactive({
    headers: <any[]>[
        { title: 'Department', align: 'start', key: 'department_name', sortable: false },
        { title: 'Session Date', align: 'center', key: 'session_date', sortable: false },
        { title: 'Doctors On Duty', align: 'center', key: 'doctors_on_duty', sortable: false },
        { title: 'Started?', align: 'center', key: 'has_started', sortable: false },
        { title: 'Options', align: 'center', key: 'options', sortable: false },
    ],
    list: <QueueSession[]>[],
    isLoading: true
})

const getQueueSessions = async () => {
    sessions.isLoading = true;

    const param = `?date=${moment('2026/08/05 00:00:00').format('YYYY-MM-DD')}`
    const data = await fetchJsonData('/queue/sessions/today' + param, token.value);
    if (data.error) return;

    sessions.list = data.map((item: any) => ({
        ...item,
        has_started: item.has_started ? true : false,
        doctors_on_duty: item.doctors_on_duty ?? null
    }));
    sessions.isLoading = false;
}

const openDialogSessionForm = (item: QueueSession) => {
    dialog.session.data = item;
    dialog.session.isVisible = true;
}

const openSession = (session: QueueSession) => {
    dialog.session.data = session;
}

const openMonitor = (role: string) => {
    dialog.station.isVisible = true;
    dialog.station.role = role;
    dialog.station.data = dialog.session.data;
}

onMounted(() => {
    getQueueSessions();
})
</script>

<style scoped></style>
