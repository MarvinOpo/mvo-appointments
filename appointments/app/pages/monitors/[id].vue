<template>
    <div class="monitor-page">
        <div class="monitor-header">
            <span class="monitor-title">{{ monitor?.name }}</span>
        </div>

        <div v-if="isLoading" class="loading-state">Loading...</div>

        <div v-else class="monitor-grid" :style="{ gridTemplateColumns: gridColumns }">
            <div v-for="dept in deptCards" :key="dept.id" class="dept-card">
                <div class="dept-name">{{ dept.name }}</div>

                <div v-for="role in queueRoles" :key="role.value" class="step-row">
                    <div class="step-label">{{ role.label }}</div>
                    <div class="step-number">
                        {{ dept.steps[role.value]?.now_serving
                            ? `${dept.code}${dept.steps[role.value]!.now_serving}-${dept.steps[role.value]!.served_sched}`
                            : '—' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { connectSocket } = useQueueSocket();

const monitorId = route.params.id as string;

const isLoading = ref(true);
const monitor = ref<{ id: number; name: string } | null>(null);

// TODO: confirm shape matches your existing options.queueRoles
// e.g. [{ value: 'registration', label: 'Registration', step: 1 }, { value: 'vitals', label: 'Vital Signs', step: 2 }, { value: 'consultation', label: 'Consultation', step: 3 }]
const queueRoles = options.queueRoles;

interface DeptCard {
    id: number;
    name: string;
    code: string;
    steps: Record<string, { now_serving?: number | string; served_sched?: string }>;
}

const deptCards = reactive<DeptCard[]>([]);

let socket: ReturnType<typeof connectSocket> | null = null;

const getMonitorConfig = async () => {
    // Public, unauthenticated call — no token
    const data = await fetchJsonData(`/monitors/${monitorId}/public`);

    if (data.error) {
        isLoading.value = false;
        return;
    }

    monitor.value = { id: data.id, name: data.name };

    // TODO: this assumes your public endpoint returns joined dept name/code —
    // i.e. data.departments = [{ id, name, code }], not just raw dept_ids
    deptCards.splice(0, deptCards.length, ...data.departments.map((d: any) => ({
        id: d.id,
        name: d.name,
        code: d.code ?? '',
        steps: {},
    })));

    isLoading.value = false;
}

const joinAllQueues = () => {
    if (!socket) return;

    for (const dept of deptCards) {
        for (const role of queueRoles) {
            socket.emit('joinQueue', { step: role.step, deptId: dept.id });
        }
    }
}

const handleQueueUpdate = (payload: any) => {
    if (payload.action === 'updateDoctorCount') return;

    const stat = payload.stat;
    if (!stat?.dept_id) return; // TODO: backend must include dept_id on the emitted stat

    const dept = deptCards.find(d => d.id === stat.dept_id);
    if (!dept) return;

    const role = queueRoles.find(r => r.step === stat.step);
    if (!role) return;

    dept.steps[role.value] = {
        now_serving: stat.now_serving,
        served_sched: stat.served_sched,
    };
}

const gridColumns = computed(() => {
    const cols = Math.min(deptCards.length, 5) || 1;
    return `repeat(${cols}, 1fr)`;
})

onMounted(async () => {
    await getMonitorConfig();

    // TODO: confirm connectSocket() works without a JWT/token for a listen-only connection
    socket = connectSocket();
    socket.on('queue:update', handleQueueUpdate);
    socket.on('connect', joinAllQueues);

    joinAllQueues();
})

onUnmounted(() => {
    if (socket) {
        for (const dept of deptCards) {
            for (const role of queueRoles) {
                socket.emit('leaveQueue', { step: role.step, deptId: dept.id });
            }
        }
        socket.off('queue:update', handleQueueUpdate);
        socket.disconnect();
    }
})

definePageMeta({
    layout: false, // kiosk mode — no nav/header chrome
    middleware: 'require-access',
    requiredAccess: ['can_manage_queue'],
});
</script>

<style scoped>
.monitor-page {
    min-height: 100vh;
    background: #0d1b2a;
    color: white;
    padding: 2rem;
}

.monitor-header {
    text-align: center;
    margin-bottom: 2rem;
}

.monitor-title {
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.monitor-grid {
    display: grid;
    gap: 1.5rem;
}

.dept-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
}

.dept-name {
    font-size: clamp(1rem, 2vw, 1.5rem);
    font-weight: bold;
    opacity: 0.8;
    text-transform: uppercase;
    margin-bottom: 1rem;
}

.step-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.step-label {
    font-size: clamp(0.8rem, 1.2vw, 1rem);
    opacity: 0.6;
    text-transform: uppercase;
}

.step-number {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: bold;
    color: #4fc3f7;
}

.loading-state {
    text-align: center;
    font-size: 1.5rem;
    padding: 4rem;
}
</style>