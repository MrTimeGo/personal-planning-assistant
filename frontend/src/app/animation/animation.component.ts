import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationService } from '../services/animation.service';

@Component({
  selector: 'app-animation',
  standalone: true,
  imports: [],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss',
})
export class AnimationComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public renderer!: any;
  public loader: GLTFLoader;
  public mixer!: THREE.AnimationMixer;
  public clock!: THREE.Clock;

  animationService = inject(AnimationService);

  // public camera
  constructor() {
    this.loader = new GLTFLoader();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThree();
    }, 1000);
  }

  initThree() {
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.rendererContainer.nativeElement.offsetWidth /
        this.rendererContainer.nativeElement.offsetHeight,
      0.1,
      1000
    );
    this.camera.rotateX(-0.15);
    this.camera.position.set(0.25, 3, 9.5);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.rendererContainer.nativeElement.offsetWidth,
      this.rendererContainer.nativeElement.offsetHeight
    );
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Load 3D model
    this.loader.load(
      'answering.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        this.scene.add(model);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
        const animations = gltf.animations;

        this.mixer = new THREE.AnimationMixer(model);
        this.clock = new THREE.Clock();

        animations
          .map((clip) => this.mixer.clipAction(clip))
          .forEach((action) => {
            action.play();
          });

        // Start the animation loop
        const animate = () => {
          const delta = this.clock.getDelta();

          requestAnimationFrame(animate);
          this.mixer.update(delta);

          this.renderer.render(this.scene, this.camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error);
      }
    );
  }
}
