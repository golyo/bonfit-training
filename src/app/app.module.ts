import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HomeComponent} from './pages/home/home.component';
import { TrainingsComponent } from './pages/trainings/trainings.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AboutComponent } from './pages/about/about.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MyselfComponent } from './pages/myself/myself.component';
import { TriplexTrainingComponent } from './pages/trainings/triplex-training/triplex-training.component';
import { TriplexOfficeComponent } from './pages/trainings/triplex-office/triplex-office.component';
import { TriplexMobilityComponent } from './pages/trainings/triplex-mobility/triplex-mobility.component';
import { BonfitTrainingComponent } from './pages/trainings/bonfit-training/bonfit-training.component';
import {NgxDocViewerModule} from 'ngx-doc-viewer';

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
    BonfitTrainingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    NgxDocViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
