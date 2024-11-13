import { Component } from '@angular/core';
import { RegistroComponent } from "../registro/registro.component";
import { PanelPacienteComponent } from "../panel-paciente/panel-paciente.component";
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { Router} from '@angular/router';
import * as XLSX from 'xlsx';
import { IconosUsuarioPipe } from '../../pipes/iconos-usuario.pipe';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, HeaderComponent,ico],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent  {
  especialistas?: Usuario[];
  flagAdmin: boolean = false;
  mostrarUsuarios = true;
  mostrarAceptarEspecialistas = false;
  mostrarRegistrarUsuarios = false;
  mostrarTurnos = false;
 

  constructor( private router: Router) {}


   // Método para navegar a un destino específico
   NavegarRegistro() {
    this.router.navigate(['/registro']); // Esto navega al componente de resultados
  }




  
  public descargarUsuariosCsv() {
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

}

