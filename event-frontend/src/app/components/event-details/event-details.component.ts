import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, Event } from '../../services/event.service';
import { InvitationService, Invitation } from '../../services/invitation.service';
import { AttendanceService, Attendance } from '../../services/attendance.service';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  invitations: Invitation[] = [];
  attendance: Attendance[] = [];
  attendanceStats: any = null;
  myAttendance: Attendance | null = null;
  loading = false;
  error: string | null = null;
  eventId: number | null = null;
  isOrganizer = false;
  currentUserId: number | null = null;
  inviteeEmail = '';
  searchResults: User[] = [];
  searching = false;

  constructor(
    public eventService: EventService,
    public invitationService: InvitationService,
    public attendanceService: AttendanceService,
    public userService: UserService,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    const user = this.authService.getUser();
    this.currentUserId = user?.id || null;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      this.loadEvent();
    });
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.loading = true;
    this.error = null;

    this.eventService.getEventById(this.eventId).subscribe({
      next: (response) => {
        if (response.event) {
          this.event = response.event;
          this.invitations = response.event.invitations || [];
          this.attendance = response.event.attendance || [];
          this.attendanceStats = response.event.attendanceStats || null;
          this.isOrganizer = this.event.organizer_id === this.currentUserId;
        }
        this.loadMyAttendance();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load event';
        this.loading = false;
      }
    });
  }

  loadMyAttendance(): void {
    if (!this.eventId) return;

    this.attendanceService.getMyAttendance(this.eventId).subscribe({
      next: (response) => {
        this.myAttendance = response.attendance || null;
      },
      error: (err) => {
        console.error('Failed to load attendance:', err);
      }
    });
  }

  setAttendance(status: 'going' | 'maybe' | 'not_going'): void {
    if (!this.eventId) return;

    this.attendanceService.setAttendance(this.eventId, status).subscribe({
      next: () => {
        this.loadEvent();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to update attendance');
      }
    });
  }

  searchUsers(): void {
    if (!this.inviteeEmail.trim() || this.inviteeEmail.trim().length < 2) {
      this.searchResults = [];
      return;
    }

    this.searching = true;
    this.userService.searchUsers(this.inviteeEmail.trim()).subscribe({
      next: (response) => {
        this.searchResults = response.users || [];
        this.searching = false;
      },
      error: (err) => {
        console.error('Failed to search users:', err);
        this.searchResults = [];
        this.searching = false;
      }
    });
  }

  inviteUser(userId: number): void {
    if (!this.eventId) {
      alert('Event ID is missing');
      return;
    }

    this.invitationService.inviteUser(this.eventId, userId).subscribe({
      next: () => {
        alert('User invited successfully');
        this.inviteeEmail = '';
        this.searchResults = [];
        this.loadEvent();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to invite user');
      }
    });
  }

  deleteEvent(): void {
    if (!this.eventId || !confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.eventService.deleteEvent(this.eventId).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to delete event');
      }
    });
  }

  editEvent(): void {
    if (!this.eventId) return;
    this.router.navigate(['/events', this.eventId, 'edit']);
  }

  getAttendanceStatusClass(status: string): string {
    switch (status) {
      case 'going':
        return 'status-going';
      case 'maybe':
        return 'status-maybe';
      case 'not_going':
        return 'status-not-going';
      default:
        return 'status-pending';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

