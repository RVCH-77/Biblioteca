const q = s => document.querySelector(s)

async function login(nombre, contrasena){
  const r = await fetch('/usuarios/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ nombre, contrasena })
  })
  if(!r.ok){
    const msg = await r.text()
    throw new Error(msg || ('HTTP '+r.status))
  }
  return r.json()
}

async function onSubmit(e){
  e.preventDefault()
  q('#login_error').textContent = ''
  const nombre = q('#login_usuario').value
  const contrasena = q('#login_contrasena').value
  try{
    const user = await login(nombre, contrasena)
    localStorage.setItem('session_user', JSON.stringify(user))
    const role = Number(user.id_rol_fk)
    const target = role === 1
      ? '/mvp/MenuPrincipalBiblio.html'
      : role === 2
        ? '/mvp/MenuUsuario.html'
        : '/mvp/MenuUsuario.html'
    location.href = target
  }catch(err){
    q('#login_error').textContent = 'Usuario o contraseña inválidos'
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  q('#formLogin').addEventListener('submit', onSubmit)
})
