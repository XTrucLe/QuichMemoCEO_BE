
const { getEmployeeDataFromMySql, getEmployeeDataFromSqlServer,

} = require('../services/service')

const getCombinedEmployeeData = async (req, res) => {
    try {
        // Fetch data from MySQL
        const mysqlData = await getEmployeeDataFromMySql();
        const sqlServerData = await getEmployeeDataFromSqlServer();
        res.json({ mysqlData, sqlServerData });
    } catch (error) {
        console.error('Error fetching combined employee data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getCombinedEmployeeData };