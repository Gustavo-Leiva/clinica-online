import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltarFila]',
  standalone: true
})
export class ResaltarFilaDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar('#b3e1f2');
    
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar(null);
  }

  private resaltar(color: string | null) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }


}
