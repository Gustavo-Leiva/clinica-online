import { Component,OnInit } from '@angular/core';
// import { RegistroComponent } from "../registro/registro.component";
// import { PanelPacienteComponent } from "../panel-paciente/panel-paciente.component";
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
// import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { Router} from '@angular/router';
// import * as XLSX from 'xlsx';
import { IconosUsuarioPipe } from '../../pipes/iconos-usuario.pipe';
import { Turno } from '../interfaces/Turno';
import { UsuariosService } from '../../services/usuarios.service';
import{auto}


@Component({
  selector: 'app-panel-admin',
  standalone: true,
  // imports: [CommonModule, HeaderComponent, IconosUsuarioPipe],
  imports: [CommonModule, HeaderComponent],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent implements OnInit {
  usuarios: Usuario[] = [];  // Inicialización con un array vacío
  especialistas: Especialista[] = [];  // Asegúrate de que sea un array
  flagAdmin: boolean = false;
  mostrarUsuarios = true;
  mostrarAceptarEspecialistas = false;
  mostrarRegistrarUsuarios = false;
  mostrarTurnos = false;
  historialClinico: Turno[] = [];
  usuarioLogueado: Usuario | null;
 

  constructor( private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios(); // Llamar al método para cargar usuarios
    
    this.authService.getCurrentUser().subscribe((user) => {
      this.usuarioLogueado = user;
      this.flagAdmin = this.usuarioLogueado?.tipoUsuario === 'administrador';
    });
    }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      console.log(this.usuarios);  // Verifica que los datos se cargan correctamente
    });
  }

   // Método para navegar a un destino específico
   NavegarRegistro() {
    this.router.navigate(['/registro']); // Esto navega al componente de resultados
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

