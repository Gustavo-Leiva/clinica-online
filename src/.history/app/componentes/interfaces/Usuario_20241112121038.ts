
export interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    edad : number,
    dni:number,
    password: string;
    tipoUsuario: string;  // Puede ser "paciente", "administrador", o "especialista"
}

export interface Paciente extends Usuario {
    obraSocial: string;  // Solo en Paciente
    fotoPerfil1: string;
    fotoPerfil2: string;
    
  }


  export interface Especialista extends Usuario {
    especialidad: string;
    fotoPerfil1: string;
    diasAtencion?: Array<string>;
    horariosAtencion?: Array<string>;
    tipoUsuario: 'especialista';  // Especifica que es un especialista
    diasAtencion?: Array<string>;
    horariosAtencion?:Array<string>;
  }
  
  export interface Administrador extends Usuario {
    password: string;
    fotoPerfil1: string;
    // Otras propiedades específicas para administradores si las hay
}

  