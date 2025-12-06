import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, Event, EventSearchParams } from '../../services/event.service';

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.css']
})
export class EventSearchComponent implements OnInit {
  searchParams: EventSearchParams = {
    keyword: '',
    startDate: '',
    endDate: '',
    role: undefined
  };
  events: Event[] = [];
  loading = false;
  error: string | null = null;
  hasSearched = false;

  constructor(
    public eventService: EventService,
    public router: Router
  ) { }

  ngOnInit(): void {
    // Optionally load all events on init
    // this.search();
  }

  search(): void {
    this.loading = true;
    this.error = null;
    this.hasSearched = true;

    // Remove empty params
    const params: EventSearchParams = {};
    if (this.searchParams.keyword?.trim()) {
      params.keyword = this.searchParams.keyword.trim();
    }
    if (this.searchParams.startDate) {
      params.startDate = this.searchParams.startDate;
    }
    if (this.searchParams.endDate) {
      params.endDate = this.searchParams.endDate;
    }
    if (this.searchParams.role) {
      params.role = this.searchParams.role;
    }

    this.eventService.searchEvents(params).subscribe({
      next: (response) => {
        this.events = response.events || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to search events';
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchParams = {
      keyword: '',
      startDate: '',
      endDate: '',
      role: undefined
    };
    this.events = [];
    this.hasSearched = false;
    this.error = null;
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
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

