// Clase para trabajar con agrupamiento de rutas
import { Router } from 'express'
// Importamos las funciones del controlador
import * as controlador from './controlador.productos.mjs'

const rutasProductos = new Router()

rutasProductos.get('/api/v1/productos', controlador.obtenerTodos)          //<-- Lectura 1 (todos)
rutasProductos.get('/api/v1/productos/:id', controlador.obtenerUno)        //<-- Lectura 2 (uno)
rutasProductos.post('/api/v1/productos', controlador.crearUno)              //<-- Alta
rutasProductos.put('/api/v1/productos/:id', controlador.actualizarUno)     //<-- Modificacion
rutasProductos.delete('/api/v1/productos/:id', controlador.eliminarUno)    //<-- Baja

// Exportamos
export default rutasProductos
