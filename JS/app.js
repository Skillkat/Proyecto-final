const apiUrl = 'http://localhost:3000/api/products';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Función para obtener los productos de la base de datos
async function fetchProducts() {
    const response = await fetch(apiUrl);
    const products = await response.json();
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td><img src="images/${product.photo}" alt="${product.name}" width="50"></td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para agregar un producto
async function addProduct() {
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0]; // Aquí se manejaría la subida de imagen
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    const formData = new FormData();
    formData.append('code', code);
    formData.append('name', name);
    formData.append('photo', photo);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('price', price);

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        fetchProducts(); // Refrescar la lista de productos
    } else {
        alert('Hubo un error al agregar el producto.');
    }
}

// Función para eliminar un producto
async function deleteProduct(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        fetchProducts(); // Refrescar la lista de productos
    } else {
        alert('Hubo un error al eliminar el producto.');
    }
}
