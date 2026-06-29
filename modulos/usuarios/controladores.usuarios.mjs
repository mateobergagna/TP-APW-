import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as modelos from './modelos.usuarios.mjs'

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_por_defecto'

export const registro = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Faltan credenciales' })
        }

        // Verificar si existe el usuario
        const usuarioExistente = await modelos.buscarUsuarioPorUsername(username)
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' })
        }

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10)
        const password_hash = await bcrypt.hash(password, salt)

        // Crear usuario
        const nuevoUsuario = await modelos.crearUsuario(username, password_hash)

        res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario.username })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Faltan credenciales' })
        }

        // Buscar usuario
        const usuario = await modelos.buscarUsuarioPorUsername(username)
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' }) // Usuario no existe
        }

        // Comparar contraseñas
        const match = await bcrypt.compare(password, usuario.password_hash)
        if (!match) {
            return res.status(401).json({ error: 'Credenciales inválidas' }) // Contraseña incorrecta
        }

        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        // Configurar la cookie firmada
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true en prod (https)
            signed: true,
            maxAge: 1000 * 60 * 60, // 1 hora
            sameSite: 'strict'
        })

        res.json({ mensaje: 'Login exitoso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export const logout = (req, res) => {
    res.clearCookie('token')
    res.json({ mensaje: 'Sesión cerrada exitosamente' })
}
