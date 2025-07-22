import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  constructor(public auth: AuthService) {}

  protected readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  protected readonly username = computed(() => this.auth.getUsername());
}
