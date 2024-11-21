import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../../services/auth.service';
import { TurnosService } from '../../services/turnos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, Especialista } from '../interfaces/Usuario';
import Swal from 'sweetalert2';
// import { jsPDF } from 'jspdf';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ExpandirHoverDirective } from '../../directivas/expandir-hover.directive';
import { animations } from '../../animations/animations';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, ExpandirHoverDirective],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
  animations:[animations.deslizarAbajo]
})
export class PerfilComponent implements OnInit {

  @ViewChild('content') content!: ElementRef;
  usuarioLogueado:any;
  diasAtencion: string[] = [];
  horariosAtencion: string[] = [];
  fotoPerfil = true;
  historialClinico: any[] = [];
  nombreApellidoFiltro: string = "";
  especialidadesDisponibles: string[] = []; // Aquí almacenaremos las especialidades del especialista
  
  constructor(public authService:AuthService,
              public usuarioService:UsuariosService,
              public turnosService: TurnosService) { }

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
      if (this.usuarioLogueado.tipoUsuario == "especialista"){

         // Hacemos el casting a 'Especialista'
         const especialista = this.usuarioLogueado as Especialista; // Aquí realizamos el casting
        // this.diasAtencion = this.usuarioLogueado.diasAtencion;
        // this.horariosAtencion = this.usuarioLogueado.horariosAtencion;
        this.diasAtencion = especialista.diasAtencion || ['Lunes'];  // Valores predeterminados si no se encuentran
       this.horariosAtencion = especialista.horariosAtencion || ['9:00 a 13:00'];  // Valores predeterminados si no se encuentran
        this.especialidadesDisponibles = especialista.especialidades || []; // Accedemos a 'especialidades'
      
      }
    });
    this.cargarHistorialClinico();
  }




  // toggleDia(dia: string) {
  //   if (this.diasAtencion.includes(dia)) {
  //     this.diasAtencion = this.diasAtencion.filter(item => item !== dia);
  //   } else {
  //     this.diasAtencion.push(dia);
  //   }
  // }

   // Método para manejar el cambio en los días de atención
   toggleDia(dia: string): void {
    if (this.diasAtencion.includes(dia)) {
      this.diasAtencion = this.diasAtencion.filter(d => d !== dia);  // Elimina el día si ya está seleccionado
    } else {
      this.diasAtencion.push(dia);  // Agrega el día si no está seleccionado
    }
  }

    // toggleHorario(horario: string) {
  //   if (this.horariosAtencion.includes(horario)) {
  //     this.horariosAtencion = this.horariosAtencion.filter(item => item !== horario);
  //   } else {
  //     this.horariosAtencion.push(horario);
  //   }
  // }

    // Método para manejar el cambio en los horarios de atención
    toggleHorario(horario: string): void {
      if (this.horariosAtencion.includes(horario)) {
        this.horariosAtencion = this.horariosAtencion.filter(h => h !== horario);  // Elimina el horario si ya está seleccionado
      } else {
        this.horariosAtencion.push(horario);  // Agrega el horario si no está seleccionado
      }
    }

  cargarHistorialClinico() {
    if (this.usuarioLogueado) {
      this.turnosService.getHistoriaClinica(this.usuarioLogueado.dni.toString())
        .subscribe(historial => {
          this.historialClinico = historial.filter(turno => 
            historial.filter(item => item.atendido == true) &&
            `${turno.nombreDoctor} ${turno.apellidoDoctor}`.toLowerCase().includes(this.nombreApellidoFiltro.toLowerCase())
          );
        });
    }
  }
  


  verDetalle(turno: any) {
    const { altura, datosDinamicos, peso, presion, temperatura } = turno.atencionDoc;
  
    let mensaje = `
      <p><strong>Altura:</strong> ${altura}</p>
      <p><strong>Peso:</strong> ${peso}</p>
      <p><strong>Presión:</strong> ${presion}</p>
      <p><strong>Temperatura:</strong> ${temperatura}</p>
    `;
  
    if (datosDinamicos && datosDinamicos.length > 0) {
      mensaje += '<p> <strong>Datos Dinámicos:</strong></p><ul>';
      datosDinamicos.forEach((dato: any) => {
        mensaje += `<li>${dato.clave}: ${dato.valor}</li>`;
      });
      mensaje += '</ul>';
    }
  
    Swal.fire({
      title: "Reseña brindada por el doctor",
      html: mensaje,
      width: 600,
      padding: "3em",
      color: "#716add",
      backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `
    });
  }

  guardarCambios() {

    Swal.fire({
        title: '¿Estás seguro de que quieres actualizar tu disponibilidad?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            this.usuarioService.actualizarDisponibilidad(this.usuarioLogueado, this.horariosAtencion, this.diasAtencion);
        }
    });
  }

  descargarPdf() {
    const content = this.content.nativeElement;
    const pdf = new jspdf.jsPDF();
  
    // Agregar el logo
    const logoImg = new Image();
    logoImg.src = "/assets/imagenes/logo.jfif";
  
    pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
  
    // Agregar el título
    pdf.setFontSize(16);
    pdf.text('Obra Social Clinica Salud', 50, 20); // Ajusta la posición y el nombre de tu clínica
  
    pdf.setFontSize(14);
    pdf.text("Historia Clinica", 10, 50);
  
    // Agregar la fecha de emisión
    pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, 70);
  
    // Convertir el contenido de la tabla en una imagen
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Ancho de la página en mm
      const pageHeight = 297; // Alto de la página en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      let position = 0;
  
      // Agregar la imagen de la tabla al PDF
      pdf.addImage(imgData, 'PNG', 10, 80, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // Descargar el archivo PDF
      pdf.save('informe_turnos.pdf');
    });
    
  }



  

}

