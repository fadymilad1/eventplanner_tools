import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Invitation Service
 * Handles all invitation-related API calls
 */

export interface Invitation {
  id?: number;
  event_id: number;
  inviter_id: number;
  invitee_id: number;
  role: 'organizer' | 'attendee';
  status: 'pending' | 'accepted' | 'declined';
  invitee_email?: string;
  inviter_email?: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationResponse {
  message: string;
  invitation?: Invitation;
  invitations?: Invitation[];
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = environment.apiUrl;
  private eventApiUrl = `${this.apiUrl}/events`;
  private invitationApiUrl = `${this.apiUrl}/invitations`;

  constructor(private http: HttpClient) { }

  /**
   * Invite a user to an event
   */
  inviteUser(eventId: number, inviteeId: number, role: 'organizer' | 'attendee' = 'attendee'): Observable<InvitationResponse> {
    return this.http.post<InvitationResponse>(`${this.eventApiUrl}/${eventId}/invitations`, {
      invitee_id: inviteeId,
      role
    });
  }

  /**
   * Get all invitations for an event
   */
  getEventInvitations(eventId: number): Observable<InvitationResponse> {
    return this.http.get<InvitationResponse>(`${this.eventApiUrl}/${eventId}/invitations`);
  }

  /**
   * Get all invitations for the current user
   */
  getUserInvitations(): Observable<InvitationResponse> {
    return this.http.get<InvitationResponse>(`${this.invitationApiUrl}`);
  }

  /**
   * Update invitation status (accept/decline)
   */
  updateInvitationStatus(eventId: number, status: 'accepted' | 'declined'): Observable<InvitationResponse> {
    return this.http.put<InvitationResponse>(`${this.invitationApiUrl}/${eventId}`, { status });
  }

  /**
   * Delete an invitation
   */
  deleteInvitation(eventId: number, inviteeId: number): Observable<InvitationResponse> {
    return this.http.delete<InvitationResponse>(`${this.eventApiUrl}/${eventId}/invitations/${inviteeId}`);
  }
}

