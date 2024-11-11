import { Component } from '@angular/core';
import { RegistroComponent } from "../registro/registro.component";
import { PanelPacienteComponent } from "../panel-paciente/panel-paciente.component";
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
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
}
