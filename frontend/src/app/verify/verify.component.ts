import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);

  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  codeErrorMessage = signal('');

  submit(){
    const email = this.route.snapshot.queryParamMap.get('email');
    if(email && this.form.valid){
      this.authService.verify({email, code: this.form.value.code!}).subscribe({
        next: ()=>{this.router.navigate(['calendar'])},
        error: (error)=>{console.error(error)}
      });
    }
  }

  updateCodeErrorMessage() {
    if (this.form.controls.code.hasError('required')) {
      this.codeErrorMessage.set('Code is required');
    } 
  }
}
