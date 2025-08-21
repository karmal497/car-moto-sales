import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from '../../services/api.service';
import * as THREE from 'three';

interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  transmission: string;
  mileage: number;
  fuel_type: string;
  image_url: string;
  created_at: string;
  is_sold: boolean;
  created_by: number;
}

interface Motorcycle {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  category: string;
  mileage: number;
  fuel_type: string;
  image_url: string;
  created_at: string;
  is_sold: boolean;
  created_by: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  featuredCars: Car[] = [];
  featuredMotorcycles: Motorcycle[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFeaturedVehicles();
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

  loadFeaturedVehicles(): void {
    this.apiService.getCars().subscribe({
      next: (data: any) => {
        this.featuredCars = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading cars:', error);
      }
    });

    this.apiService.getMotorcycles().subscribe({
      next: (data: any) => {
        this.featuredMotorcycles = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading motorcycles:', error);
      }
    });
  }

  initThreeJS(): void {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    const container = document.getElementById('three-container');
    if (!container) return;

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create car model (simplified)
    const carBody = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 4),
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    scene.add(carBody);

    const carTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.5, 2),
      new THREE.MeshLambertMaterial({ color: 0xcc0000 })
    );
    carTop.position.y = 0.75;
    scene.add(carTop);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

    const wheelPositions = [
      { x: -0.7, y: -0.5, z: 1.2 },
      { x: 0.7, y: -0.5, z: 1.2 },
      { x: -0.7, y: -0.5, z: -1.2 },
      { x: 0.7, y: -0.5, z: -1.2 }
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, pos.y, pos.z);
      scene.add(wheel);
    });

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      carBody.rotation.y += 0.01;
      carTop.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  // Format number without using pipe
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
