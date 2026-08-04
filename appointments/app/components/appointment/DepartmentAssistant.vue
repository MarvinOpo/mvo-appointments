<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Department Assistant
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <!-- FORM VIEW -->
                <v-form v-if="view === 'form'" ref="formComplaintDetails">
                    <v-textarea :model-value="complaint" label="Chief Complaint" variant="outlined"
                        :rules="[rules.required]" autocomplete="off" readonly />

                    <v-text-field v-model="details.location"
                        label="Where is it located? (e.g. jaw, lower back, left knee)" variant="outlined"
                        autocomplete="off" />

                    <v-row>
                        <v-col cols="6">
                            <v-select v-model="details.duration" :items="options.symptomDuration"
                                label="How long has this been going on?" variant="outlined" :rules="[rules.required]"
                                autocomplete="off" />
                        </v-col>
                        <v-col cols="6">
                            <v-select v-model="details.severity" :items="options.severity" label="Severity"
                                variant="outlined" :rules="[rules.required]" autocomplete="off" />
                        </v-col>
                    </v-row>
                </v-form>

                <!-- RESULT VIEW -->
                <div v-else>
                    <div class="d-flex align-center mb-1">
                        <v-icon icon="mdi-robot-outline" color="primary" class="mr-2" />
                        <span class="text-subtitle-1 font-weight-medium">Suggested departments</span>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-5">
                        Based on what you described, here's what we think fits best. Tap a card to select it, or
                        choose manually if none of these match.
                    </p>

                    <v-card v-for="(rec, i) in recommendations" :key="rec.department_id" class="mb-3 rec-card"
                        :class="{ 'rec-card--selected': selectedDeptId === rec.department_id }" variant="outlined"
                        rounded="lg" @click="selectedDeptId = rec.department_id">
                        <div class="d-flex pa-4">
                            <v-avatar :color="confidenceColor(rec.confidence)" variant="tonal" size="44"
                                class="mr-4 flex-shrink-0">
                                <v-icon :icon="confidenceIcon(rec.confidence)" />
                            </v-avatar>

                            <div class="flex-grow-1">
                                <div class="d-flex align-center flex-wrap ga-2 mb-1">
                                    <span class="text-subtitle-1 font-weight-bold">{{ getDeptName(rec.department_id)
                                        }}</span>
                                    <v-chip v-if="i === 0" size="x-small" color="primary" variant="flat">Top
                                        match</v-chip>
                                    <v-chip size="x-small" :color="confidenceColor(rec.confidence)" variant="tonal">
                                        {{ rec.confidence.toUpperCase() }} CONFIDENCE
                                    </v-chip>
                                </div>
                                <p class="text-body-2 text-medium-emphasis mb-0">{{ rec.reason }}</p>
                            </div>

                            <v-icon v-if="selectedDeptId === rec.department_id" icon="mdi-check-circle" color="success"
                                class="ml-2 flex-shrink-0" />
                        </div>
                    </v-card>

                    <v-btn variant="text" size="small" prepend-icon="mdi-pencil-outline" class="mt-2"
                        @click="closeDialog">
                        None of these — let me choose manually
                    </v-btn>
                </div>
            </v-card-text>

            <v-card-actions class="sticky-bottom bg-white">
                <v-container>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn v-if="view === 'form'" color="grey" @click="closeDialog"
                                variant="tonal">CANCEL</v-btn>
                            <v-btn v-else color="red" @click="view = 'form'" variant="tonal">RESET</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn v-if="view === 'form'" color="green" @click="confirm" :loading="isLoading"
                                variant="tonal">
                                CONFIRM
                            </v-btn>
                            <v-btn v-else color="green" :disabled="!selectedDeptId" @click="selectDepartment"
                                variant="tonal">
                                USE THIS
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const { token } = useUser();
const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    complaint: string | null;
    departments: Department[];
    patient: PatientOption | undefined;
    type: string | null;
}>();

const emit = defineEmits<{
    confirm: [departmentId: number];
}>();

const formComplaintDetails = ref();

const view = ref<'form' | 'result'>('form');
const recommendations = ref<{ department_id: number; confidence: string; reason: string }[]>([]);
const selectedDeptId = ref<number | null>(null);

const details = reactive({
    location: '',
    duration: null,
    severity: null,
    complaint: '',
    sex: '',
    age: 0,
    type: '',
});

const isLoading = ref(false);

const closeDialog = () => {
    model.value = false;
};

const getDeptName = (id: number) => {
    return props.departments.find((d) => d.id === id)?.name ?? 'Unknown department';
};

const confidenceColor = (confidence: string) => {
    if (confidence === 'high') return 'success';
    if (confidence === 'medium') return 'warning';
    return 'grey';
};

const confidenceIcon = (confidence: string) => {
    if (confidence === 'high') return 'mdi-check-decagram';
    if (confidence === 'medium') return 'mdi-alert-decagram';
    return 'mdi-alert-decagram-outline';
};

const confirm = async () => {
    const { valid } = await formComplaintDetails.value.validate();
    if (!valid) return;

    isLoading.value = true;

    try {
        if (props.complaint) details.complaint = props.complaint;
        if (props.type) details.type = props.type;
        if (props.patient) {
            details.sex = props.patient.sex;
            details.age = getAge(props.patient.birth_date);
        }

        const data = await postJsonData("/ai-assistant/department", details, token.value);
        if (data.error) return;

        recommendations.value = data.recommendations;
        selectedDeptId.value = null;
        view.value = 'result';
    } finally {
        isLoading.value = false;
    }
};

const selectDepartment = () => {
    if (!selectedDeptId.value) return;
    emit('confirm', selectedDeptId.value);
    model.value = false;
};
</script>

<style scoped>
.border-success {
    border-color: rgb(var(--v-theme-success)) !important;
    border-width: 2px !important;
}
</style>