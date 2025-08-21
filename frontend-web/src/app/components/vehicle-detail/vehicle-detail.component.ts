import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from '../../services/api.service';

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
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  vehicle: any = null;
  isLoading = true;
  isCar = true;
  similarVehicles: any[] = [];
  activeImageIndex = 0;
  vehicleImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const vehicleId = params.get('id');
      const routePath = this.router.url;

      if (routePath.includes('/car/')) {
        this.isCar = true;
        this.loadCar(Number(vehicleId));
      } else if (routePath.includes('/motorcycle/')) {
        this.isCar = false;
        this.loadMotorcycle(Number(vehicleId));
      }
    });
  }

  loadCar(carId: number): void {
    this.isLoading = true;
    this.apiService.getCar(carId).subscribe({
      next: (car: Car) => {
        this.vehicle = car;
        this.vehicle.type = 'car';
        this.vehicleImages = [car.image_url || 'assets/images/car-placeholder.jpg'];
        this.loadSimilarCars(car.brand, car.model, carId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading car:', error);
        this.isLoading = false;
      }
    });
  }

  loadMotorcycle(motorcycleId: number): void {
    this.isLoading = true;
    this.apiService.getMotorcycle(motorcycleId).subscribe({
      next: (motorcycle: Motorcycle) => {
        this.vehicle = motorcycle;
        this.vehicle.type = 'motorcycle';
        this.vehicleImages = [motorcycle.image_url || 'assets/images/motorcycle-placeholder.jpg'];
        this.loadSimilarMotorcycles(motorcycle.brand, motorcycle.model, motorcycleId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading motorcycle:', error);
        this.isLoading = false;
      }
    });
  }

  loadSimilarCars(brand: string, model: string, excludeId: number): void {
    this.apiService.getCars().subscribe({
      next: (cars: Car[]) => {
        this.similarVehicles = cars
          .filter(car => car.id !== excludeId && (car.brand === brand || car.model === model))
          .slice(0, 3)
          .map(car => ({ ...car, type: 'car' }));
      },
      error: (error) => {
        console.error('Error loading similar cars:', error);
      }
    });
  }

  loadSimilarMotorcycles(brand: string, model: string, excludeId: number): void {
    this.apiService.getMotorcycles().subscribe({
      next: (motorcycles: Motorcycle[]) => {
        this.similarVehicles = motorcycles
          .filter(motorcycle => motorcycle.id !== excludeId && (motorcycle.brand === brand || motorcycle.model === model))
          .slice(0, 3)
          .map(motorcycle => ({ ...motorcycle, type: 'motorcycle' }));
      },
      error: (error) => {
        console.error('Error loading similar motorcycles:', error);
      }
    });
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

  viewSimilarVehicle(vehicle: any): void {
    if (vehicle.type === 'car') {
      this.router.navigate(['/car', vehicle.id]);
    } else {
      this.router.navigate(['/motorcycle', vehicle.id]);
    }
    // Scroll to top
    window.scrollTo(0, 0);
  }

  contactSeller(): void {
    alert('Función de contacto con el vendedor próximamente disponible');
  }
}
