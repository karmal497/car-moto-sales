import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Venta de Autos y Motos';
  isLoggedIn = false;
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = this.authService.getUsername();
  }

  logout(): void {
    this.authService.removeToken();
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/']);
  }

  // Método para verificar autenticación antes de navegar
  checkAuthAndNavigate(route: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([route]);
    } else {
      // Efecto de vibración
      this.shakeElement();

      // Mostrar mensaje
      this.snackBar.open('Debes iniciar sesión para acceder a esta sección', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top'
      });
    }
  }

  // Efecto de vibración para el candado
  private shakeElement(): void {
    const buttons = document.querySelectorAll('button, .clickable-element');
    buttons.forEach(button => {
      button.classList.add('shake-animation');
      setTimeout(() => {
        button.classList.remove('shake-animation');
      }, 500);
    });
  }
}
