import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SplashScreenComponent implements OnInit, AfterViewInit {
  @ViewChild('particlesContainer') particlesContainer!: ElementRef;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Redirigir al login después de 20 segundos
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 20000);
  }

  ngAfterViewInit(): void {
    this.createParticles();
  }

  createParticles(): void {
    const container = this.particlesContainer.nativeElement;
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Posición aleatoria
      const size = Math.random() * 10 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = '0';

      // Color aleatorio (tonos naranja/rojo)
      const hue = Math.floor(Math.random() * 30) + 15; // 15-45 (naranja-rojo)
      particle.style.background = `hsla(${hue}, 100%, 60%, 0.7)`;

      container.appendChild(particle);
    }
  }
}
