import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TimeoutService } from '../timeout.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/models/interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOCAL_STORAGE_KEY = 'Jwt';
  private _authState$ = new BehaviorSubject<boolean>(false);
  private _userId: string | undefined;
  private _token: string | undefined;

  get authState$(): Observable<boolean> {
    return this._authState$.asObservable();
  }

  get userId(): string | undefined {
    return this._userId;
  }

  get token(): string | undefined {
    return this._token;
  }

  constructor(
    public afs: AngularFirestore,
    public auth: AngularFireAuth,
    private timeoutService: TimeoutService,
    private router: Router
  ) {}

  public createUser(email: string, password: string): Promise<any> {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.signIn(email, password);
      });
  }

  public signIn(email: string, password: string): Promise<any> {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        this._userId = user!.uid;
        this._token = user!.refreshToken;
        this._authState$.next(true);
        const expirationDate = this.calculateExpirationDate(1);
        this.setListener(expirationDate);
        this.setJwtToken(user as User, expirationDate);
        this.router.navigateByUrl('customize');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public autoSignIn(): void {
    const jwt = this.getJwtToken();
    if (!jwt || !jwt.expiration || !jwt.refreshToken || !jwt.uid) return;

    const expirationDate = new Date(jwt.expiration);
    if (this.calculateRemainingTimeSession(expirationDate)) {
      this._token = jwt.refreshToken;
      this._authState$.next(true);
      this.setListener(expirationDate);
      this._userId = jwt.uid;
    }
  }

  public isAuthenticated(): boolean {
    return this._authState$.getValue();
  }

  private logOut(): void {
    this._authState$.next(false);
    this._userId = undefined;
    this._token = undefined;
    this.removeJwtToken();
    this.timeoutService.clear();
  }

  private calculateExpirationDate(hours: number): Date {
    return new Date(Date.now() + 3600000 * hours);
  }

  private calculateRemainingTimeSession(futureDate: Date): number {
    return futureDate.getTime() - Date.now();
  }

  private setListener(date: Date): void {
    this.timeoutService.set(this.calculateRemainingTimeSession(date), () => {
      this.logOut();
    });
  }

  private setJwtToken(user: User, expirationDate: Date): void {
    const jwt: User = {
      refreshToken: user.refreshToken,
      uid: user.uid,
      expiration: expirationDate.toISOString(),
    };
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(jwt));
  }

  private getJwtToken(): User {
    return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)!);
  }

  private removeJwtToken(): void {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }
}
