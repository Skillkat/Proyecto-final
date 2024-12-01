const express = require('express');
const { poolPromise } = require('../database/connection');
const router = express.Router();

// Crear producto
router.post('/products', async (req, res) => {
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
                INSERT INTO Products (code, name, photo, description, quantity, price)
                VALUES (@code, @name, @photo, @description, @quantity, @price)
            `);
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los productos
router.get('/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un producto por ID
router.get('/products/:id', async (req, res) => {
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
        res.status(500).json({ error: err.message });
    }
});

// Actualizar producto
router.put('/products/:id', async (req, res) => {
    try {
        const { code, name, photo, description, quantity, price } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('id', req.params.id)
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
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto
router.delete('/products/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM Products WHERE id = @id');
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
