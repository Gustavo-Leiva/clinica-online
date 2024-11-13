
import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent implements OnInit {
  registroEspecialistaForm: FormGroup;
  especialidades: string[] = [
    'Cardiología',
    'Dermatología',
    'Neurología',
    'Pediatría',
    'Ginecología',
    'Oncología',
    'Psiquiatría',
    'Traumatología',
    'Oftalmología',
    'Endocrinología'
  ];
   // Especialidades predefinidas
  especialidadesDelMedico: string[] = []; // Especialidades asignadas al médico
  nuevaEspecialidad: string = ''; // Para almacenar la nueva especialidad ingresada
  imagenPerfil1: File | null = null;
  isLoading: boolean = false;
  completed: boolean = false;
  submitted: boolean = false;
  msjError: string = '';
  // file1?: File;
  // file2?: File;

  @Output() registrationCompleted = new EventEmitter<void>(); // Evento de finalización

  constructor(private fb: FormBuilder, private authService: AuthService, ) {
    this.registroEspecialistaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]], // Validaciones de edad actualizadas
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Validación para DNI
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Validación de longitud mínima para contraseña
      imagenPerfil1: [null, Validators.required],
      especialidadSeleccionada: [null],
      nuevaEspecialidad: ['']
      // especialidad: ['', Validators.required],
   
    });
  }

  ngOnInit(): void {
    
  }

 
// Método para agregar especialidad
agregarEspecialidadAlMedico() {
  const especialidadSeleccionada = this.registroEspecialistaForm.get('especialidadSeleccionada')?.value;
  if (especialidadSeleccionada && !this.especialidadesDelMedico.includes(especialidadSeleccionada)) {
    this.especialidadesDelMedico.push(especialidadSeleccionada);
    this.registroEspecialistaForm.get('especialidadSeleccionada')?.setValue(null); // Limpiar selección
  }
}


// Método para eliminar una especialidad de la lista
removerEspecialidadDelMedico(index: number) {
  this.especialidadesDelMedico.splice(index, 1);
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

onSubmit() {
  this.submitted = true;

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
            fotoPerfil1: url1 // URL de la única imagen de perfil
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
 

}
