import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HomeComponent} from './pages/home/home.component';
import {TrainingsComponent} from './pages/trainings/trainings.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {BlogComponent} from './pages/blog/blog.component';
import {AboutComponent} from './pages/about/about.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyselfComponent} from './pages/myself/myself.component';
import {TriplexTrainingComponent} from './pages/trainings/triplex-training/triplex-training.component';
import {TriplexOfficeComponent} from './pages/trainings/triplex-office/triplex-office.component';
import {TriplexMobilityComponent} from './pages/trainings/triplex-mobility/triplex-mobility.component';
import {BonfitTrainingComponent} from './pages/trainings/bonfit-training/bonfit-training.component';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {CalendarDateFormatter, CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {TestComponent} from './pages/test/test.component';
import {FormsModule} from '@angular/forms';
import {FlatpickrModule} from 'angularx-flatpickr';
import localeHu from '@angular/common/locales/hu';
import {registerLocaleData} from '@angular/common';
import {CustomDateFormatter} from './pages/calendar/custom-date-formatter.provider';

registerLocaleData(localeHu, 'hu');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TrainingsComponent,
    CalendarComponent,
    BlogComponent,
    AboutComponent,
    MyselfComponent,
    TriplexTrainingComponent,
    TriplexOfficeComponent,
    TriplexMobilityComponent,
    BonfitTrainingComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    NgbModule,
    NgxDocViewerModule
  ],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
