import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, ViewPeriod} from 'calendar-utils';
import moment from 'moment-timezone';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
  DAYS_OF_WEEK
} from 'angular-calendar';
import {addDays, addHours, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import RRule from 'rrule';
import {Time} from '@angular/common';
import {CalendarService} from '../../services/calendar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

const testRule =
  new RRule({
    freq: RRule.WEEKLY,
    dtstart: new Date(Date.UTC(2019, 11, 1, 0, 0, 0)),
    until: new Date(Date.UTC(2019, 11, 31, 0, 0, 0)),
    byweekday: [RRule.TU, RRule.TH]
  });


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  selectedEvent: CalendarEvent;
  locale = 'hu';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  viewPeriod: ViewPeriod;

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private modal: NgbModal, private calendarService: CalendarService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    } else {
      this.activeDayIsOpen = false;
    }
  }

  get isToday(): boolean {
    return this.activeDayIsOpen === true && isSameDay(this.viewDate, new Date());
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  setToday(): void {
    this.activeDayIsOpen = true;
  }

  selectEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      this.calendarService.getEvents(viewRender.period.start, viewRender.period.end).subscribe(events => {
        this.events = events;
      });
    }
  }
}
