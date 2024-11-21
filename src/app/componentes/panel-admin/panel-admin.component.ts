import { Component,OnInit } from '@angular/core';
// import { RegistroComponent } from "../registro/registro.component";
// import { PanelPacienteComponent } from "../panel-paciente/panel-paciente.component";
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
// import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { Router} from '@angular/router';
// import * as XLSX from 'xlsx';
// import { IconosUsuarioPipe } from '../../pipes/iconos-usuario.pipe';
import { Turno } from '../interfaces/Turno';
import { UsuariosService } from '../../services/usuarios.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { ExpandirHoverDirective } from '../../directivas/expandir-hover.directive';
import { RegistroComponent } from '../registro/registro.component';
import { RegistroPacienteComponent } from "../registro/registro-paciente/registro-paciente.component";
import { RegistroEspecialistaComponent } from "../registro/registro-especialista/registro-especialista.component";
import { RegistroAdministradorComponent } from "../registro/registro-administrador/registro-administrador.component";
import { ResaltarFilaDirective } from '../../directivas/resaltar-fila.directive';
import { animation } from '@angular/animations';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { IconosUsuarioPipe } from '../../pipes/iconos-usuario.pipe';
import { animations } from '../../animations/animations';
import { PanelPacienteComponent } from '../panel-paciente/panel-paciente.component';


interface Especialidad {
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  // imports: [CommonModule, HeaderComponent, IconosUsuarioPipe],
  imports: [CommonModule, 
            HeaderComponent, 
            ExpandirHoverDirective, 
            RegistroComponent, 
            RegistroPacienteComponent, 
            RegistroEspecialistaComponent, 
            RegistroAdministradorComponent,
            PanelPacienteComponent, 
            ResaltarFilaDirective, 
            IconosUsuarioPipe],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css',
  animations:[animations.deslizarAbajo, animations.escalaCentro, animations.deslizarArriba, animations.deslizarAbajo]
  
})
export class PanelAdminComponent implements OnInit {


  // especialidades: Especialidad[] = [
  //   { nombre: 'Urologo', imagen: '/assets/images/urologo.png' },
  //   { nombre: 'Flevologo', imagen: '/assets/images/flevologo.png' },
  //   { nombre: 'Dermatologo', imagen: '/assets/images/dermatologo.png' },
  //   { nombre: 'Traumatologo', imagen: '/assets/images/traumatologo.png' },
  //   { nombre: 'Oculista', imagen: '/assets/images/oculista.pngERROR' },
  // ];

  usuarios: Array<Usuario |Paciente | Especialista | Administrador> = []; // Aquí declaras el array de usuarios
  especialistas: Especialista[] = [];  // Asegúrate de que sea un array
  flagAdmin: boolean = false;
  mostrarUsuarios = false;
  mostrarAceptarEspecialistas = false;
  mostrarRegistrarUsuarios = false;
  mostrarTurnos = false;
  historialClinico: Turno[] = [];
  usuarioLogueado: Usuario | null = null;
  showSpinner = false;

 

  constructor( private usuariosService: UsuariosService, private turnosService: TurnosService, private router: Router, private AuthService: AuthService ) {}

  ngOnInit(): void {
    this.cargarUsuarios(); // Llama a cargar usuarios
    this.AuthService.getCurrentUser().subscribe(usuario => {
      this.usuarioLogueado = usuario;
      this.flagAdmin = this.usuarioLogueado?.tipoUsuario === "administrador";
      console.log("flagAdmin:", this.flagAdmin);  // Verifica el valor de flagAdmin aquí
      
      // this.cargarEspecialistasPendientes();
       
    });
  }


  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe((data) => {
      this.usuarios = data.map((usuario) => {
        return {
          ...usuario,
          uid: usuario.uid || '' // Asegúrate de que el UID esté presente
        };
      });
      console.log('Usuarios cargados:', this.usuarios);
    });
  }
  


  // cargarUsuarios() {
  //   this.usuariosService.getUsuarios().subscribe((data) => {
  //     this.usuarios = data;
  //     console.log(this.usuarios);  // Verifica que los datos se cargan correctamente
  //     this.usuarios.forEach((usuario) => {
  //     console.log('Foto de perfil de usuario:', usuario.fotoPerfil1);  // Imprime la foto de perfil
  //     });
  //   });
  // }

  // cargarEspecialistasPendientes() {
  //   this.usuariosService.getEspecialistasPendientes().subscribe(data => {
  //     // Filtrar especialistas pendientes en caso de que no lo haya hecho en el servicio
  //     this.especialistas = data.filter(especialista => especialista.estado === 'pendiente');
  //     console.log('Especialistas pendientes:', this.especialistas);
  //   }, error => {
  //     console.error('Error al obtener especialistas pendientes:', error);
  //   });
  // }

  isEspecialista(usuario: Usuario): Especialista | undefined {
    if (usuario.tipoUsuario === 'especialista') {
      return usuario as Especialista;
    }
    return undefined;
  }

  

  // Función que se llama cuando se actualiza el estado del especialista
  actualizarEstadoEspecialista(uid: string, estado: 'aceptado' | 'rechazado'): void {
    this.usuariosService.actualizarEstadoEspecialista(uid, estado)
      .then(() => {
        console.log(`Estado del especialista con UID: ${uid} actualizado a ${estado}`);
      })
      .catch((error) => {
        console.error('Error al actualizar el estado', error);
      });
  }

  


  
 

   // Método para navegar a un destino específico
   NavegarRegistro() {
    this.router.navigate(['/registro']); // Esto navega al componente de resultados
  }



  public downloadAllUsers() {
    this.exportUsersToXls(this.usuarios, 'usuarios');
  }

  public exportUsersToXls(users: Usuario[], fileName: string) {
    const usersMapped = users.map((user) => {
      return {
        Email: `${user.email}`,
        Nombre: `${user.nombre}`,
        Apellido: `${user.apellido}`,
        Dni: `${user.dni}`,
        Edad: `${user.edad}`,
        TipoUsuario: `${user.tipoUsuario}`,
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(usersMapped);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'usuarios');
    XLSX.writeFile(workBook, `${fileName}.xlsx`);
  }

  descargarDatos(usuario: Usuario) {
    if (usuario.tipoUsuario === "paciente") {
      this.showSpinner = true;
  
      setTimeout(() => {
        this.obtenerHistorialClinico(usuario)
          .then(() => {
            this.showSpinner = false;
  
            const fileName = `${usuario.nombre}_${usuario.apellido}_historial_clinico`;
            const historialMapped = this.historialClinico.map((turno: any) => {
              return {
                Especialidad: turno.especialidad || '',
                EspecialistaDni: turno.especialistaDni || '',
                NombreDoctor: turno.nombreDoctor || '',
                ApellidoDoctor: turno.apellidoDoctor || '',
                Fecha: turno.fecha || '',
                Hora: turno.hora || '',
                Atendido: turno.atendido ? 'Sí' : 'No',
                CalificacionPaciente: turno.calificacionPaciente || '',
                Resenia: turno.resenia || '',
                ConfirmacionDoctor: turno.confirmacionDoctor || '',
                PacienteDni: turno.pacienteDni || '',
                NombrePaciente: turno.nombrePaciente || '',
                ApellidoPaciente: turno.apellidoPaciente || '',
                EdadPaciente: turno.edadPaciente || '',
                ObraSocialPaciente: turno.obraSocialPaciente || '',
                Altura: turno.atencionDoc?.altura || '',
                Peso: turno.atencionDoc?.peso || '',
                Presion: turno.atencionDoc?.presion || '',
                Temperatura: turno.atencionDoc?.temperatura || '',
                DatosDinamicos: turno.atencionDoc?.datosDinamicos
                  ? turno.atencionDoc?.datosDinamicos.map((item: any) => `${item.clave}: ${item.valor}`).join(', ')
                  : '',
              };
            });
  
            if (historialMapped.length > 0) {
              const workSheet = XLSX.utils.json_to_sheet(historialMapped);
              const workBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workBook, workSheet, 'historial_clinico');
              XLSX.writeFile(workBook, `${fileName}.xlsx`);
            } else {
              Swal.fire('Historial Clínico Vacío', 'El historial clínico del paciente está vacío.', 'info');
            }
          })
          .catch((error:any) => {
            this.showSpinner = false;
            console.error('Error al obtener historial clínico:', error);
            Swal.fire('Error', 'Hubo un error al obtener el historial clínico.', 'error');
          });
      }, 2000);
  
    } else {
      Swal.fire('Operación Rechazada', 'El usuario seleccionado debe ser paciente para poder descargar el historial clínico.', 'info');
    }
  }

  
  obtenerHistorialClinico(usuario: Usuario) {
    return new Promise<void>((resolve, reject) => {
      this.turnosService.getHistoriaFull()
        .subscribe(historial => {
          this.historialClinico = historial.filter(turno =>
            turno.apellidoPaciente == usuario.apellido &&
            turno.nombrePaciente == usuario.nombre
          );
          resolve();
        }, error => {
          reject(error);
        });
    });
  }

  
  // public descargarUsuariosCsv() {
  //   this.exportUsersToXls(this.usuarios, 'usuarios');
  // }

  // public exportUsersToXls(users: Usuario[], fileName: string) {
  //   const usersMapped = users.map((user) => {
  //     return {
  //       Email: `${user.email}`,
  //       Nombre: `${user.nombre}`,
  //       Apellido: `${user.apellido}`,
  //       Dni: `${user.dni}`,
  //       Edad: `${user.edad}`,
  //       TipoUsuario: `${user.tipoUsuario}`,
  //     };
  //   });

  //   const workSheet = XLSX.utils.json_to_sheet(usersMapped);
  //   const workBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workBook, workSheet, 'usuarios');
  //   XLSX.writeFile(workBook, `${fileName}.xlsx`);
  // }


  
  // descargarDatos(usuario: Usuario) {
  //   if (usuario.tipoUsuario === "Paciente") {
  //     // this.showSpinner = true;
  
  //     setTimeout(() => {
  //       this.obtenerHistorialClinico(usuario)
  //         .then(() => {
  //           // this.showSpinner = false;
  
  //           const fileName = `${usuario.nombre}_${usuario.apellido}_historial_clinico`;
  //           const historialMapped = this.historialClinico.map((turno: any) => {
  //             return {
  //               Especialidad: turno.especialidad || '',
  //               EspecialistaDni: turno.especialistaDni || '',
  //               NombreDoctor: turno.nombreDoctor || '',
  //               ApellidoDoctor: turno.apellidoDoctor || '',
  //               Fecha: turno.fecha || '',
  //               Hora: turno.hora || '',
  //               Atendido: turno.atendido ? 'Sí' : 'No',
  //               CalificacionPaciente: turno.calificacionPaciente || '',
  //               Resenia: turno.resenia || '',
  //               ConfirmacionDoctor: turno.confirmacionDoctor || '',
  //               PacienteDni: turno.pacienteDni || '',
  //               NombrePaciente: turno.nombrePaciente || '',
  //               ApellidoPaciente: turno.apellidoPaciente || '',
  //               EdadPaciente: turno.edadPaciente || '',
  //               ObraSocialPaciente: turno.obraSocialPaciente || '',
  //               Altura: turno.atencionDoc?.altura || '',
  //               Peso: turno.atencionDoc?.peso || '',
  //               Presion: turno.atencionDoc?.presion || '',
  //               Temperatura: turno.atencionDoc?.temperatura || '',
  //               DatosDinamicos: turno.atencionDoc?.datosDinamicos
  // //                 ? turno.atencionDoc?.datosDinamicos.map((item: any) => `${item.clave}: ${item.valor}`).join(', ')
  //                 : '',
  //             };
  //           });
  
  //           if (historialMapped.length > 0) {
  //             const workSheet = XLSX.utils.json_to_sheet(historialMapped);
  //             const workBook = XLSX.utils.book_new();
  //             XLSX.utils.book_append_sheet(workBook, workSheet, 'historial_clinico');
  //             XLSX.writeFile(workBook, `${fileName}.xlsx`);
  //           } else {
  //             Swal.fire('Historial Clínico Vacío', 'El historial clínico del paciente está vacío.', 'info');
  //           }
  //         })
  //         .catch((error) => {
  //           // this.showSpinner = false;
  //           console.error('Error al obtener historial clínico:', error);
  //           Swal.fire('Error', 'Hubo un error al obtener el historial clínico.', 'error');
  //         });
  //     }, 2000);
  
  //   } else {
  //     Swal.fire('Operación Rechazada', 'El usuario seleccionado debe ser paciente para poder descargar el historial clínico.', 'info');
  //   }
  // }

  // obtenerHistorialClinico(usuario: Usuario) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.turnosService.getHistoriaFull()
  //       .subscribe(historial => {
  //         this.historialClinico = historial.filter(turno =>
  //           turno.apellidoPaciente == usuario.apellido &&
  //           turno.nombrePaciente == usuario.nombre
  //         );
  //         resolve();
  //       }, error => {
  //         reject(error);
  //       });
  //   });
  // }

}

