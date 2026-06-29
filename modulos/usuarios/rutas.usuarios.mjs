import { Router } from 'express'
import * as controlador from './controladores.usuarios.mjs'

const rutasUsuarios = new Router()

rutasUsuarios.post('/api/v1/auth/registro', controlador.registro)
rutasUsuarios.post('/api/v1/auth/login', controlador.login)
rutasUsuarios.post('/api/v1/auth/logout', controlador.logout)

export default rutasUsuarios
