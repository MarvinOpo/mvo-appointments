export interface Department {
    id?: number;
    code: string;
    name: string;
    description: string;
    min_age?: number;
    max_age?: number;
    allowed_gender?: string;
    schedules: DeptSchedule[];
}

export type DepartmentFormData = Omit<Department, "schedules">;
