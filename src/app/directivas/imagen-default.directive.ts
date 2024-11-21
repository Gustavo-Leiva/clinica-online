import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImagenDefault]',
  standalone: true
})
export class ImagenDefaultDirective {

  constructor(private readonly image: ElementRef) {}

  @HostListener('error')
  onError(): void {
    this.image.nativeElement.src = '../../assets/imagenes/especialidades/default-image.png';
  }

}
