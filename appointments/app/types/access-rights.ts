export interface AccessRights {
    id: number;
    description: string;
    can_complete_appt: boolean;
    can_manage_appts: boolean;
    can_manage_departments: boolean;
    can_manage_access: boolean;
    can_manage_holidays: boolean;
    can_manage_queue: boolean;
    can_view_all_appts: boolean;
    dept_ids: number[];
}
