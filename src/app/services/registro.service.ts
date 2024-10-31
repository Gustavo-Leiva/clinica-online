import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // Cambia AngularFirestore por Firestore
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'; // Cambia AngularFireStorage por Storage

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private firestore: Firestore, private storage: Storage) {}

  async registrarUsuario(data: any, tipoUsuario: string) {
    const collectionRef = collection(this.firestore, tipoUsuario); // Obtén la colección de Firestore
    return await addDoc(collectionRef, data); // Agrega el documento a la colección
  }

  async subirImagen(file: File, path: string): Promise<string> {
    const fileRef = ref(this.storage, `${path}/${file.name}`); // Crea una referencia para la imagen
    await uploadBytes(fileRef, file); // Sube la imagen
    return await getDownloadURL(fileRef); // Obtén la URL de descarga de la imagen
  }
}
