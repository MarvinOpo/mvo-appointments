export interface Appointment {
    id?: number;
    user_id: number | null;
    patient_id: number | null;
    department_id: number | null;
    step: number | null;
    scheduled_at: string | null;
    complaint: string | null;
    type: string | null;
    subjective: string | null;
    objective: string | null;
    assessment: string | null;
    plan: string | null;
    assessed_by: number | null;
    created_at: string | null;
    updated_at: string | null;
}

export type AppointmentFormData = Omit<
    Appointment,
    "created_at" | "updated_at"
>;
