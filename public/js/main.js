async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();

    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.photo}" alt="${product.name}" width="150">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Cantidad: ${product.quantity}</p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadProducts);
