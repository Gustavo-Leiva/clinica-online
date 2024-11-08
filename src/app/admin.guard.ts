import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service'; // Asegúrate de que la ruta sea correcta
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService); // Inyecta el AuthService

  // Obtiene el usuario actual
  const user = authService.getUser(); // Asegúrate de que este método devuelva el usuario actual

  if (user) {
    // Verifica si el tipo de usuario es 'administrador'
    return user.tipoUsuario === 'administrador';
  }

  // Si no hay usuario, no puede acceder
  return false;
};
