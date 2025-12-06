import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Register Component
 * Handles user registration functionality
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Handle registration form submission
   */
  onSubmit(): void {
    // Validation
    if (!this.email || !this.password || !this.confirmPassword) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Validate password confirmation
    if (this.password !== this.confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return;
    }

    // Validate password length
    if (this.password.length < 6) {
      this.showMessage('Password must be at least 6 characters long', 'error');
      return;
    }

    this.loading = true;
    this.message = '';

    // Call auth service
    this.authService.register({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.showMessage('Registration successful! Redirecting to login...', 'success');
        
        // Navigate to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        
        // Get error message from server response
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Show error message
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  /**
   * Display message to user
   * @param message - Message text
   * @param type - Message type (success or error)
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    
    // Clear message after longer time for errors (so user can read it)
    const timeout = type === 'error' ? 10000 : 5000;
    setTimeout(() => {
      this.message = '';
    }, timeout);
  }
}
