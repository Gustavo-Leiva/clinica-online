# ClinicaOnline

**ClinicaOnline** es una aplicación web desarrollada en Angular para gestionar turnos médicos, visualizar estadísticas y generar informes de los turnos según especialidades y días. El proyecto permite a los usuarios acceder a la clínica en línea y gestionar sus turnos, visualizando gráficos interactivos y descargando informes en formato PDF.

## Pantallas

1. **Pantalla de Inicio (Home)**: Es la pantalla principal donde los usuarios pueden ver una barra de navegación con opciones como "Home", "Informes", "Quién Soy", y los botones de "Iniciar Sesión" y "Registrarse".   
  
2. **Pantalla de Login**: Esta pantalla permite a los usuarios registrarse o iniciar sesión en la aplicación para poder acceder a las funciones completas.

3. **Pantalla de Quién Soy**: Una sección que muestra información personal del desarrollador del proyecto, incluyendo una breve biografía y una foto.

4. **Panel de Paciente** permite a los usuarios gestionar sus turnos y acceder a su historial médico. Incluye:

      4.1 **Reserva de Turnos**: Solicitar turnos con médicos de distintas especialidades.
      4.2 **Mi Turno**: Verificar los turnos agendados.
      4.3 Historia Clínica**: Consultar el historial médico del paciente.


5. **El Panel de Especialista** permite a los médicos gestionar sus turnos y pacientes. Incluye:

    5.1 **Aceptar/Rechazar Turnos:** El especialista puede aprobar o rechazar los turnos solicitados por los pacientes.
    5.2 **Listado de Turnos:** Visualizar todos los turnos agendados para su especialidad.
    5.3 **Pacientes: Acceder**  a la información y el historial de los pacientes asignados.


6. **Pantalla de Informes**: Los informes de turnos por especialidad y por día están disponibles aquí. Los usuarios pueden ver gráficos interactivos generados con **Highcharts** y descargarlos como archivos PDF.

## Tecnologías Utilizadas

- **Angular**: Framework principal utilizado para el desarrollo del frontend.
- **Firebase**: Para la autenticación de usuarios y la base de datos.
- **Highcharts**: Biblioteca para la creación de gráficos interactivos.
- **html2canvas**: Para convertir los gráficos en imágenes y exportarlas a PDF.
- **PrimeNG/Bootstrap/Angular Material**: Utilizado para el diseño y la interfaz de usuario.

## Cómo acceder a las diferentes secciones

1. **Pantalla Principal (Home)**:
   - Al acceder a la aplicación, se presentará la pantalla principal con los botones de **Iniciar Sesión** y **Registrarse**.
![image](https://github.com/user-attachments/assets/e9f7af3d-f7df-4cc9-bcef-e82b00807249)

   


2. **Login**:
   - Si no estás logueado, puedes acceder a la opción de **Iniciar Sesión** o **Registrarse** desde la barra de navegación. Una vez autenticado, podrás acceder a todas las secciones.
  
   -   **Iniciar Sesión**
   - ![image](https://github.com/user-attachments/assets/fde0d80d-02f0-4539-8243-d4338c7481d0)

    **Registrarse**.
    ![image](https://github.com/user-attachments/assets/b3522229-3db5-4bb7-96fe-f795b0a70cc6)



   


   

3. **Quién Soy**:
   - La opción **Quién Soy** en la barra de navegación muestra información sobre el desarrollador del proyecto, paciente y especialista.
   - 
   3.1 **Perfil Administrador** contiene datos personales y una foto de perfil
   - ![image](https://github.com/user-attachments/assets/8161c892-b2f0-4ae7-8b84-e27b019e6983)
  
   3.2 **Perfil Paciente** contiene datos personales y una foto de perfil como asi tambien un buscador de sobre los turnos realizados y la posibilidad de realizar la descarga de 
  datos en formato pdf.

  ![image](https://github.com/user-attachments/assets/17ee6810-6157-4e5b-9698-27d5df199076)


  3.3 **Perfil Especialista** contiene datos personales y una foto de perfil como asi tambien la posibilidad de indicar los horarios y dias de atencion sobre su prestación de servicios..

![image](https://github.com/user-attachments/assets/c95ccf4b-1f17-4963-a37a-0b42e84f8a52)



4. **Panel de Paciente** permite a los usuarios gestionar sus turnos y acceder a su historial médico. Incluye:

    4.1 **Toma de Turnos:** Solicitar turnos con médicos de distintas especialidades.
![image](https://github.com/user-attachments/assets/8b4016df-60da-47be-bcde-8cf8d67e366f)

![image](https://github.com/user-attachments/assets/61add69f-8db4-49a0-a321-35eb6ab43d00)


   4.2 **Mi Turno:** Verificar los turnos agendados.
![image](https://github.com/user-attachments/assets/6b49b8f9-aed8-41b4-b000-231f9b3acc1d)


   4.3** Historia Clínica: Consultar el historial médico del paciente. aca podrá visualizar la reseña del especialista como asi tambien emitir una calificación por su atención.
![image](https://github.com/user-attachments/assets/33a730dd-0d06-4b40-a6a7-86501115ee8b)

![image](https://github.com/user-attachments/assets/46f5a9c3-55a6-4bda-b909-b49f332346ef)



Reseña del especialista.
![image](https://github.com/user-attachments/assets/70e76cf1-2056-4c22-ab2a-63cbde26976a)

Calificación al especialista.
![image](https://github.com/user-attachments/assets/8e79847d-265d-44f8-b34b-e4d6bdd632af)



5.  **El Panel de Especialista** permite a los médicos gestionar sus turnos y pacientes. Incluye:

  5.1 Aceptar/Rechazar Turnos: El especialista puede aprobar o rechazar los turnos solicitados por los pacientes.

  ![image](https://github.com/user-attachments/assets/20d1e936-ee14-452a-8994-321261525a28)

  5.2  Listado de Turnos: Visualizar todos los turnos agendados para su especialidad.

  ![image](https://github.com/user-attachments/assets/cb198526-cdaf-4fb5-8151-c4af20c1d5a5)

  5.3  Pacientes: Acceder a la información y el historial de los pacientes asignados.
![image](https://github.com/user-attachments/assets/9ffc2d22-5082-4c4e-a67c-b171073df923)


6. **Informes**:
   - Los informes pueden ser consultados desde la opción **Informes** en la barra de navegación, la cual puede ser accedida unicamente con el role de Administrador. Esta sección muestra dos tipos de gráficos:
     - **Gráfico de Turnos por Especialidad**: Muestra la cantidad de turnos asignados a cada especialidad médica.
     - **Gráfico de Turnos por Día**: Muestra la cantidad de turnos asignados por día de la semana.
   - Además, desde esta sección puedes descargar los informes en formato PDF.
  
   - ![image](https://github.com/user-attachments/assets/d0e0063b-0f2b-48fd-ac80-c064a6210ce7)

## Instrucciones de Ejecución

Para ejecutar el proyecto localmente, sigue estos pasos:

Primero haz un git clone con la url del proyecto, luego parado en el primer nivel de la carpeta realiza npm i && ng serve tambien puedes hacerlo en dos pasos, primero npm i para instalar las dependencias y luego ng serve para levantar el proyecto.


