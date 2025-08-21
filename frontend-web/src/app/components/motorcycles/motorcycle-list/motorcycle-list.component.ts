// motorcycle-list.component.ts
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

  // Array of real motorcycle images from Unsplash
  motorcycleImages: string[] = [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1623778027840-c03bbc958d72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80',
    'https://images.unsplash.com/photo-1601579532577-012b3b8d1c1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1571068316341-9d9dee0d7d34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1564396797663-e6c02d27a05a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1564396797663-e6c02d27a05a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1632889719793-537a19c94aca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1632889719793-537a19c94aca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  ];

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
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading motorcycles:', error);
          this.isLoading = false;
        }
      });
  }

  filterMotorcycles(): void {
    if (!this.searchTerm) {
      this.filteredMotorcycles = this.motorcycles;
      return;
    }

    this.filteredMotorcycles = this.motorcycles.filter(motorcycle => {
      const searchTerm = this.searchTerm.toLowerCase();
      return (
        motorcycle.brand.toLowerCase().includes(searchTerm) ||
        motorcycle.model.toLowerCase().includes(searchTerm) ||
        motorcycle.year.toString().includes(searchTerm) ||
        motorcycle.color.toLowerCase().includes(searchTerm) ||
        motorcycle.fuel_type.toLowerCase().includes(searchTerm) ||
        motorcycle.category.toLowerCase().includes(searchTerm)
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredMotorcycles = this.motorcycles;
  }

  viewMotorcycleDetails(motorcycleId: number): void {
    this.router.navigate(['/motorcycle', motorcycleId]);
  }

  getCategoryLabel(value: string): string {
    const option = this.categoryOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  // Get a random motorcycle image from our collection
  getRandomMotorcycleImage(): string {
    const randomIndex = Math.floor(Math.random() * this.motorcycleImages.length);
    return this.motorcycleImages[randomIndex];
  }

  // Format number without using pipe
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
