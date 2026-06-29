import fs from 'node:fs'
import path from 'node:path'
import pool from '../../conexion.bd.mjs'

async function initDB() {
    try {
        const sqlPath = path.resolve('tienda.sql')
        const sql = fs.readFileSync(sqlPath, 'utf8')
        
        console.log('Ejecutando script tienda.sql...')
        await pool.query(sql)
        console.log('¡Base de datos inicializada correctamente!')
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error)
    } finally {
        pool.end() // Cerramos el pool de conexiones para que el script termine
    }
}

initDB()
