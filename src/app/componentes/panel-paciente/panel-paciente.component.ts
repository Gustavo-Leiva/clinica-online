import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Turno } from '../interfaces/Turno';
import { AuthService } from '../../services/auth.service';
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
import { TurnosService } from '../../services/turnos.service';
import { HeaderComponent } from '../header/header.component';
import { UsuariosService } from '../../services/usuarios.service';
import { ExpandirHoverDirective } from '../../directivas/expandir-hover.directive';


@Component({
  selector: 'app-panel-paciente',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ExpandirHoverDirective],
  templateUrl: './panel-paciente.component.html',
  styleUrl: './panel-paciente.component.css'
})
export class PanelPacienteComponent {

  doctores: any[] = [];
  fechas:string[] = [];
  arrayHorarios: { horario: string; estado: string }[] = [];
  especialidadSeleccionada?: string;
  fechaSeleccionada?: string;
  horaSeleccionada?: string;
  dniDoctorSeleccionado?: string;
  usuarioLogueado: Usuario | null = null;  
  mostrarReservarTurno: boolean = true;
  mostrarHistorialClinico: boolean = false;
  mostrarProximosTurnos: boolean = false;
  historialClinico: Turno[] = [];
  proximosTurnos: Turno[] = [];
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';
  filtroFull: string = '';
  pacientes: any;
  pacienteSeleccionado: any;


  constructor(private turnosService: TurnosService, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
    this.cargarPacientes();
  }

  
  
  // cargarDoctores() {

  //   console.log("Cargando Doctores...");
  //   this.usuariosService.getEspecialistaByEspecialidad(this.especialidadSeleccionada)
  //     .subscribe(doctores => {
  //       this.doctores = doctores;
  //       this.dniDoctorSeleccionado = "";
  //       this.fechaSeleccionada = "";
  //       this.horaSeleccionada = "";
  //     });
  // }


  cargarHorarios(dniDoctorSeleccionado?: string, fechaSeleccionada?: string) {
    if (dniDoctorSeleccionado != null && fechaSeleccionada != null) {
      // Obtener el doctor seleccionado
      const doctorSeleccionado = this.doctores.find((doctor) => doctor.dni == dniDoctorSeleccionado);
      console.log("Generando horarios para el doctor ->",doctorSeleccionado.horariosAtencion);
      if (doctorSeleccionado) {
        const disponibilidad = doctorSeleccionado.horariosAtencion;
  
        if (disponibilidad && disponibilidad.length > 0) {
          // Limpiar el array de horarios
          this.arrayHorarios = [];
          // Generar una lista de todos los horarios disponibles en intervalos de 30 minutos
          const horariosDisponibles: string[] = [];
          disponibilidad.forEach((horarioDisponible: string) => {
            const [horaInicio, horaFin] = horarioDisponible.split(" a ");
            const [horaInicioStr, minutoInicioStr] = horaInicio.split(":");
            const [horaFinStr, minutoFinStr] = horaFin.split(":");
            const horaInicioNum = parseInt(horaInicioStr);
            const minutoInicioNum = parseInt(minutoInicioStr);
            const horaFinNum = parseInt(horaFinStr);
            const minutoFinNum = parseInt(minutoFinStr);
  
            for (let hora = horaInicioNum; hora < horaFinNum; hora++) {
              for (let minuto = minutoInicioNum; minuto < 60; minuto += 30) {
                const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
                horariosDisponibles.push(horaFormateada);
              }
            }
          });
  
          // Ordenar los horarios en orden ascendente
          horariosDisponibles.sort();
  
          // Llenar this.arrayHorarios con los horarios ordenados y marcarlos como 'disponible'
          for (const horaFormateada of horariosDisponibles) {
            this.arrayHorarios.push({ horario: horaFormateada, estado: 'disponible' });
          }
  
          // Consultar los turnos ocupados para marcarlos como 'ocupados'
          this.turnosService.getTurnosByEspecialista(dniDoctorSeleccionado.toString(), fechaSeleccionada).subscribe(turnos => {
            for (const turno of turnos) {
              const horaOcupada = turno.hora;
              const horaIndex = this.arrayHorarios.findIndex(hora => hora.horario === horaOcupada);
              if (horaIndex !== -1) {
                this.arrayHorarios[horaIndex].estado = 'ocupado';
              }
            }
          });
        } else {
          console.log("El doctor seleccionado no tiene disponibilidad.");
        }
      } else {
        console.log("No se encontró el doctor seleccionado.");
      }
    } else {
      console.log("Primera carga de horarios");
    }
  }


  cargarProximosTurnos() {
    if (this.usuarioLogueado?.tipoUsuario == "Paciente") {
      this.turnosService.getProximosTurnos(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.proximosTurnos = turnos.filter(turno => 
            this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
          );
        });
      }else if (this.usuarioLogueado?.tipoUsuario == "Admin"){
        this.turnosService.getProximosTurnosFull()
        .subscribe(turnos => {
          this.proximosTurnos = turnos.filter(turno => 
            this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
          );
        });
      }
  }


  cargarHistorialClinico() {
    if (this.usuarioLogueado?.tipoUsuario == "Paciente") {
      this.turnosService.getHistoriaClinica(this.usuarioLogueado.dni.toString())
        .subscribe(historial => {
          this.historialClinico = historial.filter(turno => 
            this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
          );
        });
    }else if (this.usuarioLogueado?.tipoUsuario == "Admin"){
      this.turnosService.getHistoriaFull()
      .subscribe(historial => {
        this.historialClinico = historial.filter(turno => 
          this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
        );
      });
    }   

}



cargarPacientes() {

//   console.log("Cargando Pacientes...");
//   this.usuariosService.getPacientes()
//     .subscribe(pacientes => {
//       this.pacientes = pacientes;
//       this.pacienteSeleccionado = "",
//       this.dniDoctorSeleccionado = "";
//       this.fechaSeleccionada = "";
//       this.horaSeleccionada = "";
//     });
 }



concatenatedFields(turno: any): string {
  // Función auxiliar para asignar un valor predeterminado si es undefined o null
  const defaultValue = (value: any, defaultVal: any = '') => value !== undefined && value !== null ? value : defaultVal;

  // Aplicar la lógica para todos los campos
  const apellidoDoctor = defaultValue(turno.apellidoDoctor);
  const apellidoPaciente = defaultValue(turno.apellidoPaciente);
  const altura = defaultValue(turno.atencionDoc?.altura);
  const peso = defaultValue(turno.atencionDoc?.peso);
  const presion = defaultValue(turno.atencionDoc?.presion);
  const temperatura = defaultValue(turno.atencionDoc?.temperatura);
  const key1 =  defaultValue(turno.atencionDoc?.datosDinamicos[0].clave);
  const value1 =  defaultValue(turno.atencionDoc?.datosDinamicos[0].valor);
  const key2 =  defaultValue(turno.atencionDoc?.datosDinamicos[1].clave);
  const value2 =  defaultValue(turno.atencionDoc?.datosDinamicos[1].valor);
  const key3 =  defaultValue(turno.atencionDoc?.datosDinamicos[2].clave);
  const value3 =  defaultValue(turno.atencionDoc?.datosDinamicos[2].valor);
  const confirmacionDoctor = defaultValue(turno.confirmacionDoctor);
  const especialidad = defaultValue(turno.especialidad);
  const fecha = defaultValue(turno.fecha);
  const hora = defaultValue(turno.hora);
  const nombreDoctor = defaultValue(turno.nombreDoctor);
  const nombrePaciente = defaultValue(turno.nombrePaciente);
  const obraSocialPaciente = defaultValue(turno.obraSocialPaciente);
  //console.log(`DATOS TURNOS",${nombreDoctor} ${apellidoDoctor} ${nombrePaciente} ${apellidoPaciente} ${altura} ${peso} ${presion} ${temperatura} ${confirmacionDoctor} ${especialidad} ${fecha} ${hora} ${nombrePaciente} ${obraSocialPaciente} ${key1} ${value1} ${key2} ${value2} ${key3} ${value3}`);
  return `${nombreDoctor} ${apellidoDoctor} ${nombrePaciente} ${apellidoPaciente} ${altura} ${peso} ${presion} ${temperatura} ${confirmacionDoctor} ${especialidad} ${fecha} ${hora} ${nombrePaciente} ${obraSocialPaciente} ${key1} ${value1} ${key2} ${value2} ${key3} ${value3}`;
}


}
