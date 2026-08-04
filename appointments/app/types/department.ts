export interface Department {
    id?: number;
    code: string;
    name: string;
    description: string;
    schedules: DeptSchedule[];
}

export type DepartmentFormData = Omit<Department, "schedules">;
