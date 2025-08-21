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
  selector: 'app-motorcycle-list',
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
  templateUrl: './motorcycle-list.component.html',
  styleUrls: ['./motorcycle-list.component.css']
})
export class MotorcycleListComponent implements OnInit, OnDestroy {
  motorcycles: Motorcycle[] = [];
  filteredMotorcycles: Motorcycle[] = [];
  isLoading = true;
  searchTerm = '';
  selectedBrand = '';
  selectedYear = '';
  selectedCategory = '';
  minPrice = '';
  maxPrice = '';

  brands: string[] = [];
  years: number[] = [];
  private destroy$ = new Subject<void>();

  // Category options
  categoryOptions = [
    { value: 'combustion', label: 'Combustión' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'automatic', label: 'Automática' },
    { value: 'semi_automatic', label: 'Semiautomática' }
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadMotorcycles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMotorcycles(): void {
    this.isLoading = true;
    this.apiService.getMotorcycles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (motorcycles: Motorcycle[]) => {
          this.motorcycles = motorcycles;
          this.filteredMotorcycles = motorcycles;
          this.extractBrandsAndYears();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading motorcycles:', error);
          this.isLoading = false;
        }
      });
  }

  extractBrandsAndYears(): void {
    // Extract unique brands
    this.brands = [...new Set(this.motorcycles.map(motorcycle => motorcycle.brand))].sort();

    // Extract unique years (last 30 years)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  }

  filterMotorcycles(): void {
    this.filteredMotorcycles = this.motorcycles.filter(motorcycle => {
      // Search term filter
      const matchesSearch = !this.searchTerm ||
        motorcycle.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        motorcycle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        motorcycle.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        motorcycle.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand = !this.selectedBrand || motorcycle.brand === this.selectedBrand;

      // Year filter
      const matchesYear = !this.selectedYear || motorcycle.year.toString() === this.selectedYear;

      // Category filter
      const matchesCategory = !this.selectedCategory || motorcycle.category === this.selectedCategory;

      // Price filter
      const price = parseFloat(motorcycle.price.toString());
      const min = this.minPrice ? parseFloat(this.minPrice) : 0;
      const max = this.maxPrice ? parseFloat(this.maxPrice) : Number.MAX_SAFE_INTEGER;
      const matchesPrice = price >= min && price <= max;

      return matchesSearch && matchesBrand && matchesYear && matchesCategory && matchesPrice;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBrand = '';
    this.selectedYear = '';
    this.selectedCategory = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.filterMotorcycles();
  }

  viewMotorcycleDetails(motorcycleId: number): void {
    this.router.navigate(['/motorcycle', motorcycleId]);
  }

  getCategoryLabel(value: string): string {
    const option = this.categoryOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  // Format number without using pipe
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
