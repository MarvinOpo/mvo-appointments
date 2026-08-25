export interface Appointment {
    id?: number;
    user_id: number | null;
    patient_id: number | null;
    department_id: number | null;
    step: number;
    scheduled_at: string | null;
    complaint: string | null;
    type: AppointmentType | null;
    subjective: string | null;
    objective: string | null;
    assessment: string | null;
    plan: string | null;
    assessed_by: number | null;
    status: string | null;
    ai_dept_matched: boolean;
    ai_soap_assisted: boolean;
    queue_no?: number | null;
    created_at: string | null;

    department?: Department | null;
    patient?: AppointmentPatient | null;
}

export interface AppointmentPatient {
    fname: string;
    mname: string | null;
    lname: string;
    ext_name: string | null;
    birth_date?: string | null;
    email?: string | null;
    mobile_no?: string | null;
}

export interface AppointmentLog {
    id: number;
    appointment_id: number;
    action: string;
    remarks: string | null;
    created_at: string;
}

export interface AppointmentReschedForm {
    id: number;
    department_id: number | null;
    type: AppointmentType;
    complaint: string;
    scheduled_at: string;
}

export type AppointmentType = "T" | "F";

export type AppointmentFormData = Omit<
    Appointment,
    "created_at" | "updated_at" | "status" | "ai_soap_assisted"
>;

export interface ConsultationData {
    chief_complaint: string;
    history_of_present_illness: string;
    symptoms_reported: string;
    visual_audio_observations: string;
    relevant_history: string;
    self_reported_vitals: string;
    additional_notes: string;
}

export interface GeneratedSoap {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}
