const sql = require('mssql');

// Configuración para autenticación de SQL Server
const config = {
    server: 'localhost',
    port: 1433, // Cambia si usas un puerto diferente
    database: 'UserRegister',
    user: 'sa', // Usuario de SQL Server
    password: 'sa1234', // Contraseña del usuario
    options: {
        encrypt: false, // Cambiar a true si necesitas cifrar
        trustServerCertificate: true, // Solo en desarrollo
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
