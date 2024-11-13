import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-paciente',
  standalone: true,
  imports: [],
  templateUrl: './panel-paciente.component.html',
  styleUrl: './panel-paciente.component.css'
})
export class PanelPacienteComponent {

  reservarTurno: boolean = true;
  historialClinico: boolean = false;
  proximosTurnos: boolean = false;

}
