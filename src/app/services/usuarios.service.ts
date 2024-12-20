import { Injectable } from '@angular/core';
import {  Firestore, collection, collectionData, query, where, getDocs, updateDoc, doc, getDoc, QuerySnapshot, DocumentData} from '@angular/fire/firestore';
import{Usuario, Paciente, Especialista, Administrador} from '../componentes/interfaces/Usuario'
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';  // Si usas Angular Injection
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map, from } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',

})
export class UsuariosService {

  fecha?: Date;
  // logColleccion!: AngularFirestoreCollection<Log>;
  usuarioColleccion!: AngularFirestoreCollection<Usuario>;
  usuarios!: Observable<Usuario[]>;
  private usuarioLogueadoSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  usuarioLogueado$: Observable<Usuario | null> = this.usuarioLogueadoSubject.asObservable(); // Expone el Observable para suscribirse
  private tiempoExpiracionSesion: number = 30 * 60 * 1000; // 30 minutos en milisegundos
  private usuarioLocalStorageKey = 'usuarioLogueado'; // Clave para guardar el usuario en el LocalStorage


  constructor(private firestore: Firestore) { }

  get db() {
    return this.firestore;
  }

  
  // Método para obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return collectionData(usuariosRef, { idField: 'uid' }).pipe(
      tap(data => console.log('Datos obtenidos de usuarios:', data)) // Muestra los datos en consola
    ) as Observable<Usuario[]>;
  }

  // Obtener todos los especialistas pendientes (aceptado = pendiente)
   getEspecialistasPendientes(): Observable<Especialista[]> {
    const ref = collection(this.firestore, 'usuarios');
    const q = query(ref, 
                    where('aceptado', '==', 'pendiente'),
                    where('tipoUsuario', '==', 'especialista'));
    return collectionData(q, { idField: 'id' }) as Observable<Especialista[]>;
  }
  

// Método para actualizar el estado de un especialista
async actualizarEstadoEspecialista(uid: string, estado: 'aceptado' | 'rechazado'): Promise<void> {
  const especialistaRef = doc(this.firestore, 'usuarios', uid);  // Usamos doc() para apuntar al documento por su UID

  try {
    // Verificar si el documento existe
    const docSnapshot = await getDoc(especialistaRef);  // Usamos getDoc() para obtener el documento
    if (docSnapshot.exists()) {
      await updateDoc(especialistaRef, { estado });  // Actualizamos el documento con el nuevo estado
      console.log(`Estado del especialista actualizado a: ${estado}`);
    } else {
      console.error(`El documento con UID: ${uid} no existe`);
    }
  } catch (error) {
    console.error(`Error al actualizar el estado del especialista con UID: ${uid}`, error);
    throw error;
  }
}


  // Obtener los usuarios por tipo (paciente, administrador, especialista)
  getUsuariosPorTipo(tipo: 'paciente' | 'administrador' | 'especialista'): Observable<Especialista[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');
    const q = query(usuariosRef, where('tipoUsuario', '==', tipo));

    // Convertimos el Promise en un Observable utilizando 'from'
    return from(getDocs(q).then(querySnapshot => {
      return querySnapshot.docs.map(doc => doc.data() as Especialista);
    }));
  }



  getPacientes(): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');  // Referencia a la colección
    const pacientesQuery = query(usuariosRef, where('tipoUsuario', '==', 'paciente')); // Consulta específica
    return collectionData(pacientesQuery) as Observable<Usuario[]>; // Obtener los datos como Observable
  }



  getEspecialistaByEspecialidad(especialidad: string) {
    // Crea una referencia a la colección de usuarios
    const usuariosRef = collection(this.firestore, 'usuarios');
    
    // Realiza la consulta filtrando por especialidad y tipoUsuario
    const q = query(usuariosRef, 
      where('tipoUsuario', '==', 'especialista'),
      where('especialidades', 'array-contains', especialidad)
    );

    // Obtén los documentos de la consulta
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        // Mapea los documentos a la estructura de Especialista
        return querySnapshot.docs.map(doc => doc.data() as Especialista);
      })
    );
  }


  
 // Actualizar disponibilidad
 actualizarDisponibilidad(usuario: Usuario, horarios: Array<string>, dias: Array<string>): void {
  const usuariosRef = collection(this.firestore, 'usuarios');

  const q = query(
    usuariosRef,
    where('dni', '==', usuario.dni),
    where('nombre', '==', usuario.nombre),
    where('apellido', '==', usuario.apellido),
    where('email', '==', usuario.email)
  );

  getDocs(q).then((querySnapshot: QuerySnapshot<DocumentData>) => {
    querySnapshot.forEach(docSnapshot => {
      const usuarioDocRef = doc(this.firestore, `usuarios/${docSnapshot.id}`);
      updateDoc(usuarioDocRef, {
        horariosAtencion: horarios,
        diasAtencion: dias
      })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Disponibilidad Actualizada...',
            text: 'Se actualizó la disponibilidad',
          });
        })
        .catch(error => {
          console.error('Error al actualizar:', error);
        });
    });
  }).catch(error => {
    console.error('Error al consultar documentos:', error);
  });
}
  
 // Actualizar el estado de un especialista (aceptar o rechazar)
//  actualizarEstadoEspecialista(id: string, nuevoEstado: 'aceptado' | 'rechazado'): Promise<void> {
//   const especialistaDocRef = doc(this.firestore, `usuarios/${id}`);
//   return updateDoc(especialistaDocRef, { estado: nuevoEstado }); // Asegúrate de que el campo es "estado"
// }

// async actualizarEstadoEspecialista(uid: string, estado: 'aceptado' | 'rechazado'): Promise<void> {
//   const usuariosRef = collection(this.firestore, 'usuarios');
//   const q = query(usuariosRef, where('uid', '==', uid));

//   try {
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       querySnapshot.forEach(async (docSnapshot) => {
//         const especialistaRef = doc(this.firestore, `usuarios/${docSnapshot.id}`);
//         await updateDoc(especialistaRef, { estado });
//         console.log('Estado actualizado correctamente.');
//       });
//     } else {
//       console.error(`No se encontró un especialista con UID: ${uid}`);
//     }
//   } catch (error) {
//     console.error(`Error al actualizar el estado del especialista con UID: ${uid}`, error);
//     throw error;
//   }
// }


}
