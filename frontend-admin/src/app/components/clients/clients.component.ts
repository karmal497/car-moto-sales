import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatBadgeModule,
    MatSnackBarModule
  ]
})
export class ClientsComponent implements OnInit {
  messages: any[] = [];
  users: any[] = [];
  subscribers: any[] = [];

  displayedMessagesColumns: string[] = ['name', 'email', 'phone', 'message', 'date', 'actions'];
  displayedUsersColumns: string[] = ['username', 'email', 'registration_date', 'status', 'actions'];
  displayedSubscribersColumns: string[] = ['email', 'subscription_date', 'actions'];

  isLoading = true;
  selectedTabIndex = 0;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Simulando carga de datos - en una aplicación real, estos vendrían de endpoints API
    setTimeout(() => {
      // Datos de ejemplo para mensajes
      this.messages = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '1234567890', message: 'Me interesa el Audi A4, ¿tienen disponible?', date: '2023-10-15' },
        { id: 2, name: 'María García', email: 'maria@example.com', phone: '0987654321', message: 'Quiero información sobre financiamiento para la Honda CB500', date: '2023-10-14' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '5551234567', message: '¿Tienen servicio de mantenimiento para BMW?', date: '2023-10-13' }
      ];

      // Datos de ejemplo para usuarios
      this.users = [
        { id: 1, username: 'juanperez', email: 'juan@example.com', registration_date: '2023-09-01', status: 'Activo' },
        { id: 2, username: 'mariagarcia', email: 'maria@example.com', registration_date: '2023-08-15', status: 'Activo' },
        { id: 3, username: 'carloslopez', email: 'carlos@example.com', registration_date: '2023-10-05', status: 'Inactivo' }
      ];

      // Datos de ejemplo para suscriptores
      this.subscribers = [
        { id: 1, email: 'suscriptor1@example.com', subscription_date: '2023-10-10' },
        { id: 2, email: 'suscriptor2@example.com', subscription_date: '2023-10-08' },
        { id: 3, email: 'suscriptor3@example.com', subscription_date: '2023-10-05' }
      ];

      this.isLoading = false;
    }, 1000);
  }

  deleteMessage(message: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el mensaje de ${message.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messages = this.messages.filter(m => m.id !== message.id);
        this.snackBar.open('Mensaje eliminado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteUser(user: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar al usuario ${user.username}? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteSubscriber(subscriber: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar al suscriptor ${subscriber.email}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subscribers = this.subscribers.filter(s => s.id !== subscriber.id);
        this.snackBar.open('Suscriptor eliminado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  markAsRead(message: any): void {
    // Lógica para marcar mensaje como leído
    this.snackBar.open('Mensaje marcado como leído', 'Cerrar', { duration: 2000 });
  }

  exportData(): void {
    // Lógica para exportar datos
    this.snackBar.open('Datos exportados correctamente', 'Cerrar', { duration: 3000 });
  }
}
