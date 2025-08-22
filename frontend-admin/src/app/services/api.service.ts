import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/`, { headers: this.getHeaders() });
  }

  getCar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/${id}/`, { headers: this.getHeaders() });
  }

  createCar(carData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cars/`, carData, { headers: this.getHeaders() });
  }

  updateCar(id: number, carData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cars/${id}/`, carData, { headers: this.getHeaders() });
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cars/${id}/`, { headers: this.getHeaders() });
  }

  getMotorcycles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/motorcycles/`, { headers: this.getHeaders() });
  }

  getMotorcycle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/motorcycles/${id}/`, { headers: this.getHeaders() });
  }

  createMotorcycle(motorcycleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/motorcycles/`, motorcycleData, { headers: this.getHeaders() });
  }

  updateMotorcycle(id: number, motorcycleData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/motorcycles/${id}/`, motorcycleData, { headers: this.getHeaders() });
  }

  deleteMotorcycle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/motorcycles/${id}/`, { headers: this.getHeaders() });
  }

  searchVehicles(query: string, type: string = 'all'): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/?q=${query}&type=${type}`, { headers: this.getHeaders() });
  }
}
