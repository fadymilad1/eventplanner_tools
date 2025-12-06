import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Event Service
 * Handles all event-related API calls
 */

export interface Event {
  id?: number;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer_id?: number;
  organizer_email?: string;
  user_role?: 'organizer' | 'attendee' | null;
  created_at?: string;
  updated_at?: string;
  invitations?: any[];
  attendance?: any[];
  attendanceStats?: any;
}

export interface EventResponse {
  message: string;
  event?: Event;
  events?: Event[];
  count?: number;
  filters?: any;
}

export interface EventSearchParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  role?: 'organizer' | 'attendee';
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new event
   */
  createEvent(event: Event): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}`, event);
  }

  /**
   * Get all events organized by the current user
   */
  getOrganizedEvents(): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/organized`);
  }

  /**
   * Get all events the user is invited to
   */
  getInvitedEvents(): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/invited`);
  }

  /**
   * Get a single event by ID
   */
  getEventById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update an event
   */
  updateEvent(id: number, event: Partial<Event>): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.apiUrl}/${id}`, event);
  }

  /**
   * Delete an event
   */
  deleteEvent(id: number): Observable<EventResponse> {
    return this.http.delete<EventResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search events with filters
   */
  searchEvents(params: EventSearchParams): Observable<EventResponse> {
    let httpParams = new HttpParams();
    
    if (params.keyword) {
      httpParams = httpParams.set('keyword', params.keyword);
    }
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }
    if (params.role) {
      httpParams = httpParams.set('role', params.role);
    }

    return this.http.get<EventResponse>(`${this.apiUrl}/search`, { params: httpParams });
  }
}

