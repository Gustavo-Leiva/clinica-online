
import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario,Especialista } from '../../interfaces/Usuario';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule,RecaptchaModule],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent implements OnInit {
  registroEspecialistaForm: FormGroup;
  especialidades: string[] = [
    'Cardiología',
    'Dermatología',
    'Endocrinología',
    'Ginecología',
    'Neurología',
    'Oftalmología',
    'Pediatría',
    'Psiquiatría',
    'Traumatología'
  ];
   // Especialidades predefinidas
  especialidadesDelMedico: string[] = []; // Especialidades asignadas al médico
  nuevaEspecialidad: string = ''; // Para almacenar la nueva especialidad ingresada
  imagenPerfil1: File | null = null;
  isLoading: boolean = false;
  completed: boolean = false;
  submitted: boolean = false;
  msjError: string = '';
  especialistasPendientes: Especialista[] = [];
  captchaResolved = signal(false);  // Usamos signal para almacenar el estado
  

  @Output() registrationCompleted = new EventEmitter<void>(); // Evento de finalización

  constructor(private fb: FormBuilder, private authService: AuthService, private usuarioService: UsuariosService) {
    this.registroEspecialistaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]], // Validaciones de edad actualizadas
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Validación para DNI
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Validación de longitud mínima para contraseña
      imagenPerfil1: [null, Validators.required],
      especialidadSeleccionada: [null],
      nuevaEspecialidad: [''],
      estado: ['pendiente']  // Agrega este campo con el valor por defecto 'pendiente'
      // especialidad: ['', Validators.required],
   
    });
  }

  ngOnInit(): void {
    // this.obtenerEspecialistasPendientes();
  }

 
   // Este método se ejecuta cuando el usuario resuelve el captcha
 onCaptchaResolved(response: string | null): void {
  if (response) {
    this.captchaResolved.set(true);  // Cambia el estado del captcha a resuelto
  } else {
    this.captchaResolved.set(false); // Si no se resuelve el captcha, aseguramos que el estado sea falso
  }
}


onFileSelect(event: any, perfil: number) {
  const file = event.target.files[0]; // Obtener el archivo seleccionado
  if (file) {
    if (perfil === 1) {
      this.imagenPerfil1 = file;
      this.registroEspecialistaForm.patchValue({ imagenPerfil1: this.imagenPerfil1 }); // Actualizar el formulario con la imagen
 
    console.log(`Imagen de perfil ${perfil} seleccionada:`, file);
  }
}
}

  // obtenerEspecialistasPendientes(): void {
  //   this.usuarioService.getEspecialistasPendientes().subscribe((especialistas) => {
  //     this.especialistasPendientes = especialistas;
  //   });
  //   console.log("  obtenerEspecialistasPendientes")
  // }


  // actualizarEstadoEspecialista(especialistaId: string, estado: 'aceptado' | 'rechazado'): void {
  //   this.usuarioService.actualizarEstadoEspecialista(especialistaId, estado)
  //     .then(() => {
  //       this.obtenerEspecialistasPendientes();
  //     })
  //     .catch((error) => {
  //       console.error("Error al actualizar el estado del especialista:", error);
  //     });
  //     console.log("funciona actualizarEstadoEspecialista")
  // }

// Método para agregar especialidad
agregarEspecialidadAlMedico() {
  const especialidadSeleccionada = this.registroEspecialistaForm.get('especialidadSeleccionada')?.value;
  if (especialidadSeleccionada && !this.especialidadesDelMedico.includes(especialidadSeleccionada)) {
    this.especialidadesDelMedico.push(especialidadSeleccionada);
    this.registroEspecialistaForm.get('especialidadSeleccionada')?.setValue(null); // Limpiar selección
  }
}


// Método para agregar una nueva especialidad a la lista de opciones
agregarNuevaEspecialidad() {
  const nuevaEspecialidad = this.registroEspecialistaForm.get('nuevaEspecialidad')?.value?.trim();
  if (nuevaEspecialidad && !this.especialidades.includes(nuevaEspecialidad)) {
    this.especialidades.push(nuevaEspecialidad); // Agregar a la lista de opciones
    this.especialidadesDelMedico.push(nuevaEspecialidad); // Asignar directamente al médico
    this.registroEspecialistaForm.get('nuevaEspecialidad')?.setValue(''); // Limpiar campo
  } else if (nuevaEspecialidad) {
    alert('La especialidad ya existe o el campo está vacío.');
  }
}


// Método para eliminar una especialidad de la lista
removerEspecialidadDelMedico(index: number) {
  this.especialidadesDelMedico.splice(index, 1);
}




onSubmit() {
  this.submitted = true;

     // Verificar si el captcha está resuelto
     if (!this.captchaResolved()) {
      console.log("Por favor, resuelve el captcha.");
      return; // Detener el submit si el captcha no está resuelto
     }

  // Depuración: Verificamos cada condición
  console.log("Formulario válido:", this.registroEspecialistaForm.valid);
  console.log("Imagen de perfil cargada:", this.imagenPerfil1);
  console.log("Especialidades del médico:", this.especialidadesDelMedico);

  // Verificamos que el formulario sea válido y que la imagen esté cargada
  if (this.registroEspecialistaForm.valid && this.imagenPerfil1 && this.especialidadesDelMedico.length > 0) {
    this.isLoading = true;
    console.log(this.registroEspecialistaForm.value, this.imagenPerfil1);

    // Subimos solo la imagen de perfil a Firebase y obtenemos la URL
    this.authService.subirImagen(this.imagenPerfil1, `perfil/${this.imagenPerfil1.name}`)
      .then((url1) => {
        // Simulamos un proceso de registro con un retraso
        setTimeout(() => {
          const { nombre, apellido, edad, dni, email, password } = this.registroEspecialistaForm.value;

          // Creamos el objeto de usuario para especialista
          const usuario = {
            nombre,
            apellido,
            edad,
            dni,
            email,
            password,
            tipoUsuario: 'especialista', // Tipo de usuario especialista
            especialidades: this.especialidadesDelMedico, // Especialidades del especialista
            fotoPerfil1: url1, // URL de la única imagen de perfil
            estado: 'pendiente'  // Incluir el estado aquí
          };

          // Llamamos al servicio de autenticación para registrar al usuario
          this.authService.registrarUsuario(usuario, password)
            .then(user => {
              console.log('Especialista registrado con éxito:', user);
              this.isLoading = false;
              this.completed = true;
              this.registrationCompleted.emit();

              // Cierra la sesión después de un pequeño retraso
              setTimeout(() => {
                this.authService.logout();
              }, 2000);
            })
            .catch(error => {
              console.error('Error al registrar especialista:', error);
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





  resetForm() {
    this.registroEspecialistaForm.reset();
    this.imagenPerfil1 = null;
    this.completed = false; // Reiniciar el estado de completado
    this.submitted = false; // Reiniciar el estado de enviado
  }
 



  
  // onFileSelect(event: Event, fileNumber: number) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     if (fileNumber === 1) {
  //       this.file1 = input.files[0];  // Almacena en file1
  //     } else if (fileNumber === 2) {
  //       this.file2 = input.files[0];  // Almacena en file2
  //     }
  //   }
  // }

  // onSubmit() {
  //   this.submitted = true; // Marcar como enviado
  //   if (this.registroEspecialistaForm.valid && this.imagenPerfil) {
  //     this.isLoading = true; // Activar el loading
  //     console.log(this.registroEspecialistaForm.value, this.imagenPerfil);
  //     // Simular un proceso de registro
  //     setTimeout(() => {
  //       this.isLoading = false;
  //       this.completed = true; // Activar el mensaje de éxito
  //       this.registrationCompleted.emit(); // Emitir el evento al completar el registro
        
  //     }, 2000);
      
  //   } else {
  //     console.log("Por favor, completa todos los campos.");
  //   }
  // }


//   onSubmit() {
//     this.submitted = true;
  
//     // Verificamos si todos los campos son válidos, la imagen está cargada, y hay al menos una especialidad
//     if (this.registroEspecialistaForm.valid && this.imagenPerfil1 && this.especialidadesDelMedico.length > 0) {
//       this.isLoading = true;
//       console.log(this.registroEspecialistaForm.value, this.imagenPerfil1);
  
//       // Subimos las imágenes a Firebase y obtenemos las URLs
//       Promise.all([
//         this.authService.subirImagen(this.imagenPerfil1, `perfil/${this.imagenPerfil1.name}`),

//       ])
//       .then(([url1]) => {
//         // Simulamos un proceso de registro con un retraso

//       setTimeout(() => {
//         const { nombre, apellido, edad, dni, email, password } = this.registroEspecialistaForm.value;
  
//         const usuario = {
//           nombre,
//           apellido,
//           edad,
//           dni,
//           email,
//           password,
//           tipoUsuario: 'especialista',
//           especialidades: this.especialidadesDelMedico,
//           fotoPerfil1: url1, // Usamos la URL de la primera imagen
//         };
  
//         this.authService.registrarUsuario(usuario, password).then(user => {
//           console.log('Especialista registrado con éxito:', user);
//           this.isLoading = false;
//           this.completed = true;
//           this.registrationCompleted.emit();
  
//           setTimeout(() => {
//             this.authService.logout();
//           }, 2000);
//         }).catch(error => {
//           console.error('Error al registrar especialista:', error);
//           this.msjError = error.message;
//           this.isLoading = false;
//         });
//       }, 2000);
//     })
//     .catch(error => {
//       console.error('Error al subir las imágenes:', error);
//       this.isLoading = false;
//     });
// } else {
//     console.log("Por favor, completa todos los campos.");
// }
// }


}
