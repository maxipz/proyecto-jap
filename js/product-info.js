window.onload = function () {
  const productId = localStorage.getItem("productId");
  getInfo(productId);
  getComments(productId);
};

function getInfo(ID) {
  const url = `https://japceibal.github.io/emercado-api/products/${ID}.json`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      const title = document.getElementById("title");
      title.innerHTML = result.name;

      const cost = document.getElementById("cost");
      cost.innerHTML = `${result.currency} ${result.cost}`;

      const description = document.getElementById("description");
      description.innerHTML = `${result.description}`;

      const category = document.getElementById("category");
      category.innerHTML = `${result.category}`;

      const soldCount = document.getElementById("soldCount");
      soldCount.innerHTML = `${result.soldCount}`;

      const images = document.getElementById("images");
      images.innerHTML = `<br>${showImages(result)}<br>`;

      const relatedProducts = document.getElementById("relatedProducts");
      relatedProducts.innerHTML = `${showRelatedProducts(result)}`;


      const addToCartButton = document.getElementById('addToCart');

      addToCartButton.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        //Guarda la info del producto en el localStorage
        const currentProduct = {
          id: result.id,
          name: result.name,
          unitCost: result.cost,
          currency: result.currency,
          image: result.images[0]
        };

        const productExists = cart.find(item => item.id === currentProduct.id);

        if (productExists) {
          // Si el producto existe, incrementa la cantidad
          productExists.count += 1;
        } else {
          // Si el producto no existe, agrégalo al carrito
          currentProduct.count = 1;
          cart.push(currentProduct);
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        // Muestra una confirmación al usuario
        const alert = document.getElementById('successAlert');
        alert.classList.remove('d-none');
        setTimeout(function() {
          alert.classList.add('d-none');
        }, 2000);
      });



    })
    .catch((error) => console.error("Ocurrió un error:", error));
}

function setProductID(id) {
  localStorage.setItem("productId", id);
  window.location = "product-info.html"
}

function showProducts(products) {
  let htmlContainer = ''
  products.forEach(element => {
    htmlContainer += `
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
  return htmlContainer
}


function showImages(product) {
  let imagesContainer = `
    <div id="carouselControls" class="carousel slide w-75 mx-auto" data-bs-ride="carousel">
      <div class="carousel-inner">
  `;

  product.images.forEach((element, index) => {
    const activeClass = index === 0 ? "active" : ""; // Agrega la clase 'active' al primer elemento
    imagesContainer += `
      <div class="carousel-item ${activeClass} text-center">
        <img src="${element}" class="d-block mx-auto custom-image" alt="Imagen ${index + 1}">
        <div class="carousel-caption">
          <!-- Puedes agregar texto de la imagen si lo deseas -->
        </div>
      </div>
    `;
  });

  imagesContainer += `
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

  return imagesContainer;
}

function showRelatedProducts(product) {
  let relatedProductsContainer = '';
  relatedProductsContainer += '<div class="row">';
  product.relatedProducts.forEach(element => {
    relatedProductsContainer += `
    
      <div onclick='redirectProduct(${element.id})'class="col-md-3 mb-4 cursor-active">
      
        <div class="card">
          <img class="card-img-top" src="${element.image}" alt="Imagen">
          <div class="card-body">
            <p class="card-text mb-1">${element.name}</p>
          </div>
        </div>
      </div>
    `;
  });
  relatedProductsContainer += '</div>';
  return relatedProductsContainer;
}

function redirectProduct(id) { //Se declara funcion para guardar en localstorage el ID del producto
  localStorage.setItem("productId", id);
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

function getComments(ID) {
  const url = `https://japceibal.github.io/emercado-api/products_comments/${ID}.json`;

  fetch(url)
    .then((response) => response.json())
    .then((comments) => {
      const showComments = document.getElementById("comments");
      comments.forEach((comment) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="row-fluid border p-2">
            <strong>${comment.user}</strong> - ${comment.dateTime
          } - ${starRating(comment.score)} <br>
            ${comment.description}</div>

          `;
        showComments.appendChild(li);
      });
    })
    .catch((error) => console.error("Ocurrió un error:", error));
}

function showNewComment(newComment) {
  //Funcion para agregar el comentario nuevo a la pagina
  const commentsContainer = document.getElementById("comments");
  let newCommentsContainer = `
  <div class="row-fluid border p-2">
  <div class="col-sm">
  <li><b>${newComment.user}</b>${newComment.date} ${starRating(
    newComment.rating
  )}<br>
  ${newComment.description}</li>
  </div>
  </div>
  `;
  commentsContainer.innerHTML += newCommentsContainer;
}

document
  .getElementById("sendComment")
  .addEventListener("submit", (event) => {
    //Agregamos un event listener al formulario
    event.preventDefault(); //evita que se recarge             //de comentario nuevo para agregar el comentario cuando se haga el submit
    const textComment = document.getElementById("myOpinion").value;
    const rating = document.getElementById("myRating").value;
    const newComment = {
      //Creamos un nuevo objeto que contenga el comentario
      user: localStorage.getItem("username"), // Reemplazar con usuario de localstorage
      date: formattedDate, // Para usar fecha actual
      description: textComment,
      rating: rating,
    };
    showNewComment(newComment);
    document.getElementById("sendComment").reset();
  });

