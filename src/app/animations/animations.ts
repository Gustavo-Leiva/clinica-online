import { trigger, state, style, animate, transition } from '@angular/animations';

export const animations = {


 // Animación de deslizamiento desde abajo
  deslizarAbajo: trigger('deslizarAbajo', [
    state('void', style({
      transform: 'translateY(100%)',  // Mueve el componente desde abajo
      opacity: 0
    })),
    state('*', style({
      transform: 'translateY(0)',    // Componente en su posición original
      opacity: 1
    })),
    transition('void => *', animate('0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)')),
  ]),

  // Animación de deslizamiento desde arriba
  deslizarArriba: trigger('deslizarArriba', [
    state('void', style({
      transform: 'translateY(-1000px)',
      opacity: 0
    })),
    state('*', style({
      transform: 'translateY(0)',
      opacity: 1
    })),
    transition('void => *', animate('0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)')),
  ]),

  // Animación de escala en el centro
  escalaCentro: trigger('escalaCentro', [
    state('void', style({
      transform: 'scale(0)',
      opacity: 0
    })),
    state('*', style({
      transform: 'scale(1)',
      opacity: 1
    })),
    transition('void => *', animate('0.5s cubic-bezier(.25,.46,.45,.94)')),
  ]),

  // Animación de rotación vertical hacia la izquierda
  rotarVerticalIzquierda: trigger('rotarVerticalIzquierda', [
    state('*', style({
      transform: 'rotateY(360deg)',
      transformOrigin: 'left'
    })),
    transition('void => *', animate('1s cubic-bezier(.25,.46,.45,.94)')),
  ]),

  // Animación de rebote hacia arriba
  reboteArriba: trigger('reboteArriba', [
    state('void', style({
      transform: 'translateY(-45px)',
      animationTimingFunction: 'ease-in',
      opacity: 1
    })),
    state('*', style({
      transform: 'translateY(0)',
      animationTimingFunction: 'ease-out',
      opacity: 1
    })),
    transition('void => *', animate('0.9s 0.5s')),
  ]),

  // Animación de contracción de espaciado de letras
  contraccionSeguimiento: trigger('contraccionSeguimiento', [
    state('void', style({
      letterSpacing: '1em',
      opacity: 0
    })),
    state('*', style({
      letterSpacing: 'normal',
      opacity: 1
    })),
    transition('void => *', animate('0.8s cubic-bezier(.215,.61,.355,1.000)')),
  ]),
};
