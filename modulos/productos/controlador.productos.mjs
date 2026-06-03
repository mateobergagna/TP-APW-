import multer from 'multer'
import * as modelo from './modelo.productos.mjs'
import path from 'node:path'

// ------------------
// Multer

// Instanciamos multer
const subirArchivo = multer({
    dest: path.join('archivos')
})
// configuramos single
const manejarArchivo = subirArchivo.single('archivo') //<----- devuelve una funcion
// ------------------


// LECTURA 1: Obtener todos los productos
export async function obtenerTodos(req, res) {
    // Obtenemos la consulta a BD desde la capa modelo
    const respuesta = await modelo.obtenerTodos() //<--- funcion asíncrona
    // respuesta tiene todos los datos de la consulta
    const respuestaDatos = respuesta.rows //<-- accedemos al arreglo de filas
    /*
    respuesta:
    consulta,
    campos,
    datos de la tabla -> rows <---- Arreglo
    */
    res.json(respuestaDatos) //<--- ese arreglo
}

// LECTURA 2: Obtener un producto por ID
export async function obtenerUno(req, res) {
    const id = req.params.id
    const respuesta = await modelo.obtenerUno(id) //<--- funcion asíncrona
    const producto = respuesta.rows[0] //<-- primer elemento del arreglo
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    res.json(producto)
}

// ALTA: Crear un producto
export async function crearUno(req, res) {
    console.log('POST')
    // manejamos el archivo
    manejarArchivo(req, res, async (error) => {
        // Si hay error
        if (error) return res.status(500).json({ mensaje: 'error en el servidor' })

        // Insertar a BD

        // Obtener los datos del formulario
        console.log(req.file)  //<------nombre de archivo
        console.log(req.body)  //<--- demas datos
        const datos = {
            producto: req.body.producto,
            precio: req.body.precio,
            imagen: req.file ? `/archivos/${req.file.originalname}` : null
        }
        const respuesta = await modelo.crearUno(datos)
        res.status(201).json({ mensaje: 'Registro creado' })
    })
}

// MODIFICACION: Actualizar un producto
export async function actualizarUno(req, res) {
    console.log('PUT')
    manejarArchivo(req, res, async (error) => {
        if (error) return res.status(500).json({ mensaje: 'error en el servidor' })

        const id = req.params.id
        const datos = {
            producto: req.body.producto,
            precio: req.body.precio,
            imagen: req.file ? `/archivos/${req.file.originalname}` : req.body.imagen
        }
        const respuesta = await modelo.actualizarUno(id, datos)
        if (respuesta.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' })
        res.json({ mensaje: 'Registro actualizado' })
    })
}

// BAJA: Eliminar un producto
export async function eliminarUno(req, res) {
    const id = req.params.id
    const respuesta = await modelo.eliminarUno(id)
    if (respuesta.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    res.json({ mensaje: `Producto ${id} eliminado` })
}
