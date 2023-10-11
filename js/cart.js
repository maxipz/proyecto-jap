const cartUserId = 25801;
const apiUrl = `https://japceibal.github.io/emercado-api/user_cart/${cartUserId}.json`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const productoDelServidor = data.articles;
    const productosDelLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cart = [...productoDelServidor, ...productosDelLocalStorage];
    mostrarProductosEnHTML(cart);
  })
  .catch(error => {
    console.error('Hubo un error al realizar la solicitud:', error);
  });

function mostrarProductosEnHTML(articles) {
    const productosTableBody = document.getElementById('product-table-body');
  
    // Limpia cualquier contenido previo en la tabla
    productosTableBody.innerHTML = '';
  
    // Recorre el array de productos y genera filas de tabla para cada uno
    articles.forEach(producto => {
      let filaProducto = `
      <tr>
        <td><img src="${producto.image}" class="img-fluid" width="65px"></td>
        <td>${producto.name}</td>
        <td>${producto.unitCost} ${producto.currency}</td>
        <td><input type="number" class="count-input" value="${producto.count}" min="1"></td>
        <td>${producto.count * producto.unitCost} ${producto.currency}</td>
      </tr>
      `;
  
      productosTableBody.innerHTML += filaProducto;
    });
}
