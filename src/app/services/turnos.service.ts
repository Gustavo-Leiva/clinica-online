import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, getDocs, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Turno } from '../componentes/interfaces/Turno';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: Firestore) { }

 
  getTurnosByEspecialista(dni?: string, fecha?: string): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('especialistaDni', '==', dni), where('fecha', '==', fecha));
    return collectionData(turnosQuery) as Observable<Turno[]>;
  }

  getTurnosPendientesAceptarByEspecialista(dni?: string): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('especialistaDni', '==', dni), where('confirmacionDoctor', '==', 'Pendiente Confirmacion'));
    return collectionData(turnosQuery) as Observable<Turno[]>;
  }

  // getTurnosAceptadosByEspecialista(dni?: string): Observable<Turno[]> {
  //   const turnosRef = collection(this.firestore, 'turnos');
  //   const turnosQuery = query(turnosRef, where('especialistaDni', '==', dni), where('confirmacionDoctor', 'in', ['Confirmado', 'Rechazado']));
  //   return collectionData(turnosQuery) as Observable<Turno[]>;
  // }

  getTurnosAceptadosByEspecialista(dni?: string) {
    const turnosRef = collection(this.firestore, 'turnos'); // Obtiene la referencia a la colección
    const turnosQuery = query(
      turnosRef,
      where('especialistaDni', '==', dni),
      where('confirmacionDoctor', 'in', ['Aceptado', 'Atendido'])
    ); // Aplica los filtros
    return collectionData(turnosQuery, { idField: 'id' }) as Observable<Turno[]>; // Devuelve los datos
  }

  getHistoriaClinica(dni: string): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('pacienteDni', '==', dni), where('atendido', '==', true));
    return collectionData(turnosQuery) as Observable<Turno[]>;
  }

  getHistoriaFull(): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('atendido', '==', true));
    return collectionData(turnosQuery) as Observable<Turno[]>;
  }

  getProximosTurnos(dni: string): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('pacienteDni', '==', dni), where('atendido', '==', false));
    return collectionData(turnosQuery) as Observable<Turno[]>;
  }

  getProximosTurnosFull(): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('atendido', '==', false));
    return collectionData(turnosQuery) as Observable<Turno[]>;
  }

  guardarTurno(turno: Turno): Promise<void> {
    const turnosRef = collection(this.firestore, 'turnos');
    return addDoc(turnosRef, turno).then(() => {
      console.log("Turno guardado con éxito");
    }).catch(error => {
      console.error("Error al guardar el turno: ", error);
    });
  }





  
  async cancelarTurno(turno: Turno) {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('fecha', '==', turno.fecha),
        where('hora', '==', turno.hora),
        where('especialistaDni', '==', turno.especialistaDni),
        where('pacienteDni', '==', turno.pacienteDni),
        where('especialidad', '==', turno.especialidad)
      );
  
      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);
  
      if (querySnapshot.empty) {
        console.log('No se encontraron documentos que coincidan con los criterios');
        return;
      }
  
      // Elimina cada documento encontrado
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log('Documento eliminado correctamente:', doc.id);
      });
    } catch (error) {
      console.error('Error al cancelar el turno:', error);
    }
  }


  async calificarTurno(turno: Turno, calificacion: string) {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('fecha', '==', turno.fecha),
        where('hora', '==', turno.hora),
        where('especialistaDni', '==', turno.especialistaDni),
        where('pacienteDni', '==', turno.pacienteDni),
        where('especialidad', '==', turno.especialidad)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      if (querySnapshot.empty) {
        console.log('No se encontraron documentos que coincidan con los criterios');
        return;
      }

      // Actualiza el campo "calificacionPaciente" de cada documento encontrado
      for (const doc of querySnapshot.docs) {
        await updateDoc(doc.ref, { calificacionPaciente: calificacion });
        console.log('Campo "calificacionPaciente" modificado correctamente para el documento:', doc.id);
      }
    } catch (error) {
      console.error('Error al modificar el campo "calificacionPaciente":', error);
    }
  }


  async aceptarTurno(turno: Turno) {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('fecha', '==', turno.fecha),
        where('hora', '==', turno.hora),
        where('especialistaDni', '==', turno.especialistaDni),
        where('pacienteDni', '==', turno.pacienteDni),
        where('especialidad', '==', turno.especialidad)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      if (querySnapshot.empty) {
        console.log('No se encontraron documentos que coincidan con los criterios');
        return;
      }

      // Actualiza el campo "confirmacionDoctor" de cada documento encontrado
      for (const doc of querySnapshot.docs) {
        await updateDoc(doc.ref, { confirmacionDoctor: 'Aceptado' });
        console.log('Campo "confirmacionDoctor" modificado correctamente para el documento:', doc.id);
      }

      // Muestra un mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Turno Aceptado',
        text: 'Se aceptó el turno correctamente.',
      });
    } catch (error) {
      console.error('Error al aceptar el turno:', error);

      // Muestra un mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al aceptar el turno. Inténtalo de nuevo.',
      });
    }
  }

  async guardarAtencion(turno: Turno, atencion: any) {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('fecha', '==', turno.fecha),
        where('hora', '==', turno.hora),
        where('especialistaDni', '==', turno.especialistaDni),
        where('pacienteDni', '==', turno.pacienteDni),
        where('especialidad', '==', turno.especialidad)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      if (querySnapshot.empty) {
        console.log('No se encontraron documentos que coincidan con los criterios');
        return;
      }

      // Actualiza el campo "atencionDoc" de cada documento encontrado
      for (const doc of querySnapshot.docs) {
        await updateDoc(doc.ref, { atencionDoc: atencion });
        console.log('Campo "atencionDoc" modificado correctamente para el documento:', doc.id);
      }
    } catch (error) {
      console.error('Error al guardar la atención:', error);
    }
  }


  async finalizarTurno(turno: Turno) {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('fecha', '==', turno.fecha),
        where('hora', '==', turno.hora),
        where('especialistaDni', '==', turno.especialistaDni),
        where('pacienteDni', '==', turno.pacienteDni),
        where('especialidad', '==', turno.especialidad)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      if (querySnapshot.empty) {
        console.log('No se encontraron documentos que coincidan con los criterios');
        return;
      }

      // Actualiza los campos "confirmacionDoctor" y "atendido" de cada documento encontrado
      for (const doc of querySnapshot.docs) {
        await updateDoc(doc.ref, {
          confirmacionDoctor: 'Atendido',
          atendido: true
        });
        console.log('Turno finalizado correctamente para el documento:', doc.id);
        
        // Muestra una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Turno Finalizado...',
          text: 'Se finalizó el turno correctamente',
        });
      }
    } catch (error) {
      console.error('Error al finalizar el turno:', error);
    }
  }


  async rechazarTurno(turno: Turno) {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('fecha', '==', turno.fecha),
        where('hora', '==', turno.hora),
        where('especialistaDni', '==', turno.especialistaDni),
        where('pacienteDni', '==', turno.pacienteDni),
        where('especialidad', '==', turno.especialidad)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      if (querySnapshot.empty) {
        console.log('No se encontraron documentos que coincidan con los criterios');
        return;
      }

      // Actualiza el campo "confirmacionDoctor" de cada documento encontrado
      for (const doc of querySnapshot.docs) {
        await updateDoc(doc.ref, {
          confirmacionDoctor: 'Rechazado'
        });
        console.log('Turno rechazado correctamente para el documento:', doc.id);
        
        // Muestra una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Turno RECHAZADO...',
          text: 'Se rechazó el turno correctamente',
        });
      }
    } catch (error) {
      console.error('Error al rechazar el turno:', error);
    }
  }

  //SECCION INFORMES
  
    // Obtener cantidad de turnos por especialidad
    async getCantidadTurnosPorEspecialidad(especialidad: string): Promise<number> {
      try {
        // Obtiene una referencia a la colección "turnos"
        const turnosRef = collection(this.firestore, 'turnos');
        const turnosQuery = query(
          turnosRef,
          where('especialidad', '==', especialidad)
        );
  
        // Ejecuta la consulta
        const querySnapshot = await getDocs(turnosQuery);
  
        // Retorna la cantidad de turnos encontrados
        return querySnapshot.size; // Retorna la cantidad de documentos encontrados
  
      } catch (error) {
        console.error('Error al obtener la cantidad de turnos:', error);
        return 0; // Retorna 0 en caso de error
      }
    }
  

    async getCantidadTurnosPorDia(dia: string): Promise<number> {
      try {
        // Obtiene una referencia a la colección "turnos"
        const turnosRef = collection(this.firestore, 'turnos');
        const turnosQuery = query(
          turnosRef,
          where('fecha', '==', dia)
        );
  
        // Ejecuta la consulta
        const querySnapshot = await getDocs(turnosQuery);
  
        // Retorna la cantidad de turnos encontrados
        return querySnapshot.size; // Retorna la cantidad de documentos encontrados
  
      } catch (error) {
        console.error('Error al obtener la cantidad de turnos por día:', error);
        return 0; // Retorna 0 en caso de error
      }
    }

    async getDiasConTurnos(): Promise<string[]> {
      try {
        // Obtiene una referencia a la colección "turnos"
        const turnosRef = collection(this.firestore, 'turnos');
        const turnosQuery = query(turnosRef);
  
        // Ejecuta la consulta
        const querySnapshot = await getDocs(turnosQuery);
  
        // Extrae las fechas de los turnos
        const diasConTurnos = querySnapshot.docs.map(doc => doc.data()['fecha']);
  
        // Devuelve los días únicos usando Set para eliminar duplicados
        return Array.from(new Set(diasConTurnos));
  
      } catch (error) {
        console.error('Error al obtener los días con turnos:', error);
        return []; // En caso de error, retorna un array vacío
      }
    }
  
  // Obtener cantidad de turnos solicitados por médico en un lapso de tiempo
  async getCantidadTurnosSolicitadosPorMedico(dni: string, fechaInicio: string, fechaFin: string): Promise<number> {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      
      // Crea la consulta con los filtros correspondientes
      const turnosQuery = query(
        turnosRef,
        where('especialistaDni', '==', dni),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      // Devuelve la cantidad de turnos que cumplen con los criterios
      return querySnapshot.size;  // size devuelve el número de documentos en la consulta
    } catch (error) {
      console.error('Error al obtener la cantidad de turnos solicitados por el médico:', error);
      return 0; // En caso de error, retorna 0
    }
  }

  // Obtener cantidad de turnos finalizados por médico en un lapso de tiempo
  async getCantidadTurnosFinalizadosPorMedico(dni: string, fechaInicio: string, fechaFin: string): Promise<number> {
    try {
      // Obtiene una referencia a la colección "turnos"
      const turnosRef = collection(this.firestore, 'turnos');
      
      // Crea la consulta con los filtros correspondientes
      const turnosQuery = query(
        turnosRef,
        where('especialistaDni', '==', dni),
        where('atendido', '==', true),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin)
      );

      // Ejecuta la consulta
      const querySnapshot = await getDocs(turnosQuery);

      // Devuelve la cantidad de turnos finalizados que cumplen con los criterios
      return querySnapshot.size;  // size devuelve el número de documentos en la consulta
    } catch (error) {
      console.error('Error al obtener la cantidad de turnos finalizados por el médico:', error);
      return 0; // En caso de error, retorna 0
    }
  }




}


