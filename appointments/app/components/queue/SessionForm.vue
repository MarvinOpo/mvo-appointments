<template>
    <v-dialog v-model="model" max-width="600" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Queue Session
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formSession">
                    <v-row v-if="!session?.id">
                        <v-col cols="12">
                            <v-text-field v-model="form.doctors_on_duty" label="Doctors on Duty" type="number"
                                variant="outlined" :rules="[rules.required]" autocomplete="off" />
                        </v-col>
                    </v-row>


                    <v-row v-else>
                        <v-col cols="12">
                            <div class="text-subtitle-1 mb-4">
                                Session is active — choose your station
                            </div>
                        </v-col>

                        <v-col v-for="role in options.queueRoles" :key="role.value" cols="12" sm="4">
                            <v-card :variant="selectedRole === role.value ? 'flat' : 'outlined'"
                                :color="selectedRole === role.value ? role.color : undefined"
                                class="role-card pa-4 text-center" @click="selectedRole = role.value">
                                <v-icon :icon="role.icon" :color="selectedRole === role.value ? 'white' : role.color"
                                    size="40" class="mb-3" />
                                <div class="text-subtitle-2 font-weight-medium"
                                    :class="selectedRole === role.value ? 'text-white' : ''">
                                    {{ role.label }}
                                </div>
                                <div class="text-caption mt-1"
                                    :class="selectedRole === role.value ? 'text-white' : 'text-medium-emphasis'">
                                    {{ role.description }}
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="sticky-bottom bg-white">
                <v-container>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn color="grey" @click="closeDialog" variant="tonal">CANCEL</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn v-if="!session?.id" color="green" @click="openSession" :loading="isLoading"
                                variant="tonal">OPEN</v-btn>
                            <v-btn v-else color="green" @click="openMonitor" :loading="isLoading"
                                :disabled="!selectedRole" variant="tonal">JOIN</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import moment from 'moment';

const { token } = useUser();
const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    session: QueueSession | null;
}>();

const emit = defineEmits<{
    openSession: [session: QueueSession];
    openMonitor: [role: string];
}>();

const defaultForm = (): QueueSessionFormData => ({
    dept_id: null,
    session_date: null,
    doctors_on_duty: null,
    has_started: false
});

const form = ref<QueueSessionFormData>(defaultForm());

const formSession = ref();

const isLoading = ref(false);

const selectedRole = ref<string | null>(null);

const closeDialog = () => {
    model.value = false;
};

const openSession = async () => {
    const { valid } = await formSession.value.validate();
    if (!valid) return

    isLoading.value = true;

    form.value.doctors_on_duty = Number(form.value.doctors_on_duty);
    form.value.session_date = moment(form.value.session_date).format('YYYY-MM-DD');

    const data = await postJsonData("/queue/session", form.value, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    emit("openSession", data);
    isLoading.value = false;
};

const openMonitor = () => {
    if (selectedRole.value) {
        emit("openMonitor", selectedRole.value);
    }
}

watch(() => props.session, () => {
    if (props.session) {
        const data = props.session;
        form.value = {
            dept_id: data.dept_id,
            session_date: data.session_date,
            doctors_on_duty: data.doctors_on_duty,
            has_started: true
        };
    } else {
        form.value = defaultForm();
    }
}, { immediate: true });
</script>

<style scoped>
.v-icon:hover {
    transform: none !important;
}

.role-card {
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.role-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>