import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-motorcycles',
  templateUrl: './motorcycles.component.html',
  styleUrls: ['./motorcycles.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ImageUrlPipe
  ]
})
export class MotorcyclesComponent implements OnInit {
  motorcycles: any[] = [];
  displayedColumns: string[] = ['image', 'title', 'brand', 'year', 'price', 'status', 'actions'];
  isLoading = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMotorcycles();
  }

  loadMotorcycles(): void {
    this.isLoading = true;
    this.apiService.getMotorcycles().subscribe({
      next: (motorcycles) => {
        console.log('🏍️ MOTORCYCLES DATA FROM API:', motorcycles);

        if (motorcycles && motorcycles.length > 0) {
          console.log('🔍 First motorcycle:', motorcycles[0]);
          console.log('🖼️ First image_url:', motorcycles[0].image_url);
        }

        this.motorcycles = motorcycles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading motorcycles:', error);
        this.isLoading = false;
      }
    });
  }

  deleteMotorcycle(motorcycle: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar la moto "${motorcycle.title}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteMotorcycle(motorcycle.id).subscribe({
          next: () => {
            this.motorcycles = this.motorcycles.filter(m => m.id !== motorcycle.id);
          },
          error: (error) => {
            console.error('Error deleting motorcycle:', error);
          }
        });
      }
    });
  }

  // Método para manejar errores de imagen
  onImageError(event: any): void {
    console.error('❌ Image failed to load:', event.target.src);
    event.target.src = 'assets/images/no-image.jpg';
    event.target.alt = 'Imagen no disponible';
  }
}
