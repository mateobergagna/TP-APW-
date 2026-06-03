import { renderizarProductos } from "./vista.js";

// === CARGAR PRODUCTOS DESDE EL BACKEND ===
async function cargarProductos() {
    try {
        const respuesta = await fetch("/api/productos");
        const productos = await respuesta.json();
        renderizarProductos(productos);

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}
cargarProductos();

// === ACTIVAR MENÚ ACTUAL ===
const currentPage = location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

// === WHATSAPP ===
const WHATSAPP_NUMBER = "3525413549";

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("boton-consulta")) {
        const nombre = e.target.dataset.nombre;

        const mensaje = encodeURIComponent(
            `Hola! Estoy interesado en el producto: ${nombre}`
        );

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
    }
});

// === AJUSTE ALTURA DEL HEADER ===
function ajustarAlturaHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    const h = header.offsetHeight;
    document.documentElement.style.setProperty("--header-height", h + "px");
}

window.addEventListener("load", ajustarAlturaHeader);
window.addEventListener("resize", ajustarAlturaHeader);
window.addEventListener("scroll", ajustarAlturaHeader);
