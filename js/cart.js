const cartUserId = 25801;
const apiUrl = `https://japceibal.github.io/emercado-api/user_cart/${cartUserId}.json`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const preselectedProduct = data.articles;
    const localStorageProducts = JSON.parse(localStorage.getItem('cart')) || [];
    const cart = [...preselectedProduct, ...localStorageProducts];
    showProducts(cart);
  })
  .catch(error => {
    console.error('Hubo un error al realizar la solicitud:', error);
  });

function showProducts(articles) {
    const tableBodyProducts = document.getElementById('product-table-body');
  
    // Limpia cualquier contenido previo en la tabla
    tableBodyProducts.innerHTML = '';
  
    // Recorre el array de productos y genera filas de tabla para cada uno
    articles.forEach(product => {
      let rowProduct = `
      <tr>
        <td><img src="${product.image}" class="img-fluid" width="65px"></td>
        <td>${product.name}</td>
        <td>${product.unitCost} ${product.currency}</td>
        <td><input type="number" class="count-input" value="${product.count}" min="1" data-unit-cost="${product.unitCost}" data-currency="${product.currency}"></td>
        <td class="subtotal">${product.count * product.unitCost} ${product.currency}</td>
      </tr>
      `;
  
      tableBodyProducts.innerHTML += rowProduct;
    });

    // Agregar event listener a los campos de entrada de cantidad
    const countInputs = document.querySelectorAll('.count-input');
    countInputs.forEach(input => {
      input.addEventListener('input', updateSubtotal);
    });
}

function updateSubtotal(event) {
    const input = event.target;
    const count = parseInt(input.value);
    const unitCost = parseFloat(input.getAttribute('data-unit-cost'));
    const currency = input.getAttribute('data-currency');
    const subtotal = count * unitCost;
    const subtotalElement = input.parentElement.nextElementSibling;
    subtotalElement.textContent = `${subtotal} ${currency}`;
}

const cleanCart = document.getElementById('cleanCart') //se limpia el carrito cuando se cliquea el boton y tambien limpia el localstorage
cleanCart.addEventListener('click', ()=> {
  const tableBodyProducts = document.getElementById('product-table-body');
  tableBodyProducts.innerHTML = '';
  localStorage.removeItem('cart')
})


//Forma de pago
document.addEventListener("DOMContentLoaded", function () {
  const option1Radio = document.getElementById("option1");
  const option2Radio = document.getElementById("option2");
  const option2Text = document.getElementById("account-number");
  const option1Texts = document.querySelectorAll("#option-card input");
  const payMethod = document.getElementById('method');

  option1Radio.addEventListener("change", function () {
    option2Text.disabled = option1Radio.checked;
    for (const input of option1Texts) {
      input.disabled = option2Radio.checked;
    }
    payMethod.textContent = 'Tarjeta de crédito | ';
  });

  option2Radio.addEventListener("change", function () {
    for (const input of option1Texts) {
      input.disabled = option2Radio.checked;
    }
    option2Text.disabled = option1Radio.checked;
    payMethod.textContent = 'Transferencia bancaria | ';
  })
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Funcion para validar la forma de pago

function validateMessage() {
  let paymentValidation = document.getElementById("method");
  let validationP = document.getElementById("validationP");

  if (paymentValidation.textContent === "No se ha seleccionado | ") {
    // Si el mensaje es "No se ha seleccionado | ", muestra el párrafo oculto del HTML
    validationP.style.display = "block";
  } else {
    // Si el mensaje es diferente a "No se ha seleccionado | ", oculta el párrafo del html
    validationP.style.display = "none"; // Para ocultar
  }
}

// Obtén el botón "Finalizar compra" por su ID
var finishPurch = document.getElementById("finishPurch");

// Agrega un evento click al botón "Finalizar compra" para verificar el mensaje
finishPurch.addEventListener("click", validateMessage);




