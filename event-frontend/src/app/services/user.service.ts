import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * User Service
 * Handles user-related API calls (for searching users to invite)
 */

export interface User {
  id: number;
  email: string;
  created_at?: string;
}

export interface UserResponse {
  message: string;
  users?: User[];
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * Search users by email
   */
  searchUsers(email: string, limit: number = 10): Observable<UserResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('limit', limit.toString());

    return this.http.get<UserResponse>(`${this.apiUrl}/search`, { params });
  }
}
