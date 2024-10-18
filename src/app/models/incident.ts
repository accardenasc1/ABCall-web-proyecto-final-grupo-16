
export interface Incident {
    title: string;
    id: number;
    type: string;
    description?: string;
    state: string;
    clientid?: number;
    agentid?: number;
    serviceid?: number;
    userid : number;
  }
  