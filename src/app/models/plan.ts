export enum Plan{
    ENTREPRENEUR = 0,
    BUSINESSMAN = 1,
    PLUS_BUSINESSMAN = 2
}
export const PlanNames: { [key in Plan]: string } = {
    [Plan.ENTREPRENEUR]: 'PLAN EMPRENDEDOR',
    [Plan.BUSINESSMAN]: 'PLAN EMPRESARIO',
    [Plan.PLUS_BUSINESSMAN]: 'PLAN EMPRESARIO PLUS'
  };