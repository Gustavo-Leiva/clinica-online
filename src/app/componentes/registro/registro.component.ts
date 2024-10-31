import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistroService } from '../../services/registro.service'; // Asegúrate de importar el servicio
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Pediatría'];
  nuevaEspecialidad: string = '';
  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  submitted: boolean = false;
  completed: boolean = false;
  isLoading = false;
  imagen1!: File;
  imagen2!: File;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService
  ) {
    this.registroForm = this.fb.group({
      tipoUsuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      obraSocial: ['', this.isPaciente ? Validators.required : null],
      especialidad: ['', this.isEspecialista ? Validators.required : null],
      imagenPerfil: [''],
      nuevaEspecialidad: [''],
    });
  }

  ngOnInit(): void {}

  onTipoUsuarioChange() {
    const tipo = this.registroForm.get('tipoUsuario')?.value;
    this.isPaciente = tipo === 'paciente';
    this.isEspecialista = tipo === 'especialista';
  
    if (this.isPaciente) {
      this.registroForm.get('obraSocial')?.setValidators([Validators.required]);
      this.registroForm.get('especialidad')?.clearValidators();
    } else if (this.isEspecialista) {
      this.registroForm.get('especialidad')?.setValidators([Validators.required]);
      this.registroForm.get('obraSocial')?.clearValidators();
    }
  
    // Necesario para re-evaluar el estado de los campos después de cambiar las validaciones
    this.registroForm.get('obraSocial')?.updateValueAndValidity();
    this.registroForm.get('especialidad')?.updateValueAndValidity();
  }
  

  agregarEspecialidad() {
    const nuevaEspecialidad = this.registroForm.get('nuevaEspecialidad')?.value;
    if (nuevaEspecialidad && !this.especialidades.includes(nuevaEspecialidad)) {
      this.especialidades.push(nuevaEspecialidad);
      this.registroForm.get('nuevaEspecialidad')?.setValue(''); // Resetea el campo
    }
  }
  

  onFileSelect(event: any, tipo: string) {
    const file = event.target.files[0];
    if (file) {
      if (tipo === 'imagen1') {
        this.imagen1 = file;
      } else if (tipo === 'imagen2') {
        this.imagen2 = file;
      }
    }
  }

  async onSubmit() {
    this.submitted = true; // Marca el formulario como enviado
    
  
    if (this.registroForm.valid) {
      this.isLoading = true; // Activa el spinner
      const tipoUsuario = this.registroForm.get('tipoUsuario')?.value;
      const datos = { ...this.registroForm.value };
  
      try {
        if (this.isPaciente) {
          if (this.imagen1) {
            const img1Url = await this.subirImagenPaciente(this.imagen1, datos.dni, 'imagen1');
            datos.imagen1 = img1Url;
          }
          if (this.imagen2) {
            const img2Url = await this.subirImagenPaciente(this.imagen2, datos.dni, 'imagen2');
            datos.imagen2 = img2Url;
          }
        } else if (this.isEspecialista && this.imagen1) {
          const imgUrl = await this.subirImagenPaciente(this.imagen1, datos.dni, 'perfil');
          datos.imagenPerfil = imgUrl;
        }
  
        // Llamar al servicio para registrar el usuario
        await this.registroService.registrarUsuario(datos, tipoUsuario);
        console.log('Usuario registrado exitosamente en Firestore');
        this.completed = true;// Muestra el mensaje de completado
        // this.registroForm.reset(); // Resetea el formulario
        // this.submitted = false; // Reinicia el estado de enviado

        // Puedes agregar un pequeño retraso antes de resetear
      setTimeout(() => {
        this.registroForm.reset(); // Resetea el formulario
        this.submitted = false; // Reinicia el estado de enviado
        this.completed = false; // Restablece completed para que no se muestre de nuevo
      }, 3000); // 2 segundos de espera
  
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Manejo de errores, tal vez mostrar un mensaje al usuario
      } finally {
        this.isLoading = false; // Desactiva el spinner después de completar el envío
      }
    } else {
      // Manejo del caso en que el formulario es inválido
      console.log('Formulario inválido, por favor completa todos los campos requeridos.');
      // this.isLoading = false; // Desactiva el spinner en caso de error
    }
  }
  
  async subirImagenPaciente(
    file: File,
    dni: string,
    imagenTipo: string
  ): Promise<string> {
    const path = `usuarios/${dni}/${imagenTipo}`;
    const imgUrl = await this.registroService.subirImagen(file, path);
    return imgUrl; // Ahora imgUrl siempre será un string
  }
}
