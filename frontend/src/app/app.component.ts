import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { base64 } from './base64-example-audio';
import { SignInComponent } from "./sign-in/sign-in.component";
import { MainComponent } from "./main/main.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { VerifyComponent } from "./verify/verify.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignInComponent, MainComponent, SignUpComponent, VerifyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
