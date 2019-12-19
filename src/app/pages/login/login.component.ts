import {Component, NgZone, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/security/auth.service';
import {Subscription, SubscriptionLike} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy {

  private subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              protected zone: NgZone) {
  }

  login() {
    this.subscription = this.authService.getUserSubject().subscribe(user => {
      if (user) {
        this.zone.run(() => this.router.navigateByUrl(`/home`).then()).then();
      }
    });
    this.authService.login();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
