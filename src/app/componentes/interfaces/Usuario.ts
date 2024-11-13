
export interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    edad : number,
    dni:number,
    password: string;
    tipoUsuario: string;  // Puede ser "paciente", "administrador", o "especialista"
    fotoPerfil1?: File | string;  // Mover aquí con ? para que sea opcional
}

export interface Paciente extends Usuario {
    obraSocial: string;  // Solo en Paciente
    fotoPerfil2: File | string;
       
  }


  export interface Especialista extends Usuario {
    aceptado:string;
    especialidad: string;
    diasAtencion?: Array<string>;
    horariosAtencion?: Array<string>;
    tipoUsuario: 'especialista';  // Especifica que es un especialista
    
  }
  
  export interface Administrador extends Usuario {
    password: string;
    // Otras propiedades específicas para administradores si las hay
}

  