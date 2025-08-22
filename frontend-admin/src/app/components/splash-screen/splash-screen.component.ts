import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SplashScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Redirigir al login después de 20 segundos
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 20000);
  }
}
