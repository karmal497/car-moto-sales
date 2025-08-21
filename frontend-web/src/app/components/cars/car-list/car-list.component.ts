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

import { ApiService } from '../../../services/api.service';

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

@Component({
  selector: 'app-car-list',
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
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  isLoading = true;
  searchTerm = '';
  selectedBrand = '';
  selectedYear = '';
  selectedTransmission = '';
  minPrice = '';
  maxPrice = '';

  brands: string[] = [];
  years: number[] = [];
  private destroy$ = new Subject<void>();

  // Transmission options
  transmissionOptions = [
    { value: 'manual', label: 'Mecánico' },
    { value: 'automatic', label: 'Automático' },
    { value: 'electric', label: 'Eléctrico' }
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCars();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCars(): void {
    this.isLoading = true;
    this.apiService.getCars()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cars: Car[]) => {
          this.cars = cars;
          this.filteredCars = cars;
          this.extractBrandsAndYears();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cars:', error);
          this.isLoading = false;
        }
      });
  }

  extractBrandsAndYears(): void {
    // Extract unique brands
    this.brands = [...new Set(this.cars.map(car => car.brand))].sort();

    // Extract unique years (last 30 years)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  }

  filterCars(): void {
    this.filteredCars = this.cars.filter(car => {
      // Search term filter
      const matchesSearch = !this.searchTerm ||
        car.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand = !this.selectedBrand || car.brand === this.selectedBrand;

      // Year filter
      const matchesYear = !this.selectedYear || car.year.toString() === this.selectedYear;

      // Transmission filter
      const matchesTransmission = !this.selectedTransmission || car.transmission === this.selectedTransmission;

      // Price filter
      const price = parseFloat(car.price.toString());
      const min = this.minPrice ? parseFloat(this.minPrice) : 0;
      const max = this.maxPrice ? parseFloat(this.maxPrice) : Number.MAX_SAFE_INTEGER;
      const matchesPrice = price >= min && price <= max;

      return matchesSearch && matchesBrand && matchesYear && matchesTransmission && matchesPrice;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBrand = '';
    this.selectedYear = '';
    this.selectedTransmission = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.filterCars();
  }

  viewCarDetails(carId: number): void {
    this.router.navigate(['/car', carId]);
  }

  getTransmissionLabel(value: string): string {
    const option = this.transmissionOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  // Format number without using pipe
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
