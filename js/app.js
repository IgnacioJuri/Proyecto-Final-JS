// traer objetos del archivo.json
let productos = [];

fetch("js/productos.json")
    .then(response => response.json())
    .then(data =>{
        productos = data;
        cargarProductos(productos);
    })

//Constructor de objetos que estan en el json

// function producto (id, nombre, precio, img, antiguedad ){
//     this.id=id;
//     this.nombre=nombre;
//     this.precio=precio;
//     this.img=img;
//     this.antiguedad=antiguedad;
// };

 
//array con los objetos y carrito
let carrito;
let carritoLs = JSON.parse(localStorage.getItem("carrito"));
if(carritoLs){
    carrito = carritoLs;
}else{
    carrito = [];
};

// productos que ahora se cargan desde el json
// const productos = [
//     new producto (5, "Pasta de Tahini", 1700, "../img/tahini/Mestizo-frasco-tahini.webp", "nuevo"),
//     new producto (1, "Hummus Clásico", 900, "../img/clasico/Mestizo-Frasco-Clasico.webp", "clasico"),
//     new producto (4, "Hummus Pistacho", 1200, "../img/pistacho/Mestizo-frasco-pistacho.webp", "nuevo"),
//     new producto (3, "Hummus Ajo Negro", 900, "../img/ajo-negro/MESTIZO HUMMUS ALTA-ajo negro.webp", "clasico"),
//     new producto (2, "Hummus Picante", 900, "../img/picante/Mestizo-Frasco-AjiPicante.webp", "clasico"),
// ];

//llamados del DOM

const contenedorProductos = document.querySelector(".product-container");
const botonesFiltros = document.querySelectorAll(".btn-filtros");
const tituloFiltros = document.querySelector("#titulo-filtros");
const btnAgregar = document.querySelectorAll(".btn-Agregar");
const contenedorCarrito = document.querySelector(".carrito-container");
const numerito = document.querySelector("#numerito");
let eliminarCarrito = document.querySelectorAll(".carrito-producto-eliminar");
const carritoVacio = document.querySelector(".carrito-vacio");
const botonesCarrito = document.querySelector(".botones-carrito");
const botonVaciarCarrito = document.querySelector("#btn-vaciar-carrito");
const totalCarrito = document.querySelector(".total-carrito");
const btnComprar = document.querySelector("#btn-comprar");

//Function para mostrar la cantidad de productos en el carrito

function mostrarNumerito(){
    numerito.innerText = carrito.length;
}

//Function para cargar los productos al DOM

function cargarProductos(productosAll){

    //limpiar contenedor para que se eliminen los productos cuando se usan filtros 
    contenedorProductos.innerHTML = '';

    productosAll.forEach(producto =>{

        const divProductContainer = document.createElement("div");
        divProductContainer.classList.add("producto");
        divProductContainer.innerHTML = `
        
        <img class="producto-img" src=" ${producto.img} " alt="#">
        <div class="producto-info">
            <h3 class="producto-titulo"> ${producto.nombre} </h3>
            <h4 class="producto-precio"> $ ${producto.precio} </h4>
            <button class="btn-Agregar" id="${producto.id}">Agregar al Carrito</button>
        </div>

        `;

        contenedorProductos.append(divProductContainer);

    });

    agregarAlCarrito();
    mostrarNumerito();
};



//function para los botones agregar al carrito

function agregarAlCarrito() {
        const btnAgregar = document.querySelectorAll(".btn-Agregar");
        btnAgregar.forEach(boton => {
            boton.addEventListener("click", () => {
                
                const idBtn = boton.id;
                const productoAgregado = productos.find(producto => producto.id == idBtn);
                carrito.push(productoAgregado);
                console.log(carrito);

                //actualizacion de la function numerito
                mostrarNumerito(); 
                sumarPreciosCarrito(carrito);
                //guardar en local storage
                localStorage.setItem("carrito", JSON.stringify(carrito));

                //cartel producto agregado
                Toastify({
                    text: "Producto agregado Correctamente",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();

            });
        });
};

//llamado de la function mostrar numerito
mostrarNumerito();


//filtro Nuevos productos y todos los productos 

botonesFiltros.forEach(boton =>{
    boton.addEventListener("click", (e) =>{
        contenedorProductos.classList.add("product-container")
        // cambiar de color el fondo al hacer click
        botonesFiltros.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        
        if(e.currentTarget.id != "todos"){
            carritoVacio.classList.add("disabled");
            botonesCarrito.classList.add("disabled");
            const productosNuevos = productos.filter(producto => producto.antiguedad === "nuevo");
            cargarProductos(productosNuevos);
            tituloFiltros.innerText = "Productos Nuevos";
        }else{
            carritoVacio.classList.add("disabled");
            botonesCarrito.classList.add("disabled");
            cargarProductos(productos);
            tituloFiltros.innerText = "todos los productos";
        };
    });
});

// boton ordenar por precio

const botonPrecio = document.querySelector("#precio");
botonPrecio.addEventListener("click", () => {
    carritoVacio.classList.add("disabled");
    botonesCarrito.classList.add("disabled");
    contenedorProductos.classList.add("product-container")
    const productosOrdenados = [...productos].sort((a, b) => a.precio - b.precio);
    cargarProductos(productosOrdenados);
    tituloFiltros.innerText = "Ordenados por precio descendente";
});

// function carrito
function cargarCarrito(carrito) {
    //limpiar contenedor para que se eliminen los productos cuando se usan filtros 
    contenedorProductos.innerHTML = '';
    carrito.forEach(producto => {
        contenedorProductos.classList.remove("product-container")
        const divCarrito = document.createElement("div");
        divCarrito.classList.add("div-productos-carrito");
        divCarrito.innerHTML = `
            <img src="${producto.img}" alt="">
            <div><p>Nombre</p><h2>${producto.nombre}</h2></div>
            <div><p>Precio</p><h2>$${producto.precio}</h2></div>
            <button id="${producto.id}"><i class=" eliminarCarrito bi bi-trash3-fill"></i></button>
        `;
        contenedorProductos.append(divCarrito);

                // Agregar boton para eliminar productos
                const botonEliminar = divCarrito.querySelector(".eliminarCarrito");
                botonEliminar.addEventListener('click', () => {
                    // Encontrar el índice del producto en el array carrito
                    const indiceProducto = carrito.findIndex(p => p.id === producto.id);
                    // Eliminar el producto del array carrito
                    carrito.splice(indiceProducto, 1);
                    // Actualizar el carrito en el localStorage
                    localStorage.setItem('carrito', JSON.stringify(carrito));

                    // cartel de producto eliminado

                    Toastify({
                        text: "Producto Eliminado Correctamente",
                        duration: 3000,
                        destination: "https://github.com/apvarun/toastify-js",
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "red",
                        },
                        onClick: function(){} // Callback after click
                    }).showToast();

                    // Actualizar el carrito en la página
                    cargarCarrito(carrito);
                    mostrarNumerito();
                    botonesCarritoVacio();
                    sumarPreciosCarrito(carrito);
                });
        
    });
};


// ver carrito al apretar el button

const botonCarrito = document.querySelector("#carrito");
botonCarrito.addEventListener("click", () => {
    tituloFiltros.innerText = "Carrito";
    contenedorProductos.innerHTML = '';

    //mostrar o no alerta del carrito vacio y los botones
    botonesCarritoVacio ();
    sumarPreciosCarrito(carrito);
    
});

function botonesCarritoVacio (){
    if(carrito.length > 0){
        carritoVacio.classList.add("disabled");
        botonesCarrito.classList.remove("disabled");
       cargarCarrito(carrito);

    }else{
        carritoVacio.classList.remove("disabled");
        botonesCarrito.classList.add("disabled");
    };
};
    
// boton para vaciar todo el carrito
botonVaciarCarrito.addEventListener('click', () => {
    // Vaciar el array carrito
    carrito = [];
    // Limpiar el carrito en el localStorage
    localStorage.removeItem('carrito');

    //cartel carrito vacio

    Toastify({
        text: "Carrito Vaciado Correctamente",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "red",
        },
        onClick: function(){} // Callback after click
    }).showToast();

    // Actualizar el carrito 
    cargarCarrito(carrito);
    botonesCarritoVacio();
    mostrarNumerito();
    sumarPreciosCarrito(carrito);
});

//sumar los productos del carrito
function sumarPreciosCarrito(carrito) {
    let total = 0;
    for (let producto of carrito) {
        total += producto.precio;
    }
    totalCarrito.innerText = "Total: " + total;
    return total;
};

sumarPreciosCarrito(carrito);

//boton para comprar 

btnComprar.addEventListener("click", () =>{
    // Vaciar el array carrito
    carrito = [];
    // Limpiar el carrito en el localStorage
    localStorage.removeItem('carrito');

     //cartel carrito vacio

     Toastify({
        text: "Compra realizada ",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "blue",
        },
        onClick: function(){} // Callback after click
    }).showToast();

    // Actualizar el carrito 
    cargarCarrito(carrito);
    botonesCarritoVacio();
    mostrarNumerito();
    sumarPreciosCarrito(carrito);

});

