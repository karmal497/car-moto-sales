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
import { ImageUrlPipe } from '../../pipes/image-url.pipe'; // NUEVO

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
    MatNativeDateModule,
    ImageUrlPipe // NUEVO
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
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    this.isLoading = true;
    this.apiService.getDiscounts().subscribe({
      next: (response: any) => {
        console.log('💰 DISCOUNTS DATA:', response);
        this.discounts = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading discounts:', error);
        this.snackBar.open('Error al cargar los descuentos', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadAvailableVehicles(): void {
    this.apiService.getAvailableCarsForDiscount().subscribe({
      next: (response: any) => {
        this.cars = response;
      },
      error: (error) => {
        console.error('Error loading available cars for discount:', error);
        this.snackBar.open('Error al cargar los autos disponibles', 'Cerrar', { duration: 3000 });
      }
    });

    this.apiService.getAvailableMotorcyclesForDiscount().subscribe({
      next: (response: any) => {
        this.motorcycles = response;
      },
      error: (error) => {
        console.error('Error loading available motorcycles for discount:', error);
        this.snackBar.open('Error al cargar las motos disponibles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openSelectionPanel(): void {
    this.loadAvailableVehicles();
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

      const discountPromises: any[] = [];

      this.selectedCars.forEach(car => {
        const discountData = {
          car: car.id,
          vehicle_type: 'car',
          discount_percentage: discountPercentage,
          start_date: formValue.start_date,
          end_date: formValue.end_date,
          title: `${car.brand} ${car.model} (${car.year})`,
          original_price: car.price,
          image_url: car.image_url
        };

        discountPromises.push(
          this.apiService.createDiscount(discountData).toPromise()
        );
      });

      this.selectedMotorcycles.forEach(motorcycle => {
        const discountData = {
          motorcycle: motorcycle.id,
          vehicle_type: 'motorcycle',
          discount_percentage: discountPercentage,
          start_date: formValue.start_date,
          end_date: formValue.end_date,
          title: `${motorcycle.brand} ${motorcycle.model} (${motorcycle.year})`,
          original_price: motorcycle.price,
          image_url: motorcycle.image_url
        };

        discountPromises.push(
          this.apiService.createDiscount(discountData).toPromise()
        );
      });

      Promise.all(discountPromises)
        .then(() => {
          this.showDiscountPanel = false;
          this.selectedCars = [];
          this.selectedMotorcycles = [];
          this.snackBar.open('Descuentos aplicados correctamente', 'Cerrar', { duration: 3000 });
          this.loadDiscounts();
        })
        .catch(error => {
          console.error('Error applying discounts:', error);
          this.snackBar.open('Error al aplicar los descuentos', 'Cerrar', { duration: 3000 });
        });
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
        this.apiService.deleteDiscount(discount.id).subscribe({
          next: () => {
            this.snackBar.open('Descuento eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.loadDiscounts();
          },
          error: (error) => {
            console.error('Error deleting discount:', error);
            this.snackBar.open('Error al eliminar el descuento', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  isCarSelected(car: any): boolean {
    return this.selectedCars.some(c => c.id === car.id);
  }

  isMotorcycleSelected(motorcycle: any): boolean {
    return this.selectedMotorcycles.some(m => m.id === motorcycle.id);
  }

  // Método para manejar errores de imagen
  onImageError(event: any): void {
    console.error('❌ Image failed to load:', event.target.src);
    event.target.src = 'assets/images/no-image.jpg';
    event.target.alt = 'Imagen no disponible';
  }
}
