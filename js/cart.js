const subtotalCartHTML = document.getElementById('costsSubtotal');
const shippingCostCartHTML = document.getElementById('shippingCosts')
const totalCostCartHTML = document.getElementById('totalCosts')
const shipping1 = document.getElementById('shippingType1')
const shipping2 = document.getElementById('shippingType2')
const shipping3 = document.getElementById('shippingType3')
const exchangeRateUYUtoUSD = 0.025;
const exchangeRateUSDtoUSD = 1;
let subtotalCart = 0; //inicializamos el subtotal, shipping y total del carrito en 0
let shippingCost = 0
let totalCostCart = 0

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

      let exchangeRate = '' //chequeamos que moneda tiene el producto y si es UYU la convertimos a USD
    if (product.currency === 'UYU'){
      exchangeRate = exchangeRateUYUtoUSD;
    }
      else {
        exchangeRate = exchangeRateUSDtoUSD
      }

    const subtotal = product.count * product.unitCost * exchangeRate; //calculamos el subtotal para los elementos cargados inicialmente en el carrito 
    subtotalCart += subtotal

      let rowProduct = `
      <tr>
        <td><img src="${product.image}" class="img-fluid" width="65px"></td>
        <td>${product.name}</td>
        <td>${product.unitCost} ${product.currency}</td>
        <td><input type="number" class="count-input" value="${product.count}" min="1" data-unit-cost="${product.unitCost}" data-currency="${product.currency}"></td>
        <td class="subtotal">${subtotal.toFixed(2)} USD</td>
      </tr>
      `;

    tableBodyProducts.innerHTML += rowProduct;
  });



  // Agregar event listener a los campos de entrada de cantidad, se llama las funciones updateSubtotal, updateShipping y updateTotal
  const countInputs = document.querySelectorAll('.count-input');
  countInputs.forEach(input => {
    input.addEventListener('input', function(event) {
      updateSubtotal(event);
      updateShipping(shippingCost);
      updateTotal() 
    });
  });

  //Cargamos el subtotal en el HTML
  subtotalCartHTML.textContent = `${parseFloat(subtotalCart).toFixed(2)} USD`;
  totalCostCartHTML.textContent = subtotalCartHTML.textContent;
}

//Calculamos el costo de envio y el total
//le agregamos un event listener a cada opcion, si la opcion cambia se corre la funcion
shipping1.addEventListener("change", function () {  //chequea si la opcion esta checkeada, si esta calcula el shipping y corre la funcion para mostrarlo en el html
  if (shipping1.checked) {
    shippingCost  = parseFloat(subtotalCart)*0.15;
    updateShipping(shippingCost)
    updateTotal() 
  }
});
shipping2.addEventListener("change", function () {
  if (shipping2.checked) {
    shippingCost  = parseFloat(subtotalCart)*0.07;
    updateShipping(shippingCost)
    updateTotal() 
  }
});
shipping3.addEventListener("change", function () {
  if (shipping3.checked) {
    shippingCost  = parseFloat(subtotalCart)*0.05;
    updateShipping(shippingCost)
    updateTotal() 
  }
});

//funciones para actualizar shipping y costo total
function updateShipping(shippingCost) {
  shippingCostCartHTML.textContent = `${shippingCost.toFixed(2)} USD`;
}

function updateTotal() {
  totalCostCart = subtotalCart + shippingCost
  totalCostCartHTML.textContent = `${totalCostCart.toFixed(2)} USD`;
}

function updateSubtotal(event) { //funcion para actualizar el subtotal si cambian las cantidades
  const input = event.target;
  const count = parseInt(input.value);
  const unitCost = parseFloat(input.getAttribute('data-unit-cost'));
  const currency = input.getAttribute('data-currency');
  const subtotalElement = input.parentElement.nextElementSibling;

  let exchangeRate = '' //chequeamos que moneda tiene el producto y si es UYU la convertimos a USD
  if (currency === 'UYU'){
    exchangeRate = exchangeRateUYUtoUSD;
  }
    else {
      exchangeRate = exchangeRateUSDtoUSD
    }

  const subtotal = count * unitCost * exchangeRate;
  subtotalElement.textContent = `${subtotal.toFixed(2)} USD`;

  //calculamos el subtotal del carrito
  const subtotalElements = document.querySelectorAll('.subtotal');
  subtotalCart = 0;
  subtotalElements.forEach((element) => {

    const itemSubtotal = parseFloat(element.textContent.split(' ')[0]); //split crea un array basandose en el espacio para crear los elementos, se llama la pos 0 que es el valor
        subtotalCart += itemSubtotal;  //parseFloat lo convierte a numero, porque es un string
  });

  //cargamos el costo al html
  subtotalCartHTML.textContent = `${parseFloat(subtotalCart).toFixed(2)} USD`;

  //actualizamos el costo del shipping
  if (shipping1.checked) {
    shippingCost  = parseFloat(subtotalCart)*0.15;
  } else if (shipping2.checked) {
    shippingCost  = parseFloat(subtotalCart)*0.07;
  } else if (shipping3.checked) {
    shippingCost  = parseFloat(subtotalCart)*0.05;
  }

  updateShipping(shippingCost)

  //actualizamos el costo total
  updateTotal() 
}

const cleanCart = document.getElementById('cleanCart') //se limpia el carrito cuando se cliquea el boton y tambien limpia el localstorage
cleanCart.addEventListener('click', () => {
  const tableBodyProducts = document.getElementById('product-table-body');
  tableBodyProducts.innerHTML = '';
  subtotalCartHTML.textContent = '';
  shippingCostCartHTML.textContent = '';
  totalCostCartHTML.textContent = '';

  localStorage.removeItem('cart')
})


//Forma de pago
function PaymentMethod () {
  const option1Radio = document.getElementById("option1");
  const option2Radio = document.getElementById("option2");
  const option2Text = document.getElementById("account-number");
  const option1Texts = document.querySelectorAll("#option-card input");
  const payMethod = document.getElementById('method');
  const alert = document.getElementById("successAlert"); 
  const forms = document.getElementsByClassName("needs-validation");

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
  

// Validar todos los formularios 
document.getElementById("checkoutBtn").addEventListener("click", (e) => {
  let valid = true;
  for (const form of forms) {
      if (!form.checkValidity()) {
          valid = false;
// Formulario de metodo de pago
          if (form.id === "modalForm") {
            payMethod.innerText = "Debe rellenar los campos | ";
            payMethod.style.color = "#ff0602";
            
          }
      }
      form.classList.add('was-validated');
  }
  if (valid) {
      alert.classList.remove("d-none");
  }
});
};

PaymentMethod();






