import {Time} from '@angular/common';

export interface RecurringEvent {
  id: string;
  title: string;
  description: string;
  color: any;
  address: {
    name: string;
    place: string;
  };
  start: Time;
  end: Time;
  skippedEvents: Array<Date>;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
}
