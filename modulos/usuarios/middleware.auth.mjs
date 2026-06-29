import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_por_defecto'

export const verificarAcceso = (req, res, next) => {
    // 1. Obtener la cookie firmada
    const token = req.signedCookies.token

    // 2. Si no hay token, denegar el acceso
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: No se proporcionó un token válido' })
    }

    try {
        // 3. Verificar el token con jsonwebtoken
        const decoded = jwt.verify(token, JWT_SECRET)
        
        // 4. Agregar los datos del usuario a req (opcional)
        req.usuario = decoded
        
        // 5. Continuar al siguiente middleware/controlador
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado' })
    }
}
