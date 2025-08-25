import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CarsComponent } from './components/cars/cars.component';
import { MotorcyclesComponent } from './components/motorcycles/motorcycles.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { MotorcycleFormComponent } from './components/motorcycle-form/motorcycle-form.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'cars', component: CarsComponent, canActivate: [AuthGuard] },
  { path: 'cars/new', component: CarFormComponent, canActivate: [AuthGuard] },
  { path: 'cars/edit/:id', component: CarFormComponent, canActivate: [AuthGuard] },
  { path: 'motorcycles', component: MotorcyclesComponent, canActivate: [AuthGuard] },
  { path: 'motorcycles/new', component: MotorcycleFormComponent, canActivate: [AuthGuard] },
  { path: 'motorcycles/edit/:id', component: MotorcycleFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
