<template>
    <v-dialog v-model="props.modelValue" width="500">
        <v-card>
            <v-card-text class="pb-0">
                <v-container>
                    <label class="text-h6">
                        {{ label }}
                    </label>

                    <v-form v-if="withRemarks" ref="formRemarks">
                        <v-textarea v-model="remarks" class="mt-5" label="Remarks" variant="outlined"
                            :rules="[rules.required]"></v-textarea>
                    </v-form>
                </v-container>
            </v-card-text>

            <v-card-actions class="pt-0">
                <v-container>
                    <v-row justify="end">
                        <v-col cols="auto" class="pr-0">
                            <v-btn @click="cancel" color="grey" variant="text">CANCEL</v-btn>
                        </v-col>

                        <v-col cols="auto" class="pr-0">
                            <v-btn @click="confirm" :color="color" variant="text">
                                {{ positiveText }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: Boolean,
    color: {
        type: String,
        default: "red",
    },
    label: {
        type: String,
        default: "Are you sure you want to delete this item?",
    },
    positiveText: {
        type: String,
        default: "Delete",
    },
    withRemarks: {
        type: Boolean,
        default: false,
    },
});

const formRemarks = ref();
const remarks = ref("");

const emit = defineEmits(["confirm", "update:modelValue"]);

const confirm = async () => {
    if (props.withRemarks) {
        const { valid } = await formRemarks.value?.validate();
        if (!valid) return;
    }

    emit("confirm", remarks.value);
};

const cancel = () => {
    emit("update:modelValue", false);
}

</script>
