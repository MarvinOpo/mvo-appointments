<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Active Queue Sessions
                <v-spacer />
                <v-btn color="accent" prepend-icon="mdi-plus" variant="flat">
                    Open Session
                </v-btn>
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
                        <v-chip color="green">Yes</v-chip>
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon color="blue" v-bind="props" size="x-large">mdi-monitor-eye</v-icon>
                                    </template>
                                    <span>Check Queue</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token } = useUser();
const snackbar = useSnackbar();

const sessions = reactive({
    headers: <any[]>[
        { title: 'Department', align: 'start', key: 'department.name', sortable: false },
        { title: 'Session Date', align: 'center', key: 'session_date', sortable: false },
        { title: 'Started?', align: 'center', key: 'has_started', sortable: false },
        { title: 'Options', align: 'center', key: 'options', sortable: false },
    ],
    list: <QueueSession[]>[],
    isLoading: true
})

const getQueueSessions = async () => {
    sessions.isLoading = true;

    const param = `?date=${moment().format('YYYY-MM-DD')}`
    const data = await fetchJsonData('/queue/sessions/active' + param, token.value);
    if (data.error) return;

    sessions.list = data;
    sessions.isLoading = false;
}

onMounted(() => {
    getQueueSessions();
})
</script>

<style scoped></style>
