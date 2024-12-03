// API base URL
const apiUrl = 'http://localhost:5000/api/product'; // Cambia esta URL si es necesario

// Función para obtener los productos
async function getproduct() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Limpiar la tabla antes de cargar nuevos datos
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    productTable.innerHTML = '';

    // Agregar cada producto a la tabla
    data.forEach(product => {
        const row = productTable.insertRow();
        
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td><img src="${product.photo}" alt="${product.name}" /></td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>
                <button onclick="editProduct('${product.id}')">Editar</button>
                <button onclick="deleteProduct('${product.id}')">Eliminar</button>
            </td>
        `;
    });
}

// Función para agregar un producto
async function addProduct() {
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0];
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    // Crear un FormData para enviar datos, incluyendo el archivo de la foto
    const formData = new FormData();
    formData.append('code', code);
    formData.append('name', name);
    formData.append('photo', photo);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('price', price);

    // Enviar la solicitud POST a la API
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Producto agregado exitosamente!');
        getproduct(); // Actualizar la lista de productos
    } else {
        alert('Error al agregar el producto.');
    }
}

// Función para editar un producto
async function editProduct(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const product = await response.json();

    // Rellenar el formulario con los datos del producto
    document.getElementById('code').value = product.code;
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('price').value = product.price;
    
    // Cambiar el botón para actualizar el producto
    const button = document.querySelector('#productForm button');
    button.innerHTML = 'Actualizar Producto';
    button.onclick = () => updateProduct(id);
}

// Función para actualizar un producto
async function updateProduct(id) {
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0]; // Nueva imagen
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    // Crear un FormData para enviar los datos
    const formData = new FormData();
    formData.append('code', code);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('price', price);

    // Solo agrega la imagen si se seleccionó una nueva
    if (photo) {
        formData.append('photo', photo);
    }

    // Enviar la solicitud PUT al backend
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (response.ok) {
        alert('Producto actualizado exitosamente!');
        getproduct(); // Actualizar la lista de productos
        resetForm(); // Limpiar el formulario
    } else {
        alert('Error al actualizar el producto.');
    }
}


// Función para eliminar un producto
async function deleteProduct(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Producto eliminado exitosamente!');
        getproduct(); // Actualizar la lista de productos
    } else {
        alert('Error al eliminar el producto.');
    }
}

// Función para limpiar el formulario
function resetForm() {
    document.getElementById('productForm').reset();
    const button = document.querySelector('#productForm button');
    button.innerHTML = 'Agregar Producto';
    button.onclick = addProduct;
}

// Cargar productos al inicio
getproduct();
