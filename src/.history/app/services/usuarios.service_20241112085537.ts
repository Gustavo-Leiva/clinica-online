import { Injectable } from '@angular/core';
import{Usuario, Paciente, Especialista, Administrador} from '../componentes/'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor() { }


  getPacientes() {
    return this.db.collection<Usuario>('usuarios', ref =>
      ref.where('tipoUsuario', '==', "Paciente")
    ).valueChanges();
  }
}
