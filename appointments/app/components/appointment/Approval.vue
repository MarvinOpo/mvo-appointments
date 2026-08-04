<template>
    <v-dialog v-model="model" max-width="600" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Appointment Approval
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formApproval">
                    <v-row>
                        <v-col cols="12">
                            <v-textarea :model-value="appointment.complaint" label="Chief Complaint" variant="outlined"
                                counter="500" rows="3" autocomplete="off" readonly />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field :model-value="appointment.department?.name ?? 'N/A'" label="Department"
                                variant="outlined" readonly />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="form.remarks" label="Remarks" variant="outlined"
                                :rules="[rules.required]" counter="500" autocomplete="off" />
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
                            <v-btn color="blue" @click="approveAppointment" :loading="isLoading"
                                variant="tonal">APPROVE</v-btn>
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
    appointment: Appointment;
}>();

const emit = defineEmits<{
    approveAppointment: [id: number];
}>();

const isLoading = ref(false);

const form = ref({
    remarks: null,
});

const formApproval = ref();

const approveAppointment = async () => {
    const { valid } = await formApproval.value.validate();
    if (!valid) return;

    if (props.appointment.id) {
        isLoading.value = true;

        const data = await updateJsonData(`/appointments/${props.appointment.id}/approve`, form.value, token.value);
        if (data.error) return;

        isLoading.value = false;
        emit('approveAppointment', props.appointment.id);
        closeDialog();
    }
};

const closeDialog = () => {
    model.value = false;
    form.value.remarks = null;
};

</script>