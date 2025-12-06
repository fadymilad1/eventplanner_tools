import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  organizedEvents: Event[] = [];
  invitedEvents: Event[] = [];
  loading = false;
  error: string | null = null;
  activeTab: 'organized' | 'invited' = 'organized';
  user: any = null;
  searchKeyword: string = '';
  searchRole: 'organizer' | 'attendee' | undefined = undefined;
  searchResults: Event[] = [];
  isSearching: boolean = false;
  searchLoading: boolean = false;

  constructor(
    public eventService: EventService,
    public authService: AuthService,
    public router: Router
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    // Load organized events
    this.eventService.getOrganizedEvents().subscribe({
      next: (response) => {
        this.organizedEvents = response.events || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load organized events';
        this.loading = false;
      }
    });

    // Load invited events
    this.eventService.getInvitedEvents().subscribe({
      next: (response) => {
        this.invitedEvents = response.events || [];
      },
      error: (err) => {
        console.error('Failed to load invited events:', err);
        console.error('Error response:', err.error);
        console.error('Error status:', err.status);
        // Don't show error to user for invited events, just log it
      }
    });
  }

  createEvent(): void {
    this.router.navigate(['/events/create']);
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete event');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  searchEvents(): void {
    this.router.navigate(['/events/search']);
  }

  performSearch(): void {
    if (!this.searchKeyword.trim() && !this.searchRole) {
      this.clearSearch();
      return;
    }

    this.isSearching = true;
    this.searchLoading = true;
    this.error = null;

    const searchParams: any = {};
    if (this.searchKeyword.trim()) {
      searchParams.keyword = this.searchKeyword.trim();
    }
    if (this.searchRole) {
      searchParams.role = this.searchRole;
    }

    this.eventService.searchEvents(searchParams).subscribe({
      next: (response) => {
        this.searchResults = response.events || [];
        this.searchLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to search events';
        this.searchLoading = false;
        this.isSearching = false;
      }
    });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.searchRole = undefined;
    this.searchResults = [];
    this.isSearching = false;
    this.error = null;
    this.loadEvents();
  }

  setActiveTab(tab: 'organized' | 'invited'): void {
    this.activeTab = tab;
    // Clear search when switching tabs
    if (this.isSearching) {
      this.clearSearch();
    }
  }
}

