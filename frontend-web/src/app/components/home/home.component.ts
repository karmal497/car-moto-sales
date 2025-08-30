import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface FeaturedItem {
  id: number;
  car: any;
  motorcycle: any;
  vehicle_type: string;
  title: string;
  price: number;
  image_url: string;
  type: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredItems: FeaturedItem[] = [];
  featuredCars: any[] = [];
  featuredMotorcycles: any[] = [];
  isLoggedIn = false;
  showAuthModal = false;
  subscriptionForm: FormGroup;
  isSubmitting = false;
  subscriptionSuccess = false;
  isLoading = true;

  // Número de WhatsApp del proveedor
  readonly whatsappNumber = '55415814';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadFeaturedVehicles();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadFeaturedVehicles(): void {
    this.isLoading = true;

    // Obtener items destacados desde el backend
    this.apiService.getFeaturedItems().subscribe({
      next: (data: any) => {
        this.featuredItems = data;
        this.featuredCars = [];
        this.featuredMotorcycles = [];

        // Separar autos y motos destacados usando los datos directos del featured item
        data.forEach((item: FeaturedItem) => {
          const vehicleData = {
            id: item.car ? item.car.id : item.motorcycle?.id,
            brand: this.extractBrandFromTitle(item.title),
            model: this.extractModelFromTitle(item.title),
            year: this.extractYearFromTitle(item.title),
            title: item.title,
            price: item.price,
            image_url: item.image_url,
            transmission: item.car ? item.car.transmission : '',
            category: item.motorcycle ? item.motorcycle.category : '',
            vehicle_type: item.vehicle_type
          };

          if (item.vehicle_type === 'car') {
            this.featuredCars.push(vehicleData);
          } else if (item.vehicle_type === 'motorcycle') {
            this.featuredMotorcycles.push(vehicleData);
          }
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured vehicles:', error);
        this.isLoading = false;

        // Fallback: cargar algunos vehículos normales si hay error
        this.loadRegularVehicles();
      }
    });
  }

  // Métodos auxiliares para extraer información del título
  private extractBrandFromTitle(title: string): string {
    const parts = title.split(' ');
    return parts[0] || '';
  }

  private extractModelFromTitle(title: string): string {
    const parts = title.split(' ');
    return parts.slice(1, -2).join(' ') || '';
  }

  private extractYearFromTitle(title: string): number {
    const match = title.match(/\((\d{4})\)/);
    return match ? parseInt(match[1], 10) : new Date().getFullYear();
  }

  // Método de fallback en caso de error
  private loadRegularVehicles(): void {
    this.apiService.getCars().subscribe({
      next: (data: any) => {
        this.featuredCars = data.slice(0, 3).map((car: any) => ({
          ...car,
          vehicle_type: 'car'
        }));
      },
      error: (error) => {
        console.error('Error loading cars:', error);
      }
    });

    this.apiService.getMotorcycles().subscribe({
      next: (data: any) => {
        this.featuredMotorcycles = data.slice(0, 3).map((motorcycle: any) => ({
          ...motorcycle,
          vehicle_type: 'motorcycle'
        }));
      },
      error: (error) => {
        console.error('Error loading motorcycles:', error);
      }
    });
  }

  // Método para abrir WhatsApp
  openWhatsApp(vehicle: any): void {
    const message = `Hola, estoy interesado en el vehículo: ${vehicle.brand} ${vehicle.model} (${vehicle.year}). ¿Podrían darme más información?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  // Método para verificar autenticación antes de navegar
  checkAuthAndNavigate(route: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([route]);
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
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0';
  }

  // Navegar a la vista de descuentos
  navigateToDiscounts(): void {
    this.router.navigate(['/discounts']);
  }

  // Suscribirse al newsletter
  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      this.isSubmitting = true;
      const email = this.subscriptionForm.value.email;

      // Llamar al servicio para suscribirse
      this.apiService.subscribeToNewsletter(email).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.subscriptionSuccess = true;

          // Efecto de confeti
          this.showConfetti();

          // Resetear formulario
          this.subscriptionForm.reset();

          // Mostrar mensaje de éxito
          this.snackBar.open('¡Te has suscrito exitosamente!', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top'
          });

          // Resetear estado de éxito después de 5 segundos
          setTimeout(() => {
            this.subscriptionSuccess = false;
          }, 5000);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Error al suscribirse:', error);

          if (error.status === 400 && error.error && error.error.email) {
            // El email ya está suscrito
            this.snackBar.open('Este correo electrónico ya está suscrito', 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            // Error general
            this.snackBar.open('Error al suscribirse. Intenta nuevamente.', 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top'
            });
          }
        }
      });
    }
  }

  // Efecto de confeti para suscripción exitosa
  private showConfetti(): void {
    const confettiContainer = document.querySelector('.confetti-container');
    if (confettiContainer) {
      confettiContainer.innerHTML = '';

      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.backgroundColor = this.getRandomColor();
        confettiContainer.appendChild(confetti);
      }

      // Limpiar confeti después de 5 segundos
      setTimeout(() => {
        confettiContainer.innerHTML = '';
      }, 5000);
    }
  }

  // Generar color aleatorio para confeti
  private getRandomColor(): string {
    const colors = [
      '#ff7700', '#ff5500', '#3498db', '#2ecc71', '#e74c3c',
      '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
