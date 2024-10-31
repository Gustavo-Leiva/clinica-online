// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore'; 
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   constructor(private afAuth: AngularFireAuth, private firestore: Firestore) {}

//   login(email: string, password: string): Observable<any> {
//     return this.afAuth.signInWithEmailAndPassword(email, password).pipe(
//       map((userCredential) => {
//         const user = userCredential.user;
//         // Llama a la función para verificar el estado de aprobación del usuario
//         return this.checkUserApproval(user);
//       }),
//       catchError((error) => {
//         return of({ success: false, message: error.message });
//       })
//     );
//   }

//   private async checkUserApproval(user: any): Promise<any> {
//     try {
//       // Obtén el perfil del usuario desde la base de datos
//       const userProfileDoc = doc(this.firestore, `users/${user.uid}`);
//       const userProfileSnapshot = await getDoc(userProfileDoc);

//       if (!userProfileSnapshot.exists()) {
//         throw new Error('El perfil del usuario no existe.');
//       }

//       const userProfile = userProfileSnapshot.data();

//       // Verifica si el usuario es un Especialista y si está aprobado
//       if (userProfile.tipoUsuario === 'especialista' && !userProfile.aprobado) {
//         throw new Error('Tu cuenta debe ser aprobada por un administrador.');
//       }

//       // Para pacientes, verifica si el email ha sido verificado
//       if (userProfile.tipoUsuario === 'paciente' && !user.emailVerified) {
//         throw new Error('Debes verificar tu email antes de ingresar.');
//       }

//       return { success: true, message: 'Login exitoso', userProfile }; // El usuario está aprobado
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   }
// }
