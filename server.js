const express = require('express');
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('./database/connection'); // Asegúrate de que la ruta sea correcta
const app = express();
const port = 5000;

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

// Middleware para parsear JSON y solicitudes form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para obtener productos
app.get('/api/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset); // Devuelve los productos desde la base de datos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM Products WHERE id = @id');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta para agregar un producto
app.post('/api/products', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Se requiere una imagen para el producto' });
    }

    const { code, name, description, quantity, price } = req.body;
    const photo = `/uploads/${req.file.filename}`; // Ruta de la imagen cargada

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('code', code)
            .input('name', name)
            .input('photo', photo)
            .input('description', description)
            .input('quantity', quantity)
            .input('price', price)
            .query(`
                INSERT INTO Products (code, name, photo, description, quantity, price)
                VALUES (@code, @name, @photo, @description, @quantity, @price)
            `);
        
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (err) {
        console.error('Error al agregar el producto:', err);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Ruta para actualizar un producto
app.put('/api/products/:id', upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { code, name, description, quantity, price } = req.body;
    let photo = req.body.photo; // Si no se carga una nueva foto, mantener la foto existente

    // Si se carga una nueva foto, actualizamos la variable `photo`
    if (req.file) {
        photo = `/uploads/${req.file.filename}`;
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', id)
            .input('code', code)
            .input('name', name)
            .input('photo', photo)
            .input('description', description)
            .input('quantity', quantity)
            .input('price', price)
            .query(`
                UPDATE Products
                SET code = @code, name = @name, photo = @photo, 
                    description = @description, quantity = @quantity, price = @price
                WHERE id = @id
            `);
        
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', id)
            .query('DELETE FROM Products WHERE id = @id');
        
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
