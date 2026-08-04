export interface DeptSchedule {
    id?: number;
    dept_id: number | null;
    days: string[] | null;
    start: string | null;
    end: string | null;
    type: string | null;
    pax: number | null;
}
