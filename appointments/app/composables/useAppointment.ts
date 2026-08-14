import type { Moment } from "moment";

const appointmentId = ref(0);
const appointmentStep = ref(1);
const appointmentType = ref<AppointmentType>("T");
const appointmentStatus = ref("");
const isVisible = ref(false);

export const useAppointment = () => {
    const trackAppointment = (
        id: number,
        step: number,
        type: AppointmentType,
        status: string,
    ) => {
        appointmentId.value = id;
        appointmentStep.value = step;
        appointmentType.value = type;
        appointmentStatus.value = status;

        isVisible.value = true;
    };

    const getScheduledAppointments = async (deptId: number, date: Moment) => {
        const { token } = useUser();

        const start = date.startOf("day").format("YYYY-MM-DD HH:mm:ss");
        const end = date.endOf("day").format("YYYY-MM-DD HH:mm:ss");

        const param = `?deptId=${deptId}&start=${start}&end=${end}`;

        const data = await fetchJsonData(
            `/appointments/scheduled` + param,
            token.value,
        );

        return data;
    };

    return reactive({
        isVisible,
        appointmentId,
        appointmentStep,
        appointmentType,
        appointmentStatus,
        trackAppointment,
        getScheduledAppointments,
    });
};
