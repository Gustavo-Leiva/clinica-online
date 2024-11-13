import { Component, OnInit } from '@angular/core';
import { Usuario, Paciente, Especialista } from '../interfaces/Usuario';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { IconosUsuarioPipe} from '../../pipes/iconos-usuario.pipe';
import { ExpandirHoverDirective } from '../../directivas/expandir-hover.directive';
import { Router} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ExpandirHoverDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
  usuarioLogueado: Usuario | null = null; // Inicialización para evitar el error

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      console.log(user); // Aquí podrás ver si el usuario tiene los datos correctos
      this.usuarioLogueado = user;
      if (this.usuarioLogueado) {
        console.log('Usuario logueado:', this.usuarioLogueado);
      }
     });
  }

  logout() {
    this.authService.logout();
    swal.fire({
      title: '¡Hasta pronto!',
      text: 'Tu sesión ha sido cerrada correctamente. Gracias por visitarnos, esperamos verte nuevamente pronto.',
      icon: 'success',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#38b6ff', // Color suave y moderno
      background: '#f8f9fa', // Fondo claro que hace resaltar el mensaje
      customClass: {
        popup: 'swal-popup', // Estilo adicional si deseas personalizar más
      },
    });
  }


   // Verificación de tipo para paciente
   isPaciente(usuario: Usuario): usuario is Paciente {
    return (usuario as Paciente).fotoPerfil1 !== undefined;
  }

  // Verificación de tipo para especialista
  isEspecialista(usuario: Usuario): usuario is Especialista {
    return (usuario as Especialista).especialidad !== undefined;
  }


      // Método para navegar a un destino específico
       NavegarPanelAdmin() {
      this.router.navigate(['/panelAdmin']); // Esto navega al componente de resultados
    }

     // Método para navegar a un destino específico
     NavegarPanelPaciente() {
      this.router.navigate(['/panelPaciente']); // Esto navega al componente de resultados
    }
}

