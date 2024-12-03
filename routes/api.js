const express = require('express');
const { poolPromise } = require('../database/connection');
const router = express.Router();
const fs = require('fs'); // Módulo para manejar archivos


// Crear producto
router.post('/product', async (req, res) => {
    try {
        const { code, name, photo, description, quantity, price } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('code', code)
            .input('name', name)
            .input('photo', photo)
            .input('description', description)
            .input('quantity', quantity)
            .input('price', price)
            .query(`
                INSERT INTO product (code, name, photo, description, quantity, price)
                VALUES (@code, @name, @photo, @description, @quantity, @price)
            `);
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los productos
router.get('/product', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM product');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un producto por ID
router.get('/product/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM product WHERE id = @id');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Devuelve un solo producto
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Actualizar producto
router.put('/product/:id', upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { code, name, description, quantity, price } = req.body;
    let photo = req.body.photo; // Mantén la imagen existente si no se sube una nueva

    try {
        const pool = await poolPromise;

        // Si no se sube una nueva imagen, conserva la imagen anterior
        if (!req.file) {
            const result = await pool.request()
                .input('id', id)
                .query('SELECT photo FROM product WHERE id = @id');
            if (result.recordset.length > 0) {
                photo = result.recordset[0].photo;
            } else {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
        } else {
            // Si se sube una nueva imagen, actualiza la variable `photo`
            photo = `/uploads/${req.file.filename}`;
        }

        // Actualizar el producto en la base de datos
        await pool.request()
            .input('id', id)
            .input('code', code)
            .input('name', name)
            .input('photo', photo)
            .input('description', description)
            .input('quantity', quantity)
            .input('price', price)
            .query(`
                UPDATE product
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



// Eliminar producto
app.delete('/api/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await poolPromise;

        // Obtener el producto para acceder a la ruta de la imagen
        const result = await pool.request()
            .input('id', id)
            .query('SELECT photo FROM product WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const product = result.recordset[0];

        // Eliminar el archivo de la imagen si existe
        const imagePath = path.join(__dirname, product.photo);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Eliminar el producto de la base de datos
        await pool.request()
            .input('id', id)
            .query('DELETE FROM product WHERE id = @id');

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
