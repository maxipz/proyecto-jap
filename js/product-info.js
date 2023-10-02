window.onload = function () {
  const productId = localStorage.getItem("IdProducto");
  ObtenerInfo(productId);
  ObtenerComentarios(productId);
};

function ObtenerInfo(ID) {
  const url = `https://japceibal.github.io/emercado-api/products/${ID}.json`;
  fetch(url)
    .then((response) => response.json())
    .then((resultado) => {
      const Titulo = document.getElementById("Titulo");
      Titulo.innerHTML = resultado.name;

      const Precio = document.getElementById("Precio");
      Precio.innerHTML = `${resultado.currency} ${resultado.cost}`;

      const Descripcion = document.getElementById("Descripcion");
      Descripcion.innerHTML = `${resultado.description}`;

      const Categoria = document.getElementById("Categorias");
      Categoria.innerHTML = `${resultado.category}`;

      const CantidadVendidos = document.getElementById("CantVendidos");
      CantidadVendidos.innerHTML = `${resultado.soldCount}`;

      const imagenes = document.getElementById("imagenes");
      imagenes.innerHTML = `<br>${mostrarImagenes(resultado)}<br>`;

      const productosRelacionados = document.getElementById("productosRelacionados");
      productosRelacionados.innerHTML = `${mostrarProductoRelacionado(resultado)}`;
    })
    .catch((error) => console.error("Ocurrió un error:", error));
}

function setProductID(id){
  localStorage.setItem("productID", id );
  window.location = "product-info.html"
}

function mostrarProductos(productos){
  let htmlContenedor = ''
      productos.forEach(element => {
      htmlContenedor += `
      <div onclick='setProductID(${element.id})' class="list-group-item list-group-item-action cursor-active">
          <div class="row">
              <div class="col-3">
                  <img src="${element.image}" alt="${element.description}" class="img-thumbnail">
              </div>
              <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                      <h4 class="mb-1">${element.name}</h4>
                      <small class="text-muted">${element.soldCount} artículos</small>
                  </div>
                  <p class="mb-1">${element.description}</p>
              </div>
          </div>
      </div>
      `  
      })
      return htmlContenedor  
   }


function mostrarImagenes(producto) {
  let contenedorImagenes = `
    <div id="carouselControls" class="carousel slide w-75 mx-auto" data-bs-ride="carousel">
      <div class="carousel-inner">
  `;

  producto.images.forEach((element, index) => {
    const activeClass = index === 0 ? "active" : ""; // Agrega la clase 'active' al primer elemento
    contenedorImagenes += `
      <div class="carousel-item ${activeClass} text-center">
        <img src="${element}" class="d-block mx-auto custom-image" alt="Imagen ${
      index + 1}">
        <div class="carousel-caption">
          <!-- Puedes agregar texto de la imagen si lo deseas -->
        </div>
      </div>
    `;
  });

  contenedorImagenes += `
      </div>

      <!-- Botones de control para avanzar y retroceder -->
      <a class="carousel-control-prev" href="#carouselControls" role="button" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </a>
  
      <a class="carousel-control-next" href="#carouselControls" role="button" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </a>
    </div>
  `;

  return contenedorImagenes;
}

function mostrarProductoRelacionado(producto) {
  let contenedorProductoRelacionado = '';
  contenedorProductoRelacionado += '<div class="row">';
  producto.relatedProducts.forEach(element => {
    contenedorProductoRelacionado += `
    
      <div onclick='redireccionarProducto(${element.id})'class="col-md-3 mb-4 cursor-active">
      
        <div class="card">
          <img class="card-img-top" src="${element.image}" alt="Imagen">
          <div class="card-body">
            <p class="card-text mb-1">${element.name}</p>
          </div>
        </div>
      </div>
    `;
  });
  contenedorProductoRelacionado += '</div>';
  return contenedorProductoRelacionado;
}

function redireccionarProducto(id) { //Se declara funcion para guardar en localstorage el ID del producto
  localStorage.setItem("IdProducto", id);
  window.location = `product-info.html`;//Se redirige a la pagina product-info
}


//Funcion para crear las estrellas
function starRating(rating) {
  let ratingHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      ratingHTML += `<span class="fa fa-star checked"></span>`;
    } else {
      ratingHTML += `<span class="fa fa-star"></span>`;
    }
  }
  return ratingHTML;
}

// Crear Fecha
const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); //Los meses estan indexados en 0, por eso se agrega 1
const day = String(currentDate.getDate()).padStart(2, "0"); //.padStart hace que un string empiece con un caracter especifico hasta que el string tenga el largo indicado
const hours = String(currentDate.getHours()).padStart(2, "0");
const minutes = String(currentDate.getMinutes()).padStart(2, "0");
const seconds = String(currentDate.getSeconds()).padStart(2, "0");

const formattedDate = ` ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

function ObtenerComentarios(ID) {
  const url = `https://japceibal.github.io/emercado-api/products_comments/${ID}.json`;

  fetch(url)
    .then((response) => response.json())
    .then((comentarios) => {
      const mostrarComentarios = document.getElementById("comentarios");
      comentarios.forEach((comentario) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="row-fluid border p-2">
            <strong>${comentario.user}</strong> - ${
          comentario.dateTime
        } - ${starRating(comentario.score)} <br>
            ${comentario.description}</div>

          `;
        mostrarComentarios.appendChild(li);
      });
    })
    .catch((error) => console.error("Ocurrió un error:", error));
}

function mostrarComentarioNuevo(nuevoComentario) {
  //Funcion para agregar el comentario nuevo a la pagina
  const contenedorComentarios = document.getElementById("comentarios");
  let containerComentarioNuevo = `
  <div class="row-fluid border p-2">
  <div class="col-sm">
  <li><b>${nuevoComentario.usuario}</b>${nuevoComentario.fecha} ${starRating(
    nuevoComentario.rating
  )}<br>
  ${nuevoComentario.descripcion}</li>
  </div>
  </div>
  `;
  contenedorComentarios.innerHTML += containerComentarioNuevo;
}

document
  .getElementById("envioComentario")
  .addEventListener("submit", (event) => {
    //Agregamos un event listener al formulario
    event.preventDefault(); //evita que se recarge             //de comentario nuevo para agregar el comentario cuando se haga el submit
    const comentarioNuevo = document.getElementById("miOpinion").value;
    const rating = document.getElementById("miPuntuacion").value;
    const nuevoComentario = {
      //Creamos un nuevo objeto que contenga el comentario
      usuario: localStorage.getItem("username"), // Reemplazar con usuario de localstorage
      fecha: formattedDate, // Para usar fecha actual
      descripcion: comentarioNuevo,
      rating: rating,
    };
    mostrarComentarioNuevo(nuevoComentario);
    document.getElementById("envioComentario").reset();
  });






  const productId = localStorage.getItem(ID);
  const productoPrincipal = obtenerInformacionDelProducto(productId);
  const productosRelacionadosIds = productoPrincipal.relatedProducts; 
  const productosRelacionados = productos.filter((producto) => {
    return productosRelacionadosIds.includes(producto.id);
  })