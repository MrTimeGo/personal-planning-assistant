import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationService } from '../services/animation.service';
import { RobotAction } from '../models/robot-action';
import { BehaviorSubject, debounceTime } from 'rxjs';

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

  models: {
    [k: string]: {
      model: THREE.Group<THREE.Object3DEventMap>;
      mixer: THREE.AnimationMixer;
      action: THREE.AnimationAction;
    } | null;
  } = {
    [RobotAction.Answer]: null,
    [RobotAction.Hear]: null,
    [RobotAction.Think]: null,
    [RobotAction.Stay]: null,
    [RobotAction.Bye]: null,
  };

  private _robotReady = new BehaviorSubject<boolean>(false);

  // public camera
  constructor() {
    this.loader = new GLTFLoader();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initThree();
    }, 1000);

    this._robotReady.pipe(debounceTime(1000)).subscribe((ready) => {
      if (ready) {
        setTimeout(() => {
          this.animationService.currentAnimation$.subscribe((action) => {
            console.log(action);
            this.play(action);
          });
        }, 8450);
      }
    });
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

    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);

    this.clock = new THREE.Clock();

    this.loadModel('answering.glb', RobotAction.Answer);
    this.loadModel('hello.glb', RobotAction.Hello);
    this.loadModel('hearing.glb', RobotAction.Hear);
    this.loadModel('thinking.glb', RobotAction.Think);
    this.loadModel('answering.glb', RobotAction.Stay);
    this.loadModel('bye.glb', RobotAction.Bye);

    this._robotReady.pipe(debounceTime(1000)).subscribe(() => {
      this.play(RobotAction.Hello);

      const animate = () => {
        const delta = this.clock.getDelta();

        requestAnimationFrame(animate);
        this.mixer.update(delta);

        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  private loadModel(path: string, action: RobotAction) {
    this.loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);

        const mixer = new THREE.AnimationMixer(model);
        this.models[action] = {
          model,
          mixer,
          action: mixer.clipAction(gltf.animations[0]),
        };
        this._robotReady.next(true);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error);
      }
    );
  }

  play(action: RobotAction) {
    console.log('action requested: ', action);
    this.scene.remove(
      ...Object.values(this.models)
        .filter((model) => !!model)
        .map((model) => model.model)
    );

    const currentModel = this.models[action];
    this.scene.add(currentModel!.model);
    this.mixer = currentModel!.mixer;

    if (action !== RobotAction.Stay) {
      currentModel!.action.play();
    }
  }
}
