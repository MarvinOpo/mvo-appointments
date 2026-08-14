<template>
    <div>
        <v-dialog v-model="model" max-width="1000" persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    {{ isEdit ? 'Edit Patient' : 'Add Patient' }} ({{ type.toUpperCase() }})
                    <v-spacer />
                    <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
                </v-card-title>

                <v-card-text>
                    <v-form ref="formPatient">
                        <fieldset class="pa-5">
                            <legend class="text-primary pl-2 pr-2">Personal Information</legend>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.fname" label="First Name" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.mname" label="Middle Name" variant="outlined"
                                        density="compact" />
                                </v-col>
                                <v-col cols="12" md="5">
                                    <v-text-field v-model="form.lname" label="Last Name" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-select v-model="form.ext_name" label="Extension Name"
                                        :items="options.extensionName" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select v-model="form.relationship" label="Relationship"
                                        :items="options.relationships" :rules="[rules.required]" variant="outlined"
                                        density="compact" :readonly="selfRegister" />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-date-input v-model="form.birth_date" label="Date of Birth" prepend-icon=""
                                        prepend-inner-icon="mdi-calendar" :rules="[rules.required]" variant="outlined"
                                        density="compact" autocomplete="off" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select v-model="form.sex" label="Sex" :items="options.sex"
                                        :rules="[rules.required]" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-select v-model="form.civil_status" label="Civil Status"
                                        :items="options.civilStatus" :rules="[rules.required]" variant="outlined"
                                        density="compact" />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="form.religion" label="Religion" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="form.nationality" label="Nationality"
                                        :rules="[rules.required]" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="form.occupation" label="Occupation" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.mobile_no" label="Mobile Number"
                                        :rules="[rules.required, rules.phone]" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.email" label="Email" type="email" variant="outlined"
                                        density="compact" />
                                </v-col>
                            </v-row>
                        </fieldset>

                        <!-- <v-row class="mt-5">
                        <v-col cols="12" md="6">
                            
                        </v-col>

                        <v-col cols="12" md="6" class="h-100">

                        </v-col>
                    </v-row> -->

                        <fieldset class="pa-5 mt-5">
                            <legend class="text-primary pl-2 pr-2">Address</legend>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.lot_no" label="Lot/House No." :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.street" label="Street" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="form.barangay" label="Barangay" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="form.city" label="City" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="form.province" label="Province" :rules="[rules.required]"
                                        variant="outlined" density="compact" />
                                </v-col>
                            </v-row>
                        </fieldset>

                        <fieldset class="pa-5 mt-5">
                            <legend class="text-primary pl-2 pr-2">Family Information</legend>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.father_name" label="Father's Name"
                                        :rules="[rules.required]" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.mother_name" label="Mother's Name"
                                        :rules="[rules.required]" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.spouse_name" label="Spouse's Name"
                                        :rules="[rules.required]" variant="outlined" density="compact" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.spouse_address" label="Spouse's Address"
                                        :rules="[rules.required]" variant="outlined" density="compact" />
                                </v-col>
                            </v-row>
                        </fieldset>
                    </v-form>
                </v-card-text>

                <v-card-actions class="sticky-bottom bg-white">
                    <v-container>
                        <v-row justify="center">
                            <v-col cols="auto">
                                <v-btn color="grey" @click="closeDialog" variant="tonal">CANCEL</v-btn>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="accent" @click="savePatient" :loading="isLoading" variant="tonal">
                                    SAVE
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <DialogConfirm v-model="dialog.confirm.isVisible" :label="dialog.confirm.label" color="red"
            positive-text="LOGOUT" @confirm="logout" />
    </div>
</template>

<script setup lang="ts">
const { token, user, logout } = useUser();

const model = defineModel<boolean>({ default: false });

const props = defineProps<{
    type: 'self' | 'dependent';
    patient?: Patient | null;
}>();

const emit = defineEmits<{
    addPatient: [patient: Patient];
    updatePatient: [patient: Patient];
}>();

const dialog = reactive({
    confirm: {
        isVisible: false,
        label: 'To use this system, you must complete your patient registration by providing the required information. Otherwise, you will be logged out. Do you wish to continue?',
    },
})

const isEdit = computed(() => !!props.patient?.id);
const isLoading = ref(false);
const formPatient = ref();
const selfRegister = ref(false);

const defaultForm = (): PatientFormData => ({
    user_id: null,
    owner_user_id: null,
    relationship: null,
    fname: '',
    mname: null,
    lname: null as any,
    email: null,
    ext_name: null,
    birth_date: null,
    civil_status: null,
    sex: null,
    religion: null,
    nationality: null,
    occupation: null,
    lot_no: null,
    street: null,
    barangay: null,
    city: null,
    province: null,
    mobile_no: null,
    spouse_name: null,
    spouse_address: null,
    father_name: null,
    mother_name: null,
});

const form = ref<PatientFormData>(defaultForm());

const closeDialog = () => {
    if (props.type == 'self' && !isEdit.value) {
        dialog.confirm.isVisible = true;
        return;
    }

    model.value = false;
};

const insertPatient = async () => {
    const data = await postJsonData("/patients", form.value, token.value);
    if (data.error) return;

    form.value.id = data.id;
    emit("addPatient", data);

    model.value = false;
}

const updatePatient = async () => {
    const data = await updateJsonData("/patients/" + props.patient?.id, form.value, token.value);
    if (data.error) return;

    emit("updatePatient", data);
    closeDialog();
}

const savePatient = async () => {
    const { valid } = await formPatient.value.validate();
    if (!valid) return;

    isLoading.value = true;

    if (user.value) {
        form.value.owner_user_id = Number(user.value.id);
        form.value.birth_date = formatDate(form.value.birth_date!, 'YYYY-MM-DD HH:mm:ss');
        if (!form.value.email) form.value.email = user.value.email;
    }

    if (!props.patient?.id) await insertPatient();
    else await updatePatient();

    isLoading.value = false;
};

watch(() => props.patient, () => {
    if (props.patient) {
        form.value = { ...props.patient };
    }
})

onMounted(() => {
    if (props.type === 'self' && !isEdit.value) {
        selfRegister.value = true;

        if (user.value) {
            form.value.owner_user_id = user.value.id;
            form.value.user_id = user.value.id;
            form.value.relationship = 'Self';
            form.value.fname = user.value.fname;
            form.value.mname = user.value.mname;
            form.value.lname = user.value.lname;
            form.value.ext_name = user.value.ext_name;
            form.value.email = user.value.email;
            form.value.birth_date = user.value.birth_date;

            if (user.value.civil_status && options.civilStatus.includes(user.value.civil_status))
                form.value.civil_status = user.value.civil_status;

            form.value.sex = user.value.gender;
            form.value.mobile_no = user.value.mobile_no;

            form.value.spouse_name = getFullName({
                fname: user.value.spouse_fname,
                mname: user.value.spouse_mname,
                lname: user.value.spouse_lname,
                ename: user.value.spouse_ename
            })

            form.value.father_name = getFullName({
                fname: user.value.father_fname,
                mname: user.value.father_mname,
                lname: user.value.father_lname,
                ename: user.value.father_ename
            })

            form.value.mother_name = getFullName({
                fname: user.value.mother_fname,
                mname: user.value.mother_mname,
                lname: user.value.mother_lname,
                ename: user.value.mother_ename
            })
        }
    }
});

</script>