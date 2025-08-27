import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule
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

    // Cargar mensajes de contacto
    this.apiService.getContactMessages().subscribe({
      next: (messages: any[]) => {
        this.messages = messages.map(message => ({
          id: message.id,
          name: message.name,
          email: message.email,
          phone: message.phone,
          message: message.message,
          date: new Date(message.date).toLocaleDateString('es-ES'),
          is_read: message.is_read
        }));
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.snackBar.open('Error al cargar mensajes', 'Cerrar', { duration: 3000 });
      }
    });

    // Cargar usuarios
    this.apiService.getUsers().subscribe({
      next: (users: any[]) => {
        this.users = users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          registration_date: new Date(user.date_joined).toLocaleDateString('es-ES'),
          status: user.is_active ? 'Activo' : 'Inactivo'
        }));
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });

    // Cargar suscriptores
    this.apiService.getSubscribers().subscribe({
      next: (subscribers: any[]) => {
        this.subscribers = subscribers.map(subscriber => ({
          id: subscriber.id,
          email: subscriber.email,
          subscription_date: new Date(subscriber.subscription_date).toLocaleDateString('es-ES'),
          is_active: subscriber.is_active
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar suscriptores:', error);
        this.snackBar.open('Error al cargar suscriptores', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
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
        this.apiService.deleteContactMessage(message.id).subscribe({
          next: () => {
            this.messages = this.messages.filter(m => m.id !== message.id);
            this.snackBar.open('Mensaje eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al eliminar mensaje:', error);
            this.snackBar.open('Error al eliminar mensaje', 'Cerrar', { duration: 3000 });
          }
        });
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
        // Nota: En una aplicación real, necesitarías un endpoint para eliminar usuarios
        this.snackBar.open('Funcionalidad de eliminación de usuarios no implementada', 'Cerrar', { duration: 3000 });
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
        this.apiService.deleteSubscriber(subscriber.id).subscribe({
          next: () => {
            this.subscribers = this.subscribers.filter(s => s.id !== subscriber.id);
            this.snackBar.open('Suscriptor eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al eliminar suscriptor:', error);
            this.snackBar.open('Error al eliminar suscriptor', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  markAsRead(message: any): void {
    this.apiService.updateContactMessage(message.id, { is_read: true }).subscribe({
      next: () => {
        message.is_read = true;
        this.snackBar.open('Mensaje marcado como leído', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error al marcar mensaje como leído:', error);
        this.snackBar.open('Error al marcar mensaje como leído', 'Cerrar', { duration: 3000 });
      }
    });
  }

  exportData(): void {
    // Lógica para exportar datos según la pestaña seleccionada
    switch (this.selectedTabIndex) {
      case 0: // Mensajes
        this.exportMessages();
        break;
      case 1: // Usuarios
        this.exportUsers();
        break;
      case 2: // Suscriptores
        this.exportSubscribers();
        break;
    }
  }

  private exportMessages(): void {
    const csvContent = this.convertToCSV(this.messages, ['name', 'email', 'phone', 'message', 'date']);
    this.downloadCSV(csvContent, 'mensajes_contacto.csv');
    this.snackBar.open('Mensajes exportados correctamente', 'Cerrar', { duration: 3000 });
  }

  private exportUsers(): void {
    const csvContent = this.convertToCSV(this.users, ['username', 'email', 'registration_date', 'status']);
    this.downloadCSV(csvContent, 'usuarios_registrados.csv');
    this.snackBar.open('Usuarios exportados correctamente', 'Cerrar', { duration: 3000 });
  }

  private exportSubscribers(): void {
    const csvContent = this.convertToCSV(this.subscribers, ['email', 'subscription_date']);
    this.downloadCSV(csvContent, 'suscriptores.csv');
    this.snackBar.open('Suscriptores exportados correctamente', 'Cerrar', { duration: 3000 });
  }

  private convertToCSV(data: any[], columns: string[]): string {
    const header = columns.join(',');
    const rows = data.map(item =>
      columns.map(column => `"${item[column]?.toString().replace(/"/g, '""') || ''}"`).join(',')
    );
    return [header, ...rows].join('\n');
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
