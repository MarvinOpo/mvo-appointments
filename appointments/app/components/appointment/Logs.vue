<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Appointment Logs
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <AppointmentStepper :step="step" :type="type" :status="status" />

                <LayoutLoader v-if="isLoading" :loading="isLoading" />

                <v-timeline v-else dot-color="primary" side="end" size="x-small">
                    <v-timeline-item v-for="log in logs" :key="log.id" small>
                        <v-row>
                            <v-col cols="auto">
                                <strong>
                                    {{ formatDate(log.created_at, "MMM. DD, YYYY") }}
                                </strong>
                            </v-col>
                            <v-col cols="auto" class="flex-grow-1">
                                <strong class="text-green">{{ log.action }}</strong>
                                <div class="text-caption">
                                    {{ log.remarks }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                </v-timeline>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const { token } = useUser();
const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    appointmentId: number | null;
    step: number;
    status: string;
    type: 'T' | 'F';
}>();

const emit = defineEmits<{
    confirm: [];
}>();

const isLoading = ref(false);

const logs = ref<AppointmentLog[]>([]);

const closeDialog = () => {
    model.value = false;
};

const getLogs = async () => {
    isLoading.value = true;

    const data = await fetchJsonData(`/appointments/${props.appointmentId}/logs`, token.value);
    if (data.error) return;

    logs.value = data;

    isLoading.value = false;
};

watch(() => props.appointmentId, () => {
    if (props.appointmentId) getLogs();
}, { immediate: true });

</script>