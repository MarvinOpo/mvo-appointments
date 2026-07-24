<template>
    <v-card flat>
        <v-card-text>
            <v-container>
                <v-row justify="center">
                    <v-col cols="auto">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-col>
                    <v-col cols="auto">
                        <label class="text-h5">{{ label }}</label>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: 'Fetching data. Please wait.'
    },
})
</script>