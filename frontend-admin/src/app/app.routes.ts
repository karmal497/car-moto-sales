import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { CarsComponent } from './components/cars/cars.component';
import { MotorcyclesComponent } from './components/motorcycles/motorcycles.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { MotorcycleFormComponent } from './components/motorcycle-form/motorcycle-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/splash', pathMatch: 'full' },
  { path: 'splash', component: SplashScreenComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'cars', component: CarsComponent },
      { path: 'cars/new', component: CarFormComponent },
      { path: 'cars/edit/:id', component: CarFormComponent },
      { path: 'motorcycles', component: MotorcyclesComponent },
      { path: 'motorcycles/new', component: MotorcycleFormComponent },
      { path: 'motorcycles/edit/:id', component: MotorcycleFormComponent },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
