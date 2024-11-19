import { Routes } from '@angular/router';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { ErrorComponent } from './componentes/error/error.component'; // Asegúrate de importar tu componente de error
import { RegistroComponent } from './componentes/registro/registro.component';
import { RegistroAdministradorComponent } from './componentes/registro/registro-administrador/registro-administrador.component';
import { RegistroPacienteComponent } from './componentes/registro/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './componentes/registro/registro-especialista/registro-especialista.component';
import { PanelAdminComponent } from './componentes/panel-admin/panel-admin.component';
import { PanelPacienteComponent } from './componentes/panel-paciente/panel-paciente.component';
import { PanelEspecialistaComponent } from './componentes/panel-especialista/panel-especialista.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { adminGuard } from './guards/admin.guard'; // Asegúrate de que la ruta sea correcta
import { GestionUsuariosComponent } from './componentes/gestion-usuarios/gestion-usuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path:'header', component: HeaderComponent},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registro/paciente', component: RegistroPacienteComponent },
    { path: 'registro/especialista', component: RegistroEspecialistaComponent },
    { path: 'registro/administrador', component: RegistroAdministradorComponent },
    { path:  'panelAdmin', component: PanelAdminComponent },
    { path:  'panelPaciente', component: PanelPacienteComponent },
    { path:  'panelEspecialista', component: PanelEspecialistaComponent },
    { path:  'perfil', component: PerfilComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'gestion-usuarios', component: GestionUsuariosComponent, canActivate: [adminGuard] }
    // Protege esta ruta
];

