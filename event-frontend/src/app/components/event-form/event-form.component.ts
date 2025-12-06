import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event: Event = {
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: ''
  };
  isEditMode = false;
  loading = false;
  error: string | null = null;
  eventId: number | null = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.eventId = +params['id'];
        this.isEditMode = true;
        this.loadEvent();
      }
    });
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (response) => {
        if (response.event) {
          // Format date for input field (YYYY-MM-DD)
          const eventDate = new Date(response.event.event_date);
          this.event = {
            ...response.event,
            event_date: eventDate.toISOString().split('T')[0],
            event_time: response.event.event_time.substring(0, 5) // HH:MM format
          };
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load event';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Format the event data before sending
    const formattedDate = this.formatDate(this.event.event_date);
    const formattedTime = this.formatTime(this.event.event_time);

    // Validate formatted data
    if (!formattedDate) {
      this.error = 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2025-12-02)';
      this.loading = false;
      return;
    }

    if (!formattedTime) {
      this.error = 'Invalid time format. Please use HH:MM format in 24-hour time (e.g., 17:30)';
      this.loading = false;
      return;
    }

    const eventData = {
      title: this.event.title.trim(),
      description: this.event.description ? this.event.description.trim() : undefined,
      event_date: formattedDate,
      event_time: formattedTime,
      location: this.event.location.trim()
    };

    // Debug logging (remove in production)
    console.log('Form data before submit:', {
      original: {
        event_date: this.event.event_date,
        event_time: this.event.event_time
      },
      formatted: {
        event_date: formattedDate,
        event_time: formattedTime
      },
      fullData: eventData
    });

    if (this.isEditMode && this.eventId) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Update event error:', err);
          this.error = err.error?.message || err.error?.error || 'Failed to update event';
          if (err.error?.errors) {
            this.error += ': ' + err.error.errors.map((e: any) => e.msg || e.message).join(', ');
          }
          this.loading = false;
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Create event error:', err);
          console.error('Error response:', err.error);
          console.error('Error status:', err.status);
          
          // Build detailed error message
          let errorMessage = err.error?.message || err.error?.error || 'Failed to create event';
          
          // Add validation errors if present
          if (err.error?.errors && Array.isArray(err.error.errors)) {
            const validationErrors = err.error.errors.map((e: any) => e.msg || e.message || e).join(', ');
            errorMessage += ': ' + validationErrors;
          }
          
          // Add missing fields info if present
          if (err.error?.missingFields) {
            errorMessage += ` (Missing: ${err.error.missingFields.join(', ')})`;
          }
          
          // Add received data for debugging
          if (err.error?.received) {
            console.error('Received data:', err.error.received);
          }
          
          this.error = errorMessage;
          this.loading = false;
        }
      });
    }
  }

  /**
   * Format date to YYYY-MM-DD format
   */
  formatDate(date: string): string {
    if (!date || !date.trim()) return '';
    
    const trimmedDate = date.trim();
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
      return trimmedDate;
    }
    
    // Handle MM/DD/YYYY or DD/MM/YYYY format
    const slashMatch = trimmedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const [, part1, part2, year] = slashMatch;
      // Try to determine if it's MM/DD or DD/MM
      // Assume MM/DD if first part > 12, otherwise try both
      let month: string, day: string;
      if (parseInt(part1) > 12) {
        // DD/MM format
        day = part1.padStart(2, '0');
        month = part2.padStart(2, '0');
      } else if (parseInt(part2) > 12) {
        // MM/DD format
        month = part1.padStart(2, '0');
        day = part2.padStart(2, '0');
      } else {
        // Ambiguous - assume MM/DD (US format)
        month = part1.padStart(2, '0');
        day = part2.padStart(2, '0');
      }
      return `${year}-${month}-${day}`;
    }
    
    // Try to parse as Date object
    const dateObj = new Date(trimmedDate);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return '';
  }

  /**
   * Format time to HH:MM format (24-hour)
   */
  formatTime(time: string): string {
    if (!time || !time.trim()) return '';
    
    const trimmedTime = time.trim();
    
    // If already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(trimmedTime)) {
      return trimmedTime;
    }
    
    // Handle HH:MM:SS format
    if (/^\d{2}:\d{2}:\d{2}$/.test(trimmedTime)) {
      return trimmedTime.substring(0, 5);
    }
    
    // Try to parse 12-hour format (e.g., "05:30 PM" or "5:30 PM")
    const time12Match = trimmedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (time12Match) {
      let hours = parseInt(time12Match[1]);
      const minutes = time12Match[2];
      const ampm = time12Match[3].toUpperCase();
      
      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    
    // If input type="time" returns a value, it should be in HH:MM format
    // But if it's not, return empty to trigger error
    return '';
  }

  validateForm(): boolean {
    // Clear previous error
    this.error = null;
    
    if (!this.event.title || !this.event.title.trim()) {
      this.error = 'Title is required';
      return false;
    }
    if (this.event.title.trim().length < 3) {
      this.error = 'Title must be at least 3 characters long';
      return false;
    }
    if (!this.event.event_date || !this.event.event_date.trim()) {
      this.error = 'Event date is required';
      return false;
    }
    if (!this.event.event_time || !this.event.event_time.trim()) {
      this.error = 'Event time is required';
      return false;
    }
    if (!this.event.location || !this.event.location.trim()) {
      this.error = 'Location is required';
      return false;
    }
    if (this.event.location.trim().length < 3) {
      this.error = 'Location must be at least 3 characters long';
      return false;
    }
    
    // Pre-validate format
    const formattedDate = this.formatDate(this.event.event_date);
    const formattedTime = this.formatTime(this.event.event_time);
    
    if (!formattedDate) {
      this.error = 'Invalid date format. Please use YYYY-MM-DD format or select from the date picker';
      return false;
    }
    
    if (!formattedTime) {
      this.error = 'Invalid time format. Please use HH:MM format in 24-hour time or select from the time picker';
      return false;
    }
    
    return true;
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

