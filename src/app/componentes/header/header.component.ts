import { Component, OnInit } from '@angular/core';
import { Usuario, Paciente, Especialista } from '../interfaces/Usuario';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IconosUsuarioPipe} from '../../pipes/iconos-usuario.pipe';
import { ExpandirHoverDirective } from '../../directivas/expandir-hover.directive';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ExpandirHoverDirective, IconosUsuarioPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
  usuarioLogueado: any = null;
  isVerified: boolean = false;

  // usuarioLogueado: Usuario | null = null; // Inicialización para evitar el error

  constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.authService.actualUser$.subscribe((user) => {
  //     console.log(user); // Aquí podrás ver si el usuario tiene los datos correctos
  //     this.usuarioLogueado = user;
  //     if (this.usuarioLogueado) {
  //       console.log('Usuario logueado:', this.usuarioLogueado);
  //     }
  //    });
  // }


  async ngOnInit() {
    this.usuarioLogueado = await this.authService.getUser(); // Obtener el usuario logueado
    this.isVerified = await this.authService.isUserVerified(); // Verificar el correo electrónico
  }

  // logout() {
  //   this.authService.logout();
  //   swal.fire({
  //     title: '¡Hasta pronto!',
  //     text: 'Tu sesión ha sido cerrada correctamente. Gracias por visitarnos, esperamos verte nuevamente pronto.',
  //     icon: 'success',
  //     confirmButtonText: 'Cerrar',
  //     confirmButtonColor: '#38b6ff', // Color suave y moderno
  //     background: '#f8f9fa', // Fondo claro que hace resaltar el mensaje
  //     customClass: {
  //       popup: 'swal-popup', // Estilo adicional si deseas personalizar más
  //     },
  //   });
  // }


  logout() {
    this.authService.logout().then(() => {
      this.usuarioLogueado = null; // Actualiza el estado para indicar que no hay usuario logueado
      this.router.navigate(['/home']); // Redirige al usuario al home
      Swal.fire({
        title: '¡Hasta pronto!',
        text: 'Tu sesión ha sido cerrada correctamente. Gracias por visitarnos, esperamos verte nuevamente pronto.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#38b6ff',
        background: '#f8f9fa',
        customClass: {
          popup: 'swal-popup'
        }
      });
    });
  }


   // Verificación de tipo para paciente
   isPaciente(usuario: Usuario): usuario is Paciente {
    return (usuario as Paciente).fotoPerfil1 !== undefined;
  }

  // Verificación de tipo para especialista
isEspecialista(usuario: Usuario): usuario is Especialista {
  // Verifica que la propiedad especialidades exista y tenga al menos un elemento
  return (usuario as Especialista).especialidades?.length > 0;
}

    // Método para navegar a un destino específico
      NavegarPanelAdmin() {
    this.router.navigate(['/panelAdmin']); // Esto navega al componente de resultados
  }

     // Método para navegar a un destino específico
     NavegarPanelPaciente() {
      this.router.navigate(['/panelPaciente']); // Esto navega al componente de resultados
    }

      // Método para navegar a un destino específico
      NavegarPerfil() {
        this.router.navigate(['/perfil']); // Esto navega al componente de resultados
      }

      
      // Método para navegar a un destino específico
      NavegarHome() {
        this.router.navigate(['/home']); // Esto navega al componente de resultados
      }
}



