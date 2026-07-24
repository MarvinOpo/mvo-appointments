export interface AccessRight {
  id: number;
  description: string;
  can_view_appointments: boolean;
  can_complete_appointment: boolean;
  can_forward_appointment: boolean;
  can_manage_department: boolean;
  can_manage_access: boolean;
  can_manage_holidays: boolean;
}
