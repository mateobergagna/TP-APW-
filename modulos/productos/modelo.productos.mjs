import pool from '../../conexion.bd.mjs'

// LECTURA 1: Obtener todos los productos
export async function obtenerTodos() {
    const resultado = await pool.query('SELECT * FROM productos ORDER BY id ASC') //<--- promesa
    return resultado
}

// LECTURA 2: Obtener un producto por ID
export async function obtenerUno(id) {
    const resultado = await pool.query(
        'SELECT * FROM productos WHERE id = $1',
        [id]
    ) //<--- promesa
    return resultado
}

// ALTA: Crear un producto
export async function crearUno(datos) {
    const { producto, precio, imagen } = datos //<--- asignacion desestructurante
    const resultado = await pool.query(`
        INSERT INTO 
        productos(producto, precio, imagen) 
        VALUES($1, $2, $3) 
        RETURNING id, producto, precio, imagen`,
        [producto, precio, imagen]
    ) //<--- promesa
    return resultado
}

// MODIFICACION: Actualizar un producto
export async function actualizarUno(id, datos) {
    const { producto, precio, imagen } = datos //<--- asignacion desestructurante
    const resultado = await pool.query(`
        UPDATE productos 
        SET producto = $1, precio = $2, imagen = $3 
        WHERE id = $4 
        RETURNING id, producto, precio, imagen`,
        [producto, precio, imagen, id]
    ) //<--- promesa
    return resultado
}

// BAJA: Eliminar un producto
export async function eliminarUno(id) {
    const resultado = await pool.query(
        'DELETE FROM productos WHERE id = $1 RETURNING id',
        [id]
    ) //<--- promesa
    return resultado
}
