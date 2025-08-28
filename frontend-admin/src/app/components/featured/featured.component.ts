import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ]
})
export class FeaturedComponent implements OnInit {
  featuredItems: any[] = [];
  cars: any[] = [];
  motorcycles: any[] = [];
  showSelectionPanel = false;
  isLoading = true;

  displayedColumns: string[] = ['image', 'title', 'type', 'price', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  loadFeaturedItems(): void {
    this.isLoading = true;
    this.apiService.getFeaturedItems().subscribe({
      next: (response: any) => {
        console.log('Featured items response:', response); // DEBUG
        // Usar los datos directamente del backend (ya vienen formateados)
        this.featuredItems = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured items:', error);
        this.snackBar.open('Error al cargar los destacados', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadAvailableVehicles(): void {
    this.apiService.getAvailableCars().subscribe({
      next: (response: any) => {
        console.log('Available cars:', response); // DEBUG
        // Usar los datos directamente del backend
        this.cars = response;
      },
      error: (error) => {
        console.error('Error loading available cars:', error);
        this.snackBar.open('Error al cargar los autos disponibles', 'Cerrar', { duration: 3000 });
      }
    });

    this.apiService.getAvailableMotorcycles().subscribe({
      next: (response: any) => {
        console.log('Available motorcycles:', response); // DEBUG
        // Usar los datos directamente del backend
        this.motorcycles = response;
      },
      error: (error) => {
        console.error('Error loading available motorcycles:', error);
        this.snackBar.open('Error al cargar las motos disponibles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openSelectionPanel(): void {
    this.loadAvailableVehicles();
    this.showSelectionPanel = true;
  }

  closeSelectionPanel(): void {
    this.showSelectionPanel = false;
  }

  addCarToFeatured(car: any): void {
    const featuredItem = {
      car: car.id,
      vehicle_type: 'car'
    };

    this.apiService.createFeaturedItem(featuredItem).subscribe({
      next: (response: any) => {
        console.log('Car added to featured:', response); // DEBUG
        this.snackBar.open('Auto agregado a destacados', 'Cerrar', { duration: 3000 });
        this.loadFeaturedItems();
        this.closeSelectionPanel();
      },
      error: (error) => {
        console.error('Error adding car to featured:', error);
        if (error.status === 400) {
          this.snackBar.open('Este auto ya está en destacados', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open('Error al agregar el auto a destacados', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  addMotorcycleToFeatured(motorcycle: any): void {
    const featuredItem = {
      motorcycle: motorcycle.id,
      vehicle_type: 'motorcycle'
    };

    this.apiService.createFeaturedItem(featuredItem).subscribe({
      next: (response: any) => {
        console.log('Motorcycle added to featured:', response); // DEBUG
        this.snackBar.open('Moto agregada a destacados', 'Cerrar', { duration: 3000 });
        this.loadFeaturedItems();
        this.closeSelectionPanel();
      },
      error: (error) => {
        console.error('Error adding motorcycle to featured:', error);
        if (error.status === 400) {
          this.snackBar.open('Esta moto ya está en destacados', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open('Error al agregar la moto a destacados', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  removeFeaturedItem(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar "${item.title}" de destacados?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteFeaturedItem(item.id).subscribe({
          next: () => {
            this.snackBar.open('Elemento eliminado de destacados', 'Cerrar', { duration: 3000 });
            this.loadFeaturedItems();
          },
          error: (error) => {
            console.error('Error removing featured item:', error);
            this.snackBar.open('Error al eliminar el elemento de destacados', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}
