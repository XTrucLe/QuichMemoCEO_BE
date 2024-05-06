const poolPromise = require('../config/conn_sqlsever');
const sql = require('mssql');

const getallbenefit = async () => {
    const pool = await poolPromise;
    const request = pool.request();
    const query = 'SELECT * FROM [dbo].[BENEFIT_PLANS];';
    const result = await request.query(query);
    return result.recordset; // return only the recordset for further handling in the controller
};
const getallemployment = async () => {
    const pool = await poolPromise;
    const request = pool.request();
    const query = 'SELECT * FROM [dbo].[EMPLOYMENT];';
    const result = await request.query(query);
    return result.recordset; // return only the recordset for further handling in the controller
};
const getallemployment_working = async () => {
    const pool = await poolPromise;
    const request = pool.request();
    const query = 'SELECT * FROM [dbo].[EMPLOYMENT_WORKING_TIME];';
    const result = await request.query(query);
    return result.recordset;
};
const getalljob_history = async () => {
    const pool = await poolPromise;
    const request = pool.request();
    const query = 'SELECT * FROM [dbo].[JOB_HISTORY];';
    const result = await request.query(query);
    return result.recordset;
};
const getallpersonal = async () => {
    const pool = await poolPromise;
    const request = pool.request();
    const query = 'SELECT * FROM [dbo].[PERSONAL];';
    const result = await request.query(query);
    return result.recordset;
};

const getIdpersonal = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = 'SELECT * FROM [dbo].[PERSONAL] WHERE PERSONAL_ID = @personalid';
    const result = await request.query(query);
    return result.recordset;
};
const createEmployee = async (req, res) => {
    let { idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear } = req.body;

    await createEm(idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear)
    let results = await getallusers();
    return res.json({ employee_create: results });
    //=====>đưa ra chuỗi 

};
const createAllpersonal = async (idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip, curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[PERSONAL] (
                PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE,
                SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE, CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY,
                CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER, CURRENT_PERSONAL_EMAIL,
                CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID
            )
            VALUES (@idem, @fname, @lname, @mname, @birthday, @ssn, @drivers, @adr1, @adr2, @curcity,
                @curcountry, @curzip, @curgen, @curphone, @curmail, @curstt, @ethnicity, @sharestt, @benefitid)
        `;

        const result = await request
            .input('idem', idem)
            .input('fname', sql.NVarChar(255), fname)
            .input('lname', sql.NVarChar(255), lname)
            .input('mname', sql.NVarChar(255), mname)
            .input('birthday', sql.NVarChar(255), birthday)
            .input('ssn', sql.NVarChar(255), ssn)
            .input('drivers', sql.NVarChar(255), drivers)
            .input('adr1', sql.NVarChar(255), adr1)
            .input('adr2', sql.NVarChar(255), adr2)
            .input('curcity', sql.NVarChar(255), curcity)
            .input('curcountry', sql.NVarChar(255), curcountry)
            .input('curzip', sql.Int, curzip)
            .input('curgen', sql.NVarChar(255), curgen)
            .input('curphone', sql.NVarChar(255), curphone)
            .input('curmail', sql.NVarChar(255), curmail)
            .input('curstt', sql.NVarChar(255), curstt)
            .input('ethnicity', sql.NVarChar(255), ethnicity)
            .input('sharestt', sql.NVarChar(255), sharestt)
            .input('benefitid', sql.NVarChar(255), benefitid)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};




module.exports = { getallbenefit, getallemployment, getallemployment_working, getalljob_history, getallpersonal, getIdpersonal, createAllpersonal };
