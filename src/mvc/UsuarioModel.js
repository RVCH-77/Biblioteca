export default class UsuarioModel {
  constructor(id_usuario, nombre, contrasena, id_rol_fk) {
    this.id_usuario = id_usuario
    this.nombre = nombre
    this.contrasena = contrasena
    this.id_rol_fk = id_rol_fk
  }
}
