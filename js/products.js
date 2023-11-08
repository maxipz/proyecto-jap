
  let sortOrder = '';
  let searchData = [];

  function showHTML(data) {
    const productsContainer = document.querySelector('.product-list');
    const minPrice = parseInt(document.querySelector('#rangeFilterPriceMin').value);
    const maxPrice = parseInt(document.querySelector('#rangeFilterPriceMax').value);
    const searchInput = document.querySelector('#searchInput').value.trim().toLowerCase();

    if (sortOrder === 'asc') {
      data.sort((a, b) => a.cost - b.cost);
    } else if (sortOrder === 'desc') {
      data.sort((a, b) => b.cost - a.cost);
    } else if (sortOrder === 'soldCount') {
      data.sort((a, b) => b.soldCount - a.soldCount);
    }

    let filteredData = data.filter(product => {
      const productPrice = parseInt(product.cost);

      return (
        (isNaN(minPrice) || productPrice >= minPrice) &&
        (isNaN(maxPrice) || productPrice <= maxPrice) &&
        (product.name.toLowerCase().includes(searchInput) ||
          product.description.toLowerCase().includes(searchInput))
      );
    });

    let htmlContent = '';

    filteredData.forEach(product => {
      htmlContent += `
        <div class="list-group-item list-group-item-action cursor-active " onclick="getId('${product.id}')">
          <div class="row">
            <div class="col-3">
              <img src="${product.image}" alt="product image" class="img-thumbnail">
            </div>
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <div class="mb-1">
                  <h4>${product.name} - ${product.currency} ${product.cost}</h4>
                  <p class="mb-1">${product.description}</p>
                </div>
                <small class="text-muted">${product.soldCount} artículos</small>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = htmlContent;
  }

  function loadProductData(catID) {
    const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
    fetch(url)
      .then(response => response.json())
      .then(result => {
        searchData = result.products;
        showHTML(searchData);
      })
      .catch(error => console.error('Ocurrió un error:', error));
  }

  document.querySelector('#sortAsc').addEventListener('click', () => {
    sortOrder = 'asc';
    showHTML(searchData); // Apply the sorting locally
  });

  document.querySelector('#sortDesc').addEventListener('click', () => {
    sortOrder = 'desc';
    showHTML(searchData); // Apply the sorting locally
  });

  document.querySelector('#sortByCount').addEventListener('click', () => {
    sortOrder = 'soldCount';
    showHTML(searchData); // Apply the sorting locally
  });

  document.querySelector('#rangeFilterPrice').addEventListener('click', () => {
    showHTML(searchData); // Apply the filtering and sorting locally
  });

  document.querySelector('#clearRangeFilter').addEventListener('click', () => {
    document.querySelector('#rangeFilterPriceMin').value = '';
    document.querySelector('#rangeFilterPriceMax').value = '';
    document.querySelector('#searchInput').value = '';
    sortOrder = '';
    showHTML(searchData); // Apply the filtering and sorting locally
  });

  document.querySelector('#searchInput').addEventListener('input', () => {
    showHTML(searchData); // Apply the filtering and sorting locally
  });

  const catID = localStorage.getItem("catID");
  loadProductData(catID);


function getId(id) {
  localStorage.setItem("productId", id);
  window.location.href = "product-info.html";
}
