export interface Holiday {
    id: number;
    date: string;
    description: string;
    dept_ids: number[];
}

export type HolidayFormData = Omit<Holiday, "id">;
