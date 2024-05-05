require('dotenv').config();
const mysql = require('mysql2/promise');


// Setup for MySQL
const connection_mysql = mysql.createPool({
    host: process.env.DB_mysql_host,
    port: process.env.DB_mysql_port,
    database: process.env.DB_mysql_name,
    user: process.env.DB_mysql_user,
    password: process.env.DB_mysql_password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



// Export both connections
module.exports = connection_mysql
