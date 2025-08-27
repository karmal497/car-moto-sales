import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule
  ]
})
export class SettingsComponent implements OnInit {
  generalForm: FormGroup;
  appearanceForm: FormGroup;
  notificationsForm: FormGroup;
  securityForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    this.generalForm = this.fb.group({
      companyName: ['KARMALITE Motors', Validators.required],
      email: ['info@karmalite.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567', Validators.required],
      address: ['123 Automotive Ave, Detroit, MI', Validators.required],
      currency: ['USD', Validators.required],
      timezone: ['America/New_York', Validators.required]
    });

    this.appearanceForm = this.fb.group({
      theme: ['dark', Validators.required],
      primaryColor: ['#ff7700', Validators.required],
      secondaryColor: ['#ffd700', Validators.required],
      font: ['Roboto', Validators.required],
      logo: ['']
    });

    this.notificationsForm = this.fb.group({
      emailNotifications: [true],
      salesNotifications: [true],
      inventoryNotifications: [true],
      marketingNotifications: [true],
      securityNotifications: [true]
    });

    this.securityForm = this.fb.group({
      twoFactorAuth: [false],
      sessionTimeout: [30, [Validators.min(5), Validators.max(120)]],
      passwordExpiry: [90, [Validators.min(30), Validators.max(365)]],
      loginAttempts: [5, [Validators.min(3), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // En una aplicación real, cargaríamos estos valores desde la API
    console.log('Cargando configuraciones...');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadLogo(): void {
    if (this.selectedFile) {
      // Simular subida de archivo
      setTimeout(() => {
        this.snackBar.open('Logo actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.selectedFile = null;
      }, 1000);
    }
  }

  saveGeneralSettings(): void {
    if (this.generalForm.valid) {
      // this.apiService.updateSettings(this.generalForm.value).subscribe({
      //   next: () => {
          this.snackBar.open('Configuración general guardada', 'Cerrar', { duration: 3000 });
      //   },
      //   error: (error: any) => {
      //     console.error('Error guardando configuración:', error);
      //     this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
      //   }
      // });
    }
  }

  saveAppearanceSettings(): void {
    if (this.appearanceForm.valid) {
      // this.apiService.updateSettings(this.appearanceForm.value).subscribe({
      //   next: () => {
          this.snackBar.open('Configuración de apariencia guardada', 'Cerrar', { duration: 3000 });
      //   },
      //   error: (error: any) => {
      //     console.error('Error guardando configuración:', error);
      //     this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
      //   }
      // });
    }
  }

  saveNotificationSettings(): void {
    if (this.notificationsForm.valid) {
      // this.apiService.updateSettings(this.notificationsForm.value).subscribe({
      //   next: () => {
          this.snackBar.open('Configuración de notificaciones guardada', 'Cerrar', { duration: 3000 });
      //   },
      //   error: (error: any) => {
      //     console.error('Error guardando configuración:', error);
      //     this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
      //   }
      // });
    }
  }

  saveSecuritySettings(): void {
    if (this.securityForm.valid) {
      // this.apiService.updateSettings(this.securityForm.value).subscribe({
      //   next: () => {
          this.snackBar.open('Configuración de seguridad guardada', 'Cerrar', { duration: 3000 });
      //   },
      //   error: (error: any) => {
      //     console.error('Error guardando configuración:', error);
      //     this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
      //   }
      // });
    }
  }

  resetSettings(): void {
    if (confirm('¿Estás seguro de que quieres restablecer todas las configuraciones a sus valores predeterminados?')) {
      this.generalForm.reset({
        companyName: 'KARMALITE Motors',
        email: 'info@karmalite.com',
        phone: '+1 (555) 123-4567',
        address: '123 Automotive Ave, Detroit, MI',
        currency: 'USD',
        timezone: 'America/New_York'
      });

      this.appearanceForm.reset({
        theme: 'dark',
        primaryColor: '#ff7700',
        secondaryColor: '#ffd700',
        font: 'Roboto',
        logo: ''
      });

      this.notificationsForm.reset({
        emailNotifications: true,
        salesNotifications: true,
        inventoryNotifications: true,
        marketingNotifications: true,
        securityNotifications: true
      });

      this.securityForm.reset({
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5
      });

      this.previewUrl = null;
      this.selectedFile = null;

      this.snackBar.open('Configuraciones restablecidas', 'Cerrar', { duration: 3000 });
    }
  }
}
