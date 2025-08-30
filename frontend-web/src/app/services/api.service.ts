import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // Auth endpoints
  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + '/token/', credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(API_URL + '/register/', user);
  }

  refreshToken(tokenData: any): Observable<any> {
    return this.http.post(API_URL + '/token/refresh/', tokenData);
  }

  // Car endpoints
  getCars(): Observable<any> {
    return this.http.get(API_URL + '/cars/');
  }

  getCar(id: number): Observable<any> {
    return this.http.get(API_URL + '/cars/' + id + '/');
  }

  createCar(car: any): Observable<any> {
    return this.http.post(API_URL + '/cars/', car);
  }

  updateCar(id: number, car: any): Observable<any> {
    return this.http.put(API_URL + '/cars/' + id + '/', car);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(API_URL + '/cars/' + id + '/');
  }

  // Motorcycle endpoints
  getMotorcycles(): Observable<any> {
    return this.http.get(API_URL + '/motorcycles/');
  }

  getMotorcycle(id: number): Observable<any> {
    return this.http.get(API_URL + '/motorcycles/' + id + '/');
  }

  createMotorcycle(motorcycle: any): Observable<any> {
    return this.http.post(API_URL + '/motorcycles/', motorcycle);
  }

  updateMotorcycle(id: number, motorcycle: any): Observable<any> {
    return this.http.put(API_URL + '/motorcycles/' + id + '/', motorcycle);
  }

  deleteMotorcycle(id: number): Observable<any> {
    return this.http.delete(API_URL + '/motorcycles/' + id + '/');
  }

  // Search endpoint
  search(query: string, type: string = 'all'): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', type);

    return this.http.get(API_URL + '/search/', { params });
  }

  // Filter endpoints
  filterCars(filters: any): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get(API_URL + '/cars/', { params });
  }

  filterMotorcycles(filters: any): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get(API_URL + '/motorcycles/', { params });
  }

  getContactMessages(): Observable<any> {
    return this.http.get(API_URL + '/contact-messages/');
  }

  getContactMessage(id: number): Observable<any> {
    return this.http.get(API_URL + '/contact-messages/' + id + '/');
  }

  createContactMessage(message: any): Observable<any> {
    return this.http.post(API_URL + '/contact-messages/', message);
  }

  updateContactMessage(id: number, message: any): Observable<any> {
    return this.http.put(API_URL + '/contact-messages/' + id + '/', message);
  }

  deleteContactMessage(id: number): Observable<any> {
    return this.http.delete(API_URL + '/contact-messages/' + id + '/');
  }

  // User endpoints
  getUsers(): Observable<any> {
    return this.http.get(API_URL + '/users/');
  }

  // Subscriber endpoints
  getSubscribers(): Observable<any> {
    return this.http.get(API_URL + '/subscribers/');
  }


  // Subscription endpoint
  subscribeToNewsletter(email: string): Observable<any> {
    return this.http.post(API_URL + '/subscribers/', { email });
  }

  getDiscounts(): Observable<any> {
    return this.http.get(API_URL + '/discounts/');
  }

  getFeaturedItems(): Observable<any> {
    return this.http.get(API_URL + '/featured/');
  }

}


