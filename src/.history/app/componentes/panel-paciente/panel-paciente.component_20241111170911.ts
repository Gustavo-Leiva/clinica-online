import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-panel-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-paciente.component.html',
  styleUrl: './panel-paciente.component.css'
})
export class PanelPacienteComponent {

  usuarioLogueado: Usuario | null = null; 
  mostrarReservarTurno: boolean = true;
  mostrarhistorialClinico: boolean = false;
  mostrarProximosTurnos: boolean = false;

}
