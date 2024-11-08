import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

/*importante si necesito trabajar con imagenes deberia poder subir a storage service */

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
    const file = event.target.files[0];
    if (file) {
      if (perfil === 1) {
        this.imagenPerfil1 = file;
        this.registroPacienteForm.patchValue({ imagenPerfil1: this.imagenPerfil1 });
      } else {
        this.imagenPerfil2 = file;
        this.registroPacienteForm.patchValue({ imagenPerfil2: this.imagenPerfil2 });
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    
    // Verificamos si todos los campos son válidos y las imágenes están cargadas
    if (this.registroPacienteForm.valid && this.imagenPerfil1 && this.imagenPerfil2) {
      this.isLoading = true;
      console.log(this.registroPacienteForm.value, this.imagenPerfil1, this.imagenPerfil2);
  
      // Simular un proceso de registro con un retraso
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
          fotoPerfil1: this.imagenPerfil1?.name,  // Asumimos que se suben los archivos de las imágenes
          fotoPerfil2: this.imagenPerfil2?.name   // Igualmente para la segunda imagen
        };
  
        // Llamamos al servicio de autenticación para registrar al usuario
        this.authService.registrarUsuario(usuario, password).then(user => {
          console.log('Usuario registrado con éxito:', user);
          this.isLoading = false;
          this.completed = true;
          this.registrationCompleted.emit(); // Emitir evento al completar el registro
        }).catch(error => {
          console.error('Error al registrar usuario:', error);
          this.isLoading = false;
        });
      }, 2000);  // Simulamos un retraso de 2 segundos
    } else {
      console.log("Por favor, completa todos los campos.");
    }
  }
  

  resetForm() {
    this.registroPacienteForm.reset();
    this.imagenPerfil1 = null;
    this.imagenPerfil2 = null;
    this.completed = false;
    this.submitted = false;
  }
}