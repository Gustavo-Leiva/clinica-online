import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirebaseError } from 'firebase/app';
import { HeaderComponent } from "../header/header.component"; // Asegúrate de importar FirebaseError


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  flagError: boolean = false;
  msjError: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private auth: AuthService) {}
  async LoginUser() {
    this.isLoading = true;
    this.flagError = false;
    this.msjError = '';
  
    try {
      await this.auth.login(this.email, this.password);
      const user = this.auth.userActive; // Obtiene el usuario activo del AuthService
  
      if (user) {
        console.log('Usuario autenticado:', user);
  
        // Verificación de tipo de usuario
        if (user.tipoUsuario === 'especialista') {
          if (user.aprobado && user.emailVerificado) {
            this.router.navigate(['/home']);
          } else {
            this.flagError = true;
            this.msjError = 'La cuenta de Especialista no está aprobada o el email no está verificado.';
          }
        } else if (user.tipoUsuario === 'paciente') {
          if (user.emailVerificado) {
            this.router.navigate(['/home']);
          } else {
            this.flagError = true;
            this.msjError = 'La cuenta de Paciente no tiene el email verificado.';
          }
        } else if (user.tipoUsuario === 'administrador') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.flagError = true;
          this.msjError = 'Perfil de usuario no reconocido.';
        }
      } else {
        this.flagError = true;
        this.msjError = 'No se pudo obtener la información del usuario.';
      }
  
    } catch (e: any) {
      console.error('Error de inicio de sesión:', e);
      this.flagError = true;
  
      // Verificar si el error contiene un código de error
      if (e.code) {
        this.msjError = this.auth.mostrarErrorLogin(e.code);
      } else {
        this.msjError = "Error de autenticación desconocido. Intente nuevamente";
      }
    } finally {
      this.isLoading = false;
    }
  }
}  

  // UsuarioPaciente() {
  //   this.email = 'paciente@gmail.com';
  //   this.password = 'paciente';
  //   this.LoginUser(); // Llama a LoginUser automáticamente
  // }
  
  // UsuarioEspecialista() {
  //   this.email = 'especialista@gmail.com';
  //   this.password = 'especialista';
  //   this.LoginUser(); // Llama a LoginUser automáticamente
  // }
  
