import { Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../services/api.service';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  constructor(private apiService: ApiService) {}

  transform(value: string): string {
    return this.apiService.getImageUrl(value);
  }
}
