import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    CommonModule,
    MatSnackBarModule
  ]
})
export class CarFormComponent implements OnInit {
  carForm: FormGroup;
  isEdit = false;
  isLoading = false;
  carId: number | null = null;
  maxYear = new Date().getFullYear() + 1;

  transmissionOptions = [
    { value: 'automatic', label: 'Automática' },
    { value: 'manual', label: 'Manual' },
    { value: 'semi-automatic', label: 'Semi-Automática' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.carForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.maxYear)]],
      color: ['', [Validators.required]],
      engine: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      fuel_type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [null],
      is_sold: [false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carId = parseInt(id, 10);
      this.isEdit = true;
      this.loadCarData(this.carId);
    }
  }

  loadCarData(id: number): void {
    this.isLoading = true;
    this.apiService.getCarById(id).subscribe({
      next: (car: any) => {
        this.carForm.patchValue(car);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading car:', error);
        this.snackBar.open('Error al cargar los datos del auto', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        this.snackBar.open('Por favor selecciona solo imágenes', 'Cerrar', { duration: 3000 });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('La imagen no debe exceder los 5MB', 'Cerrar', { duration: 3000 });
        return;
      }

      this.carForm.patchValue({ image: file });
      this.carForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      Object.keys(this.carForm.controls).forEach(key => {
        const value = this.carForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const request = this.isEdit && this.carId
        ? this.apiService.updateCar(this.carId, formData)
        : this.apiService.createCar(formData);

      request.subscribe({
        next: (response: any) => {
          this.snackBar.open(
            `Auto ${this.isEdit ? 'actualizado' : 'creado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.router.navigate(['/cars']);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error saving car:', error);
          this.snackBar.open(
            `Error al ${this.isEdit ? 'actualizar' : 'crear'} el auto`,
            'Cerrar',
            { duration: 3000 }
          );
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.carForm.controls).forEach(key => {
        this.carForm.get(key)?.markAsTouched();
      });
    }
  }
}
