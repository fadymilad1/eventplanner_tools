import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Login Component
 * Handles user login functionality
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
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
   * Handle login form submission
   */
  onSubmit(): void {
    // Validation
    if (!this.email || !this.password) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    this.loading = true;
    this.message = '';

    // Call auth service
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.showMessage('Login successful! Redirecting...', 'success');
        
        // Navigate to dashboard after successful login
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        // Get error message from server response
        let errorMessage = 'Login failed. Please try again.';
        
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
