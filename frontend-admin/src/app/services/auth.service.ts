// services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminTokenKey = 'admin_access_token';

  constructor(private router: Router) { }

  setToken(token: string): void {
    localStorage.setItem(this.adminTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.adminTokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.adminTokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.username;
    } catch (error) {
      return null;
    }
  }
}
