# ClinicaOnline

**ClinicaOnline** es una aplicación web desarrollada en Angular para gestionar turnos médicos, visualizar estadísticas y generar informes de los turnos según especialidades y días. El proyecto permite a los usuarios acceder a la clínica en línea y gestionar sus turnos, visualizando gráficos interactivos y descargando informes en formato PDF.

## Pantallas

1. **Pantalla de Inicio (Home)**: Es la pantalla principal donde los usuarios pueden ver una barra de navegación con opciones como "Home", "Informes", "Quién Soy", y los botones de "Iniciar Sesión" y "Registrarse".
   
2. **Pantalla de Informes**: Los informes de turnos por especialidad y por día están disponibles aquí. Los usuarios pueden ver gráficos interactivos generados con **Highcharts** y descargarlos como archivos PDF.
   
3. **Pantalla de Login**: Esta pantalla permite a los usuarios registrarse o iniciar sesión en la aplicación para poder acceder a las funciones completas.

4. **Pantalla de Quién Soy**: Una sección que muestra información personal del desarrollador del proyecto, incluyendo una breve biografía y una foto.

## Tecnologías Utilizadas

- **Angular**: Framework principal utilizado para el desarrollo del frontend.
- **Firebase**: Para la autenticación de usuarios y la base de datos.
- **Highcharts**: Biblioteca para la creación de gráficos interactivos.
- **html2canvas**: Para convertir los gráficos en imágenes y exportarlas a PDF.
- **PrimeNG/Bootstrap/Angular Material**: Utilizado para el diseño y la interfaz de usuario.

## Cómo acceder a las diferentes secciones

1. **Pantalla Principal (Home)**:
   - Al acceder a la aplicación, se presentará la pantalla principal con los botones de **Iniciar Sesión** y **Registrarse**.
   - ![image](https://github.com/user-attachments/assets/c167cddc-01d5-4e38-bfb5-69c3c3e23531)

   
2. **Informes**:
   - Los informes pueden ser consultados desde la opción **Informes** en la barra de navegación. Esta sección muestra dos tipos de gráficos:
     - **Gráfico de Turnos por Especialidad**: Muestra la cantidad de turnos asignados a cada especialidad médica.
     - **Gráfico de Turnos por Día**: Muestra la cantidad de turnos asignados por día de la semana.
   - Además, desde esta sección puedes descargar los informes en formato PDF.

3. **Login**:
   - Si no estás logueado, puedes acceder a la opción de **Iniciar Sesión** o **Registrarse** desde la barra de navegación. Una vez autenticado, podrás acceder a todas las secciones.

4. **Quién Soy**:
   - La opción **Quién Soy** en la barra de navegación muestra información sobre el desarrollador del proyecto.

## Instrucciones de Ejecución

Para ejecutar el proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tuusuario/clinicaonline.git

