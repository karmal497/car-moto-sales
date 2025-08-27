import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CarsComponent } from './components/cars/cars.component';
import { MotorcyclesComponent } from './components/motorcycles/motorcycles.component';
import { ClientsComponent } from './components/clients/clients.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { FeaturedComponent } from './components/featured/featured.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { MotorcycleFormComponent } from './components/motorcycle-form/motorcycle-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'cars', component: CarsComponent },
      { path: 'cars/new', component: CarFormComponent },
      { path: 'cars/edit/:id', component: CarFormComponent },
      { path: 'motorcycles', component: MotorcyclesComponent },
      { path: 'motorcycles/new', component: MotorcycleFormComponent },
      { path: 'motorcycles/edit/:id', component: MotorcycleFormComponent },
      { path: 'clients', component: ClientsComponent }, // Solo una ruta para clients
      { path: 'marketing/discounts', component: DiscountsComponent }, // Ruta específica para descuentos
      { path: 'marketing/featured', component: FeaturedComponent }, // Ruta específica para destacados
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
