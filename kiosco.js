// ----------------------------------------------------------------------------------
// JAVASCRIPT: Lógica para AGREGAR y QUITAR productos sin mezclarlos
// ----------------------------------------------------------------------------------

// El array que contiene los objetos del carrito: [{id: 1, nombre: 'Snack Salado', precio: 1.50, cantidad: 2}]
let carrito = [];
// Nuevo: Definimos el símbolo de moneda para usarlo en el DOM
const MONEDA = '$'; 

// Elementos del DOM (Document Object Model)
const totalElement = document.getElementById('total-carrito');
const contadorElement = document.getElementById('contador-carrito');
const itemsEnCarritoElement = document.getElementById('items-en-carrito');
const botonesAgregar = document.querySelectorAll('.boton-agregar');
const btnVaciar = document.getElementById('btn-vaciar');

// ----------------------------------------------------
// FUNCIONES PRINCIPALES
// ----------------------------------------------------

/** Dibuja la lista detallada y actualiza los totales. */
function actualizarCarritoDOM() {
    let total = 0;
    let contador = 0;
    itemsEnCarritoElement.innerHTML = ''; // Limpiar la lista actual

    if (carrito.length === 0) {
        itemsEnCarritoElement.innerHTML = '<p class="carrito-vacio">El carrito está vacío. ¡Agrega productos!</p>';
        // CAMBIO AQUÍ: Uso de MONEDA
        totalElement.textContent = '0.00' + MONEDA; 
        contadorElement.textContent = '0';
        return;
    }

    carrito.forEach(item => {
        // Cálculo de totales
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        contador += item.cantidad;

        // Creación del HTML para el detalle del producto en la barra lateral
        const itemHTML = `
            <div class="item-carrito">
                <div class="item-info">
                    ${item.nombre} <br>
                    <span>${item.cantidad} x ${item.precio.toFixed(2)}${MONEDA}</span> 
                </div>
                <button class="btn-quitar-item" data-id="${item.id}">- Quitar</button>
            </div>
        `;
        itemsEnCarritoElement.innerHTML += itemHTML;
    });

    // Actualizar los totales del encabezado
    // CAMBIO AQUÍ: Uso de MONEDA
    totalElement.textContent = total.toFixed(2) + MONEDA; 
    contadorElement.textContent = contador;
    
    // Asignar el listener a los nuevos botones de Quitar (que se acaban de crear)
    asignarListenersQuitar();
}

/** Lógica para AGREGAR un producto */
function agregarProducto(id, nombre, precio) {
    // Buscar si el producto ya existe en el carrito
    const itemExistente = carrito.find(item => item.id == id);

    if (itemExistente) {
        // Si existe, incrementamos solo la cantidad
        itemExistente.cantidad += 1;
    } else {
        // Si no existe, lo agregamos como nuevo
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    actualizarCarritoDOM();
}

/** Lógica para QUITAR un producto individual */
function quitarProducto(id) {
    const itemIndex = carrito.findIndex(item => item.id == id);

    if (itemIndex > -1) {
        // Reducir la cantidad
        carrito[itemIndex].cantidad -= 1;

        // Si la cantidad llega a 0, eliminar el producto completamente del array
        if (carrito[itemIndex].cantidad === 0) {
            carrito.splice(itemIndex, 1);
        }
    }
    
    actualizarCarritoDOM();
}

/** Asigna listeners al botón de Quitar específico. */
function asignarListenersQuitar() {
    // Seleccionamos los botones de quitar recién insertados en el DOM
    document.querySelectorAll('.btn-quitar-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            quitarProducto(id);
        });
    });
}

// ----------------------------------------------------
// EVENT LISTENERS INICIALES (Al cargar la página)
// ----------------------------------------------------

// 1. Listeners para AGREGAR
botonesAgregar.forEach(button => {
    button.addEventListener('click', function() {
        // Usamos los atributos 'data-' para obtener la información del producto
        const id = this.getAttribute('data-id');
        const nombre = this.getAttribute('data-nombre');
        const precio = parseFloat(this.getAttribute('data-precio'));
        
        agregarProducto(id, nombre, precio);
    });
});

// 2. Listener para VACIAR TODO el carrito
btnVaciar.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
        carrito = []; // Resetear el array
        actualizarCarritoDOM();
    }
});

// Inicializar la interfaz al cargar la página (muestra 0.00€ y "carrito vacío")
actualizarCarritoDOM();