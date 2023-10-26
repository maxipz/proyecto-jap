const subtotalCartHTML = document.getElementById('costsSubtotal');
const shippingCostCartHTML = document.getElementById('shippingCosts');
const totalCostCartHTML = document.getElementById('totalCosts');
const shipping1 = document.getElementById('shippingType1');
const shipping2 = document.getElementById('shippingType2');
const shipping3 = document.getElementById('shippingType3');
const exchangeRateUYUtoUSD = 0.025;
const exchangeRateUSDtoUSD = 1;
let subtotalCart = 0;
let shippingCost = 0;
let totalCostCart = 0;

const cartUserId = 25801;
const apiUrl = `https://japceibal.github.io/emercado-api/user_cart/${cartUserId}.json`;

let cart = [];

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const preselectedProduct = data.articles;
    const localStorageProducts = JSON.parse(localStorage.getItem('cart')) || [];
    cart = [...preselectedProduct, ...localStorageProducts];
    showProducts(cart);
  })
  .catch((error) => {
    console.error('Hubo un error al realizar la solicitud:', error);
  });

function showProducts(articles) {
  const tableBodyProducts = document.getElementById('product-table-body');
  subtotalCart = 0; // Inicializa el subtotalCart a 0 antes de recorrer los productos

  tableBodyProducts.innerHTML = '';

  articles.forEach((product, index) => {
    let exchangeRate = product.currency === 'UYU' ? exchangeRateUYUtoUSD : exchangeRateUSDtoUSD;
    const subtotal = product.count * product.unitCost * exchangeRate;
    subtotalCart += subtotal; // Actualiza el subtotalCart en cada iteración

    let rowProduct = `
      <tr>
        <td><img src="${product.image}" class="img-fluid" width="65px"></td>
        <td>${product.name}</td>
        <td>${product.unitCost} ${product.currency}</td>
        <td><input type="number" class="count-input" value="${product.count}" min="1" data-index="${index}" data-unit-cost="${product.unitCost}" data-currency="${product.currency}"></td>
        <td class="subtotal">${subtotal.toFixed(2)} USD</td>
        <td><button type="button" class="btn btn-outline-danger delete-button" data-index="${index}" onclick="removeProduct(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg>
          </button>
        </td>
      </tr>
    `;

    tableBodyProducts.innerHTML += rowProduct;
  });

  const countInputs = document.querySelectorAll('.count-input');
  countInputs.forEach((input) => {
    input.addEventListener('input', function (event) {
      updateSubtotal(event);
    });

    // Actualiza el costo total y el costo de envío después de eliminar un producto
    updateTotal();
  });

  // Actualiza el subtotal en la tabla de costos
  subtotalCartHTML.textContent = `${parseFloat(subtotalCart).toFixed(2)} USD`;

  updateShipping(shippingCost);
}

function removeProduct(index) {
  const productIndex = parseInt(index);
  cart.splice(productIndex, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  showProducts(cart); // Mostrar productos restantes

  if (cart.length === 0) {
    // Si el carrito está vacío, oculta la tabla y establece los valores en 0
    const tableBodyProducts = document.getElementById('product-table-body');
    tableBodyProducts.innerHTML = '';
    subtotalCart = 0;
    shippingCost = 0;
    totalCostCart = 0;
    subtotalCartHTML.textContent = '0.00 USD';
    shippingCostCartHTML.textContent = '0.00 USD';
    totalCostCartHTML.textContent = '0.00 USD';
  }
}


shipping1.addEventListener('change', function () {
  if (shipping1.checked) {
    shippingCost = parseFloat(subtotalCart) * 0.15;
    updateShipping(shippingCost);
    updateTotal();
  }
});

shipping2.addEventListener('change', function () {
  if (shipping2.checked) {
    shippingCost = parseFloat(subtotalCart) * 0.07;
    updateShipping(shippingCost);
    updateTotal();
  }
});

shipping3.addEventListener('change', function () {
  if (shipping3.checked) {
    shippingCost = parseFloat(subtotalCart) * 0.05;
    updateShipping(shippingCost);
    updateTotal();
  }
});

function updateShipping(shippingCost) {
  shippingCostCartHTML.textContent = `${shippingCost.toFixed(2)} USD`;
}

function updateTotal() {
  totalCostCart = subtotalCart + shippingCost;
  totalCostCartHTML.textContent = `${totalCostCart.toFixed(2)} USD`;
}

function updateSubtotal(event) {
  const input = event.target;
  const count = parseInt(input.value);
  const unitCost = parseFloat(input.getAttribute('data-unit-cost'));
  const currency = input.getAttribute('data-currency');
  const subtotalElement = input.parentElement.nextElementSibling;

  let exchangeRate = currency === 'UYU' ? exchangeRateUYUtoUSD : exchangeRateUSDtoUSD;
  const subtotal = count * unitCost * exchangeRate;
  subtotalElement.textContent = `${subtotal.toFixed(2)} USD`;

  // Actualiza el subtotal en la tabla de costos
  const subtotalElements = document.querySelectorAll('.subtotal');
  subtotalCart = 0;
  subtotalElements.forEach((element) => {
    const itemSubtotal = parseFloat(element.textContent.split(' ')[0]);
    subtotalCart += itemSubtotal;
  });

  subtotalCartHTML.textContent = `${parseFloat(subtotalCart).toFixed(2)} USD`;

  if (shipping1.checked) {
    shippingCost = parseFloat(subtotalCart) * 0.15;
  } else if (shipping2.checked) {
    shippingCost = parseFloat(subtotalCart) * 0.07;
  } else if (shipping3.checked) {
    shippingCost = parseFloat(subtotalCart) * 0.05;
  }

  updateShipping(shippingCost);
  updateTotal();
}

const cleanCart = document.getElementById('cleanCart');
cleanCart.addEventListener('click', () => {
  const tableBodyProducts = document.getElementById('product-table-body');
  tableBodyProducts.innerHTML = '';
  subtotalCart = 0; // Restablece el subtotal a 0 cuando se limpia el carrito
  subtotalCartHTML.textContent = '';
  shippingCostCartHTML.textContent = '';
  totalCostCartHTML.textContent = '';

  localStorage.removeItem('cart');
});

function PaymentMethod() {
  const option1Radio = document.getElementById('option1');
  const option2Radio = document.getElementById('option2');
  const option2Text = document.getElementById('account-number');
  const option1Texts = document.querySelectorAll('#option-card input');
  const payMethod = document.getElementById('method');
  const alert = document.getElementById('successAlert');
  const forms = document.getElementsByClassName('needs-validation');

  option1Radio.addEventListener('change', function () {
    option2Text.disabled = option1Radio.checked;
    for (const input of option1Texts) {
      input.disabled = option2Radio.checked;
    }
    payMethod.textContent = 'Tarjeta de crédito | ';
  });

  option2Radio.addEventListener('change', function () {
    for (const input of option1Texts) {
      input.disabled = option2Radio.checked;
    }
    option2Text.disabled = option1Radio.checked;
    payMethod.textContent = 'Transferencia bancaria | ';
  });

  document.getElementById('checkoutBtn').addEventListener('click', (e) => {
    let valid = true;
    for (const form of forms) {
      if (!form.checkValidity()) {
        valid = false;
        if (form.id === 'modalForm') {
          payMethod.innerText = 'Debe rellenar los campos | ';
          payMethod.style.color = '#ff0602';
        }
      }
      form.classList.add('was-validated');
    }
    if (valid) {
      alert.classList.remove('d-none');
    }
  });
}

PaymentMethod();
