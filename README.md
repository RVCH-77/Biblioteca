# 📚 Proyecto: Biblioteca Universal

## 📖 Descripción General 
[cite_start]Este proyecto consiste en una plataforma digital diseñada para la interconexión de bibliotecas virtuales universitarias[cite: 6]. [cite_start]El objetivo principal es permitir que los estudiantes accedan a un repositorio global de conocimientos, consultando libros tanto de su propia universidad como de universidades externas conectadas a la red[cite: 9, 11].

[cite_start]El sistema permite la búsqueda centralizada, mostrando resultados con portada y metadatos, y facilita la lectura de documentos PDF directamente en el navegador mediante transmisión en Base64[cite: 19, 81].

## 🚀 Funcionalidades Principales 

### 👤 Módulo de Bibliotecario 
* [cite_start]**Gestión de Usuarios:** CRUD completo (Crear, Leer, Actualizar, Borrar) de usuarios internos[cite: 32]. 
* [cite_start]**Gestión de Libros:** CRUD de libros del catálogo local (Título, género, portada y archivo PDF)[cite: 33, 49]. 
* [cite_start]*Nota: Solo gestiona datos locales, sin acceso a edición externa[cite: 38, 47].* 

### 🎓 Módulo de Alumno 
* [cite_start]**Buscador Global:** Consulta unificada de libros internos y externos[cite: 53, 56]. 
* [cite_start]**Visualización:** Despliegue de libros PDF en el navegador[cite: 81]. 

## 🏗️ Arquitectura y Patrones de Diseño 
[cite_start]Este proyecto se rige por una arquitectura estricta de N-Capas, implementando los siguientes patrones de diseño de software[cite: 130]: 

* [cite_start]**MVC (Model-View-Controller):** Estructura base para la separación de la lógica de presentación y control[cite: 29]. 
* [cite_start]**DAO (Data Access Object):** Capa exclusiva para realizar consultas a la base de datos (Lectura)[cite: 110]. 
* [cite_start]**CQRS (Command Query Responsibility Segregation):** Separación de responsabilidades; utiliza *Commands* para operaciones de escritura (Registro, Edición, Eliminación) y delega las lecturas al DAO[cite: 37, 112]. 
* [cite_start]**MVVM (Model-View-ViewModel):** Utilizado para el mapeo de datos hacia la vista, asegurando que no exista lógica de negocio en la presentación[cite: 54, 120]. 
* [cite_start]**DDD (Domain-Driven Design):** Enfoque en el dominio, implementando una capa de infraestructura (`ApiService`) para la comunicación con APIs de universidades externas[cite: 60, 126]. 

## ⚙️ Reglas de Implementación 
* [cite_start]**Interoperabilidad:** El sistema consume servicios de otros compañeros para poblar la biblioteca global. 
* [cite_start]**Manejo de Archivos:** Envío y recepción de PDFs estandarizados en formato Base64[cite: 81]. 
* [cite_start]**Seguridad:** Validación de roles (Bibliotecario vs. Alumno) al iniciar sesión[cite: 30]. 

## 🛠️ Stack Tecnológico 
* [Lenguaje de programación, ej. Java/C#] 
* [Base de Datos, ej. MySQL/PostgreSQL] 
* [Framework Web]

Aplicación Express + MySQL para gestionar una biblioteca digital. El proyecto aplica patrones DAO, CQRS, MVC, MVVM, MVP y DDD.

## Requisitos
- Node.js
- MySQL

## Instalación
- `npm install`

## Configuración
- Variables de entorno soportadas:
  - `PORT` (por defecto `3000`)
  - `DB_HOST` (por defecto `localhost`)
  - `DB_PORT` (por defecto `3306`)
  - `DB_USER` (por defecto `root`)
  - `DB_PASSWORD` (por defecto `1234`)
  - `DB_NAME` (por defecto `Biblioteca`)

## Base de datos
- Crear la base `Biblioteca` y la tabla `Libro` con columnas necesarias:
```
CREATE DATABASE IF NOT EXISTS Biblioteca;
USE Biblioteca;

CREATE TABLE IF NOT EXISTS Libro (
  id_libro INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  genero VARCHAR(120) NOT NULL,
  universidad VARCHAR(120) NOT NULL,
  portada LONGBLOB NULL,
  pdf LONGBLOB NULL
);
```

## Ejecutar
- Desarrollo: `npm run dev`
- Producción: `npm run start`

## Endpoints
- Libros
  - `POST /libros` multipart (`portada`, `pdf`), campos: `nombre`, `genero`, `universidad`
  - `PUT /libros` multipart (`portada`, `pdf`), campos: `id_libro`, `nombre`, `genero`, `universidad`
  - `GET /libros` lista
  - `GET /libros/:id` detalle
  - `DELETE /libros/:id` eliminar
  - `GET /libros/search` filtro por `?nombre=`
  - `GET /libros/search/:nombre` filtro por parámetro
- Usuarios
  - `POST /usuarios`
  - `PUT /usuarios/:id`
  - `GET /usuarios`
  - `GET /usuarios/:id`
  - `DELETE /usuarios/:id`
  - `POST /usuarios/login` cuerpo: `nombre`, `contrasena`
- Roles
  - `GET /roles`
- Externos
  - `GET /externo/libros`
  - `GET /externo/libros_ngrok`

## Páginas UI
- `http://localhost:3000/mvp/BlibliotecaCrud.html`
- `http://localhost:3000/mvp/UsuarioCrud.html`
- `http://localhost:3000/mvp/MenuPrincipalBiblio.html`

## Estructura
- `src/server/app.js` servidor y rutas estáticas
- `src/Routes` rutas Express (`LibroApi.js`, `UsuarioApi.js`)
- `src/mvc` controladores
- `src/dao` acceso a datos MySQL
- `src/cqrs` capa de comandos/consultas
- `src/mvvm` lógica de UI en JS
- `src/mvp` páginas HTML
- `src/ddd` consumo de APIs externas
- `src/db/DB.js` pool de conexión MySQL

## Notas
- Subida de archivos usa `multer` en memoria.
- `universidad` es obligatorio en creación/actualización.
