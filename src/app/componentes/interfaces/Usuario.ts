
// export interface Usuario {
//     nombre: string;
//     apellido: string;
//     email: string;
//     edad : number,
//     dni:number,
//     password: string;
//     tipoUsuario: string;  // Puede ser "paciente", "administrador", o "especialista"
//     fotoPerfil1?: File | string;  // Mover aquí con ? para que sea opcional
// }

// export interface Paciente extends Usuario {
//     obraSocial: string;  // Solo en Paciente
//     fotoPerfil2: File | string;
       
//   }


//   export interface Especialista extends Usuario {
//     aceptado:string;
//     especialidad: string;
//     diasAtencion?: Array<string>;
//     horariosAtencion?: Array<string>;
//     tipoUsuario: 'especialista';  // Especifica que es un especialista
    
//   }
  
//   export interface Administrador extends Usuario {
//     password: string;
//     // Otras propiedades específicas para administradores si las hay
// }

  

export interface Usuario {
  uid?: string; // UID opcional para usuarios creados automáticamente en Firebase
  nombre: string;
  apellido: string;
  email: string;
  edad: number;
  dni: number;
  password: string;
  tipoUsuario: string;  // Ahora opcional y específico en interfaces derivadas
  fotoPerfil1?: File | string;  // Hacer opcional para flexibilidad
}

export interface Paciente extends Usuario {
  tipoUsuario: 'paciente';  // Especifica que es un paciente
  obraSocial: string;       // Propiedad específica para Paciente
  fotoPerfil2: File | string;
}

export interface Especialista extends Usuario {
  tipoUsuario: 'especialista';  // Especifica que es un especialista
  especialidades: string[];  // Array de especialidades
  // especialidades: { 
  //   nombre: string; 
  //   imagen: string; 
  // }[]; // Array de especialidades con nombre e imagen
  estado: 'pendiente' | 'aceptado' | 'rechazado'; // Estado específico para especialistas
  diasAtencion?: Array<string>;
  horariosAtencion?: Array<string>;
}

export interface Administrador extends Usuario {
  tipoUsuario: 'administrador';  // Especifica que es un administrador
  // Puedes agregar otras propiedades específicas para Administrador aquí si es necesario
}
