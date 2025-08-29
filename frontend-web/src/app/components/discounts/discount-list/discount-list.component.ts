import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from '../../../services/api.service';

interface DiscountVehicle {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  new_price: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  image_url: string;
  type: string;
  is_sold: boolean;
  created_at: string;
}

@Component({
  selector: 'app-discount-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.css']
})
export class DiscountListComponent implements OnInit, OnDestroy {
  discountVehicles: DiscountVehicle[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadDiscountVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDiscountVehicles(): void {
    this.isLoading = true;
    // En una implementación real, aquí llamarías a tu endpoint de descuentos
    // Por ahora simularemos datos de descuento
    this.apiService.getCars()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cars: any) => {
          // Simular descuentos para algunos vehículos
          this.discountVehicles = cars.slice(0, 4).map((car: any, index: number) => ({
            ...car,
            type: 'car',
            original_price: car.price * (1 + (index + 1) * 0.1), // Precio original aumentado
            discount_percentage: (index + 1) * 10, // 10%, 20%, 30%, 40%
            new_price: car.price
          }));

          this.apiService.getMotorcycles()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (motorcycles: any) => {
                const discountMotorcycles = motorcycles.slice(0, 2).map((motorcycle: any, index: number) => ({
                  ...motorcycle,
                  type: 'motorcycle',
                  original_price: motorcycle.price * (1 + (index + 1) * 0.15),
                  discount_percentage: (index + 1) * 15,
                  new_price: motorcycle.price
                }));

                this.discountVehicles = [...this.discountVehicles, ...discountMotorcycles];
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error loading discount motorcycles:', error);
                this.isLoading = false;
              }
            });
        },
        error: (error) => {
          console.error('Error loading discount cars:', error);
          this.isLoading = false;
        }
      });
  }

  viewVehicleDetails(vehicle: DiscountVehicle): void {
    if (vehicle.type === 'car') {
      this.router.navigate(['/car', vehicle.id]);
    } else {
      this.router.navigate(['/motorcycle', vehicle.id]);
    }
  }

  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  calculateSavings(original: number, discounted: number): number {
    return original - discounted;
  }
}
