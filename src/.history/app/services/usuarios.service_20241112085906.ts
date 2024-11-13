import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import{Usuario, Paciente, Especialista, Administrador} from '../componentes/interfaces/Usuario'

@Injectable({
  providedIn: 'root'
  standalone: true;
})
export class UsuariosService {

  constructor(private db: AngularFirestore) { }


  getPacientes() {
    return this.db.collection<Usuario>('usuarios', ref =>
      ref.where('tipoUsuario', '==', "Paciente")
    ).valueChanges();
  }
}
