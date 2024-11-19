import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Turno } from '../interfaces/Turno';
import { AuthService } from '../../services/auth.service';
import { Usuario, Paciente, Administrador, Especialista } from '../interfaces/Usuario';
import { TurnosService } from '../../services/turnos.service';
import { HeaderComponent } from '../header/header.component';
import { UsuariosService } from '../../services/usuarios.service';
import { ExpandirHoverDirective } from '../../directivas/expandir-hover.directive';
import {animations} from '../../animations/animations';
import Swal from 'sweetalert2';
import { HoraFormatoPipe } from '../../pipes/hora-formato.pipe';



interface Especialidad {
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-panel-paciente',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ExpandirHoverDirective, HoraFormatoPipe ],
  templateUrl: './panel-paciente.component.html',
  styleUrl: './panel-paciente.component.css',
  animations:[animations.deslizarAbajo]
 // Aquí agregamos la animación
  
})
export class PanelPacienteComponent implements OnInit{

  especialidades: Especialidad[] = [
   
    { nombre: 'Dermatologo', imagen: '/assets/imagenes/especialidades/dermatologo.png' },
    { nombre: 'Pediatra', imagen: '/assets/imagenes/especialidades/pediatra.jpg' },
    { nombre: 'Neurologo', imagen: '/assets/imagenes/especialidades/neurologo.jpg' },
    { nombre: 'Oftalmologo', imagen: '/assets/imagenes/especialidades/oftalmologo.png' },
    { nombre: 'Cardiologo', imagen: '/assets/imagenes/especialidades/cardiologo.jpg' },
    { nombre: 'Psicologo', imagen: '/assets/imagenes/especialidades/psicologo.jpg' },
    { nombre: 'Endocrinolgo', imagen: '/assets/imagenes/especialidades/default-image.png' },


  ];

  doctores: any[] = [];
  fechas:string[] = [];
  arrayHorarios: { horario: string; estado: string }[] = [];
  especialidadSeleccionada?: string;
  fechaSeleccionada?: string;
  horaSeleccionada?: string;
  dniDoctorSeleccionado: string = ''; // Valor por defecto vacío
  usuarioLogueado: Usuario | null = null;  
  mostrarReservarTurno: boolean = false;
  mostrarHistorialClinico: boolean = false;
  mostrarProximosTurnos: boolean = false;
  historialClinico: Turno[] = [];
  proximosTurnos: Turno[] = [];
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';
  filtroFull: string = '';
  pacientes: any;
  pacienteSeleccionado: any;


  constructor(private turnosService: TurnosService, private authService: AuthService, private usuariosService: UsuariosService) {
  }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
    this.cargarPacientes();
    this.mostrarReservarTurno= true;
  }

  
  cargarDoctores() {
    console.log("Cargando Doctores...");
    this.usuariosService.getEspecialistaByEspecialidad(this.especialidadSeleccionada || '')
      .subscribe(doctores => {
        if (Array.isArray(doctores)) {
          this.doctores = doctores;
        } else {
          this.doctores = [];  // Aseguramos que sea un array vacío si la respuesta es incorrecta
        }
        this.dniDoctorSeleccionado = "";
        this.fechaSeleccionada = "";
        this.horaSeleccionada = "";
      });
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

  console.log("Cargando Pacientes...");
  this.usuariosService.getPacientes()
    .subscribe(pacientes => {
      this.pacientes = pacientes;
      this.pacienteSeleccionado = "",
      this.dniDoctorSeleccionado = "";
      this.fechaSeleccionada = "";
      this.horaSeleccionada = "";
    });
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



generarFechas(dniDoctorSeleccionado: string) {
  this.fechaSeleccionada = "";
  this.horaSeleccionada = "";

  const doctorSeleccionado = this.doctores.find((doctor) => doctor.dni == dniDoctorSeleccionado);

  if (!doctorSeleccionado) {
    console.log("Doctor no encontrado, dni:", dniDoctorSeleccionado);
    return;
  }

  const diasAtencion = doctorSeleccionado.diasAtencion;
  console.log("Generando fechas del doctor -> ", doctorSeleccionado.diasAtencion);

  const fechaActual = new Date();

  const fechasGeneradas:any = []; // Nuevo array para almacenar fechas únicas

  for (let i = 0; i < 15; i++) {
    const fecha = new Date(fechaActual.getTime()); // Crear una nueva instancia de fecha para cada iteración
    fecha.setDate(fechaActual.getDate() + i);

    // Verifica si el día de la semana coincide con uno de los días de atención y no es domingo.
    const diaSemana = fecha.getDay(); // 0 para Domingo, 1 para Lunes, 2 para Martes, etc.

    if (diasAtencion.includes(this.getNombreDia(diaSemana)) && diaSemana !== 0) {
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear();

      const fechaFormateada = `${dia}-${mes}-${anio}`;

      // Verificar si la fecha ya existe en el array antes de agregarla
      if (!fechasGeneradas.includes(fechaFormateada)) {
        fechasGeneradas.push(fechaFormateada);
      }
    }
  }

  console.log("ARRAY DE FECHAS GENERADO", fechasGeneradas);
  this.fechas = fechasGeneradas; // Actualizar this.fechas con las fechas únicas
}


  // Función para obtener el nombre del día a partir del número (0 para Domingo, 1 para Lunes, etc.).
  getNombreDia(numeroDia:any) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[numeroDia];
  }


  
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
  

  reservarTurno(hora: string) {
    const doctorSeleccionado = this.doctores.find(doctor => doctor.dni == this.dniDoctorSeleccionado);
    
    if (doctorSeleccionado) {
      const nuevoTurno: Turno = {
        especialidad: this.especialidadSeleccionada,
        especialistaDni: this.dniDoctorSeleccionado.toString(),
        nombreDoctor: doctorSeleccionado.nombre, 
        apellidoDoctor: doctorSeleccionado.apellido,
        pacienteDni: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.dni.toString() : this.usuarioLogueado?.dni.toString(),
        fecha: this.fechaSeleccionada,
        hora: hora,
        atendido: false,
        confirmacionDoctor: "Pendiente Confirmacion",
        nombrePaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.nombre : this.usuarioLogueado?.nombre,
        apellidoPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.apellido : this.usuarioLogueado?.apellido,
        edadPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.edad : this.usuarioLogueado?.edad,
        // Aquí verificamos si 'usuarioLogueado' es un 'Paciente' antes de acceder a 'obraSocial'
        obraSocialPaciente: (this.usuarioLogueado as Paciente).obraSocial || ''
      };
      console.log("Turnito a reservar:",nuevoTurno);
      
      Swal.fire({
        title: 'Estas seguro que queres reservar el turno?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.turnosService.guardarTurno(nuevoTurno)
          .then(() => {
            Swal.fire('Operación exitosa!', `Turno guardado con éxito para el ${this.fechaSeleccionada} a las ${nuevoTurno.hora}.`, 'success');
            this.cargarHorarios(nuevoTurno.especialistaDni, nuevoTurno.fecha);
          })
          .catch(error => {
            Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
          });
        } else if (result.isDenied) {
          Swal.fire('Operacion Cancelada', 'Se cancelo la operacion con exito.', 'warning');
        }
      })
    }
  }
  

  
  // reservarTurno(hora: string) {
    
  //   const doctorSeleccionado = this.doctores.find(doctor => doctor.dni == this.dniDoctorSeleccionado);
    
  //   if (doctorSeleccionado) {
  //     const nuevoTurno: Turno = {
  //       especialidad: this.especialidadSeleccionada,
  //       especialistaDni: this.dniDoctorSeleccionado.toString(),
  //       nombreDoctor: doctorSeleccionado.nombre, 
  //       apellidoDoctor: doctorSeleccionado.apellido,
  //       pacienteDni: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.dni.toString() : this.usuarioLogueado?.dni.toString(),
  //       fecha: this.fechaSeleccionada,
  //       hora: hora,
  //       atendido: false,
  //       confirmacionDoctor: "Pendiente Confirmacion",
  //       nombrePaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.nombre : this.usuarioLogueado?.nombre,
  //       apellidoPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.apellido : this.usuarioLogueado?.apellido,
  //       edadPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.edad : this.usuarioLogueado?.edad,
  //       obraSocialPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.obraSocial : this.usuarioLogueado?.obraSocial
  //     };
  //     console.log("Turnito a reservar:",nuevoTurno);
      
  //   Swal.fire({
  //     title: 'Estas seguro que queres reservar el turno?',
  //     showDenyButton: true,
  //     confirmButtonText: 'Si',
  //     denyButtonText: 'No'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.turnosService.guardarTurno(nuevoTurno)
  //       .then(() => {
  //         Swal.fire('Operación exitosa!', `Turno guardado con éxito para el ${this.fechaSeleccionada} a las ${nuevoTurno.hora}.`, 'success');
  //         this.cargarHorarios(nuevoTurno.especialistaDni,nuevoTurno.fecha);
  //       })
  //       .catch(error => {
  //         Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
  //       });
  //     } else if (result.isDenied) {
  //       Swal.fire('Operacion Cancelada', 'Se cancelo la operacion con exito.', 'warning');
  //     }
  //   })
  //   }
  // }


}
