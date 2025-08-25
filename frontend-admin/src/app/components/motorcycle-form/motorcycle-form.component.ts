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
  selector: 'app-motorcycle-form',
  templateUrl: './motorcycle-form.component.html',
  styleUrls: ['./motorcycle-form.component.css'],
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
export class MotorcycleFormComponent implements OnInit {
  motorcycleForm: FormGroup;
  isEdit = false;
  isLoading = false;
  motorcycleId: number | null = null;
  maxYear = new Date().getFullYear() + 1;

  // CATEGORÍAS CORREGIDAS según el backend
  categoryOptions = [
    { value: 'combustion', label: 'Combustión' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'automatic', label: 'Automática' },
    { value: 'semi_automatic', label: 'Semiautomática' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.motorcycleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.maxYear)]],
      color: ['', [Validators.required]],
      engine: ['', [Validators.required]],
      category: ['', [Validators.required]],
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
      this.motorcycleId = parseInt(id, 10);
      this.isEdit = true;
      this.loadMotorcycleData(this.motorcycleId);
    }
  }

  loadMotorcycleData(id: number): void {
    this.isLoading = true;
    this.apiService.getMotorcycleById(id).subscribe({
      next: (motorcycle: any) => {
        this.motorcycleForm.patchValue(motorcycle);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading motorcycle:', error);
        this.snackBar.open('Error al cargar los datos de la moto', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        this.snackBar.open('Por favor selecciona solo imágenes', 'Cerrar', { duration: 3000 });
        return;
      }

      // Validar tamaño de archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('La imagen no debe exceder los 5MB', 'Cerrar', { duration: 3000 });
        return;
      }

      this.motorcycleForm.patchValue({ image: file });
      this.motorcycleForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.motorcycleForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      Object.keys(this.motorcycleForm.controls).forEach(key => {
        const value = this.motorcycleForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const request = this.isEdit && this.motorcycleId
        ? this.apiService.updateMotorcycle(this.motorcycleId, formData)
        : this.apiService.createMotorcycle(formData);

      request.subscribe({
        next: (response: any) => {
          this.snackBar.open(
            `Moto ${this.isEdit ? 'actualizada' : 'creada'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.router.navigate(['/motorcycles']);
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error saving motorcycle:', error);
          this.snackBar.open(
            `Error al ${this.isEdit ? 'actualizar' : 'crear'} la moto: ${error.error?.detail || error.message}`,
            'Cerrar',
            { duration: 5000 }
          );
          this.isLoading = false;
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.motorcycleForm.controls).forEach(key => {
        this.motorcycleForm.get(key)?.markAsTouched();
      });
    }
  }
}
