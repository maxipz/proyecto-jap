const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

function logCheck() {
  // Verificar si el usuario está autenticado
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirigir al formulario de inicio de sesión si no está autenticado
  if (!isLoggedIn) {
    const alert = document.getElementById('notLoggedIn');
    
    alert.classList.remove('d-none');
    setTimeout(function() {
      alert.classList.add('d-none');
      window.location.href = "login.html";
    }, 3000);
  }

  const userId = localStorage.getItem("username"); // Agarra los datos de localStorage del username y lo agrega al navbar
  const userButton = document.getElementById("userbutton");
  const atIndex = userId.indexOf("@");

  if (atIndex !== -1) {
    const userName = userId.substring(0, atIndex);
    userButton.innerHTML = "Bienvenido! " + userName;

  } else {
    userButton.innerHTML = "Bienvenido! " + userId;
  }
};
window.onload = logCheck();


const logOut = document.getElementById("logOut");
logOut.addEventListener("click", function () {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('profileDataImg');
  localStorage.removeItem('profileData');
  window.location.href = "index.html";
});

// Cambiar el Background de la pagina
const colorModeButton = document.querySelector('#color-mode');
const body = document.body;
// Recuperar el estado del modo de color desde localStorage (si existe)
const isDarkMode = localStorage.getItem('darkMode') === 'true';
const modals = document.querySelectorAll('.modal-content');
const tables = document.querySelectorAll('.table');
const subtotal = document.getElementById('subtotal');
const shipping = document.getElementById('shipping');
const total = document.getElementById('total');
const totalCosts = document.getElementById('totalCosts');
//Texto "Arrastra tus fotos aqui" ventas
const textSells = document.querySelectorAll('.dz-message');

// Inicializar el modo de color según lo que se encuentra en localStorage
if (isDarkMode) {
  body.classList.add("dark-mode");
  modals.forEach((modal) => {
    modal.classList.add('dark-mode');
  });
  textSells.forEach((textSell) => {
    textSell.classList.add('text-dark');
  });
  tables.forEach((table) => {
    table.classList.add('text-white');
  });
  if (subtotal){
    subtotal.classList.add('text-dark');
  }
  if (shipping){
    shipping.classList.add('text-dark');
  }
  if (total){
    total.classList.add('text-dark');
  }
  if (totalCosts){
    totalCosts.classList.add('text-dark');
  }
  colorModeButton.innerText = "Cambiar a Light";
}

colorModeButton.addEventListener("click", changeColorMode);

function changeColorMode() {
  body.classList.toggle("dark-mode");
  modals.forEach((modal) => {
    modal.classList.toggle('dark-mode');
  });
  textSells.forEach((textSell) => {
    textSell.classList.toggle('text-dark');
  });
  tables.forEach((table) => {
    table.classList.toggle('text-white');
  });
  if (subtotal){
    subtotal.classList.toggle('text-dark');
  }
  if (shipping){
    shipping.classList.toggle('text-dark');
  }  
  if (total){
    total.classList.toggle('text-dark');
  }
  if (totalCosts){
    totalCosts.classList.toggle('text-dark');
  }
  // Guardar el estado del modo de color en localStorage
  localStorage.setItem('darkMode', body.classList.contains("dark-mode"));

  if (body.classList.contains("dark-mode")) {
    colorModeButton.innerText = "Cambiar a Light";
  } else {
    colorModeButton.innerText = "Cambiar a Dark";
  }
}