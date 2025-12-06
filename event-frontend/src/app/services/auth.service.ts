import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Auth Service
 * Handles authentication operations - register and login
 */

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: any;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  /**
   * Register a new user
   * @param data - User registration data (email, password)
   * @returns Observable with registration response
   */
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  /**
   * Login user and store JWT token
   * @param data - User login data (email, password)
   * @returns Observable with login response containing JWT token
   */
  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        // Store JWT token in localStorage
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  /**
   * Get stored JWT token from localStorage
   * @returns JWT token string or null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get stored user data from localStorage
   * @returns User object or null
   */
  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user is logged in
   * @returns Boolean indicating if user is logged in
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logout user and clear localStorage
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
