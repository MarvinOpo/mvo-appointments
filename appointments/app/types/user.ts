export interface User {
    id: number;
    fname: string;
    mname: string | null;
    lname: string;
    ext_name: string | null;
    email: string;
    birth_date: string | null;
    civil_status: string | null;
    gender: string | null;
    mobile_no: string | null;
    is_activated: boolean;

    spouse_fname: string | null;
    spouse_mname: string | null;
    spouse_lname: string | null;
    spouse_ename: string | null;

    father_fname: string | null;
    father_mname: string | null;
    father_lname: string | null;
    father_ename: string | null;

    mother_fname: string | null;
    mother_mname: string | null;
    mother_lname: string | null;
    mother_ename: string | null;
}
