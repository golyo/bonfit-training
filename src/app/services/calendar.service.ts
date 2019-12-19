import {Injectable} from '@angular/core';
import RRule from 'rrule';
import {DecimalPipe, formatNumber, Time} from '@angular/common';
import {from, Observable} from 'rxjs';
import {CalendarEvent, EventColor} from 'calendar-utils';
import {concatMap, delay, flatMap, map, mergeMap, take, tap} from 'rxjs/operators';
import moment from 'moment-timezone';
import {AngularFirestore} from '@angular/fire/firestore';
import {Util} from './firebase.util';
import {AuthService} from './security/auth.service';
import {RecurringEvent} from '../dto/recurring-event.interface';
import {TrainingEvent} from '../dto/training-event.interface';
import {EventMember} from '../dto/user.dto';

const DISABLED_COLOR: EventColor = {
  primary: '#BBB',
  secondary: '#BBB'
};

@Injectable()
export class CalendarService {
  constructor(private db: AngularFirestore, private authService: AuthService) {
  }

  reactivateEvent(event: CalendarEvent): Promise<void> {
    const parent = event.meta as RecurringEvent;
    this.removeOldSkippedEvents(parent);
    const idx = parent.skippedEvents.findIndex(date => date.getTime() === event.start.getTime());
    parent.skippedEvents.splice(idx, 1);
    event.cssClass = null;
    return this.updateSkippedEvents(parent);
  }

  inactivateEvent(event: CalendarEvent): Promise<void> {
    const parent = event.meta as RecurringEvent;
    this.removeOldSkippedEvents(parent);
    event.cssClass = 'disabled';
    if (!parent.skippedEvents) {
      parent.skippedEvents = [];
    }
    parent.skippedEvents.push(event.start);
    return this.updateSkippedEvents(parent);
  }

  getTrainingEvent(event: CalendarEvent): Observable<TrainingEvent> {
    const id = this.getEventDbId(event);
    return this.db.collection('trainingEvents').doc<TrainingEvent>(id).valueChanges();
  }

  addContextUserToEvent(cevent: CalendarEvent, event: TrainingEvent): Promise<void> {
    const id = this.getEventDbId(cevent);
    const user = this.authService.getUser();
    const member: EventMember = {
      id: user.id,
      name: user.name
    };
    if (!event) {
      event = {
        members: []
      };
    }
    event.members.push(member);
    return this.db.collection('trainingEvents').doc<TrainingEvent>(id).set(event);
  }

  removeContextUserFromEvent(cevent: CalendarEvent, event: TrainingEvent): Promise<void> {
    const id = this.getEventDbId(cevent);
    const user = this.authService.getUser();
    event.members = event.members.filter(m => m.id !== user.id);
    return this.db.collection('trainingEvents').doc<TrainingEvent>(id).set(event);
  }

  private getEventDbId(event: CalendarEvent) {
    const parent = event.meta as RecurringEvent;
    const start = event.start;
    return parent.id + '_' + start.getFullYear() + start.getMonth() + start.getDay() + '_' + start.getHours() + start.getMinutes();
  }

  private removeOldSkippedEvents(parent: RecurringEvent) {
    const yearCheck = new Date();
    yearCheck.setFullYear(yearCheck.getFullYear() - 1);
    const timeLimit = yearCheck.getTime();
    parent.skippedEvents = parent.skippedEvents.filter(date => date.getTime() > timeLimit);
  }

  private updateSkippedEvents(parent: RecurringEvent) {
    const skippedObject: Partial<RecurringEvent> = {skippedEvents: parent.skippedEvents};
    return this.db.collection<RecurringEvent>('recurringEvents').doc(parent.id).update(skippedObject);
  }

  getEvents(start: Date, end: Date): Observable<CalendarEvent<RecurringEvent>[]> {
    const isAdmin = this.authService.isAdmin;
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
          const isSkipped = revent.skippedEvents.some(check => check.getTime() === date.getTime());
          if (!isSkipped || isAdmin) {
            const endTime = moment(date).toDate();
            endTime.setHours(revent.end.hours, revent.end.minutes);

            events.push({
              title,
              color: isSkipped ? DISABLED_COLOR : revent.color,
              meta: revent,
              start: moment(date).toDate(),
              end: endTime,
              cssClass: isSkipped ? 'disabled' : null
            });
          }
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
    return this.db.collection<RecurringEvent>('recurringEvents').snapshotChanges().pipe(map(Util.resultsToObjects),
      tap(events => events.map(event => Util.timestampsToDate(event, 'skippedEvents'))));
    // return of(RECURRING_EVENTS);
  }

}
