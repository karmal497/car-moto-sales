import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    // Para FormData, no establecemos Content-Type, el navegador lo hará automáticamente
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Cars
  getCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/`, { headers: this.getHeaders() });
  }

  getCar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/${id}/`, { headers: this.getHeaders() });
  }

  createCar(car: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cars/`, car, { headers: this.getFormDataHeaders() });
  }

  updateCar(id: number, car: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cars/${id}/`, car, { headers: this.getFormDataHeaders() });
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cars/${id}/`, { headers: this.getHeaders() });
  }

  // Motorcycles
  getMotorcycles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/motorcycles/`, { headers: this.getHeaders() });
  }

  getMotorcycle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/motorcycles/${id}/`, { headers: this.getHeaders() });
  }

  createMotorcycle(motorcycle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/motorcycles/`, motorcycle, { headers: this.getFormDataHeaders() });
  }

  updateMotorcycle(id: number, motorcycle: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/motorcycles/${id}/`, motorcycle, { headers: this.getFormDataHeaders() });
  }

  deleteMotorcycle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/motorcycles/${id}/`, { headers: this.getHeaders() });
  }

  // Users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/`, { headers: this.getHeaders() });
  }

  // Sales
  getSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales/`, { headers: this.getHeaders() });
  }

  createSale(sale: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales/`, sale, { headers: this.getHeaders() });
  }

  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cars/${id}/`);
  }

  getMotorcycleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/motorcycles/${id}/`);
  }

  // Settings
  updateSettings(settings: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/settings/`, settings, { headers: this.getHeaders() });
  }

  // Contact Messages
  getContactMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contact-messages/`, { headers: this.getHeaders() });
  }

  updateContactMessage(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/contact-messages/${id}/`, data, { headers: this.getHeaders() });
  }

  deleteContactMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contact-messages/${id}/`, { headers: this.getHeaders() });
  }

  // Subscribers
  getSubscribers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subscribers/`, { headers: this.getHeaders() });
  }

  deleteSubscriber(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subscribers/${id}/`, { headers: this.getHeaders() });
  }

  // Featured Items
  getFeaturedItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/featured/`, { headers: this.getHeaders() });
  }

  createFeaturedItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/featured/`, item, { headers: this.getHeaders() });
  }

  deleteFeaturedItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/featured/${id}/`, { headers: this.getHeaders() });
  }

  getAvailableCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-cars/`, { headers: this.getHeaders() });
  }

  getAvailableMotorcycles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-motorcycles/`, { headers: this.getHeaders() });
  }

  // Discounts
  getDiscounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/discounts/`, { headers: this.getHeaders() });
  }

  createDiscount(discount: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/discounts/`, discount, { headers: this.getHeaders() });
  }

  deleteDiscount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/discounts/${id}/`, { headers: this.getHeaders() });
  }

  getAvailableCarsForDiscount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-cars-discount/`, { headers: this.getHeaders() });
  }

  getAvailableMotorcyclesForDiscount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-motorcycles-discount/`, { headers: this.getHeaders() });
  }
}
