import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    if (this.email === 'admin.admin@gmail.com' && this.password === '123456') {
      this.auth.login('admin');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuário ou senha inválidos!');
    }
  }
}
