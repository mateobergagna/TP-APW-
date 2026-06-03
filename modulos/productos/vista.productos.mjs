// Reestructuración y formateo de datos para el cliente (API REST)

export function responderTodos(productos) {
    return productos.map(p => ({
        id: Number(p.id),
        nombre: p.nombre || p.producto || '',
        precio: Number(p.precio),
        imagen: p.imagen || './recursos/catalogo.jpeg'
    }))
}

export function responderUno(p) {
    if (!p) return null
    return {
        id: Number(p.id),
        nombre: p.nombre || p.producto || '',
        precio: Number(p.precio),
        imagen: p.imagen || './recursos/catalogo.jpeg'
    }
}
