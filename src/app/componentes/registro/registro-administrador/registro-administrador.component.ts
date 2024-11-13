import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro-administrador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './registro-administrador.component.html',
  styleUrl: './registro-administrador.component.css'
})
export class RegistroAdministradorComponent implements OnInit {
  registroAdministradorForm: FormGroup;
  imagenPerfil1: File | null = null;
  isLoading: boolean = false;
  completed: boolean = false;
  submitted: boolean = false;
  msjError: string = '';
  flagError: boolean = false;

  @Output() registrationCompleted = new EventEmitter<void>(); // Evento de finalización

  constructor(private fb: FormBuilder,
              private authService: AuthService, 
              
  ) {
    this.registroAdministradorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagenPerfil1: [null, Validators.required],
    });
  }

  ngOnInit(): void {}


  onFileSelect(event: any, perfil: number) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      if (perfil === 1) {
        this.imagenPerfil1 = file;
        this.registroAdministradorForm.patchValue({ imagenPerfil1: this.imagenPerfil1 }); // Actualizar el formulario con la imagen
   
      console.log(`Imagen de perfil ${perfil} seleccionada:`, file);
    }
  }
  }

  // onSubmit() {
  //   this.submitted = true;
  
  //   // Verificamos si todos los campos son válidos y las imágenes están cargadas
  //   if (this.registroAdministradorForm.valid && this.imagenPerfil1) {
  //       this.isLoading = true;
  //       console.log(this.registroAdministradorForm.value, this.imagenPerfil1);
  
  //       // Simulamos un proceso de registro con un retraso
  //       setTimeout(() => {
  //           // Obtenemos los valores del formulario
  //           const { nombre, apellido, edad, dni, email, password } = this.registroAdministradorForm.value;
  
  //           // Creamos el objeto usuario
  //           const usuario = {
  //               nombre: nombre,
  //               apellido: apellido,
  //               edad: edad,
  //               dni: dni,
  //               email: email,
  //               password: password,
  //               tipoUsuario: 'administrador', // El tipo de usuario es paciente
  //               fotoPerfil1: this.imagenPerfil1?.name, // Asumimos que se suben los archivos de las imágenes
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
  

  onSubmit() {
    this.submitted = true;
  
    // Depuración: Verificamos cada condición
    console.log("Formulario válido:", this.registroAdministradorForm.valid);
    console.log("Imagen de perfil cargada:", this.imagenPerfil1);
  
    // Verificamos que el formulario sea válido y que la imagen esté cargada
    if (this.registroAdministradorForm.valid && this.imagenPerfil1) {
      this.isLoading = true;
      console.log(this.registroAdministradorForm.value, this.imagenPerfil1);
  
      // Subimos solo la imagen de perfil a Firebase y obtenemos la URL
      this.authService.subirImagen(this.imagenPerfil1, `perfil/${this.imagenPerfil1.name}`)
        .then((url1) => {
          // Simulamos un proceso de registro con un retraso
          setTimeout(() => {
            const { nombre, apellido, edad, dni, email, password } = this.registroAdministradorForm.value;
  
            // Creamos el objeto de usuario para administrador
            const usuario = {
              nombre,
              apellido,
              edad,
              dni,
              email,
              password,
              tipoUsuario: 'administrador', // Tipo de usuario administrador
              fotoPerfil1: url1 // URL de la imagen de perfil
            };
  
            // Llamamos al servicio de autenticación para registrar al usuario
            this.authService.registrarUsuario(usuario, password)
              .then(user => {
                console.log('Administrador registrado con éxito:', user);
                this.isLoading = false;
                this.completed = true;
                this.registrationCompleted.emit();
  
                // Cierra la sesión después de un pequeño retraso
                setTimeout(() => {
                  this.authService.logout();
                }, 2000);
              })
              .catch(error => {
                console.error('Error al registrar administrador:', error);
                this.msjError = error.message; // Muestra el error en la vista
                this.isLoading = false;
              });
          }, 2000); // Retraso de 2 segundos para simular el proceso de registro
        })
        .catch(error => {
          console.error('Error al subir la imagen:', error);
          this.isLoading = false;
        });
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  }
  




}

