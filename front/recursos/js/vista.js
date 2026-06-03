export function renderizarProductos(productos) {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;

    let html = "";

    productos.forEach(p => {
        html += `
            <article class="producto">
                <img src="${p.imagen}" alt="${p.producto}">

                <h3>${p.producto}</h3>

                <ul>
                    <li>Precio: $ ${p.precio.toLocaleString("es-AR")}</li>
                </ul>

                <button 
                    class="boton-consulta"
                    data-nombre="${p.producto}"
                >
                    Consultar
                </button>
            </article>
        `;
    });

    contenedor.innerHTML = html;
}
