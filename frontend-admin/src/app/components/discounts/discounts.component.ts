import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class DiscountsComponent implements OnInit {
  discounts: any[] = [];
  cars: any[] = [];
  motorcycles: any[] = [];
  selectedCars: any[] = [];
  selectedMotorcycles: any[] = [];
  showSelectionPanel = false;
  showDiscountPanel = false;
  discountForm: FormGroup;
  isLoading = true;

  displayedColumns: string[] = ['image', 'title', 'type', 'original_price', 'discount', 'new_price', 'duration', 'actions'];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.discountForm = this.fb.group({
      discount_percentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    // Cargar datos de ejemplo (en una app real, estos vendrían de la API)
    setTimeout(() => {
      this.discounts = [
        {
          id: 1,
          title: 'Audi A4 2022',
          type: 'Auto',
          image_url: 'assets/images/audi-a4.jpg',
          original_price: 45000,
          discount_percentage: 15,
          new_price: 38250,
          start_date: '2023-11-01',
          end_date: '2023-11-15'
        },
        {
          id: 2,
          title: 'Honda CB500',
          type: 'Moto',
          image_url: 'assets/images/honda-cb500.jpg',
          original_price: 7500,
          discount_percentage: 10,
          new_price: 6750,
          start_date: '2023-11-05',
          end_date: '2023-11-20'
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
    this.selectedCars = [];
    this.selectedMotorcycles = [];
  }

  closeSelectionPanel(): void {
    this.showSelectionPanel = false;
  }

  toggleCarSelection(car: any): void {
    const index = this.selectedCars.findIndex(c => c.id === car.id);
    if (index > -1) {
      this.selectedCars.splice(index, 1);
    } else if (this.selectedCars.length < 7) {
      this.selectedCars.push(car);
    } else {
      this.snackBar.open('Máximo 7 autos permitidos', 'Cerrar', { duration: 3000 });
    }
  }

  toggleMotorcycleSelection(motorcycle: any): void {
    const index = this.selectedMotorcycles.findIndex(m => m.id === motorcycle.id);
    if (index > -1) {
      this.selectedMotorcycles.splice(index, 1);
    } else if (this.selectedMotorcycles.length < 7) {
      this.selectedMotorcycles.push(motorcycle);
    } else {
      this.snackBar.open('Máximo 7 motos permitidas', 'Cerrar', { duration: 3000 });
    }
  }

  proceedToDiscount(): void {
    if (this.selectedCars.length === 0 && this.selectedMotorcycles.length === 0) {
      this.snackBar.open('Selecciona al menos un vehículo', 'Cerrar', { duration: 3000 });
      return;
    }

    this.showSelectionPanel = false;
    this.showDiscountPanel = true;
    this.discountForm.reset();
  }

  applyDiscount(): void {
    if (this.discountForm.valid) {
      const formValue = this.discountForm.value;
      const discountPercentage = formValue.discount_percentage;

      // Aplicar descuento a los vehículos seleccionados
      this.selectedCars.forEach(car => {
        const newPrice = car.price * (1 - discountPercentage / 100);
        this.discounts.push({
          ...car,
          type: 'Auto',
          original_price: car.price,
          discount_percentage: discountPercentage,
          new_price: newPrice,
          start_date: formValue.start_date,
          end_date: formValue.end_date
        });
      });

      this.selectedMotorcycles.forEach(motorcycle => {
        const newPrice = motorcycle.price * (1 - discountPercentage / 100);
        this.discounts.push({
          ...motorcycle,
          type: 'Moto',
          original_price: motorcycle.price,
          discount_percentage: discountPercentage,
          new_price: newPrice,
          start_date: formValue.start_date,
          end_date: formValue.end_date
        });
      });

      this.showDiscountPanel = false;
      this.selectedCars = [];
      this.selectedMotorcycles = [];
      this.snackBar.open('Descuentos aplicados correctamente', 'Cerrar', { duration: 3000 });
    }
  }

  deleteDiscount(discount: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el descuento de "${discount.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.discounts = this.discounts.filter(d => d.id !== discount.id);
        this.snackBar.open('Descuento eliminado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  isCarSelected(car: any): boolean {
  return this.selectedCars.some(c => c.id === car.id);
  }

  isMotorcycleSelected(motorcycle: any): boolean {
    return this.selectedMotorcycles.some(m => m.id === motorcycle.id);
  }
}
