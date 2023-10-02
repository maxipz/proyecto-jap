const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
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
     alert("Debes iniciar sesión para acceder a esta página.");
     window.location.href = "login.html";
   }
   
   const userId = localStorage.getItem("username"); // Agarra los datos de localStorage del username y lo agrega al navbar
   const userButton = document.getElementById("userbutton"); 
   const atIndex = userId.indexOf("@");    

if (atIndex !== -1) {
   const userName = userId.substring(0, atIndex);
   userButton.innerHTML = "Bienvenido! " + userName; 

}else{
 userButton.innerHTML = "Bienvenido! " + userId;
}};
window.onload = logCheck();


const logOut = document.getElementById("logOut");
logOut.addEventListener("click", function() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = "index.html";
});


// Cambiar el Background de la pagina
const colorModeButton = document.querySelector('#color-mode');
const body = document.body;

// Recuperar el estado del modo de color desde localStorage (si existe)
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Inicializar el modo de color según lo que se encuentra en localStorage
if (isDarkMode) {
  body.classList.add("dark-mode");
  colorModeButton.innerText = "Cambiar a Light";
}

colorModeButton.addEventListener("click", cambiarModoColor);

function cambiarModoColor() {
  body.classList.toggle("dark-mode");

  // Guardar el estado del modo de color en localStorage
  localStorage.setItem('darkMode', body.classList.contains("dark-mode"));

  if (body.classList.contains("dark-mode")) {
    colorModeButton.innerText = "Cambiar a Light";
  } else {
    colorModeButton.innerText = "Cambiar a Dark";
  }
}

z