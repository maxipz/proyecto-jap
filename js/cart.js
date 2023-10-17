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