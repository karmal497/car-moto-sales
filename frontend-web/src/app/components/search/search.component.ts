// search.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from '../../services/api.service';

interface Vehicle {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  image_url: string;
  is_sold: boolean;
  type: string;
  transmission?: string;
  category?: string;
  mileage: number;
  fuel_type: string;
}

interface FeaturedItem {
  id: number;
  title: string;
  price: number;
  image_url: string;
  vehicle_type: string;
  car?: Vehicle;
  motorcycle?: Vehicle;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery = '';
  searchResults: Vehicle[] = [];
  featuredItems: FeaturedItem[] = [];
  allCars: Vehicle[] = [];
  allMotorcycles: Vehicle[] = [];
  isLoading = false;
  isLoadingFeatured = false;
  isLoadingCars = false;
  isLoadingMotorcycles = false;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllData(): void {
    this.loadFeaturedItems();
    this.loadAllCars();
    this.loadAllMotorcycles();
  }

  loadFeaturedItems(): void {
    this.isLoadingFeatured = true;
    // Simular la carga de elementos destacados ya que el endpoint no existe
    // En una implementación real, esto vendría de la API
    setTimeout(() => {
      this.featuredItems = [];
      this.isLoadingFeatured = false;
    }, 1000);
  }

  loadAllCars(): void {
    this.isLoadingCars = true;
    this.apiService.getCars()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cars: any) => {
          this.allCars = cars.map((car: any) => ({ ...car, type: 'car' }));
          this.isLoadingCars = false;
        },
        error: (error: any) => {
          console.error('Error loading cars:', error);
          this.isLoadingCars = false;
        }
      });
  }

  loadAllMotorcycles(): void {
    this.isLoadingMotorcycles = true;
    this.apiService.getMotorcycles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (motorcycles: any) => {
          this.allMotorcycles = motorcycles.map((motorcycle: any) => ({ ...motorcycle, type: 'motorcycle' }));
          this.isLoadingMotorcycles = false;
        },
        error: (error: any) => {
          console.error('Error loading motorcycles:', error);
          this.isLoadingMotorcycles = false;
        }
      });
  }

  navigateToDiscounts(): void {
    this.router.navigate(['/discounts']);
  }

  navigateToCars(): void {
    this.router.navigate(['/cars']);
  }

  navigateToMotorcycles(): void {
    this.router.navigate(['/motorcycles']);
  }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.apiService.search(this.searchQuery, 'all')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: any) => {
          // Combine cars and motorcycles
          const cars = results.cars || [];
          const motorcycles = results.motorcycles || [];

          // Add type property to distinguish between vehicles
          this.searchResults = [
            ...cars.map((car: any) => ({ ...car, type: 'car' })),
            ...motorcycles.map((motorcycle: any) => ({ ...motorcycle, type: 'motorcycle' }))
          ];

          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error searching:', error);
          this.isLoading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  viewVehicleDetails(vehicle: Vehicle): void {
    if (vehicle.type === 'car') {
      this.router.navigate(['/car', vehicle.id]);
    } else {
      this.router.navigate(['/motorcycle', vehicle.id]);
    }
  }

  viewFeaturedItemDetails(item: FeaturedItem): void {
    if (item.vehicle_type === 'car' && item.car) {
      this.router.navigate(['/car', item.car.id]);
    } else if (item.vehicle_type === 'motorcycle' && item.motorcycle) {
      this.router.navigate(['/motorcycle', item.motorcycle.id]);
    }
  }

  getTransmissionLabel(value: string): string {
    const options = [
      { value: 'manual', label: 'Mecánico' },
      { value: 'automatic', label: 'Automático' },
      { value: 'electric', label: 'Eléctrico' }
    ];

    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getCategoryLabel(value: string): string {
    const options = [
      { value: 'combustion', label: 'Combustión' },
      { value: 'electric', label: 'Eléctrico' },
      { value: 'automatic', label: 'Automática' },
      { value: 'semi_automatic', label: 'Semiautomática' }
    ];

    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  // Format number without using pipe
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
