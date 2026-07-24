export interface DeptSchedule {
    id: number;
    dept_id: number;
    days: JSON;
    start: string;
    end: string;
    type: string;
    pax: number;
}
