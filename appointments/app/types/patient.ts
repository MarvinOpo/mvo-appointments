// types/patient.ts
export interface Patient {
    id?: number;
    user_id: number | null;
    owner_user_id: number | null;
    relationship: string | null;
    fname: string;
    mname: string | null;
    lname: string;
    email: string | null;
    ext_name: string | null;
    birth_date: string | null;
    civil_status: string | null;
    sex: string | null;
    religion: string | null;
    nationality: string | null;
    occupation: string | null;
    lot_no: string | null;
    street: string | null;
    barangay: string | null;
    city: string | null;
    province: string | null;
    mobile_no: string | null;
    spouse_name: string | null;
    spouse_address: string | null;
    father_name: string | null;
    mother_name: string | null;
    created_at: string;
}

export interface PatientOption {
    id: number;
    name: string;
    relationship: string;
    birth_date: string;
    sex: string;
}

export interface WalkInPatient {
    name: string;
    type: string;
    queue_no: string;
}

export type PatientFormData = Omit<Patient, "created_at">;
