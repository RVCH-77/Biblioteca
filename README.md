# Biblioteca

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
