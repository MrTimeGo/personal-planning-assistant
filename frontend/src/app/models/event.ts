export interface Event{
  name: string;
  start: Date;
  end: Date;
}

export enum Period {
  Today = 'today',
  ThisWeek = 'this_week',
  NextWeek = 'next_week',
}