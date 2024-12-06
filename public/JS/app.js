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

//Funcion de validacion de errores:
function validateForm() {
    const fields = [
        { id: 'code', message: 'El código del producto es obligatorio.' },
        { id: 'name', message: 'El nombre del producto es obligatorio.' },
        { id: 'photo', message: 'La foto del producto es obligatoria.' },
        { id: 'description', message: 'La descripción del producto es obligatoria.' },
        { id: 'quantity', message: 'La cantidad del producto es obligatoria.' },
        { id: 'price', message: 'El precio del producto es obligatorio.' }
    ];

    let isValid = true;

    fields.forEach(field => {
        const inputElement = document.getElementById(field.id);
        const errorMessage = inputElement.nextElementSibling;

        if (inputElement.type === 'file') {
            if (!inputElement.files[0]) {
                isValid = false;
                inputElement.classList.add('error');
                errorMessage.textContent = field.message;
                errorMessage.style.display = 'block';
            } else {
                inputElement.classList.remove('error');
                errorMessage.style.display = 'none';
            }
        } else if (inputElement.value.trim() === '') {
            isValid = false;
            inputElement.classList.add('error');
            errorMessage.textContent = field.message;
            errorMessage.style.display = 'block';
        } else {
            inputElement.classList.remove('error');
            errorMessage.style.display = 'none';
        }
    });

    return isValid;
}

// Modificar la función de agregar producto para incluir la validación
async function addProduct() {
    if (!validateForm()) {
        alert('Por favor, corrige los campos en rojo antes de continuar.');
        return;
    }

    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0];
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
        alert('Producto agregado exitosamente!');
        getproduct();
        resetForm();
    } else {
        alert('Error al agregar el producto.');
    }
}


// Función para agregar un producto
async function addProduct() {
    // Verifica si el formulario es válido antes de continuar
    if (!validateForm()) {
        return; // No procede si hay errores
    }

    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0];
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

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Producto agregado exitosamente!');
            getproduct();
            resetForm();
        } else {
            alert('Error al agregar el producto. Revisa los datos e inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al conectar con el servidor.');
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
