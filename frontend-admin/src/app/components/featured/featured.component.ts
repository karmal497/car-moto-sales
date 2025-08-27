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
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    // Cargar datos de ejemplo
    setTimeout(() => {
      this.featuredItems = [
        {
          id: 1,
          title: 'Audi A4 2022',
          type: 'Auto',
          image_url: 'assets/images/audi-a4.jpg',
          price: 45000
        },
        {
          id: 2,
          title: 'Honda CB500',
          type: 'Moto',
          image_url: 'assets/images/honda-cb500.jpg',
          price: 7500
        }
      ];

      // Simular carga de vehículos
      this.cars = [
        { id: 1, title: 'Audi A4 2022', price: 45000, image_url: 'assets/images/audi-a4.jpg' },
        { id: 2, title: 'BMW X5 2023', price: 65000, image_url: 'assets/images/bmw-x5.jpg' },
        { id: 3, title: 'Mercedes C-Class', price: 48000, image_url: 'assets/images/mercedes-c.jpg' }
      ];

      this.motorcycles = [
        { id: 1, title: 'Honda CB500', price: 7500, image_url: 'assets/images/honda-cb500.jpg' },
        { id: 2, title: 'Yamaha MT-07', price: 8200, image_url: 'assets/images/yamaha-mt07.jpg' },
        { id: 3, title: 'Kawasaki Ninja 400', price: 6800, image_url: 'assets/images/kawasaki-ninja400.jpg' }
      ];

      this.isLoading = false;
    }, 1000);
  }

  openSelectionPanel(): void {
    this.showSelectionPanel = true;
  }

  closeSelectionPanel(): void {
    this.showSelectionPanel = false;
  }

  addCarToFeatured(car: any): void {
    if (!this.featuredItems.some(item => item.id === car.id && item.type === 'Auto')) {
      this.featuredItems.push({
        ...car,
        type: 'Auto'
      });
      this.snackBar.open('Auto agregado a destacados', 'Cerrar', { duration: 3000 });
    } else {
      this.snackBar.open('Este auto ya está en destacados', 'Cerrar', { duration: 3000 });
    }
  }

  addMotorcycleToFeatured(motorcycle: any): void {
    if (!this.featuredItems.some(item => item.id === motorcycle.id && item.type === 'Moto')) {
      this.featuredItems.push({
        ...motorcycle,
        type: 'Moto'
      });
      this.snackBar.open('Moto agregada a destacados', 'Cerrar', { duration: 3000 });
    } else {
      this.snackBar.open('Esta moto ya está en destacados', 'Cerrar', { duration: 3000 });
    }
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
        this.featuredItems = this.featuredItems.filter(i => i.id !== item.id || i.type !== item.type);
        this.snackBar.open('Elemento eliminado de destacados', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
