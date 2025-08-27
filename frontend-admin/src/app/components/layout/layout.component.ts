import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule
  ]
})
export class LayoutComponent {
  isSidenavOpen = true;
  marketingMenuOpen = false;

  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Autos', icon: 'directions_car', route: '/cars' },
    { name: 'Motos', icon: 'two_wheeler', route: '/motorcycles' },
    { name: 'Clientes', icon: 'people', route: '/clients' },
    {
      name: 'Marketing',
      icon: 'campaign',
      children: [
        { name: 'Destacados', route: '/marketing/featured' },
        { name: 'Descuentos', route: '/marketing/discounts' }
      ]
    },
    { name: 'Configuraciones', icon: 'settings', route: '/settings' }
  ];

  constructor(private authService: AuthService) {}

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  toggleMarketingMenu(): void {
    this.marketingMenuOpen = !this.marketingMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
