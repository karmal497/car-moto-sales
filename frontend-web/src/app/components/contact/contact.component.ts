import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isLoading = false;
  contactMethods = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'phone', label: 'Llamada Telefónica' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      contactMethod: ['whatsapp', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;

      // Preparar datos para enviar (sin el campo contactMethod que no existe en el modelo)
      const formData = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        message: `Método de contacto preferido: ${this.contactForm.value.contactMethod}\n\nAsunto: ${this.contactForm.value.subject}\n\nMensaje: ${this.contactForm.value.message}`
      };

      // Enviar mensaje a la API
      this.apiService.createContactMessage(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.contactForm.reset({
            contactMethod: 'whatsapp'
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al enviar el mensaje:', error);
          this.snackBar.open('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  contactViaWhatsApp(): void {
    const phoneNumber = '55415814';
    const message = 'Hola, me gustaría obtener más información sobre sus vehículos.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get contactMethod() { return this.contactForm.get('contactMethod'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}
