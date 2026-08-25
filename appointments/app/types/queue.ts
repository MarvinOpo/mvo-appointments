export interface AppointmentQueue {
    id: number;
    scheduled_at: string;
    queue_no: number;
    step: number;

    patient?: Patient;
}

export interface AppointmentWalkin {
    id: number;
    queue_no: number;
    type: string;
    step: number;
}

export interface QueueSession {
    id: number;
    dept_id: number;
    dept_name: string;
    dept_code: string;
    session_date: string;
    doctors_on_duty: number;
    has_started: boolean;

    stats?: SessionStat[];
}

export interface QueueSessionFormData {
    id?: number;
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
    served_sched: string;
    served_count: number;
    avg_seconds: number;
}

export interface QueueUpdate {
    action: string;
    stat: SessionStat;
    queue: AppointmentQueue[];
    session: QueueSession;
}

export interface QueueMonitor {
    id: number;
    name: string;
    dept_ids: number[];
}
