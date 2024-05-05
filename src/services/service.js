const connection = require('../config/conn_mysql')
const poolPromise = require('../config/conn_sqlsever');
const sql = require('mssql');

// const getEmployeeDataFromMySql = async () => {
//     try {
//         const query = `
//         SELECT idEmployee,
//         FirstName,
//         LastName,
//         PaidToDate,
//         PaidLastYear,
//         Value
//         FROM employee FULL JOIN payrates  ON PayRates_idPayRates = idPayRates;`;

//         const results = await connection(query);
//         return results;
//     } catch (error) {
//         console.error('Error fetching data from MySQL:', error);
//         throw error;
//     }
// }
const getEmployeeDataFromMySql = async () => {
    let [results, fields] = await connection.query(`SELECT idEmployee,
    FirstName,
    LastName,
    PaidToDate,
    PaidLastYear,
    Value
    FROM employee FULL JOIN payrates  ON PayRates_idPayRates = idPayRates;`)
    return results
}
const getEmployeeDataFromSqlServer = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
    PERSONAL.PERSONAL_ID, 
    PERSONAL.CURRENT_GENDER,
    JOB_HISTORY.DEPARTMENT,
    CASE 
        WHEN JOB_HISTORY.TYPE_OF_WORK = 1 THEN 'full time'
        WHEN JOB_HISTORY.TYPE_OF_WORK = 0 THEN 'part time'
        ELSE 'other' -- Optionally handle unexpected values
    END AS TYPE_OF_WORK_DESCRIPTION,
    PERSONAL.ETHNICITY 
FROM 
    PERSONAL,
    EMPLOYMENT,
    JOB_HISTORY
WHERE PERSONAL.PERSONAL_ID= EMPLOYMENT.PERSONAL_ID AND 
EMPLOYMENT.EMPLOYMENT_ID=JOB_HISTORY.JOB_HISTORY_ID`);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}
module.exports = { getEmployeeDataFromMySql, getEmployeeDataFromSqlServer }