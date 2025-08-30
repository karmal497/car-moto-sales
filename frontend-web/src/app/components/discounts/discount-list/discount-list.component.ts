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
  days_remaining: number;
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

  // Número de WhatsApp del anunciante
  private readonly whatsappNumber = '55415814';

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

            // Obtener el precio original del vehículo
            const originalPrice = parseFloat(discount.original_price) ||
                                (vehicleData ? parseFloat(vehicleData.price) : 0);

            // Obtener el porcentaje de descuento
            const discountPercentage = parseFloat(discount.discount_percentage) || 0;

            // Calcular nuevo precio correctamente
            const newPrice = this.calculateDiscountedPrice(originalPrice, discountPercentage);

            // Calcular días restantes
            const daysRemaining = this.calculateDaysRemaining(discount.end_date);

            return {
              id: discount.id,
              title: discount.title || this.generateTitleFromVehicle(vehicleData, vehicleType),
              description: vehicleData?.description || '',
              price: newPrice,
              original_price: originalPrice,
              discount_percentage: discountPercentage,
              new_price: newPrice,
              brand: vehicleData?.brand || this.extractBrandFromTitle(discount.title),
              model: vehicleData?.model || this.extractModelFromTitle(discount.title),
              year: vehicleData?.year || this.extractYearFromTitle(discount.title) || new Date().getFullYear(),
              color: vehicleData?.color || '',
              image_url: discount.image_url || vehicleData?.image_url,
              type: vehicleType === 'car' ? 'car' : 'motorcycle',
              is_sold: vehicleData?.is_sold || false,
              created_at: discount.created_at,
              vehicle_type: discount.vehicle_type,
              start_date: discount.start_date,
              end_date: discount.end_date,
              is_active: discount.is_active,
              days_remaining: daysRemaining,
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

  private generateTitleFromVehicle(vehicleData: any, vehicleType: string): string {
    if (!vehicleData) return 'Vehículo en oferta';

    const brand = vehicleData.brand || '';
    const model = vehicleData.model || '';
    const year = vehicleData.year || '';

    return `${brand} ${model} ${year ? `(${year})` : ''}`.trim();
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    if (!originalPrice || !discountPercentage) return originalPrice || 0;
    const discountDecimal = discountPercentage / 100;
    const discountedPrice = originalPrice * (1 - discountDecimal);
    return Math.round(discountedPrice * 100) / 100; // Redondear a 2 decimales
  }

  calculateDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  extractBrandFromTitle(title: string): string {
    if (!title) return '';
    const parts = title.split(' ');
    return parts.length > 0 ? parts[0] : '';
  }

  extractModelFromTitle(title: string): string {
    if (!title) return '';
    const parts = title.split(' ');
    if (parts.length <= 1) return '';

    // Eliminar el último elemento (año entre paréntesis) y unir el resto
    const modelParts = parts.slice(1, -1);
    return modelParts.join(' ');
  }

  extractYearFromTitle(title: string): number {
    if (!title) return 0;
    const yearMatch = title.match(/\((\d{4})\)/);
    return yearMatch ? parseInt(yearMatch[1], 10) : 0;
  }

  // Método para abrir WhatsApp con el mensaje predefinido
  openWhatsApp(vehicle: DiscountVehicle): void {
    const message = `Hola como está, eh visto que tiene un ${vehicle.title} en descuento, estoy interesado`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  formatNumber(value: number): string {
    if (!value && value !== 0) return '0';
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  calculateSavings(original: number, discounted: number): number {
    if (!original || !discounted) return 0;
    return Math.round((original - discounted) * 100) / 100;
  }

  getTimeRemainingText(days: number): string {
    if (days === 0) return 'Último día';
    if (days === 1) return '1 día restante';
    return `${days} días restantes`;
  }

  isExpiringSoon(days: number): boolean {
    return days <= 3;
  }
}
