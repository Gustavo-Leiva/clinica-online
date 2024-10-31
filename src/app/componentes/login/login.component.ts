import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from '../services/auth.service'; // Asegúrate de tener un servicio de autenticación

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  // loginForm: FormGroup;
  // submitted: boolean = false;
  // errorMessage: string = '';

  // constructor(private fb: FormBuilder, private authService: AuthService) {
  //   this.loginForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //   });
  // }

  // ngOnInit(): void {}

  // onSubmit() {
  //   this.submitted = true;
  //   this.errorMessage = '';

  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;

  //     this.authService.login(email, password).subscribe(
  //       (response) => {
  //         // Aquí puedes manejar la respuesta del login (por ejemplo, redirigir al usuario)
  //         console.log('Login exitoso', response);
  //       },
  //       (error) => {
  //         // Aquí puedes manejar los errores de login
  //         this.errorMessage = error.message;
  //         console.error('Error de login', error);
  //       }
  //     );
  //   }
  // }
}
