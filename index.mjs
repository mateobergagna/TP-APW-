import express from 'express'
import path from 'node:path'
import rutasProductos from './modulos/productos/rutas.productos.mjs'

const PUERTO = process.env.PUERTO || 3000
const app = express()

// Permitir parsear el cuerpo JSON de peticiones POST/PUT
app.use(express.json())

// Servir archivos estáticos del frontend
app.use(express.static(path.resolve('front')))

// Servir las imágenes subidas con multer
app.use('/archivos', express.static(path.resolve('archivos')))

// Registrar rutas MVC para productos
app.use(rutasProductos)

app.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`)
})
