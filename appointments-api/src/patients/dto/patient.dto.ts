import { Expose, Type } from 'class-transformer';

export class PatientDto {
  @Expose()
  id: number;

  @Expose()
  user_id: number | null;

  @Expose()
  owner_user_id: number | null;

  @Expose()
  relationship: string | null;

  @Expose()
  fname: string;

  @Expose()
  mname: string | null;

  @Expose()
  lname: string;

  @Expose()
  email: string | null;

  @Expose()
  ext_name: string | null;

  @Expose()
  @Type(() => Date)
  birth_date: Date | null;

  @Expose()
  civil_status: string | null;

  @Expose()
  gender: string | null;

  @Expose()
  religion: string | null;

  @Expose()
  nationality: string | null;

  @Expose()
  occupation: string | null;

  @Expose()
  lot_no: string | null;

  @Expose()
  street: string | null;

  @Expose()
  barangay: string | null;

  @Expose()
  city: string | null;

  @Expose()
  province: string | null;

  @Expose()
  mobile_no: string | null;

  @Expose()
  spouse_name: string | null;

  @Expose()
  spouse_address: string | null;

  @Expose()
  father_name: string | null;

  @Expose()
  mother_name: string | null;

  @Expose()
  @Type(() => Date)
  created_at: Date;
}
