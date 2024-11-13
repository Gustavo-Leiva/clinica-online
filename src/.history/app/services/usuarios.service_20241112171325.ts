import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import{Usuario, Paciente, Especialista, Administrador} from '../componentes/interfaces/Usuario'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class UsuariosService {

  constructor(private firestore: Firestore) { }


  getPacientes(): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');  // Referencia a la colección
    const pacientesQuery = query(usuariosRef, where('tipoUsuario', '==', 'paciente')); // Consulta específica
    return collectionData(pacientesQuery) as Observable<Usuario[]>; // Obtener los datos como Observable
  }


  // Método para obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return collectionData(usuariosRef, { idField: 'id' }).pipe(
      tap(data => console.log('Datos obtenidos de usuarios:', data)) // Muestra los datos en consola
    ) as Observable<Usuario[]>;
  }
  

}
