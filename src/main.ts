// Esto es la configuracion inicial.
//import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';


// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig, // Mantén tu configuración existente
  providers: [
    ...(appConfig.providers || []), // Asegúrate de no sobrescribir otros proveedores
    provideAnimations() // Agrega el proveedor para habilitar animaciones
  ]
}).catch((err) => console.error(err));
