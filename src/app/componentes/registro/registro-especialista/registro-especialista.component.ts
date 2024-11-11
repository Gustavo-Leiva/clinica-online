
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
  imagenPerfil: File | null = null;
  isLoading: boolean = false;
  completed: boolean = false;
  submitted: boolean = false;
  msjError: string = '';

  @Output() registrationCompleted = new EventEmitter<void>(); // Evento de finalización

  constructor(private fb: FormBuilder, private authService: AuthService, ) {
    this.registroEspecialistaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]], // Validaciones de edad actualizadas
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Validación para DNI
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Validación de longitud mínima para contraseña
      imagenPerfil: [null, Validators.required],
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



  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenPerfil = file;
      this.registroEspecialistaForm.patchValue({ imagenPerfil: this.imagenPerfil });
    }
  }


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


  onSubmit() {
    this.submitted = true;
  
    // Verificamos si todos los campos son válidos, la imagen está cargada, y hay al menos una especialidad
    if (this.registroEspecialistaForm.valid && this.imagenPerfil && this.especialidadesDelMedico.length > 0) {
      this.isLoading = true;
      console.log(this.registroEspecialistaForm.value, this.imagenPerfil);
  
      setTimeout(() => {
        const { nombre, apellido, edad, dni, email, password } = this.registroEspecialistaForm.value;
  
        const usuario = {
          nombre,
          apellido,
          edad,
          dni,
          email,
          password,
          tipoUsuario: 'especialista',
          especialidades: this.especialidadesDelMedico,
          fotoPerfil: this.imagenPerfil?.name
        };
  
        this.authService.registrarUsuario(usuario, password).then(user => {
          console.log('Especialista registrado con éxito:', user);
          this.isLoading = false;
          this.completed = true;
          this.registrationCompleted.emit();
  
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        }).catch(error => {
          console.error('Error al registrar especialista:', error);
          this.msjError = error.message;
          this.isLoading = false;
        });
      }, 2000);
    } else {
      if (this.especialidadesDelMedico.length === 0) {
        console.log("Por favor, selecciona al menos una especialidad.");
      }
    }
  }



  resetForm() {
    this.registroEspecialistaForm.reset();
    this.imagenPerfil = null;
    this.completed = false; // Reiniciar el estado de completado
    this.submitted = false; // Reiniciar el estado de enviado
  }
 

}
