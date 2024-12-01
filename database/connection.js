const sql = require('mssql');

// Configuración de la conexión
const config = {
    user: 'tu_usuario', // Reemplaza con tu usuario
    password: 'tu_contraseña', // Reemplaza con tu contraseña
    server: 'localhost', // O la IP de tu servidor
    database: 'ComputerPartsDB',
    options: {
        encrypt: false, // Deshabilitar en entornos locales
        trustServerCertificate: true, // Solo si usas localhost
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar con SQL Server:', err);
    });

module.exports = {
    sql,
    poolPromise,
};
