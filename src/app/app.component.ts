import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {fader, slider, stepper} from './animations';
import {AuthService} from './services/security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fader
  ]
})
export class AppComponent {
  isNavbarCollapsed = true;

  constructor(authService: AuthService) {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
