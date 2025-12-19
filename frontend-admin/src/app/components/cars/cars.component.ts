import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ImageUrlPipe
  ]
})
export class CarsComponent implements OnInit {
  cars: any[] = [];
  displayedColumns: string[] = ['image', 'title', 'brand', 'year', 'price', 'status', 'actions'];
  isLoading = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.apiService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.isLoading = false;
      }
    });
  }

  deleteCar(car: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el auto "${car.title}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteCar(car.id).subscribe({
          next: () => {
            this.cars = this.cars.filter(c => c.id !== car.id);
          },
          error: (error) => {
            console.error('Error deleting car:', error);
          }
        });
      }
    });
  }
}
