import pool from '../../conexion.bd.mjs'

export const buscarUsuarioPorUsername = async (username) => {
    const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE username = $1',
        [username]
    )
    return rows[0]
}

export const crearUsuario = async (username, password_hash) => {
    const { rows } = await pool.query(
        'INSERT INTO usuarios (username, password_hash) VALUES ($1, $2) RETURNING id, username',
        [username, password_hash]
    )
    return rows[0]
}
