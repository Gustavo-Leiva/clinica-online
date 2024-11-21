import { Component, OnInit } from '@angular/core';
import { TurnosService } from '../../services/turnos.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular'; // Importa el módulo de Highcharts
import { from } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [HighchartsChartModule, HeaderComponent],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent implements OnInit {
  highcharts: any = Highcharts;
  chartOptionsEspecialidades: any = {};
  chartOptionsDias: any = {};
  especialidades: string[] = ['','Cardiología', 'Dermatología','Endocrinología','Ginecología','Neurología',  'Oftalmología','Pediatría','Psiquiatría','Traumatología', ];
  seriesDataEspecialidades: any = [];
  seriesDataDias: any = [];
  medicoId: string = '123';  // El ID del médico (deberías obtenerlo dinámicamente en tu aplicación)
  fechaInicio: Date = new Date('2024-11-01');  // Fecha de inicio (ajusta según sea necesario)
  fechaFin: Date = new Date('2024-12-31');     // Fecha de fin (ajusta según sea necesario

  constructor(private turnosService: TurnosService) {}

  ngOnInit() {
    this.chartOptionsEspecialidades = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cantidad de turnos por especialidad'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Cantidad de turnos'
        }
      },
      series: [{
        name: 'Turnos',
        colorByPoint: true,
        data: this.seriesDataEspecialidades
      }]
    };

    this.chartOptionsDias = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cantidad de turnos por día'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Cantidad de turnos'
        }
      },
      series: [{
        name: 'Turnos',
        colorByPoint: true,
        data: this.seriesDataDias
      }]
    };

    this.loadChartData();
  }

  loadChartData() {
    // Cargar datos para la cantidad de turnos por especialidad
    this.especialidades.forEach(especialidad => {
      this.turnosService.getCantidadTurnosPorEspecialidad(especialidad)
        .then(cantidad => {
          this.seriesDataEspecialidades.push({
            name: especialidad,
            y: cantidad
          });
  
          // Actualizar el gráfico con los nuevos datos
          this.chartOptionsEspecialidades.series[0].data = this.seriesDataEspecialidades;
          Highcharts.chart('chartContainerEspecialidades', this.chartOptionsEspecialidades);
        })
        .catch(error => {
          console.error('Error al obtener cantidad de turnos por especialidad', error);
        });
    });
  
    // Cargar datos para la cantidad de turnos por día
    this.turnosService.getDiasConTurnos()
      .then(dias => {
        dias.forEach(dia => {
          this.turnosService.getCantidadTurnosPorDia(dia)
            .then(cantidad => {
              this.seriesDataDias.push({
                name: dia,
                y: cantidad
              });
  
              // Actualizar el gráfico con los nuevos datos
              this.chartOptionsDias.series[0].data = this.seriesDataDias;
              Highcharts.chart('chartContainerDias', this.chartOptionsDias);
            })
            .catch(error => {
              console.error('Error al obtener cantidad de turnos por día', error);
            });
        });
      })
      .catch(error => {
        console.error('Error al obtener los días con turnos', error);
      });
  }
  
  descargarPdfEspecialidades() {
    const contentEspecialidades = document.getElementById('chartContainerEspecialidades');
  
    if (!contentEspecialidades) {
      console.error('No se pudo encontrar el contenedor del gráfico de especialidades.');
      return;
    }
  
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600],
    });
  
    const logoImg = new Image();
    logoImg.src = "/assets/imagenes/logo.jfif";
    pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
  
    pdf.setFontSize(16);
    pdf.text('Obra Social Clinica Medica', 50, 20);
  
    pdf.setFontSize(14);
    pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, 70);
  
    html2canvas(contentEspecialidades).then((canvasEspecialidades) => {
      const imgDataEspecialidades = canvasEspecialidades.toDataURL('image/png');
      this.agregarImagenAPdf(pdf, imgDataEspecialidades, 80);
  
      pdf.save('informe_turnos_especialidades.pdf');
    });
  }

  descargarPdfDias() {
    const contentDias = document.getElementById('chartContainerDias');
  
    if (!contentDias) {
      console.error('No se pudo encontrar el contenedor del gráfico de días.');
      return;
    }
  
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600],
    });
  
    const logoImg = new Image();
    logoImg.src = "/assets/imagenes/logo.jfif";
    pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
  
    pdf.setFontSize(16);
    pdf.text('Obra Social Personal Informatica', 50, 20);
  
    pdf.setFontSize(14);
    pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, 70);
  
    html2canvas(contentDias).then((canvasDias) => {
      const imgDataDias = canvasDias.toDataURL('image/png');
      this.agregarImagenAPdf(pdf, imgDataDias, 80);
  
      pdf.save('informe_turnos_dias.pdf');
    });
  }

  private agregarImagenAPdf(pdf: any, imgData: string, positionY: number) {
    const imgWidth = 800; // Ancho del gráfico
    const imgHeight = 600; // Alto del gráfico
  
    pdf.addImage(imgData, 'PNG', 10, positionY, imgWidth, imgHeight);
  }

}