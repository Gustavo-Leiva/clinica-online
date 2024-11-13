import { Injectable } from '@angular/core';
import{usuar}

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
