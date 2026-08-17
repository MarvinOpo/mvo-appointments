import moment from "moment";

export const formatAvgTime = (seconds?: number | null) => {
    if (!seconds) return "-";

    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")} mins`;
};

export const formatDate = (date: string, format: string) =>
    moment(date).format(format);

export const formatUTCDate = (date: string, format: string) =>
    moment.utc(date).format(format);

export const getAge = (birthDate: string | Date) =>
    moment().diff(birthDate, "years");

export const getApptStatus = (
    step: number,
    status: string | null,
    type: string | null,
) => {
    switch (status) {
        case "X":
            return {
                label: "Cancelled",
                color: "red",
            };
        case "NS":
            return {
                label: "No Show",
                color: "red",
            };
    }

    switch (step) {
        case 1:
            return {
                label: "For Confirmation",
                color: "grey",
            };
        case 2:
            return {
                label: type === "T" ? "For Teleconsult" : "For Check In",
                color: "blue",
            };
        case 3:
            return {
                label: type === "T" ? "Completed" : "For Vital Signs",
                color: type === "T" ? "green" : "blue",
            };
        case 4:
            return {
                label: "For Consultation",
                color: "blue",
            };
        case 5:
            return {
                label: "Completed",
                color: "green",
            };
    }
};

export const getApptType = (type: string | null) =>
    type === "T" ? "Teleconsult" : "Face to Face";

export const getFullName = (user: any) => {
    return [
        user.fname,
        user.mname ? `${user.mname[0]}.` : "",
        user.lname,
        user.ext_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();
};

export const getQueueRole = (role: string) => {
    return options.queueRoles.find((r) => r.value === role)?.label;
};

export const getQueueStep = (step: number) => {
    switch (step) {
        case 1:
            return "FOR CONFIRMATION";
        case 2:
            return "FOR CHECK IN";
        case 3:
            return "FOR VITAL SIGNS";
        case 4:
            return "FOR CONSULTATION";
        case 5:
            return "COMPLETED";
    }
};

export const spellOutCode = (code: string) => {
    return code
        .split("")
        .map((c) => (c === "-" ? "dash" : c))
        .join(" ");
};
