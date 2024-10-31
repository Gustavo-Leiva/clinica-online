import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../app/componentes/environments/environmet';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),  // Usamos environment.firebaseConfig
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"clinica-online-b1cba","appId":"1:594226703420:web:5f60bf4382c374aaf06739","storageBucket":"clinica-online-b1cba.appspot.com","apiKey":"AIzaSyBJtHg96-UA6lDy6l1xuaVsKf85m4tDXng","authDomain":"clinica-online-b1cba.firebaseapp.com","messagingSenderId":"594226703420","measurementId":"G-4VKE4SX4KG"})), provideAuth(() => getAuth()), 
//   provideFirestore(() => getFirestore()),
//   provideStorage(() => getStorage())  // Aquí se agrega Firebase Storage
//   ]
// };
