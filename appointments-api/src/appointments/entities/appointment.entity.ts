export class Appointment {
  id: number;
  user_id: number;
  patient_id: number;
  department_id: number;
  step: number;
  scheduled_at: Date;
  complaint: string;
  type: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  assessed_by: number | null;
  ai_assisted: boolean;
  status: string;
  queue_no: number | null;
  created_at: Date;
}
