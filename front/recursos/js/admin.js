// SCRIPT ADMINISTRATIVO PARA EL CRUD - 3D_MATT

document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES DE ESTADO ---
    let todosLosProductos = [];
    let idProductoAEliminar = null;

    // --- ELEMENTOS DEL DOM ---
    const tablaBody = document.getElementById('tabla-productos-body');
    const inputBusqueda = document.getElementById('busqueda');
    
    // Estadísticas
    const statTotal = document.getElementById('stat-total');
    const statPromedio = document.getElementById('stat-promedio');
    const statDb = document.getElementById('stat-db');

    // Modales
    const modalForm = document.getElementById('modal-producto');
    const modalConfirm = document.getElementById('modal-confirmar');
    
    // Formulario
    const btnNuevo = document.getElementById('btn-nuevo');
    const formProducto = document.getElementById('form-producto');
    const formId = document.getElementById('form-id');
    const formNombre = document.getElementById('form-nombre');
    const formPrecio = document.getElementById('form-precio');
    const formArchivo = document.getElementById('form-archivo');
    const imagenActual = document.getElementById('imagen-actual');
    const modalTitulo = document.getElementById('modal-titulo');

    // Botón Confirmación Borrado
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    const deleteItemName = document.getElementById('delete-item-name');

    // --- CARGAR PRODUCTOS ---
    async function cargarProductos() {
        try {
            const res = await fetch('/api/v1/productos');
            if (!res.ok) throw new Error('Error al obtener datos');
            
            todosLosProductos = await res.json();
            renderizarTabla(todosLosProductos);
            actualizarEstadisticas(todosLosProductos);
            
            // Detectar estado de base de datos de forma dinámica
            detectarEstadoBD();
        } catch (error) {
            console.error('Error cargando productos:', error);
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-row">
                        ⚠️ Error al conectar con el servidor. Por favor, asegúrate de que el servidor Node está corriendo.
                    </td>
                </tr>
            `;
            mostrarToast('Error de conexión con el servidor', 'danger');
        }
    }

    // --- RENDERIZAR TABLA ---
    function renderizarTabla(productos) {
        if (productos.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-row">
                        📭 No hay productos registrados que coincidan con la búsqueda.
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        productos.forEach(p => {
            html += `
                <tr data-id="${p.id}">
                    <td><strong>#${p.id}</strong></td>
                    <td>
                        <div class="thumbnail-container">
                            <img src="${p.imagen}" alt="${p.producto}" onerror="this.src='./recursos/catalogo.jpeg'">
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 600; color: #1e293b;">${p.producto}</div>
                    </td>
                    <td>
                        <span style="font-weight: 600; color: #1c2d66;">$ ${p.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </td>
                    <td>
                        <button class="btn-accion btn-editar" data-id="${p.id}">Editar</button>
                        <button class="btn-accion btn-eliminar" data-id="${p.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        tablaBody.innerHTML = html;
    }

    // --- ACTUALIZAR ESTADÍSTICAS ---
    function actualizarEstadisticas(productos) {
        statTotal.textContent = productos.length;
        
        if (productos.length === 0) {
            statPromedio.textContent = '$ 0,00';
            return;
        }

        const suma = productos.reduce((acc, p) => acc + Number(p.precio), 0);
        const promedio = suma / productos.length;
        statPromedio.textContent = `$ ${promedio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // --- DETECTAR ESTADO DE BASE DE DATOS ---
    async function detectarEstadoBD() {
        statDb.className = 'stat-value status-badge postgres';
        statDb.textContent = 'PostgreSQL';
    }

    // --- FILTRADO EN TIEMPO REAL ---
    inputBusqueda.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtrados = todosLosProductos.filter(p => 
            p.producto.toLowerCase().includes(query)
        );
        renderizarTabla(filtrados);
    });

    // --- GESTIÓN DE MODALES ---
    // Abrir nuevo
    btnNuevo.addEventListener('click', () => {
        formProducto.reset();
        formId.value = '';
        imagenActual.textContent = '';
        modalTitulo.textContent = 'Crear Nuevo Producto';
        abrirModal(modalForm);
    });

    // Cerrar modales (clases compartidas)
    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => cerrarModal(modalForm));
    });

    document.querySelectorAll('.close-confirm, .close-confirm-btn').forEach(btn => {
        btn.addEventListener('click', () => cerrarModal(modalConfirm));
    });

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (e) => {
        if (e.target === modalForm) cerrarModal(modalForm);
        if (e.target === modalConfirm) cerrarModal(modalConfirm);
    });

    function abrirModal(modal) {
        modal.classList.add('show');
    }

    function cerrarModal(modal) {
        modal.classList.remove('show');
    }

    // --- GUARDAR PRODUCTO (ALTA / MODIFICACIÓN) ---
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = formId.value;
        const producto = formNombre.value.trim();
        const precio = formPrecio.value;

        // Armamos FormData para enviar con multer (multipart/form-data)
        const formData = new FormData() //<--- igual que el profe
        formData.append('producto', producto)
        formData.append('precio', precio)
        if (formArchivo.files[0]) {
            formData.append('archivo', formArchivo.files[0]) //<--- nombre del campo = 'archivo'
        }

        try {
            let res;
            let esNuevo = !id;

            if (esNuevo) {
                // ALTA
                res = await fetch('/api/v1/productos', {
                    method: 'POST',
                    body: formData //<--- sin Content-Type, el browser lo pone solo
                });
            } else {
                // MODIFICACIÓN
                res = await fetch(`/api/v1/productos/${id}`, {
                    method: 'PUT',
                    body: formData //<--- sin Content-Type, el browser lo pone solo
                });
            }

            if (!res.ok) throw new Error('Error al guardar el producto');

            mostrarToast(
                esNuevo ? 'Producto creado exitosamente' : 'Producto actualizado exitosamente',
                'success'
            );
            
            cerrarModal(modalForm);
            cargarProductos();
        } catch (error) {
            console.error('Error al guardar:', error);
            mostrarToast('Hubo un error al guardar el producto', 'danger');
        }
    });

    // --- CLICK EN ACCIONES (TABLA) ---
    tablaBody.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('btn-accion')) return;

        const id = target.dataset.id;
        const producto = todosLosProductos.find(p => p.id == id);
        if (!producto) return;

        if (target.classList.contains('btn-editar')) {
            abrirEditar(producto);
        } else if (target.classList.contains('btn-eliminar')) {
            abrirEliminar(producto);
        }
    });

    // --- CONFIGURAR MODAL EDITAR ---
    function abrirEditar(p) {
        formId.value = p.id;
        formNombre.value = p.producto;
        formPrecio.value = p.precio;
        formArchivo.value = ''; // limpiar el file input
        imagenActual.textContent = p.imagen ? `Imagen actual: ${p.imagen}` : '';

        modalTitulo.textContent = `Editar Producto #${p.id}`;
        abrirModal(modalForm);
    }

    // --- CONFIGURAR MODAL ELIMINAR ---
    function abrirEliminar(p) {
        idProductoAEliminar = p.id;
        deleteItemName.textContent = `"${p.producto}" (ID #${p.id})`;
        abrirModal(modalConfirm);
    }

    // --- CONFIRMAR ELIMINACIÓN (BAJA) ---
    btnConfirmarEliminar.addEventListener('click', async () => {
        if (!idProductoAEliminar) return;

        try {
            const res = await fetch(`/api/v1/productos/${idProductoAEliminar}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Error al eliminar');

            mostrarToast('Producto eliminado permanentemente', 'success');
            cerrarModal(modalConfirm);
            idProductoAEliminar = null;
            cargarProductos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            mostrarToast('No se pudo eliminar el producto', 'danger');
        }
    });

    // --- SISTEMA DE TOASTS (PREMIUM) ---
    function mostrarToast(mensaje, tipo = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;

        let icon = 'ℹ️';
        if (tipo === 'success') icon = '✅';
        if (tipo === 'danger') icon = '❌';
        if (tipo === 'warning') icon = '⚠️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${mensaje}</span>
        `;

        container.appendChild(toast);

        // Forzar reflow para animación
        setTimeout(() => toast.classList.add('show'), 50);

        // Desvanecer y remover
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- INICIALIZAR ---
    cargarProductos();
});
