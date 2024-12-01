const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Configuración de Multer para cargar imágenes
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// Rutas CRUD

// Obtener todos los productos
router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Obtener un producto por ID
router.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

// Crear un nuevo producto
router.post('/products', upload.single('photo'), async (req, res) => {
    const { code, name, description, quantity, price } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : '';
    const newProduct = new Product({ code, name, description, quantity, price, photo });
    await newProduct.save();
    res.json({ message: 'Producto creado', product: newProduct });
});

// Editar un producto existente
router.put('/products/:id', upload.single('photo'), async (req, res) => {
    const { code, name, description, quantity, price } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : req.body.currentPhoto;
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { code, name, description, quantity, price, photo },
        { new: true }
    );
    res.json({ message: 'Producto actualizado', product: updatedProduct });
});

// Eliminar un producto
router.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;
