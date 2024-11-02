import { Role } from "./role";

export interface User {
  id?: number | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  id_number?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  phone?: string | null;
  department?: string | null;
  city?: string | null;
  address?: string | null;
  birthday?: string | null;
  dataCheck?: boolean | null;
  type?: Role | null;
  client_id?: string | null;
}
