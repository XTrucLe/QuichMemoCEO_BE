require('dotenv').config();
const sqlserver = require('mssql');
// Setup for SQL Server
const sqlServerConfig = {
    user: process.env.DB_sqlsever_USER,
    password: process.env.DB_sqlsever_PWD,
    server: process.env.DB_sqlsever_HOST, // Note: 'server' is the correct property, not 'host'
    port: parseInt(process.env.DB_sqlsever_PORT, 10),
    database: process.env.DB_sqlsever_NAME,
    options: {
        encrypt: process.env.DB_sqlsever_ENCRYPT === 'true', // Usually true for Azure
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};


const connect_sqlsever = new sqlserver.ConnectionPool(sqlServerConfig).connect().then(pool => {
    console.log('Connected to SQL Server successfully!');
    return pool;
}).catch(err => {
    console.error('Failed to connect to SQL Server:', err);
    process.exit(1);
});


module.exports = connect_sqlsever 
