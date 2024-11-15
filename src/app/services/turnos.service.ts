import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Turno } from '../componentes/interfaces/Turno';

// interface Turno {
//   especialistaDni: string;
//   fecha: string;
//   // Otros campos del turno si los tienes
// }
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

  getTurnosAceptadosByEspecialista(dni?: string): Observable<Turno[]> {
    const turnosRef = collection(this.firestore, 'turnos');
    const turnosQuery = query(turnosRef, where('especialistaDni', '==', dni), where('confirmacionDoctor', 'in', ['Confirmado', 'Rechazado']));
    return collectionData(turnosQuery) as Observable<Turno[]>;
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


}
