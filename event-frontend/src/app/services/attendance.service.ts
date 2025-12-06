import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Attendance Service
 * Handles all attendance-related API calls
 */

export interface Attendance {
  id?: number;
  event_id: number;
  user_id: number;
  status: 'going' | 'maybe' | 'not_going' | 'pending';
  user_email?: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStats {
  going: number;
  maybe: number;
  not_going: number;
  pending: number;
  total: number;
}

export interface AttendanceResponse {
  message: string;
  attendance?: Attendance;
  attendanceStats?: AttendanceStats;
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = environment.apiUrl;
  private eventApiUrl = `${this.apiUrl}/events`;
  private attendanceApiUrl = `${this.apiUrl}/attendance`;

  constructor(private http: HttpClient) { }

  /**
   * Set attendance status for an event
   */
  setAttendance(eventId: number, status: 'going' | 'maybe' | 'not_going'): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.eventApiUrl}/${eventId}/attendance`, { status });
  }

  /**
   * Get attendance for an event (organizer only)
   */
  getEventAttendance(eventId: number): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${this.eventApiUrl}/${eventId}/attendance`);
  }

  /**
   * Get user's attendance for an event
   */
  getMyAttendance(eventId: number): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${this.eventApiUrl}/${eventId}/attendance/me`);
  }

  /**
   * Get all events user is attending
   */
  getMyAttendingEvents(status?: 'going' | 'maybe' | 'not_going'): Observable<AttendanceResponse> {
    let httpParams = new HttpParams();
    if (status) {
      httpParams = httpParams.set('status', status);
    }
    return this.http.get<AttendanceResponse>(`${this.attendanceApiUrl}`, { params: httpParams });
  }
}

