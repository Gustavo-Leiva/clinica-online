import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, setDoc} from '@angular/fire/firestore';
import{Usuario, Paciente, Especialista, Administrador} from '../componentes/interfaces/Usuario'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',

})
export class UsuariosService {

  constructor(private firestore: Firestore) { }


  getPacientes(): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');  // Referencia a la colección
    const pacientesQuery = query(usuariosRef, where('tipoUsuario', '==', 'Paciente')); // Consulta específica
    return collectionData(pacientesQuery) as Observable<Usuario[]>; // Obtener los datos como Observable
  }
