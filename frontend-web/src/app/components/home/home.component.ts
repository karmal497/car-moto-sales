import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  transmission: string;
  mileage: number;
  fuel_type: string;
  image_url: string;
  created_at: string;
  is_sold: boolean;
  created_by: number;
}

interface Motorcycle {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  category: string;
  mileage: number;
  fuel_type: string;
  image_url: string;
  created_at: string;
  is_sold: boolean;
  created_by: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredCars: Car[] = [];
  featuredMotorcycles: Motorcycle[] = [];
  isLoggedIn = false;
  showAuthModal = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFeaturedVehicles();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadFeaturedVehicles(): void {
    this.apiService.getCars().subscribe({
      next: (data: any) => {
        this.featuredCars = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading cars:', error);
      }
    });

    this.apiService.getMotorcycles().subscribe({
      next: (data: any) => {
        this.featuredMotorcycles = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading motorcycles:', error);
      }
    });
  }

  // Método para verificar autenticación antes de navegar
  checkAuthAndNavigate(route: string): void {
    if (this.authService.isLoggedIn()) {
      // Navegar normalmente si está autenticado
      window.location.href = route;
    } else {
      // Efecto de vibración
      this.shakeElement();

      // Mostrar modal de autenticación
      this.showAuthModal = true;

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
    const buttons = document.querySelectorAll('.explore-btn, .vehicle-card button');
    buttons.forEach(button => {
      button.classList.add('shake-animation');
      setTimeout(() => {
        button.classList.remove('shake-animation');
      }, 500);
    });
  }

  // Format number without using pipe
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
