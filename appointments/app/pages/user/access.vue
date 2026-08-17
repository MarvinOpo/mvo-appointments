<template>
    <div>
        <v-card class="child-component" flat>
            <v-card-title class="d-flex align-center">
                User Access
                <v-spacer />
                <v-btn @click="openDialogUserAccess(null)" color="accent" prepend-icon="mdi-plus" variant="elevated">
                    Add User Access
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="userAccess.headers" :items="userAccess.list" :loading="isLoading"
                    :mobile="smAndDown">
                    <template v-slot:item.name="{ item }">
                        {{ getFullName(item) }}
                    </template>

                    <template v-slot:item.access_right="{ item }">
                        {{ getAccessRightLabel(item.access_right) }}
                    </template>

                    <template v-slot:item.departments="{ item }">
                        <v-chip v-for="label in getDeptLabels(item.dept_ids)" :key="label" size="small" class="ma-1">
                            {{ label }}
                        </v-chip>
                    </template>

                    <template v-slot:item.options="{ item }">
                        <v-row v-if="item.access_right != 1" justify="center">
                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogUserAccess(item)" color="blue" v-bind="props"
                                            size="x-large">mdi-lead-pencil</v-icon>
                                    </template>
                                    <span>Edit</span>
                                </v-tooltip>
                            </v-col>

                            <v-col cols="auto">
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-icon @click="openDialogDelete(item.id)" color="red" v-bind="props"
                                            size="x-large">mdi-delete</v-icon>
                                    </template>
                                    <span>Delete</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <UserAccessForm v-model="dialog.userAccess.isVisible" :user-access="dialog.userAccess.data"
            :access-rights="accessRights" :departments="departments" @add-user-access="handleNewUserAccess"
            @update-user-access="handleUpdateUserAccess" />

        <DialogConfirm v-model="dialog.confirm.isVisible" :label="dialog.confirm.label" color="red"
            positive-text="DELETE" @confirm="deleteUserAccess" />
    </div>
</template>

<script setup lang="ts">
const { smAndDown } = useDisplay();
const { token } = useUser();
const snackbar = useSnackbar();

const userAccess = reactive({
    headers: <any[]>[
        { title: "Name", align: "start", value: "name", sortable: false },
        { title: "Email", align: "start", value: "email", sortable: false },
        { title: "Access Right", align: "start", value: "access_right", sortable: false },
        { title: "Departments", align: "start", value: "departments", sortable: false, width: "400" },
        { title: "Options", align: "center", value: "options", sortable: false, width: "200" },
    ],
    list: <UserAccess[]>[],
});

const dialog = reactive({
    confirm: {
        id: 0,
        isVisible: false,
        label: "Are you sure you want to delete this user access?",
    },
    userAccess: {
        isVisible: false,
        data: <UserAccess | null>null,
    },
})

const isLoading = ref(true);
const accessRights = ref<AccessRights[]>([]);
const departments = ref<Department[]>([]);

const accessRightMap = computed(() => {
    const map = new Map<number, string>();
    accessRights.value.forEach(a => map.set(a.id, a.description));
    return map;
});

const departmentMap = computed(() => {
    const map = new Map<number, string>();
    departments.value.forEach(d => map.set(d.id!, d.name));
    return map;
});

const deleteUserAccess = async () => {
    isLoading.value = true;

    const data = await deleteJsonData(`/user-access/${dialog.confirm.id}`, token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    const index = userAccess.list.findIndex(u => u.id === dialog.confirm.id);
    if (index !== -1) {
        userAccess.list.splice(index, 1);

        snackbar.show({
            message: "User access successfully deleted",
            title: "Success",
            type: "success",
        })
    }

    isLoading.value = false;
}

const getAccessRightLabel = (access_right: number) => {
    return accessRightMap.value.get(access_right) ?? `#${access_right}`;
};

const getDeptLabels = (departments_: number[] | null): string[] => {
    if (!departments_ || departments_.length === 0) return ["All Departments"];
    return departments_.map(id => departmentMap.value.get(id) ?? `#${id}`);
};

const getUserAccess = async () => {
    isLoading.value = true;

    const data = await fetchJsonData("/user-access", token.value);
    if (data.error) {
        isLoading.value = false;
        return;
    }

    userAccess.list = data;

    isLoading.value = false;
};

const getAccessRights = async () => {
    const data = await fetchJsonData("/users/access-rights", token.value);
    if (!data.error) accessRights.value = data;
};

const getDepartments = async () => {
    const data = await fetchJsonData("/departments", token.value);
    if (!data.error) departments.value = data;
};

const handleNewUserAccess = (item: UserAccess) => {
    userAccess.list.push(item);
    snackbar.show({
        message: "User access successfully added",
        title: "Success",
        type: "success",
    })
};

const handleUpdateUserAccess = (item: UserAccess) => {
    const index = userAccess.list.findIndex(u => u.id === item.id);
    userAccess.list[index] = item;

    snackbar.show({
        message: "User access successfully updated",
        title: "Success",
        type: "success",
    })
};

const openDialogUserAccess = (item: UserAccess | null) => {
    dialog.userAccess.isVisible = true;
    dialog.userAccess.data = item;
};

const openDialogDelete = (id: number) => {
    dialog.confirm.isVisible = true;
    dialog.confirm.id = id;
};

onMounted(() => {
    getUserAccess();
    getAccessRights();
    getDepartments();
});
</script>

<style scoped></style>