import pool from '../db/DB.js'
import { insertLibro, updateLibro, deleteLibro } from '../dao/LibroDao.js'

// CQRS para Libro
export async function insertLibroCqrs(libro) {
  return insertLibro(libro) 

}   


export async function updateLibroCqrs(libro) {
  return updateLibro(libro)
}

export async function deleteLibroCqrs(id) {
  return deleteLibro(id)
}

export async function getLibroByIdCqrs(id) {
  return getLibroById(id)
}

export async function getLibrosCqrs() {
  return getLibros()
}

export async function getLibrosByGeneroCqrs(genero) {
  return getLibrosByGenero(genero)
}
export async function getLibrosByUniversidadCqrs(universidad) {
  return getLibrosByUniversidad(universidad)
}
