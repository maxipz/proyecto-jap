let cart = JSON.parse(localStorage.getItem('cart')) || []
showProducts(cart);

function showProducts(articles) {
  const tableBodyProducts = document.getElementById('product-table-body');
  tableBodyProducts.innerHTML = '';
  articles.forEach((product) => {
    let rowProduct = `
      <tr class="cart-row">
        <td><img src="${product.image}" class="img-fluid" width="65px"></td>
        <td>${product.name}</td>
        <td><div class="cart-price">${product.unitCost}</div> <div class="cart-currency">${product.currency}</div></td>
        <td><input type="number" class="count-input" value="${product.count}" min="1" data-unit-cost="${product.unitCost}" data-currency="${product.currency}"></td>
        <td class="item-subtotal"></td>
        <td><button type="button" class="btn btn-outline-danger delete-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg>
          </button>
        </td>
      </tr>
    `;
    tableBodyProducts.innerHTML += rowProduct;
    updateCosts()
  });

/////////////////////////////////////////
/////////////REMOVE ITEMS////////////////
/////////////////////////////////////////

let removeItemButton  = document.getElementsByClassName('delete-button') //me trae un array con todos los botones para eliminar los elementos
for(let i=0; i < removeItemButton.length; i++) { //hacemos un for para recorrer el array y agregarle un event listener a c/u de los botones
  let button = removeItemButton[i] //el boton que accedemos
  button.addEventListener('click', function(event){  //el event listener siempre devuelve un event object adentro de la funcion que llama
    let row = event.target.closest('tr') //el target es el boton que clickeamos, el closest seria la fila mas cercana al boton que clickeamos
    let productName = row.querySelector('td:nth-child(2)').innerText;
    cart = cart.filter(product => product.name !== productName); //si el nombre del producto es distinto al productName de la fila borrada, lo deja en el array cart
    localStorage.setItem('cart', JSON.stringify(cart));
    row.remove()
    updateCosts()
  })
}

/////////////////////////////////////////
/////////////COUNT INPUTS////////////////
/////////////////////////////////////////

let countInputs  = document.getElementsByClassName('count-input') //me trae un array con todos los count input
for(let i=0; i < countInputs.length; i++) { //hacemos un for para recorrer el array y agregarle un event listener a c/u de los input
let input = countInputs[i] //el input que accedemos
input.addEventListener('change', updateCosts) //cuando cambia la cantidad que actualice el costo
}

/////////////////////////////////////////
/////////SHIPPING OPTIONS////////////////
/////////////////////////////////////////

let shippingOptions = document.getElementsByClassName('form-check-input') //obtenemos todas las opciones del shipping
for(let i=0; i < shippingOptions.length; i++) {  //accedemos a c/u de las opciones
  let shippingOption = shippingOptions[i]
  shippingOption.addEventListener('change', updateCosts) //si cambia una de las opciones, actualizamos los costos
}
}

function updateCosts(){

/////////////////////////////////////////
/////////////////SUBTOTAL////////////////
/////////////////////////////////////////

  let cartRows = document.getElementsByClassName('cart-row') //obtenemos todas las filas del carrito
  let subtotal = 0
  const exchangeRateUYUtoUSD = 0.025;
  const exchangeRateUSDtoUSD = 1;
  for(let i=0; i < cartRows.length; i++) {  //accedemos a c/u de las filas para calcular el subtotal del item
    let cartRow = cartRows[i] 
    let priceElement = cartRow.getElementsByClassName('cart-price')[0]
    let quantityElement = cartRow.getElementsByClassName('count-input')[0]
    let currencyElement = cartRow.getElementsByClassName('cart-currency')[0]
    let price = parseFloat(priceElement.innerText) //el precio unitario del item
    let quantity = quantityElement.value //la cantidad que hay en el input
    let exchangeRate = currencyElement.innerText === 'UYU' ? exchangeRateUYUtoUSD : exchangeRateUSDtoUSD; //el cambio a usar
    subtotal = subtotal + (price*quantity*exchangeRate) //calculamos el subtotal para cada elemento del carrito y lo agregamos al subtotal general
    let subtotalElement = cartRow.getElementsByClassName('item-subtotal')[0]
    subtotalElement.innerHTML = (price*quantity*exchangeRate).toFixed(2) + ' USD'
    }
    let cartSubtotal = document.getElementById('cartSubtotal')
    cartSubtotal.innerHTML = subtotal.toFixed(2) + ' USD'

/////////////////////////////////////////
/////////////////SHIPPING////////////////
/////////////////////////////////////////

  let shippingOptions = document.getElementsByClassName('form-check-input') //obtenemos todas las opciones del shipping
  let shipping = 0
  let shippingOption1Percentage = 0.15
  let shippingOption2Percentage = 0.07
  let shippingOption3Percentage = 0.05
  for(let i=0; i < shippingOptions.length; i++) {  //accedemos a c/u de las opciones
  let shippingOption = shippingOptions[i]
  if (shippingOption.checked) {  //si esta marcada, vemos que id tiene la opcion y calculamos el shipping acorde
    if (shippingOption.id === 'shippingType1') {
      shipping = shipping + subtotal * shippingOption1Percentage;
    } else if (shippingOption.id === 'shippingType2') {
      shipping = shipping + subtotal * shippingOption2Percentage;
    } else if (shippingOption.id === 'shippingType3') {
      shipping = shipping + subtotal * shippingOption3Percentage;
    }
  }
}
let cartShipping = document.getElementById('shippingCosts')
cartShipping.innerHTML = shipping.toFixed(2) + ' USD'

/////////////////////////////////////////
//////////////COSTO TOTAL////////////////
/////////////////////////////////////////

  let total = subtotal + shipping
  let cartTotal = document.getElementById('totalCosts')
  cartTotal.innerHTML = total.toFixed(2) + ' USD'
}  


const cleanCart = document.getElementById('cleanCart');
cleanCart.addEventListener('click', () => {
  const tableBodyProducts = document.getElementById('product-table-body');
  tableBodyProducts.innerHTML = '';
  localStorage.removeItem('cart');
  updateCosts()
});

function paymentMethod() {
  const option1Radio = document.getElementById('option1');
  const option2Radio = document.getElementById('option2');
  const option2Text = document.getElementById('account-number');
  const option1Texts = document.querySelectorAll('#option-card input');
  const payMethod = document.getElementById('method');
  const alert = document.getElementById('successAlert');
  const errorAlert = document.getElementById('errorAlert');
  const forms = document.getElementsByClassName('needs-validation');

  function radioChange() {
    option2Text.disabled = option1Radio.checked;
    for (const input of option1Texts) {
      input.disabled = option2Radio.checked;
    }
    payMethod.textContent = option1Radio.checked ? 'Tarjeta de crédito | ' : 'Transferencia bancaria | ';
  }

  option1Radio.addEventListener("change", radioChange);
  option2Radio.addEventListener("change", radioChange);

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
      setTimeout(function() {
        alert.classList.add('d-none');
      }, 2000);
    }
    let cart = localStorage.getItem('cart')
    if (cart === '[]') {
      console.log('carrito vacio')
      errorAlert.classList.remove('d-none');
    }
  });
}

paymentMethod();