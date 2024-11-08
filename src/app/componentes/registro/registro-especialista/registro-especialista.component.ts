
import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent implements OnInit {
  registroEspecialistaForm: FormGroup;
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Neurología']; // Especialidades predefinidas
  nuevaEspecialidad: string = ''; // Para almacenar la nueva especialidad ingresada
  imagenPerfil: File | null = null;
  isLoading: boolean = false;
  completed: boolean = false;
  submitted: boolean = false;

  @Output() registrationCompleted = new EventEmitter<void>(); // Evento de finalización

  constructor(private fb: FormBuilder) {
    this.registroEspecialistaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]], // Validaciones de edad actualizadas
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Validación para DNI
      especialidad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Validación de longitud mínima para contraseña
      imagenPerfil: [null, Validators.required],
      nuevaEspecialidad: [''] // Agrega esta línea
    });
  }

  ngOnInit(): void {}

  agregarEspecialidad() {
    const nueva = this.registroEspecialistaForm.get('nuevaEspecialidad')?.value;
    if (nueva.trim() && !this.especialidades.includes(nueva)) {
      this.especialidades.push(nueva);
      this.registroEspecialistaForm.controls['especialidad'].setValue(nueva); // Seleccionar automáticamente la nueva especialidad
      this.registroEspecialistaForm.controls['nuevaEspecialidad'].setValue(''); // Limpiar el campo de entrada
    } else if (this.especialidades.includes(nueva)) {
      alert('Esta especialidad ya está en la lista.');
    }
  }
  

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenPerfil = file;
      this.registroEspecialistaForm.patchValue({ imagenPerfil: this.imagenPerfil });
    }
  }

  onSubmit() {
    this.submitted = true; // Marcar como enviado
    if (this.registroEspecialistaForm.valid && this.imagenPerfil) {
      this.isLoading = true; // Activar el loading
      console.log(this.registroEspecialistaForm.value, this.imagenPerfil);
      // Simular un proceso de registro
      setTimeout(() => {
        this.isLoading = false;
        this.completed = true; // Activar el mensaje de éxito
        this.registrationCompleted.emit(); // Emitir el evento al completar el registro
        
      }, 2000);
      
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  }


  resetForm() {
    this.registroEspecialistaForm.reset();
    this.imagenPerfil = null;
    this.completed = false; // Reiniciar el estado de completado
    this.submitted = false; // Reiniciar el estado de enviado
  }
 
}
