<template>
    <v-dialog v-model="model" fullscreen persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                Queue Station ({{ getQueueRole(props.role) }})
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
            </v-card-title>

            <v-card-text>
                <v-row>
                    
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    role: string;
    session: QueueSession | null;
}>();

const emit = defineEmits<{
    confirm: [];
}>();

const isLoading = ref(false);

const closeDialog = () => {
    model.value = false;
};

const confirm = () => {
    emit('confirm');
};
</script>