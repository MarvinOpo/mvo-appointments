<template>
    <div class="monitor-page">
        <div class="monitor-header">
            <span class="monitor-title">{{ monitor?.name }}</span>
        </div>

        <div v-if="isLoading" class="loading-state">Loading...</div>

        <div v-else class="monitor-grid" :style="gridStyle">
            <div v-for="dept in deptCards" :key="dept.id" class="dept-card" :style="cardStyle">
                <div class="dept-name">{{ dept.name }}</div>

                <div class="dept-steps">
                    <div v-for="role in queueRoles" :key="role.value" class="step-row">
                        <div class="step-label">{{ role.label }}</div>
                        <div class="step-number" :class="{ 'flash': isFlashing(dept.id, role.value) }">
                            {{ dept.steps[role.value]?.now_serving
                                ?
                                `${dept.code}${dept.steps[role.value]!.now_serving}-${dept.steps[role.value]!.served_sched}`
                                : '—' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

const { token } = useUser();

const route = useRoute();
const { connectSocket } = useQueueSocket();

const flashingCells = reactive(new Set<string>());
const flashTimers = new Map<string, ReturnType<typeof setTimeout>>();

const flashKey = (deptId: number, roleValue: string) => `${deptId}:${roleValue}`;

const GAP_REM = 1.5;

const gridCols = computed(() => {
    const count = deptCards.length || 1;
    return Math.min(Math.ceil(Math.sqrt(count)), 5);
})

const gridRows = computed(() => {
    const count = deptCards.length || 1;
    return Math.ceil(count / gridCols.value);
})

const gridStyle = computed<CSSProperties>(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: `${GAP_REM}rem`,
}))

const cardStyle = computed<CSSProperties>(() => {
    const cols = gridCols.value;
    const rows = gridRows.value;

    return {
        flex: `0 0 calc((100% - ${(cols - 1) * GAP_REM}rem) / ${cols})`,
        height: `calc((100% - ${(rows - 1) * GAP_REM}rem) / ${rows})`,
    };
})

const isFlashing = (deptId: number, roleValue: string) => flashingCells.has(flashKey(deptId, roleValue));

const isLoading = ref(true);

const monitorId = route.params.id as string;
const monitor = ref<{ id: number; name: string } | null>(null);

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
    const data = await fetchJsonData(`/monitors/${monitorId}`, token.value);

    if (data.error) {
        isLoading.value = false;
        return;
    }

    monitor.value = { id: data.id, name: data.name };

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

const handleQueueUpdate = async (payload: any) => {
    if (payload.action === 'updateDoctorCount') return;

    const stat = payload.stat;

    if (!payload.dept_id) return;
    const dept = deptCards.find(d => d.id === payload.dept_id);
    if (!dept) return;

    const role = queueRoles.find(r => r.step === stat.step);
    if (!role) return;

    dept.steps[role.value] = {
        now_serving: stat.now_serving,
        served_sched: stat.served_sched,
    };

    await triggerFlash(dept.id, role.value);
}

const triggerFlash = async (deptId: number, roleValue: string) => {
    const key = flashKey(deptId, roleValue);

    const existingTimer = flashTimers.get(key);
    if (existingTimer) clearTimeout(existingTimer);

    if (flashingCells.has(key)) {
        flashingCells.delete(key);
        await nextTick();
        
        const el = document.querySelector(`[data-flash-key="${key}"]`);
        if (el) void (el as HTMLElement).offsetWidth;
    }

    flashingCells.add(key);

    const timer = setTimeout(() => {
        flashingCells.delete(key);
        flashTimers.delete(key);
    }, 5000);

    flashTimers.set(key, timer);
}


onMounted(async () => {
    await getMonitorConfig();

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

    flashTimers.clear();
})

definePageMeta({
    layout: false,
    middleware: 'require-access',
    requiredAccess: ['can_manage_queue'],
});
</script>

<style scoped>
.monitor-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #0d1b2a;
    color: white;
    padding: 2rem;
    box-sizing: border-box;
    overflow: hidden;
}

.monitor-header {
    text-align: center;
    margin-bottom: 1.5rem;
    flex-shrink: 0;
}

.monitor-title {
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.monitor-grid {
    flex: 1;
    min-height: 0;
}

.dept-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 0;
}

.dept-name {
    font-size: clamp(1rem, 2vw, 1.5rem);
    font-weight: bold;
    opacity: 0.8;
    text-transform: uppercase;
    margin-bottom: 1rem;
    flex-shrink: 0;
}

.dept-steps {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
}

.loading-state {
    text-align: center;
    font-size: 1.5rem;
    padding: 4rem;
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

.step-number.flash {
    animation: blink-red 0.5s step-start 10;
    /* 0.5s * 10 = 5s */
}

@keyframes blink-red {

    0%,
    100% {
        color: #4fc3f7;
    }

    50% {
        color: #ff1744;
    }
}
</style>