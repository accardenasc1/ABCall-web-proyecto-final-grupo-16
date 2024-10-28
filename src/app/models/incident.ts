import { State } from "./state";
import { Type } from "./type";

export interface Incident {
  title: string | null;
  description: string | null;
  clientid: string | null;
  state: State | null;
  agentid: string | null;
  serviceid: string | null;
  userid: number | null;
  type: Type | null;
  username?: string | null;
  id_number?: number | null;
}
