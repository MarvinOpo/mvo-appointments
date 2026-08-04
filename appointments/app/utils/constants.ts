export const VERSION = "3.0.0";

export const options = {
    appointmentTypes: [
        { title: "Teleconsult", value: "T" },
        { title: "Face to Face", value: "F" },
    ],
    civilStatus: ["Single", "Married", "Widowed", "Separated", "Divorced"],
    dayMap: {
        SUN: 0,
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
    } as Record<string, number>,
    extensionName: ["Jr.", "Sr.", "II", "III", "IV", "V"],
    queueRoles: [
        {
            value: "check_in",
            label: "Check-In",
            description: "Register and queue patients",
            icon: "mdi-clipboard-check-outline",
            color: "primary",
        },
        {
            value: "vital_signs",
            label: "Vital Signs",
            description: "Record BP, temp, weight",
            icon: "mdi-heart-pulse",
            color: "error",
        },
        {
            value: "consult",
            label: "Consult",
            description: "Doctor consultation room",
            icon: "mdi-doctor",
            color: "success",
        },
    ],
    relationships: ["Self", "Child", "Spouse", "Parent", "Sibling", "Other"],
    sex: [
        { title: "Male", value: "M" },
        { title: "Female", value: "F" },
    ],
    severity: ["Mild", "Moderate", "Severe"],
    symptomDuration: [
        "Today",
        "Few days",
        "Few weeks",
        "Few months",
        "Several months",
    ],
};

export const rules = {
    required: (v: any) =>
        (v !== undefined && v !== null && v !== "") || "This field is required",

    requiredObject: (v: any) =>
        (v !== null &&
            v !== undefined &&
            typeof v === "object" &&
            Object.keys(v).length > 0) ||
        "Please select an option",

    email: (v: string) => /.+@.+\..+/.test(v) || "Must be a valid email",

    phone: (v: string) =>
        /^(09|\+639)\d{9}$/.test(v || "") || "Must be a valid PH mobile number",

    minLength: (min: number) => (v: string) =>
        (v || "").length >= min || `Must be at least ${min} characters`,

    maxLength: (max: number) => (v: string) =>
        (v || "").length <= max || `Must be ${max} characters or fewer`,

    confirmPassword: (original: string) => (v: string) =>
        v === original || "Passwords do not match",
};
