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
   // Declara la propiedad userProfileImageUrl
   userProfileImageUrl: string = 'path-to-default-profile-image.jpg'; // Puedes poner una imagen predeterminada o la URL de la imagen del perfil

  


  userListVisible: boolean = false;  // Estado para mostrar u ocultar los usuarios
  users = [
    { id: 1, name: 'Administrador', role: 'admin', image: 'path-to-admin.jpg' },
    { id: 2, name: 'Especialista 1', role: 'especialista', image: 'path-to-especialista1.jpg' },
    { id: 3, name: 'Especialista 2', role: 'especialista', image: 'path-to-especialista2.jpg' },
    { id: 4, name: 'Paciente 1', role: 'paciente', image: 'path-to-paciente1.jpg' },
    { id: 5, name: 'Paciente 2', role: 'paciente', image: 'path-to-paciente2.jpg' },
    { id: 6, name: 'Paciente 3', role: 'paciente', image: 'path-to-paciente3.jpg' }
  ];

  usuario = { email: '', password: '' };


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



  // Método para alternar la visibilidad de la lista de usuarios
  toggleUserList(): void {
    this.userListVisible = !this.userListVisible;
  }

  // Método que se llama al hacer clic en un usuario
  onUserClick(user: any): void {
    this.accesoRapido(user.id);
    console.log('Usuario seleccionado:', user.name);

    // Puedes redirigir o realizar alguna acción según el tipo de usuario
    if (user.role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (user.role === 'especialista') {
      this.router.navigate(['/especialista-dashboard']);
    } else if (user.role === 'paciente') {
      this.router.navigate(['/paciente-dashboard']);
    }
  }


 accesoRapido(numero: number) {
    switch (numero) {
      case 1:
        this.usuario.email = 'administrador@utn.com';
        this.usuario.password = 'admin123';
        break;
      case 2:
        this.usuario.email = 'especialista@especialista.com';
        this.usuario.password = 'especialista';
        break;
      case 3:
        this.usuario.email = 'erling@haaland.com';
        this.usuario.password = '123456';
        break;
      case 4:
        this.usuario.email = 'paciente@paciente.com';
        this.usuario.password = 'paciente';
        break;
      case 5:
        this.usuario.email = 'kylianmbappe@gmail.com';
        this.usuario.password = '123456';
        break;
      case 6:
        this.usuario.email = 'juanromanriquelme@gmail.com';
        this.usuario.password = '123456';
        break;
      default:
        console.log('Número de ingreso rápido no válido');
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
  
