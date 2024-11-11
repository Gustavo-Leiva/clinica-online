import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RegistroEspecialistaComponent } from './registro-especialista/registro-especialista.component';
import { RegistroAdministradorComponent } from './registro-administrador/registro-administrador.component';
import { RegistroPacienteComponent } from './registro-paciente/registro-paciente.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RegistroEspecialistaComponent, RegistroPacienteComponent, RegistroAdministradorComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  selectedRole: string | null = null;
  completed: boolean = false;
  userRole: string | null = null;
  isAdmin: boolean = false; // Para saber si el usuario es administrador

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAdminRole();  // Llama a checkAdminRole cuando el componente se inicialice
    //asi se puede mostrar el boton para dar de alta el formulario de administrador.
  }

    // Verifica si el usuario está logueado como administrador
    checkAdminRole(): void {
      const user = this.authService.getUser();
      if (user && user.tipoUsuario === 'administrador') {
        this.isAdmin = true;
      }
    }

  // Selección de rol
  selectRole(role: string): void {
    this.selectedRole = role;
  }

  // Cerrar formulario
  closeForm(): void {
    this.selectedRole = null;
  }

  // Finalización de registro
  onCompleted(): void {
    this.completed = true;
    this.userRole = this.selectedRole;
    this.closeForm();
     // Ocultar mensaje de confirmación después de 3 segundos
     setTimeout(() => {
      this.completed = false;
      this.userRole = null;
    }, 3000); // 3000 ms = 3 segundos
  }

}
