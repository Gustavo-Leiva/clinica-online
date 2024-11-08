import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconosUsuario',
  standalone: true
})
export class IconosUsuarioPipe implements PipeTransform {

  transform(tipoUsuario: any)  {
    switch (tipoUsuario) {
      case 'Especialista':
        return '🩺';
      case 'Admin':
        return '👑';
      default:
        return '🟢';
    }
  }
}
