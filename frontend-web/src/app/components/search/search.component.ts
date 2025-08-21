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
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        error: (error) => {
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
