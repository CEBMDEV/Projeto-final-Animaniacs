import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = signal(false);
  private _username = signal<string | null>(null);

  login(username: string) {
    this._isLoggedIn.set(true);
    this._username.set(username);
  }

  logout() {
    this._isLoggedIn.set(false);
    this._username.set(null);
  }

  isLoggedIn() {
    return this._isLoggedIn();
  }

  getUsername() {
    return this._username();
  }
}
