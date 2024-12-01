const ComputerPart = require('../models/ComputerPart');

// Obtener todas las partes
exports.getAllParts = async (req, res) => {
    try {
        const parts = await ComputerPart.find();
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva parte
exports.createPart = async (req, res) => {
    const { code, name, photo, description, quantity, price } = req.body;

    try {
        const newPart = new ComputerPart({ code, name, photo, description, quantity, price });
        await newPart.save();
        res.status(201).json(newPart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar una parte existente
exports.updatePart = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPart = await ComputerPart.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPart) return res.status(404).json({ message: 'Part not found' });
        res.status(200).json(updatedPart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una parte
exports.deletePart = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPart = await ComputerPart.findByIdAndDelete(id);
        if (!deletedPart) return res.status(404).json({ message: 'Part not found' });
        res.status(200).json({ message: 'Part deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
