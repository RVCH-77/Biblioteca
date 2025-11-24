export default class Libro {
  constructor({ id_libro = null, nombre, genero, portada = null, pdf = null } = {}) {
    this.id_libro = id_libro
    this.nombre = nombre
    this.genero = genero
    this.portada = portada
    this.pdf = pdf
  }
}

