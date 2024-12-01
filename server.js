const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/computer_parts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Rutas de la API
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(5000, () => console.log('Servidor ejecutándose en http://localhost:5000'));
