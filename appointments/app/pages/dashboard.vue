<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Dashboard ({{ appointments.from }} - {{ appointments.to }})
                <v-spacer />
                <v-row justify="end">
                    <v-col cols="auto">
                        <v-date-input v-model="filter.from" label="Date From" prepend-icon="" variant="outlined"
                            autocomplete="off" width="300" clearable />
                    </v-col>
                    <v-col cols="auto">
                        <v-date-input v-model="filter.to" label="Date To" prepend-icon="" variant="outlined"
                            autocomplete="off" width="300" clearable />
                    </v-col>
                    <v-col cols="auto">
                        <v-btn @click="getReports" color="green" prepend-icon="mdi-magnify" size="x-large">
                            Search
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="3" lg="2" v-for="stat in summaryStats" :key="stat.label">
                        <v-card :color="stat.color" variant="tonal">
                            <v-card-text>
                                <div class="stat-label">{{ stat.label }}</div>
                                <div class="stat-value">{{ stat.value }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" md="6">
                        <v-card flat>
                            <v-card-title>AI-Assisted SOAP (Teleconsult)</v-card-title>
                            <v-card-text class="d-flex align-center justify-center" style="height: 300px;">
                                <apexchart type="radialBar" height="280" :options="aiConsultChart.options"
                                    :series="aiConsultChart.series" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card flat>
                            <v-card-title>AI Department Matching</v-card-title>
                            <v-card-text class="d-flex align-center justify-center" style="height: 300px;">
                                <apexchart type="radialBar" height="280" :options="aiDeptChart.options"
                                    :series="aiDeptChart.series" />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" md="6">
                        <v-card flat>
                            <v-card-title>
                                Appointments by Type
                            </v-card-title>
                            <v-card-text>
                                <apexchart type="pie" height="300" :options="typeChart.options"
                                    :series="typeChart.series" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card flat>
                            <v-card-title>Appointments by Department</v-card-title>
                            <v-card-text>
                                <apexchart type="bar" height="300" :options="departmentChart.options"
                                    :series="departmentChart.series" />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-card flat>
                            <v-card-title>Appointments Trend</v-card-title>
                            <v-card-text>
                                <apexchart type="line" height="300" :options="trendChart.options"
                                    :series="trendChart.series" />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="isLoading" persistent width="300">
            <LayoutLoader />
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token } = useUser();

const appointments = reactive({
    from: '',
    to: '',
    list: <ReportAppointment[]>[]
})

const filter = reactive({
    from: moment().startOf('month').format('YYYY-MM-DD'),
    to: moment().endOf('month').format('YYYY-MM-DD'),
});

const isLoading = ref(true);

const summary = reactive({
    pending: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    total: 0,
});

const summaryStats = computed(() => [
    { label: 'Pending', value: summary.pending, color: 'orange' },
    { label: 'Ongoing', value: summary.ongoing, color: 'blue' },
    { label: 'Completed', value: summary.completed, color: 'green' },
    { label: 'Cancelled', value: summary.cancelled, color: 'grey-darken-1' },
    { label: 'No Show', value: summary.noShow, color: 'red' },
    { label: 'Total Appointments', value: summary.total, color: 'indigo' },
]);

const typeChart = computed(() => {
    const faceToFace = appointments.list.filter(a => a.type === 'F').length;
    const teleconsult = appointments.list.filter(a => a.type === 'T').length;

    return {
        series: [faceToFace, teleconsult],
        options: {
            labels: ['Face to Face', 'Teleconsult'],
            colors: ['#AB47BC', '#26A69A'],
            legend: { position: 'bottom' },
        },
    };
});

// AI-Assisted SOAP: real ratio from ai_soap_assisted
const aiAssistedCount = computed(() => appointments.list.filter(a => a.ai_soap_assisted).length);


const teleconsultAppointments = computed(() => appointments.list.filter(a => a.type === 'T'));
const totalTeleconsults = computed(() => teleconsultAppointments.value.length);

const aiConsultChart = computed(() => {
    const percentage = totalTeleconsults.value
        ? Math.round((aiAssistedCount.value / totalTeleconsults.value) * 100)
        : 0;

    return {
        series: [percentage],
        options: {
            chart: { toolbar: { show: false } },
            colors: ['#42A5F5'],
            plotOptions: {
                radialBar: {
                    hollow: { size: '65%' },
                    dataLabels: {
                        name: { show: true, fontSize: '14px', color: '#888', offsetY: -10 },
                        value: {
                            show: true,
                            fontSize: '28px',
                            fontWeight: 700,
                            offsetY: 5,
                            formatter: () => `${aiAssistedCount.value}/${totalTeleconsults.value}`,
                        },
                    },
                },
            },
            labels: ['AI-Assisted'],
        },
    };
});

const aiDeptMatchedCount = computed(() => appointments.list.filter(a => a.ai_dept_matched).length);
const aiDeptRedirectedCount = computed(() => appointments.list.filter(a => !a.ai_dept_matched).length);

const aiDeptChart = computed(() => {
    const total = appointments.list.length;
    const percentage = total ? Math.round((aiDeptMatchedCount.value / total) * 100) : 0;

    return {
        series: [percentage],
        options: {
            chart: { toolbar: { show: false } },
            colors: ['#66BB6A'],
            plotOptions: {
                radialBar: {
                    hollow: { size: '65%' },
                    dataLabels: {
                        name: { show: true, fontSize: '14px', color: '#888', offsetY: -10 },
                        value: {
                            show: true,
                            fontSize: '28px',
                            fontWeight: 700,
                            offsetY: 5,
                            formatter: () => `${aiDeptMatchedCount.value}/${appointments.list.length}`,
                        },
                    },
                },
            },
            labels: ['AI-Matched'],
        },
    };
});

// Appointments by Department
const departmentChart = computed(() => {
    const grouped = new Map<string, number>();
    for (const a of appointments.list) {
        const deptName = a.department?.code ?? 'Unassigned';
        grouped.set(deptName, (grouped.get(deptName) ?? 0) + 1);
    }

    return {
        series: [{ name: 'Appointments', data: [...grouped.values()] }],
        options: {
            chart: { toolbar: { show: false } },
            xaxis: { categories: [...grouped.keys()] },
            colors: ['#42A5F5'],
            plotOptions: { bar: { borderRadius: 4, horizontal: false } },
            dataLabels: { enabled: false },
        },
    };
});

// Appointments Trend by scheduled_at date
const trendChart = computed(() => {
    const grouped = new Map<string, number>();
    for (const a of appointments.list) {
        const day = moment(a.scheduled_at).format('YYYY-MM-DD');
        grouped.set(day, (grouped.get(day) ?? 0) + 1);
    }

    const sortedDates = [...grouped.keys()].sort();

    return {
        series: [{ name: 'Appointments', data: sortedDates.map(d => grouped.get(d)!) }],
        options: {
            chart: { toolbar: { show: false }, zoom: { enabled: false } },
            xaxis: { categories: sortedDates.map(d => formatDate(d, 'MMM DD')) },
            colors: ['#42A5F5'],
            stroke: { curve: 'smooth', width: 3 },
            dataLabels: { enabled: false },
        },
    };
});

const getReports = async () => {
    isLoading.value = true;

    const param = `?from=${moment(filter.from).format('YYYY-MM-DD HH:mm:ss')}&to=${moment(filter.to).format('YYYY-MM-DD HH:mm:ss')}`;
    const data = await fetchJsonData('/appointments/report' + param, token.value);
    if (data) {
        appointments.list = data;

        summary.pending = appointments.list.filter(a => a.status === 'P').length;
        summary.ongoing = appointments.list.filter(a => a.status === 'O').length;
        summary.completed = appointments.list.filter(a => a.status === 'C').length;
        summary.cancelled = appointments.list.filter(a => a.status === 'X').length;
        summary.noShow = appointments.list.filter(a => a.status === 'NS').length;
        summary.total = appointments.list.length;
    }

    appointments.from = moment(filter.from).format('MMM DD, YYYY');
    appointments.to = moment(filter.to).format('MMM DD, YYYY');

    isLoading.value = false;
}

onMounted(() => getReports());
</script>
<style scoped>
.stat-label {
    font-size: clamp(0.75rem, 1.2vw, 0.9rem);
    opacity: 0.7;
    margin-bottom: 4px;
}

.stat-value {
    font-size: clamp(1.25rem, 3vw, 2rem);
    font-weight: 700;
}
</style>