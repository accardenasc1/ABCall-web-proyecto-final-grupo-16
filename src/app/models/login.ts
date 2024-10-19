import { User } from "../models/user";

export interface Login {
    user: User;
    access_token: string | null;
  }
