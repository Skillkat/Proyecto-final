const express = require('express');
const router = express.Router();
const {
    getAllParts,
    createPart,
    updatePart,
    deletePart
} = require('../controllers/partsController');

// Rutas CRUD
router.get('/', getAllParts);
router.post('/', createPart);
router.put('/:id', updatePart);
router.delete('/:id', deletePart);

module.exports = router;
