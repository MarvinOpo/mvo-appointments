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
    ai_assisted: boolean;
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

export interface AppointmentQueue {
    id: number;
    scheduled_at: string;
    queue_no: number;
    step: number;
}

export interface QueueSession {
    id: number;
    dept_id: number;
    session_date: string;
    doctors_on_duty: number;
    has_started: boolean;

    stats?: SessionStat[];
}

export interface QueueSessionFormData {
    dept_id: number | null;
    session_date: string | null;
    doctors_on_duty: number | null;
    has_started: boolean;
}

export interface SessionStat {
    id: number;
    session_id: number;
    step: number;
    now_serving: number;
    served_count: number;
    avg_seconds: number;
}

export type AppointmentType = "T" | "F";

export type AppointmentFormData = Omit<
    Appointment,
    "created_at" | "updated_at"
>;
