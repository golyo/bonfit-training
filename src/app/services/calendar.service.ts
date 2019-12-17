import {Injectable} from '@angular/core';
import RRule from 'rrule';
import {DecimalPipe, formatNumber, Time} from '@angular/common';
import {from, Observable, of} from 'rxjs';
import {CalendarEvent} from 'calendar-utils';
import {concatMap, delay, flatMap, map, mergeMap} from 'rxjs/operators';
import moment from 'moment-timezone';

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

interface RecurringEvent {
  title: string;
  description: string;
  color: any;
  address: {
    name: string;
    place: string;
  };
  start: Time;
  end: Time;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
}

const RECURRING_EVENTS: RecurringEvent[] = [
  {
    title: 'BonfitTraining 60\'',
    description: 'Az edzések többnyire saját testsúlyos gyakorlatokra épülnek változatoseszközhasználattal kombinálva. ' +
      'Ezek a TRX, Bosu, Fitt ball, Kettlebell,súlyzók, Gumikötelek, szalagok, Rope kötél, Plyobox, stb. ' +
      'Nincsen két egyformaedzés. Nagy hangsúlyt fektetek a prevencióra, ezen belül az ízületek és agerinc védelmére. ' +
      'Így minden edzésen találkozhatsz a mobilizációval és a core-stabilizációval,illetve az erősítő blokk mellett ' +
      'a sztrecsing is minden edzés végén jelen van.',
    address: {
      name: 'Urban Dojo',
      place: 'Budapest, Szív u. 11, 1063 Magyarország'
    },
    color: colors.blue,
    start: {
      hours: 18,
      minutes: 0
    },
    end: {
      hours: 19,
      minutes: 0
    },
    rrule: {
      freq: RRule.WEEKLY,
      byweekday: [RRule.TU, RRule.TH]
    }
  },
];

@Injectable()
export class CalendarService {
  getEvents(start: Date, end: Date): Observable<CalendarEvent<RecurringEvent>[]> {
    return this.getRecurringEvents().pipe(map(recurringEvents => {
      const events = [];
      recurringEvents.forEach(revent => {
        const timeStart = moment(start).startOf('day').toDate();
        const title =  revent.title + this.eventRangeToString(revent);
        timeStart.setHours(revent.start.hours, revent.start.minutes);
        const rule: RRule = new RRule({
          ...revent.rrule,
          dtstart: timeStart,
          until: moment(end).endOf('day').toDate()
        });
        rule.all().forEach(date => {
          const endTime = moment(date).toDate();
          endTime.setHours(revent.end.hours, revent.end.minutes);
          events.push({
            title,
            color: revent.color,
            meta: revent,
            start: moment(date).toDate(),
            end: endTime
          });
        });
      });
      return events;
    }), delay(0));
  }

  private eventRangeToString(revent: RecurringEvent): string {
    return ' (' + this.timeToString(revent.start) + ' - ' + this.timeToString(revent.end) + ')';
  }

  private timeToString(time: Time): string {
    return formatNumber(time.hours, 'hu', '2.0') + ':' + formatNumber(time.minutes, 'hu', '2.0');
  }

  private getRecurringEvents(): Observable<RecurringEvent[]> {
    return of(RECURRING_EVENTS);
  }
}
