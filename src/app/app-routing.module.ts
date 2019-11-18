import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {TrainingsComponent} from './pages/trainings/trainings.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {BlogComponent} from './pages/blog/blog.component';
import {AboutComponent} from './pages/about/about.component';
import {MyselfComponent} from './pages/myself/myself.component';
import {TriplexTrainingComponent} from './pages/trainings/triplex-training/triplex-training.component';
import {BonfitTrainingComponent} from './pages/trainings/bonfit-training/bonfit-training.component';
import {TriplexOfficeComponent} from './pages/trainings/triplex-office/triplex-office.component';
import {TriplexMobilityComponent} from './pages/trainings/triplex-mobility/triplex-mobility.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  },
  {
    path: 'myself',
    component: MyselfComponent,
    data: { animation: 'myself' }
  },
  {
    path: 'trainings',
    component: TrainingsComponent,
    data: { animation: 'trainings' }
  },
  {
    path: 'triplex-training',
    component: TriplexTrainingComponent,
    data: { animation: 'triplex-training' }
  },
  {
    path: 'bonfit-training',
    component: BonfitTrainingComponent,
    data: { animation: 'bonfit-training' }
  },
  {
    path: 'triplex-office',
    component: TriplexOfficeComponent,
    data: { animation: 'triplex-office' }
  },
  {
    path: 'triplex-mobility',
    component: TriplexMobilityComponent,
    data: { animation: 'triplex-mobility' }
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { animation: 'calendar' }
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: { animation: 'blog' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {animation: 'about'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
