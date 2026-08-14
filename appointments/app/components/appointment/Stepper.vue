<template>
    <v-stepper :model-value="step" alt-labels>
        <v-stepper-header>
            <v-stepper-item :value="1" title="For Confirmation" :color="step > 1 ? 'green' : 'blue'"
                :complete="step > 1" />
            <v-divider />

            <template v-if="type === 'T'">
                <v-stepper-item v-if="!cancelledAppt" :value="2" title="Teleconsultation"
                    :color="step > 2 ? 'green' : 'blue'" :complete="step > 2" />

                <v-stepper-item v-else :rules="[() => false]" :subtitle="cancelDetails" title="Teleconsultation"
                    :value="2"></v-stepper-item>

                <v-divider />

                <v-stepper-item :value="3" title="Completed" :color="step >= 3 ? 'green' : 'blue'"
                    :complete="step >= 3" />
            </template>
            <template v-else>
                <v-stepper-item v-if="!cancelledAppt" :value="2" title="Check In" :color="step > 2 ? 'green' : 'blue'"
                    :complete="step > 2" />

                <v-stepper-item v-else :rules="[() => false]" :subtitle="cancelDetails" title="Check In"
                    :value="2"></v-stepper-item>
                <v-divider />

                <v-stepper-item :value="3" title="Vital Signs" :color="step > 3 ? 'green' : 'blue'"
                    :complete="step > 3" />
                <v-divider />

                <v-stepper-item :value="4" title="Consultation" :color="step > 4 ? 'green' : 'blue'"
                    :complete="step > 4" />
                <v-divider />

                <v-stepper-item :value="5" title="Completed" :color="step >= 5 ? 'green' : 'blue'"
                    :complete="step >= 5" />
            </template>
        </v-stepper-header>
    </v-stepper>
</template>

<script setup lang="ts">
const props = defineProps<{
    step: number;
    type: 'T' | 'F';
    status: string;
}>();

const cancelledAppt = computed(() => ['X', 'NS'].includes(props.status));
const cancelDetails = computed(() => {
    if (props.status === 'X') return 'Cancelled';
    if (props.status === 'NS') return 'No Show';
});
</script>