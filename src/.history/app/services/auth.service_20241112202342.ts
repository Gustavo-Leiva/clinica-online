import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, User } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Usuario, Paciente, Administrador, Especialista } from '../componentes/interfaces/Usuario';
import { Firestore, collection, addDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  msjError: string | null = null;
  userActive: any;
  private actualUserSubject = new BehaviorSubject<Usuario | null>(null);
  public actualUser$ = this.actualUserSubject.asObservable();

  // constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
  //   onAuthStateChanged(this.auth, (user) => {
  //     if (user) {
  //       this.userActive = user;
  //       const usuario: Usuario = this.mapUserToUsuario(user); // Convierte el User en un Usuario
  //       this.actualUserSubject.next(usuario); // Actualiza el estado con el tipo correcto
  //     } else {
  //       this.userActive = null;
  //       this.actualUserSubject.next(null);
  //     }
  //   });
  // }


  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.userActive = user;
        const perfilUsuario = await this.obtenerPerfilUsuario(user.uid); // Obtenemos el perfil desde Firestore
        if (perfilUsuario) {
          this.actualUserSubject.next(perfilUsuario); // Actualizamos el usuario en el Subject
        } else {
          console.error('Perfil no encontrado en Firestore');
          this.actualUserSubject.next(null);
        }
      } else {
        this.userActive = null;
        this.actualUserSubject.next(null);
      }
    });
  }

  // Método para obtener el usuario actual
  getUser(): Usuario | null {
    return this.actualUserSubject.value;
  }

 // Método para obtener el usuario actual como Observable
  getCurrentUser(): Observable<Usuario | null> {
  return this.actualUserSubject.asObservable();
}

  // Función para mapear User (Firebase) a Usuario (tu interfaz personalizada)
  private mapUserToUsuario(user: User): Usuario {
    // Lógica para determinar el tipo de usuario
    const tipoUsuario: 'paciente' | 'administrador' | 'especialista' = 'paciente'; // Aquí va tu lógica para determinar el tipo de usuario

    if (tipoUsuario === 'paciente') {
      return {
        nombre: '', // Deberías obtener estos datos desde Firestore o de donde los guardes
        apellido: '',
        edad: 0,
        dni: 0,
        obraSocial: '', // Solo los pacientes tienen obraSocial
        email: user.email,
        password:'',
        fotoPerfil1: '',
        fotoPerfil2: '',
        tipoUsuario: 'paciente',
      } as Paciente;
    }

    if (tipoUsuario === 'administrador') {
      return {
        nombre: '',
        apellido: '',
        edad: 0,
        dni: 0,
        password:'',
        email: user.email || '',
        fotoPerfil1: '',
        tipoUsuario: 'administrador',
        } as Administrador;
    }

    if (tipoUsuario === 'especialista') {
      return {
        nombre: '',
        apellido: '',
        edad: 0,
        dni: 0,
        email: user.email || '',
        password:'',
        fotoPerfil1: '',
        especialidad: '', // Propiedad específica de los especialistas
        tipoUsuario: 'especialista',
      } as Especialista;
    }

    return {} as Usuario; // Por si no se determina un tipo de usuario
  }




// Función para login de usuario
async login(email: string, password: string): Promise<User> {
  try {
    const res = await signInWithEmailAndPassword(this.auth, email, password);

    // Verificar si el correo electrónico está verificado
    if (!res.user.emailVerified) {
      this.msjError = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
      throw new Error(this.msjError);
    }

    // Si el correo está verificado, continuar con el proceso de inicio de sesión
    const uid = res.user.uid;
    const tipoDeUsuario = await this.obtenerTipoDeUsuario(uid); // Obtener el tipo de usuario

    if (tipoDeUsuario) {
      // Ahora puedes hacer algo con el tipo de usuario
      if (tipoDeUsuario === 'paciente') {
        this.router.navigate(['/home']); // Redirigir a la página de inicio del paciente
      } else if (tipoDeUsuario === 'especialista') {
        this.router.navigate(['/home']); // Redirigir a la página de inicio del especialista
      } else if (tipoDeUsuario === 'administrador') {
        this.router.navigate(['/home']); // Redirigir a la página de administrador
      }
    } else {
      this.msjError = 'Tipo de usuario desconocido.';
      throw new Error(this.msjError);
    }

    return res.user;
  } catch (e: any) {
    console.error('Error al iniciar sesión:', e);
    const errorMessage = e.code ? this.mostrarErrorLogin(e.code) : 'Error de autenticación desconocido. Intente nuevamente';
    throw new Error(errorMessage);
  }
}


  
  // Método para mostrar mensaje de error según el código de error
mostrarErrorLogin(codigoError: string): string {
  switch (codigoError) {
    case 'auth/invalid-email':
      return 'El formato del correo es inválido.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada. Contacta al soporte.';
    case 'auth/user-not-found':
      return 'No se encontró un usuario con este correo.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/too-many-requests':
      return 'Se ha bloqueado temporalmente la cuenta debido a muchos intentos fallidos. Inténtalo más tarde.';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu red y vuelve a intentarlo.';
    case 'auth/popup-closed-by-user':
      return 'La ventana de inicio de sesión se cerró antes de finalizar.';
    case 'auth/cancelled-popup-request':
      return 'La solicitud de autenticación fue cancelada.';
    default:
      return 'Error desconocido: ' + codigoError;
  }
}


  // Obtener el perfil del usuario desde Firestore
  async obtenerPerfilUsuario(uid: string): Promise<Usuario | null> {
    console.log('Obteniendo perfil de usuario con UID:', uid);
    const userRef = doc(this.firestore, `usuarios/${uid}`);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      return userSnap.data() as Usuario;
    } else {
      console.log('Perfil de usuario no encontrado en Firestore.');
      return null;
    }
  }

  // Método para obtener el tipo de usuario
  async obtenerTipoDeUsuario(uid: string): Promise<"paciente" | "administrador" | "especialista" | null> {
    const perfil = await this.obtenerPerfilUsuario(uid);

    if (perfil) {
      const tipoUsuario: string = perfil.tipoUsuario;  // Aquí `tipoUsuario` es de tipo string
      // Validamos que `tipoUsuario` sea uno de los valores permitidos
      if (tipoUsuario === 'paciente' || tipoUsuario === 'administrador' || tipoUsuario === 'especialista') {
        console.log('Tipo de usuario:', tipoUsuario);
        return tipoUsuario;  // Devuelve el tipo de usuario si es válido
      } else {
        console.log('Tipo de usuario desconocido:', tipoUsuario);
        return null;  // Devuelve null si el tipo de usuario es desconocido
      }
    } else {
      console.log('No se encontró el perfil del usuario.');
      return null;  // Si no se encuentra el perfil, devuelves null
    }
  }





 // Función para registrar usuario
// async registrarUsuario(usuario: Usuario, password: string, file?: File) {
//   console.log('Registrando usuario con email:', usuario.email);

//   // Verificar si el correo electrónico es válido
//   if (!usuario.email || usuario.email.trim() === '') {
//     throw new Error('El correo electrónico es obligatorio');
//   }

//   if (!usuario.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(usuario.email.trim())) {
//     throw new Error('El correo electrónico no tiene un formato válido.');
//   }
  
//   try {
//     const res = await createUserWithEmailAndPassword(this.auth, usuario.email, password);
//     console.log('Respuesta de Firebase:', res);

//     let fotoURL = ''; // URL de la imagen de perfil

//     // Subir la imagen a Firebase Storage si file está definido
//     if (file) {
//       const path = `usuarios/${res.user.uid}/fotoPerfil1.jpg`;  // Usa el UID del usuario para la ruta
//       fotoURL = await this.subirImagen(file, path);
//       console.log('URL de la imagen subida:', fotoURL); // Verifica si se obtiene la URL
//     }

//     // Almacenar el usuario en Firestore con las propiedades correspondientes
//     const userRef = doc(this.firestore, 'usuarios', res.user.uid); // Usamos el UID como ID del documento
      
//     if (usuario.tipoUsuario === 'paciente') {
//       const paciente = usuario as Paciente;
//       await setDoc(userRef, {
//         ...paciente,
//         uid: res.user.uid,
//         fotoPerfil: fotoURL  // Agrega la URL de la imagen de perfil
//       });

//     } else if (usuario.tipoUsuario === 'administrador') {
//       const administrador = usuario as Administrador;
//       await setDoc(userRef, {
//         ...administrador,
//         uid: res.user.uid,
//         fotoPerfil: fotoURL  // Agrega la URL de la imagen de perfil
//       });
//     } else if (usuario.tipoUsuario === 'especialista') {
//       const especialista = usuario as Especialista;
//       await setDoc(userRef, {
//         ...especialista,
//         uid: res.user.uid,
//         fotoPerfil: fotoURL  // Agrega la URL de la imagen de perfil
//       });
//     }

//         // Enviar correo de verificación
//     await sendEmailVerification(res.user);
//     console.log('Correo de verificación enviado a:', usuario.email);

//     return res.user;
//   } catch (e: any) {
     
//     console.error('Error al registrar usuario:', e); // Esto imprimirá el objeto de error completo

//     // Verificar si el error es de Firebase y contiene un código
//     let errorCode = e?.code || 'error-desconocido';
//     this.msjError = this.mostrarErrorRegistro(errorCode); // Asigna el mensaje de error
    
//      // Lanza el error con el mensaje adecuado
//     throw new Error(this.msjError);
//   }
// }

// // Método para subir imágenes a Firebase Storage
// async subirImagen(file: File, path: string): Promise<string> {
//   const storage = getStorage(); // Inicializa el storage de Firebase
//   const storageRef = ref(storage, path); // Crea la referencia a la ruta en Storage
  
//   // Sube el archivo y obtiene la URL de descarga
//   await uploadBytes(storageRef, file);
//   const downloadURL = await getDownloadURL(storageRef);
  
//   return downloadURL; // Retorna la URL de descarga
// }




// Método para mostrar mensaje de error según el código de error en el registro
mostrarErrorRegistro(codigoError: string): string {
  switch (codigoError) {
    case 'auth/invalid-email':
      return 'El correo electrónico tiene un formato inválido';
    case 'auth/email-already-in-use':
      return 'El correo electrónico ya está en uso';
    case 'auth/weak-password':
      return 'La contraseña debe ser de más de 6 caracteres';
    case 'auth/missing-password':
      return 'Por favor, introduzca una contraseña';
    default:
      return 'Error desconocido: ' + codigoError;
  }
}


  // Cierra la sesión del usuario activo
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['home']);
      this.userActive = null;
    });
  }

  
  // logout(){
  //   this.actualUserSubject.next(null); // Establece el usuario en null
  //   this.auth.signOut();
  // }

  
}
