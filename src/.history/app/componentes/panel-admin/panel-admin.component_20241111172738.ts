import { Component } from '@angular/core';
import { RegistroComponent } from "../registro/registro.component";
import { PanelPacienteComponent } from "../panel-paciente/panel-paciente.component";
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { Router} from '@angular/router';
// import * as XLSX from 'xlsx';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
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
  historialClinico: Turno[] = [];

  constructor( private router: Router) {}


   // Método para navegar a un destino específico
   NavegarRegistro() {
    this.router.navigate(['/registro']); // Esto navega al componente de resultados
  }
}

