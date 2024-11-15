import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { FirebaseError } from 'firebase/app';
import { HeaderComponent } from "../../header/header.component";  // Asegúrate de importar FirebaseError si usas Firebase
/*importante si necesito trabajar con imagenes deberia poder subir a storage service */

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css'
})
export class RegistroPacienteComponent implements OnInit {
  registroPacienteForm: FormGroup;
  imagenPerfil1: File | null = null;
  imagenPerfil2: File | null = null;
  isLoading: boolean = false;
  completed: boolean = false;
  submitted: boolean = false;
  msjError: string = '';
  flagError: boolean = false;
  


  @Output() registrationCompleted = new EventEmitter<void>(); // Evento de finalización

  constructor(private fb: FormBuilder,
              private authService: AuthService, 
              
  ) {
    this.registroPacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      obraSocial: ['', [Validators.required, Validators.maxLength(20)]],
      imagenPerfil1: [null, Validators.required],
      imagenPerfil2: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  

  onFileSelect(event: any, perfil: number) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      if (perfil === 1) {
        this.imagenPerfil1 = file;
        this.registroPacienteForm.patchValue({ imagenPerfil1: this.imagenPerfil1 }); // Actualizar el formulario con la imagen
      } else if (perfil === 2) {
        this.imagenPerfil2 = file;
        this.registroPacienteForm.patchValue({ imagenPerfil2: this.imagenPerfil2 }); // Actualizar el formulario con la imagen
      }
      console.log(`Imagen de perfil ${perfil} seleccionada:`, file);
    }
  }
  

  onSubmit() {
    this.submitted = true;
  
    // Verificamos si todos los campos son válidos y las imágenes están cargadas
    if (this.registroPacienteForm.valid && this.imagenPerfil1 && this.imagenPerfil2) {
        this.isLoading = true;
        console.log(this.registroPacienteForm.value, this.imagenPerfil1, this.imagenPerfil2);
  
        // Subimos las imágenes a Firebase y obtenemos las URLs
        Promise.all([
          this.authService.subirImagen(this.imagenPerfil1, `perfil/${this.imagenPerfil1.name}`),
          this.authService.subirImagen(this.imagenPerfil2, `perfil/${this.imagenPerfil2.name}`)
        ])
        .then(([url1, url2]) => {
          // Simulamos un proceso de registro con un retraso
          setTimeout(() => {
              // Obtenemos los valores del formulario
              const { nombre, apellido, edad, dni, email, password, obraSocial } = this.registroPacienteForm.value;
  
              // Creamos el objeto usuario
              const usuario = {
                  nombre: nombre,
                  apellido: apellido,
                  edad: edad,
                  dni: dni,
                  email: email,
                  password: password,
                  tipoUsuario: 'paciente', // El tipo de usuario es paciente
                  obraSocial: obraSocial,
                  fotoPerfil1: url1, // Usamos la URL de la primera imagen
                  fotoPerfil2: url2   // Usamos la URL de la segunda imagen
              };
  
              // Llamamos al servicio de autenticación para registrar al usuario
              this.authService.registrarUsuario(usuario, password).then(user => {
                  console.log('Usuario registrado con éxito:', user);
                  this.isLoading = false;
                  this.completed = true;
  
                  // Mostrar mensaje de registro exitoso
                  console.log("Registro exitoso");
  
                  // Emitir evento al completar el registro
                  this.registrationCompleted.emit();
  
                  // Esperar un momento antes de redirigir
                  setTimeout(() => {
                      this.authService.logout(); // Esto cierra la sesión, redirigiendo a la página de login o home
                      // Si prefieres que permanezca en la página de registro, usa una redirección específica
                      // this.router.navigate(['/home']); // Redirige al home después del registro (si es necesario)
                  }, 2000); // Retraso de 2 segundos para que se muestre el mensaje antes de redirigir
              }).catch(error => {
                  console.error('Error al registrar usuario:', error);
                  this.msjError = error.message; // Mostrar el error
                  this.isLoading = false;
              });
          }, 2000);  // Simulamos un retraso de 2 segundos
        })
        .catch(error => {
          console.error('Error al subir las imágenes:', error);
          this.isLoading = false;
        });
    } else {
        console.log("Por favor, completa todos los campos.");
    }
  }
  

// onSubmit() {
//   this.submitted = true;

//   // Verificamos si todos los campos son válidos y las imágenes están cargadas
//   if (this.registroPacienteForm.valid && this.imagenPerfil1 && this.imagenPerfil2) {
//       this.isLoading = true;
//       console.log(this.registroPacienteForm.value, this.imagenPerfil1, this.imagenPerfil2);


      
//       // Simulamos un proceso de registro con un retraso
//       setTimeout(() => {
//           // Obtenemos los valores del formulario
//           const { nombre, apellido, edad, dni, email, password, obraSocial } = this.registroPacienteForm.value;

//           // Creamos el objeto usuario
//           const usuario = {
//               nombre: nombre,
//               apellido: apellido,
//               edad: edad,
//               dni: dni,
//               email: email,
//               password: password,
//               tipoUsuario: 'paciente', // El tipo de usuario es paciente
//               obraSocial: obraSocial,
//               fotoPerfil1: this.imagenPerfil1?.name, // Asumimos que se suben los archivos de las imágenes
//               fotoPerfil2: this.imagenPerfil2?.name   // Igualmente para la segunda imagen
//           };

//           // Llamamos al servicio de autenticación para registrar al usuario
//           this.authService.registrarUsuario(usuario, password).then(user => {
//               console.log('Usuario registrado con éxito:', user);
//               this.isLoading = false;
//               this.completed = true;

//               // Mostrar mensaje de registro exitoso
//               console.log("Registro exitoso");

//               // Emitir evento al completar el registro
//               this.registrationCompleted.emit();

//               // Esperar un momento antes de cerrar sesión y redirigir
//               setTimeout(() => {
//                   this.authService.logout(); //aca se hace esto para que al registrarse no 
//                   //se muestre el usuario logueado (pero dirige al home) si quiero que parmanezca en la pagian de registro
//                   //deberia crear un metodo de cierre de sesion que dirija a ese lugar.
//               }, 2000); // Retraso de 1.5 segundos para que se muestre el mensaje antes de redirigir
//           }).catch(error => {
//               console.error('Error al registrar usuario:', error);
//               this.msjError = error.message; // Mostrar el error
//               this.isLoading = false;
//           });
//       }, 2000);  // Simulamos un retraso de 2 segundos
//   } else {
//       console.log("Por favor, completa todos los campos.");
//   }
// }



  

  resetForm() {
    this.registroPacienteForm.reset();
    this.imagenPerfil1 = null;
    this.imagenPerfil2 = null;
    this.completed = false;
    this.submitted = false;
  }



  

  // onSubmit() {
  //   this.submitted = true;
    
  //   // Verificamos si todos los campos son válidos y las imágenes están cargadas
  //   if (this.registroPacienteForm.valid && this.imagenPerfil1 && this.imagenPerfil2) {
  //     this.isLoading = true;
  //     console.log(this.registroPacienteForm.value, this.imagenPerfil1, this.imagenPerfil2);
  
  //     // Simular un proceso de registro con un retraso
  //     setTimeout(() => {
  //       // Obtenemos los valores del formulario
  //       const { nombre, apellido, edad, dni, email, password, obraSocial } = this.registroPacienteForm.value;
  
  //       // Creamos el objeto usuario
  //       const usuario = {
  //         nombre: nombre,
  //         apellido: apellido,
  //         edad: edad,
  //         dni: dni,
  //         email: email,
  //         password: password,
  //         tipoUsuario: 'paciente', // El tipo de usuario es paciente
  //         obraSocial: obraSocial,
  //         fotoPerfil1: this.imagenPerfil1?.name,  // Asumimos que se suben los archivos de las imágenes
  //         fotoPerfil2: this.imagenPerfil2?.name   // Igualmente para la segunda imagen
  //       };
  
  //       // Llamamos al servicio de autenticación para registrar al usuario
  //       this.authService.registrarUsuario(usuario, password).then(user => {
  //         console.log('Usuario registrado con éxito:', user);
  //         this.isLoading = false;
  //         this.completed = true;
  //         this.registrationCompleted.emit(); // Emitir evento al completar el registro
  //       }).catch(error => {
  //         console.error('Error al registrar usuario:', error);
  //         this.msjError = this.authService.mostrarErrorRegistro(error.code); // Asigna el mensaje de error
  //         this.isLoading = false;
  //       });
  //     }, 2000);  // Simulamos un retraso de 2 segundos
  //   } else {
  //     console.log("Por favor, completa todos los campos.");
  //   }
  // }

//   onSubmit() {
//     this.submitted = true;

//     // Verificamos si todos los campos son válidos y las imágenes están cargadas
//     if (this.registroPacienteForm.valid && this.imagenPerfil1 && this.imagenPerfil2) {
//         this.isLoading = true;
//         console.log(this.registroPacienteForm.value, this.imagenPerfil1, this.imagenPerfil2);

//         // Simular un proceso de registro con un retraso
//         setTimeout(() => {
//             // Obtenemos los valores del formulario
//             const { nombre, apellido, edad, dni, email, password, obraSocial } = this.registroPacienteForm.value;

//             // Creamos el objeto usuario
//             const usuario = {
//                 nombre: nombre,
//                 apellido: apellido,
//                 edad: edad,
//                 dni: dni,
//                 email: email,
//                 password: password,
//                 tipoUsuario: 'paciente', // El tipo de usuario es paciente
//                 obraSocial: obraSocial,
//                 fotoPerfil1: this.imagenPerfil1?.name, // Asumimos que se suben los archivos de las imágenes
//                 fotoPerfil2: this.imagenPerfil2?.name   // Igualmente para la segunda imagen
//             };

//             // Llamamos al servicio de autenticación para registrar al usuario
//             this.authService.registrarUsuario(usuario, password).then(user => {
//                 console.log('Usuario registrado con éxito:', user);
//                 this.isLoading = false;
//                 this.completed = true;

//                 // Emitir evento al completar el registro
//                 this.registrationCompleted.emit();

//                 // Cerrar la sesión después del registro
//                 // this.authService.logout();
//             }).catch(error => {
//                 console.error('Error al registrar usuario:', error);
//                 this.msjError = this.authService.mostrarErrorRegistro(error.code); // Asigna el mensaje de error
//                 this.isLoading = false;
//             });
//         }, 2000);  // Simulamos un retraso de 2 segundos
//     } else {
//         console.log("Por favor, completa todos los campos.");
//     }
// }


// onFileSelect(event: any, perfil: number) {
//     const file = event.target.files[0];
//     if (file) {
//       if (perfil === 1) {
//         this.imagenPerfil1 = file;
//         this.registroPacienteForm.patchValue({ imagenPerfil1: this.imagenPerfil1 });
//       } else {
//         this.imagenPerfil2 = file;
//         this.registroPacienteForm.patchValue({ imagenPerfil2: this.imagenPerfil2 });
//       }
//     }
//   }
}