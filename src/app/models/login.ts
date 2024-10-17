import { User } from "../models/user";

export interface Login {
    usuario: User| null;
    access_token: string | null;    
  }