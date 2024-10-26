import { State } from "./state";

export interface Incident {
  title: string | null;
  description: string | null;
  clientid: string | null;
  state: State | null;
  agentid: string | null;
  serviceid: string | null;
  userid: number | null;
  type: number | null;
  username?: string | null;
}
