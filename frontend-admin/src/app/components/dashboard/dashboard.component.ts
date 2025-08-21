// components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalCars: 0,
    totalMotorcycles: 0,
    soldCars: 0,
    soldMotorcycles: 0
  };

  recentCars: any[] = [];
  recentMotorcycles: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentVehicles();
  }

  loadStats(): void {
    this.apiService.getCars().subscribe({
      next: (cars) => {
        this.stats.totalCars = cars.length;
        this.stats.soldCars = cars.filter((car: any) => car.is_sold).length;
      }
    });

    this.apiService.getMotorcycles().subscribe({
      next: (motorcycles) => {
        this.stats.totalMotorcycles = motorcycles.length;
        this.stats.soldMotorcycles = motorcycles.filter((moto: any) => moto.is_sold).length;
      }
    });
  }

  loadRecentVehicles(): void {
    this.apiService.getCars().subscribe({
      next: (cars) => {
        this.recentCars = cars.slice(0, 5);
      }
    });

    this.apiService.getMotorcycles().subscribe({
      next: (motorcycles) => {
        this.recentMotorcycles = motorcycles.slice(0, 5);
      }
    });
  }
}
