import express from 'express'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import rutasProductos from './modulos/productos/rutas.productos.mjs'
import rutasUsuarios from './modulos/usuarios/rutas.usuarios.mjs'
import { verificarAcceso } from './modulos/usuarios/middleware.auth.mjs'

const PUERTO = process.env.PUERTO || 3000
const app = express()

// Permitir parsear el cuerpo JSON de peticiones POST/PUT
app.use(express.json())

// Parsear cookies firmadas
app.use(cookieParser(process.env.COOKIE_SECRET || 'secreto_cookie_por_defecto'))

// Registrar rutas de usuarios (auth) ANTES de los estáticos
app.use(rutasUsuarios)

// Interceptar /admin.html antes del express.static
app.get('/admin.html', verificarAcceso, (req, res, next) => {
    next()
})

// Servir archivos estáticos del frontend
app.use(express.static(path.resolve('front')))

// Servir las imágenes subidas con multer
app.use('/archivos', express.static(path.resolve('archivos')))

// Registrar rutas MVC para productos
app.use(rutasProductos)

app.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`)
})
