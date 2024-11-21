import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltarElemento]',
  standalone: true
})
export class ResaltarElementoDirective {

  constructor(private elemento: ElementRef, private renderizador: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar('lightskyblue'); // Aplica el color de fondo al pasar el mouse.
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar(null); // Elimina el color de fondo al quitar el mouse.
  }

  private resaltar(color: string | null) {
    this.renderizador.setStyle(this.elemento.nativeElement, 'background-color', color);
  }

}
