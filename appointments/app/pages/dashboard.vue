<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                Dashboard
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
                            <v-card-title>AI-Assisted SOAP</v-card-title>
                            <v-card-text class="d-flex align-center justify-center" style="height: 300px;">
                                <apexchart type="radialBar" height="280" :options="aiConsultChart.options"
                                    :series="aiConsultChart.series" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card flat>
                            <v-card-title>AI Department Matching</v-card-title>
                            <v-card-text>
                                <apexchart type="bar" height="300" :options="aiDeptChart.options"
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
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';

const aiDeptSelection = [
    { department: 'IM', ai_matched: 22, redirected: 4 },
    { department: 'Pediatrics', ai_matched: 15, redirected: 2 },
    { department: 'OB-GYNE', ai_matched: 12, redirected: 3 },
    { department: 'Orthopedics', ai_matched: 9, redirected: 5 },
    { department: 'ENT', ai_matched: 8, redirected: 6 },
    { department: 'Dermatology', ai_matched: 6, redirected: 1 },
    { department: 'Cardiology', ai_matched: 5, redirected: 2 },
    { department: 'Dental', ai_matched: 4, redirected: 1 },
];

const aiDeptChart = computed(() => ({
    series: [
        { name: 'AI-Matched', data: aiDeptSelection.map(d => d.ai_matched) },
        { name: 'Redirected', data: aiDeptSelection.map(d => d.redirected) },
    ],
    options: {
        chart: { toolbar: { show: false }, stacked: true },
        xaxis: { categories: aiDeptSelection.map(d => d.department) },
        colors: ['#66BB6A', '#EF5350'],
        plotOptions: { bar: { borderRadius: 4, horizontal: false } },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
    },
}));

const aiConsultChart = computed(() => {
    const percentage = totalAppointments ? Math.round((aiAssistedCount / totalAppointments) * 100) : 0;

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
                            formatter: () => `${aiAssistedCount}/${totalAppointments}`,
                        },
                    },
                },
            },
            labels: ['AI-Assisted'],
        },
    };
});

const filter = reactive({
    from: moment().startOf('month').format('YYYY-MM-DD'),
    to: moment().endOf('month').format('YYYY-MM-DD'),
    pie: 0,
});

const summary = reactive({
    pending: 42,
    ongoing: 38,
    completed: 187,
    cancelled: 19,
    total: 248,
});

const statusBreakdown = [
    { status: 'pending', count: 42 },
    { status: 'completed', count: 187 },
    { status: 'X', count: 19 },
];

const departmentBreakdown = [
    { department: 'IM', count: 68 },
    { department: 'Pediatrics', count: 45 },
    { department: 'OB-GYNE', count: 37 },
    { department: 'Orthopedics', count: 29 },
    { department: 'ENT', count: 24 },
    { department: 'Dermatology', count: 18 },
    { department: 'Cardiology', count: 15 },
    { department: 'Dental', count: 12 },
];

const typeBreakdown = [
    { type: 'F', count: 165 },
    { type: 'T', count: 83 },
    { type: 'W', count: 10 },
];

const trend = [
    { date: '2026-08-04', count: 12 },
    { date: '2026-08-05', count: 18 },
    { date: '2026-08-06', count: 15 },
    { date: '2026-08-07', count: 21 },
    { date: '2026-08-08', count: 9 },
    { date: '2026-08-09', count: 6 },
    { date: '2026-08-10', count: 14 },
    { date: '2026-08-11', count: 19 },
    { date: '2026-08-12', count: 23 },
    { date: '2026-08-13', count: 17 },
    { date: '2026-08-14', count: 20 },
    { date: '2026-08-15', count: 11 },
    { date: '2026-08-16', count: 8 },
    { date: '2026-08-17', count: 16 },
];

const aiAssistedCount = 83;
const totalAppointments = 248;

const summaryStats = computed(() => [
    { label: 'Pending', value: summary.pending, color: 'orange' },
    { label: 'Ongoing', value: summary.ongoing, color: 'blue' },
    { label: 'Completed', value: summary.completed, color: 'green' },
    { label: 'Cancelled', value: summary.cancelled, color: 'red' },
    { label: 'Total Appointments', value: summary.total, color: 'black' },
]);

const departmentChart = computed(() => ({
    series: [{ name: 'Appointments', data: departmentBreakdown.map(d => d.count) }],
    options: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: departmentBreakdown.map(d => d.department) },
        colors: ['#42A5F5'],
        plotOptions: { bar: { borderRadius: 4, horizontal: false } },
        dataLabels: { enabled: false },
    },
}));

const typeChart = computed(() => ({
    series: typeBreakdown.map(t => t.count),
    options: {
        labels: ['Face to Face', 'Teleconsult', 'Walk-in'],
        colors: ['#AB47BC', '#26A69A', '#EF5350'],
        legend: { position: 'bottom' },
    },
}));

const trendChart = computed(() => ({
    series: [{ name: 'Appointments', data: trend.map(t => t.count) }],
    options: {
        chart: { toolbar: { show: false }, zoom: { enabled: false } },
        xaxis: { categories: trend.map(t => formatDate(t.date, 'MMM DD')) },
        colors: ['#42A5F5'],
        stroke: { curve: 'smooth', width: 3 },
        dataLabels: { enabled: false },
    },
}));
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