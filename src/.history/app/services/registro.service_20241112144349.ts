// import { Injectable } from '@angular/core';
// import { Firestore, collection, addDoc, DocumentReference, DocumentData, getDoc, doc } from '@angular/fire/firestore';
// import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
// import { userData } from '../componentes/interfaces/userData';

// @Injectable({
//   providedIn: 'root',
// })
// export class RegistroService {
//   constructor(private firestore: Firestore, private storage: Storage) {}

//   // Método para registrar un usuario en Firestore
//   async registrarUsuario(data: userData, tipoUsuario: 'paciente' | 'especialista'): Promise<DocumentReference<DocumentData> | undefined> {
//     const collectionRef = collection(this.firestore, 'usuarios');
//     data.tipoUsuario = tipoUsuario;

//     try {
//       return await addDoc(collectionRef, data);
//     } catch (error) {
//       console.error('Error al agregar documento a Firestore:', error);
//       return undefined;
//     }
//   }

//   // Método para obtener un usuario de Firestore
//   async obtenerUsuarioFirestore(uid: string): Promise<userData | null> {
//     const userRef = doc(this.firestore, `usuarios/${uid}`);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       return userSnap.data() as userData;
//     } else {
//       console.log("Documento no encontrado en la colección de usuarios.");
//       return null;
//     }
//   }

//   // Método para subir una imagen a Firebase Storage
//   async subirImagen(file: File, path: string): Promise<string> {
//     const fileRef = ref(this.storage, `${path}/${file.name}`);  // Crea una referencia para la imagen
//     await uploadBytes(fileRef, file); // Sube la imagen
//     return await getDownloadURL(fileRef); // Obtén la URL de descarga de la imagen
//   }
// }
