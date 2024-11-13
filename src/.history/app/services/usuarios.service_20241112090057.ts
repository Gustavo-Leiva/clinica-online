import { Injectable } from '@angular/core';
import { Firestorecollection, addDoc, doc, getDoc, setDoc} from '@angular/fire/firestore';
import{Usuario, Paciente, Especialista, Administrador} from '../componentes/interfaces/Usuario'

@Injectable({
  providedIn: 'root',

})
export class UsuariosService {

  constructor(private firestore: Firestore) { }


  getPacientes() {
    return this.firestore.collection<Usuario>('usuarios', ref =>
      ref.where('tipoUsuario', '==', "Paciente")
    ).valueChanges();
  }
}
