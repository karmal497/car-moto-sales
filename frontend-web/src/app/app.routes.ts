// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CarListComponent } from './components/cars/car-list/car-list.component';
import { MotorcycleListComponent } from './components/motorcycles/motorcycle-list/motorcycle-list.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { SearchComponent } from './components/search/search.component';
import { ContactComponent } from './components/contact/contact.component'; // Añadir esta importación

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cars', component: CarListComponent },
  { path: 'motorcycles', component: MotorcycleListComponent },
  { path: 'car/:id', component: VehicleDetailComponent },
  { path: 'motorcycle/:id', component: VehicleDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'contact', component: ContactComponent }, // Añadir esta ruta
  { path: '**', redirectTo: '' }
];
