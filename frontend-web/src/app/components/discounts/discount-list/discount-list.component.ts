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
  car?: any;
  motorcycle?: any;
  vehicle_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
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

    // Obtener descuentos activos desde la API
    this.apiService.getDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (discounts: any) => {
          // Filtrar solo descuentos activos
          const activeDiscounts = discounts.filter((discount: any) =>
            discount.is_active &&
            new Date(discount.end_date) > new Date()
          );

          // Transformar los datos para la vista
          this.discountVehicles = activeDiscounts.map((discount: any) => {
            const vehicleType = discount.vehicle_type;
            const vehicleData = vehicleType === 'car' ? discount.car : discount.motorcycle;

            return {
              id: discount.id,
              title: discount.title,
              description: vehicleData?.description || '',
              price: discount.new_price || this.calculateDiscountedPrice(discount.original_price, discount.discount_percentage),
              original_price: discount.original_price,
              discount_percentage: discount.discount_percentage,
              new_price: discount.new_price || this.calculateDiscountedPrice(discount.original_price, discount.discount_percentage),
              brand: this.extractBrandFromTitle(discount.title),
              model: this.extractModelFromTitle(discount.title),
              year: this.extractYearFromTitle(discount.title),
              color: vehicleData?.color || '',
              image_url: discount.image_url,
              type: vehicleType === 'car' ? 'car' : 'motorcycle',
              is_sold: vehicleData?.is_sold || false,
              created_at: discount.created_at,
              vehicle_type: discount.vehicle_type,
              start_date: discount.start_date,
              end_date: discount.end_date,
              is_active: discount.is_active,
              car: discount.car,
              motorcycle: discount.motorcycle
            };
          });

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading discounts:', error);
          this.isLoading = false;
        }
      });
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    const discountDecimal = discountPercentage / 100;
    return originalPrice * (1 - discountDecimal);
  }

  extractBrandFromTitle(title: string): string {
    // Extraer la marca del título (ej: "Toyota Corolla (2020)" -> "Toyota")
    const parts = title.split(' ');
    return parts.length > 0 ? parts[0] : '';
  }

  extractModelFromTitle(title: string): string {
    // Extraer el modelo del título (ej: "Toyota Corolla (2020)" -> "Corolla")
    const parts = title.split(' ');
    return parts.length > 1 ? parts.slice(1, -1).join(' ') : '';
  }

  extractYearFromTitle(title: string): number {
    // Extraer el año del título (ej: "Toyota Corolla (2020)" -> 2020)
    const yearMatch = title.match(/\((\d{4})\)/);
    return yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
  }

  viewVehicleDetails(vehicle: DiscountVehicle): void {
    if (vehicle.vehicle_type === 'car') {
      this.router.navigate(['/car', vehicle.car?.id || vehicle.id]);
    } else {
      this.router.navigate(['/motorcycle', vehicle.motorcycle?.id || vehicle.id]);
    }
  }

  formatNumber(value: number): string {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  calculateSavings(original: number, discounted: number): number {
    return original - discounted;
  }
}
