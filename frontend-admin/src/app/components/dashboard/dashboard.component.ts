import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  stats = {
    totalCars: 0,
    totalMotorcycles: 0,
    soldCars: 0,
    soldMotorcycles: 0,
    totalClients: 0
  };

  recentCars: any[] = [];
  recentMotorcycles: any[] = [];
  chart: any;
  isLoading = true;

  constructor(private apiService: ApiService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentVehicles();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadStats(): void {
    this.apiService.getCars().subscribe({
      next: (cars) => {
        this.stats.totalCars = cars.length;
        this.stats.soldCars = cars.filter((car: any) => car.is_sold).length;
        this.createChart();
      },
      error: (error) => {
        console.error('Error loading cars:', error);
      }
    });

    this.apiService.getMotorcycles().subscribe({
      next: (motorcycles) => {
        this.stats.totalMotorcycles = motorcycles.length;
        this.stats.soldMotorcycles = motorcycles.filter((moto: any) => moto.is_sold).length;
        this.createChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading motorcycles:', error);
        this.isLoading = false;
      }
    });

    // Simular datos de clientes
    this.stats.totalClients = 42;
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

  createChart(): void {
    if (this.stats.totalCars > 0 || this.stats.totalMotorcycles > 0) {
      const ctx = document.getElementById('vehicleChart') as HTMLCanvasElement;

      if (!ctx) return;

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Autos Vendidos', 'Autos Disponibles', 'Motos Vendidas', 'Motos Disponibles'],
          datasets: [{
            data: [
              this.stats.soldCars,
              this.stats.totalCars - this.stats.soldCars,
              this.stats.soldMotorcycles,
              this.stats.totalMotorcycles - this.stats.soldMotorcycles
            ],
            backgroundColor: [
              '#FF7700',
              '#FFA357',
              '#333333',
              '#666666'
            ],
            borderWidth: 0,
            hoverOffset: 15
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
                font: {
                  family: 'Orbitron, sans-serif',
                  size: 12
                },
                padding: 20
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
  }
}
