const connection = require('../config/conn_mysql')
const getallusers = async () => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`employee`;')
    return results
}
const getallpayrate = async () => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`payrates`;')
    return results
}
// const getupdate = async (employeeid) truyền vào id 
const getIdEmployee = async (employeeid) => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`employee` WHERE `idEmployee` = ?;', [employeeid])
    let employee = results && results.length > 0 ? results[0] : {};
    return employee
}

const createEm = async (idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear) => {
    let [results, fields] = await connection.query(
        'INSERT INTO `mydb`.`employee` (`idEmployee`, `EmployeeNumber`, `LastName`, `FirstName`, `SSN`, `PayRate`, `PayRates_idPayRates`, `VacationDays`, `PaidToDate`, `PaidLastYear`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear],

    );
}

const updateEm = async (idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear) => {

    let [results, fields] = await connection.query(
        'UPDATE `mydb`.`employee` SET `EmployeeNumber` = ?,`LastName` = ?,`FirstName` = ?,`SSN` = ?,`PayRate` = ?,`PayRates_idPayRates` = ?,`VacationDays` = ?,`PaidToDate` = ?,`PaidLastYear` = ? WHERE `idEmployee` = ?;',
        [emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear, idem]
    )
}

const deleteEm = async (id) => {
    let [results, fields] = await connection.query(
        'DELETE FROM `mydb`.`employee`WHERE `idEmployee` = ?;',
        [id]
    )
}

//---------------------------------------------


const getall_payrate = async () => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`payrates`;')
    return results
}
module.exports = {
    getallusers, getIdEmployee, createEm, updateEm, deleteEm,
    //------------------------------
    getallpayrate,
}