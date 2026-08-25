<template>
    <v-dialog v-model="model" max-width="800" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                {{ getFullName(appointment?.patient) }} ({{ appointment?.patient?.mobile_no ?? 'N/A' }})
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <template v-if="!showSoapForm">
                    <v-form ref="formConsultation">
                        <v-row>
                            <v-col cols="12">
                                <v-alert type="info" variant="tonal" density="comfortable">
                                    <strong>Chief Complaint:</strong>
                                    {{ consultation.chief_complaint || 'Not specified' }}
                                </v-alert>
                            </v-col>

                            <v-col cols="12">
                                <v-textarea v-model="consultation.history_of_present_illness"
                                    label="History of Present Illness" variant="outlined" rows="3"
                                    :append-inner-icon="isListening === 'hpi' ? 'mdi-microphone' : 'mdi-microphone-outline'"
                                    @click:append-inner="toggleDictation('hpi')"
                                    :color="isListening === 'hpi' ? 'red' : undefined" />
                            </v-col>

                            <v-col cols="12">
                                <div class="text-caption mb-1">Symptoms Reported (Tap to add)</div>
                                <v-chip-group v-model="selectedSymptoms" class="mb-2" multiple column>
                                    <v-chip v-for="s in commonSymptoms" :key="s" :text="s" :value="s" filter
                                        variant="outlined" />
                                </v-chip-group>
                                <v-textarea v-model="extraSymptoms" label="Other symptoms (optional)" variant="outlined"
                                    rows="1"
                                    :append-inner-icon="isListening === 'symptoms' ? 'mdi-microphone' : 'mdi-microphone-outline'"
                                    @click:append-inner="toggleDictation('symptoms')"
                                    :color="isListening === 'symptoms' ? 'red' : undefined" />
                            </v-col>

                            <v-col cols="12">
                                <div class="text-caption mb-1">Observations (Tap to add)</div>
                                <v-chip-group v-model="selectedObservations" class="mb-2" multiple column>
                                    <v-chip v-for="o in commonObservations" :key="o" :text="o" :value="o" filter
                                        variant="outlined" />
                                </v-chip-group>
                                <v-textarea v-model="extraObservations" label="Other observations (optional)"
                                    variant="outlined" rows="1"
                                    :append-inner-icon="isListening === 'observations' ? 'mdi-microphone' : 'mdi-microphone-outline'"
                                    @click:append-inner="toggleDictation('observations')"
                                    :color="isListening === 'observations' ? 'red' : undefined" />
                            </v-col>

                            <v-col cols="12">
                                <v-textarea v-model="consultation.relevant_history"
                                    label="Relevant History (meds, allergies, past conditions)" variant="outlined"
                                    rows="2"
                                    :append-inner-icon="isListening === 'history' ? 'mdi-microphone' : 'mdi-microphone-outline'"
                                    @click:append-inner="toggleDictation('history')"
                                    :color="isListening === 'history' ? 'red' : undefined" />
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="consultation.self_reported_vitals"
                                    label="Self-Reported Vitals (optional, if patient has a home device)"
                                    variant="outlined" />
                            </v-col>
                        </v-row>
                    </v-form>
                </template>

                <template v-else>
                    <v-form ref="formSoap">
                        <v-alert v-if="!isManualMode" type="info" variant="tonal" density="compact" class="mb-7">
                            AI-generated — review and edit before confirming.
                        </v-alert>
                        <v-alert v-else type="info" variant="tonal" density="compact" class="mb-7">
                            Manual entry — fill in the SOAP note directly.
                        </v-alert>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea v-model="soap.subjective" label="Subjective" variant="outlined" rows="3"
                                    :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="soap.objective" label="Objective" variant="outlined" rows="3"
                                    :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="soap.assessment" label="Assessment" variant="outlined" rows="3"
                                    :rules="[rules.required]" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="soap.plan" label="Plan" variant="outlined" rows="3"
                                    :rules="[rules.required]" />
                            </v-col>
                        </v-row>
                    </v-form>
                </template>
            </v-card-text>

            <v-card-actions class="sticky-bottom bg-white">
                <v-container>
                    <v-row justify="center">
                        <template v-if="!showSoapForm">
                            <!-- <v-col cols="auto">
                                <v-btn color="grey" @click="closeDialog" variant="tonal">CANCEL</v-btn>
                            </v-col> -->
                            <v-col cols="auto" class="float-right">
                                <v-btn color="green" @click="manualSoap" prepend-icon="mdi-account-edit"
                                    variant="tonal">
                                    MANUAL SOAP
                                </v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="blue" @click="generateSoap" prepend-icon="mdi-robot"
                                    :loading="isGenerating" variant="tonal">
                                    GENERATE SOAP
                                </v-btn>
                            </v-col>
                        </template>
                        <template v-else>
                            <v-col cols="auto">
                                <v-btn color="orange" @click="backToConsultation" variant="tonal">BACK</v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="green" @click="confirmSoap" :loading="isSaving" variant="tonal">
                                    CONFIRM & SAVE
                                </v-btn>
                            </v-col>
                        </template>
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
    appointment: Appointment | null;
}>();

const emit = defineEmits<{
    updateAppointment: [appointment: Appointment];
}>();

const isGenerating = ref(false);
const isSaving = ref(false);
const isListening = ref<string | null>(null); // which field is currently being dictated
const isManualMode = ref(false); // true if doctor chose Manual SOAP instead of AI generation

const rules = {
    required: (v: any) => !!v || 'Required',
};

const commonSymptoms = [
    'Fever', 'Cough', 'Colds', 'Sore Throat', 'Headache', 'Body Ache',
    'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Dizziness',
    'Shortness of Breath', 'Chest Pain', 'Fatigue', 'Rash',
];

const commonObservations = [
    'Alert & Oriented', 'In Distress', 'Pale', 'Flushed', 'Audible Wheezing',
    'Labored Breathing', 'Clear Speech', 'Slurred Speech', 'Coughing on Camera',
    'Appears Well',
];

const selectedSymptoms = ref<string[]>([]);
const extraSymptoms = ref('');
const selectedObservations = ref<string[]>([]);
const extraObservations = ref('');

// const defaultConsultation = (): ConsultationData => ({
//     chief_complaint: props.appointment?.complaint ?? '',
//     history_of_present_illness: '',
//     symptoms_reported: '',
//     relevant_history: '',
//     self_reported_vitals: '',
//     additional_notes: '',
// });

const defaultConsultation = (): ConsultationData => ({
    "chief_complaint": props.appointment?.complaint ?? '',
    "history_of_present_illness": "Patient reports intermittent chest tightness starting 3 days ago, described as a pressure-like sensation in the central chest. Worse with exertion (e.g. climbing stairs, walking briskly), improves with rest. Associated with mild shortness of breath during episodes. No radiation to the arm, jaw, neck, or back. No associated nausea, sweating, or dizziness reported. No prior episodes like this before.",
    "symptoms_reported": "Chest tightness, exertional worsening, mild shortness of breath",
    "relevant_history": "No known history of hypertension, diabetes, or heart disease per patient report. No current maintenance medications. No known allergies. Non-smoker. Father had a heart attack in his 60s.",
    "visual_audio_observations": "Alert and oriented, speaking in full sentences without noticeable breathlessness on camera, no visible distress at rest, skin color normal on camera, no accessory muscle use observed",
    "self_reported_vitals": "",
    "additional_notes": "Patient advised to seek immediate in-person/ER evaluation if tightness becomes constant, severe, or radiates, or if associated with sweating, nausea, or fainting."
});

const defaultSoap = (): GeneratedSoap => ({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
});

const consultation = ref<ConsultationData>(defaultConsultation());
const soap = ref<GeneratedSoap>(defaultSoap());

// true once either AI generation or manual entry has produced a SOAP form to show/edit
const showSoapForm = computed(() => isManualMode.value || hasGenerated.value);
const hasGenerated = ref(false);

const formConsultation = ref();
const formSoap = ref();

// --- Voice dictation via Web Speech API ---
let recognition: any = null;

const toggleDictation = (field: string) => {
    if (isListening.value === field) {
        recognition?.stop();
        return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Voice dictation is not supported in this browser. Try Chrome.');
        return;
    }

    recognition?.stop();
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript + ' ';
            }
        }
        transcript = transcript.trim();
        if (!transcript) return;

        if (field === 'hpi') consultation.value.history_of_present_illness += (consultation.value.history_of_present_illness ? ' ' : '') + transcript;
        else if (field === 'symptoms') extraSymptoms.value += (extraSymptoms.value ? ' ' : '') + transcript;
        else if (field === 'observations') extraObservations.value += (extraObservations.value ? ' ' : '') + transcript;
        else if (field === 'history') consultation.value.relevant_history += (consultation.value.relevant_history ? ' ' : '') + transcript;
    };

    recognition.onend = () => {
        isListening.value = null;
    };

    recognition.start();
    isListening.value = field;
};

const closeDialog = () => {
    recognition?.stop();
    model.value = false;
};

const confirmSoap = async () => {
    const { valid } = await formSoap.value.validate();
    if (!valid) return;

    isSaving.value = true;

    const payload = {
        ...soap.value,
        ai_soap_assisted: !isManualMode.value,
    };

    const data = await updateJsonData(
        `/appointments/${props.appointment?.id}/soap`,
        payload,
        token.value,
    );

    isSaving.value = false;

    if (data.error) return;

    emit('updateAppointment', data);
    resetAndClose();
};

const generateSoap = async () => {
    consultation.value.symptoms_reported = [...selectedSymptoms.value, extraSymptoms.value].filter(Boolean).join(', ');
    consultation.value.visual_audio_observations = [...selectedObservations.value, extraObservations.value].filter(Boolean).join(', ');

    isGenerating.value = true;

    const data = await postJsonData(
        "/ai-assistant/soap",
        consultation.value,
        token.value,
    );

    isGenerating.value = false;

    if (data.error) return;

    soap.value = data;
    isManualMode.value = false;
    hasGenerated.value = true;
};

const manualSoap = () => {
    soap.value = defaultSoap();
    isManualMode.value = true;
    hasGenerated.value = false;
};

const backToConsultation = () => {
    isManualMode.value = false;
    hasGenerated.value = false;
};

const resetAndClose = () => {
    consultation.value = defaultConsultation();
    soap.value = defaultSoap();
    isManualMode.value = false;
    hasGenerated.value = false;
    selectedSymptoms.value = [];
    extraSymptoms.value = '';
    selectedObservations.value = [];
    extraObservations.value = '';
    closeDialog();
};

watch(() => props.appointment, () => {
    consultation.value = defaultConsultation();
    soap.value = defaultSoap();
    isManualMode.value = false;
    hasGenerated.value = false;
    selectedSymptoms.value = [];
    extraSymptoms.value = '';
    selectedObservations.value = [];
    extraObservations.value = '';
});
</script>