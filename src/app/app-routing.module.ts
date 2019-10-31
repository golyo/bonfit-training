import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {TrainingsComponent} from './pages/trainings/trainings.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {BlogComponent} from './pages/blog/blog.component';
import {AboutComponent} from './pages/about/about.component';


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
    path: 'trainings',
    component: TrainingsComponent,
    data: { animation: 'trainings' }
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
