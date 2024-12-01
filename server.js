const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para parsear JSON y solicitudes form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Multer para manejar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las fotos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({ storage });

// Ruta para obtener productos (simulada aquí)
app.get('/api/products', (req, res) => {
    // Aquí iría la lógica para obtener productos desde la base de datos
    res.json([]); // Devolver una lista vacía de productos por ahora
});

// Ruta para agregar un producto
app.post('/api/products', upload.single('photo'), (req, res) => {
    // Verificar si el archivo está presente
    if (!req.file) {
        return res.status(400).json({ error: 'Se requiere una imagen para el producto' });
    }

    const { code, name, description, quantity, price } = req.body;
    const photo = `/uploads/${req.file.filename}`; // Ruta de la imagen cargada

    // Aquí podrías agregar el producto a tu base de datos, por ejemplo, en SQL
    // Simulación de guardado del producto
    const newProduct = {
        code,
        name,
        description,
        quantity,
        price,
        photo
    };

    // Devolver la respuesta con el producto agregado (simulación)
    res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
