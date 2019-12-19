import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Role, User} from '../../dto/user.dto';
import {TrainingEvent} from '../../dto/training-event.interface';

@Injectable()
export class AuthService {
  private authCheckStarted;
  private user: User;
  private userSubject = new Subject<User>();

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFirestore) {
    this.authCheckStarted = true;
    this.firebaseAuth.authState.subscribe((firebaseUser: firebase.User) => {
      this.onAuthStateChanged(firebaseUser);
    });
  }

  login(): void {
    this.authCheckStarted = true;
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((authRequest) => {
      this.onAuthStateChanged(authRequest.user);
    });
  }

  logout(): void {
    delete this.user;
    this.firebaseAuth.auth.signOut().then();
  }

  private onAuthStateChanged(firebaseUser: firebase.User): void {
    this.user = null;
    if (!firebaseUser) {
      // User is logged out
      delete this.user;
      this.userSubject.next(null);
      this.authCheckStarted = false;
    } else {
      // User logged in for first time or changed
      const subscription = this.db.collection('users', ref => ref.where('email', '==', firebaseUser.email))
        .snapshotChanges().pipe(map(users => users.map(user => user.payload.doc.data() as User)))
        .subscribe((users) => {
          if (users.length > 0) {
            this.user = users[0];
          } else {
            this.user = new User(firebaseUser.displayName, firebaseUser.email, []);
            this.user.id = firebaseUser.uid;
            this.db.collection('users').doc<User>(this.user.id).set(Object.assign({}, this.user)).then();
          }
          subscription.unsubscribe();
          this.authCheckStarted = false;
          this.userSubject.next(this.user);
        });
    }
  }

  getUserIdPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.authCheckStarted) {
        this.userSubject.asObservable().pipe(take(1)).subscribe(user => {
          resolve(this.user ? this.user.id : null);
        });
      } else {
        resolve(this.user ? this.user.id : null);
      }
    });
  }
  getUserSubject(): Observable<User> {
    return this.user ? of(this.user) : this.authCheckStarted ? this.userSubject.asObservable() : of(null);
  }

  getUser(): User {
    return this.user;
  }

  get isAdmin(): boolean {
    return Boolean(this.user) && Boolean(this.user.roles) && this.user.roles.includes(Role.ADMIN);
  }
}
