const connection = require('../config/conn_mysql')
const poolPromise = require('../config/conn_sqlsever');
const sql = require('mssql');



const getEmployeeDataFromMySql = async () => {
    let [results, fields] = await connection.query(`SELECT e.*, p.*
    FROM mydb.employee e
    JOIN mydb.payrates p ON e.PayRates_idPayRates = p.idPayRates;`)
    return results
}

const getEmployeeDataFromSqlServer = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
    PERSONAL.PERSONAL_ID AS PERSONAL_ID_PERSONAL, 
    PERSONAL.CURRENT_FIRST_NAME AS CURRENT_FIRST_NAME_PERSONAL,
    PERSONAL.CURRENT_LAST_NAME AS CURRENT_LAST_NAME_PERSONAL,
    PERSONAL.CURRENT_MIDDLE_NAME AS CURRENT_MIDDLE_NAME_PERSONAL,
    PERSONAL.BIRTH_DATE AS BIRTH_DATE_PERSONAL,
    PERSONAL.SOCIAL_SECURITY_NUMBER AS SOCIAL_SECURITY_NUMBER_PERSONAL,
    PERSONAL.DRIVERS_LICENSE AS DRIVERS_LICENSE_PERSONAL,
    PERSONAL.CURRENT_ADDRESS_1 AS CURRENT_ADDRESS_1_PERSONAL,
    PERSONAL.CURRENT_ADDRESS_2 AS CURRENT_ADDRESS_2_PERSONAL,
    PERSONAL.CURRENT_CITY AS CURRENT_CITY_PERSONAL,
    PERSONAL.CURRENT_COUNTRY AS CURRENT_COUNTRY_PERSONAL,
    PERSONAL.CURRENT_ZIP AS CURRENT_ZIP_PERSONAL,
    PERSONAL.CURRENT_GENDER AS CURRENT_GENDER_PERSONAL,
    PERSONAL.CURRENT_PHONE_NUMBER AS CURRENT_PHONE_NUMBER_PERSONAL,
    PERSONAL.CURRENT_PERSONAL_EMAIL AS CURRENT_PERSONAL_EMAIL_PERSONAL,
    PERSONAL.CURRENT_MARITAL_STATUS AS CURRENT_MARITAL_STATUS_PERSONAL,
    PERSONAL.ETHNICITY AS ETHNICITY_PERSONAL,
    PERSONAL.SHAREHOLDER_STATUS AS SHAREHOLDER_STATUS_PERSONAL,
    PERSONAL.BENEFIT_PLAN_ID AS BENEFIT_PLAN_ID_PERSONAL,
    JOB_HISTORY.JOB_HISTORY_ID AS JOB_HISTORY_ID_JOB_HISTORY,
    JOB_HISTORY.DEPARTMENT AS DEPARTMENT_JOB_HISTORY,
    JOB_HISTORY.DIVISION AS DIVISION_JOB_HISTORY,
    JOB_HISTORY.FROM_DATE AS FROM_DATE_JOB_HISTORY,
    JOB_HISTORY.THRU_DATE AS THRU_DATE_JOB_HISTORY,
    JOB_HISTORY.JOB_TITLE AS JOB_TITLE_JOB_HISTORY,
    JOB_HISTORY.SUPERVISOR AS SUPERVISOR_JOB_HISTORY,
    JOB_HISTORY.LOCATION AS LOCATION_JOB_HISTORY,
    JOB_HISTORY.TYPE_OF_WORK AS TYPE_OF_WORK_JOB_HISTORY,
    EMPLOYMENT.EMPLOYMENT_ID AS EMPLOYMENT_ID_EMPLOYMENT,
    EMPLOYMENT.EMPLOYMENT_CODE AS EMPLOYMENT_CODE_EMPLOYMENT,
    EMPLOYMENT.EMPLOYMENT_STATUS AS EMPLOYMENT_STATUS_EMPLOYMENT,
    EMPLOYMENT.HIRE_DATE_FOR_WORKING AS HIRE_DATE_FOR_WORKING_EMPLOYMENT,
    EMPLOYMENT.WORKERS_COMP_CODE AS WORKERS_COMP_CODE_EMPLOYMENT,
    EMPLOYMENT.TERMINATION_DATE AS TERMINATION_DATE_EMPLOYMENT,
    EMPLOYMENT.REHIRE_DATE_FOR_WORKING AS REHIRE_DATE_FOR_WORKING_EMPLOYMENT,
    EMPLOYMENT.LAST_REVIEW_DATE AS LAST_REVIEW_DATE_EMPLOYMENT,
    EMPLOYMENT.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH AS NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH_EMPLOYMENT,
    EMPLOYMENT_WORKING_TIME.EMPLOYMENT_WORKING_TIME_ID AS EMPLOYMENT_WORKING_TIME_ID_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.YEAR_WORKING AS YEAR_WORKING_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.MONTH_WORKING AS MONTH_WORKING_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH AS NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH AS TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH_EMPLOYMENT_WORKING_TIME,
    BENEFIT_PLANS.BENEFIT_PLANS_ID AS BENEFIT_PLANS_ID_BENEFIT_PLANS,
    BENEFIT_PLANS.PLAN_NAME AS PLAN_NAME_BENEFIT_PLANS,
    BENEFIT_PLANS.DEDUCTABLE AS DEDUCTABLE_BENEFIT_PLANS,
    BENEFIT_PLANS.PERCENTAGE_COPAY AS PERCENTAGE_COPAY_BENEFIT_PLANS,
    CASE 
        WHEN JOB_HISTORY.TYPE_OF_WORK = 1 THEN 'full time'
        WHEN JOB_HISTORY.TYPE_OF_WORK = 0 THEN 'part time'
        ELSE 'other' -- Optionally handle unexpected values
    END AS TYPE_OF_WORK_DESCRIPTION
FROM 
    PERSONAL,
    EMPLOYMENT,
    JOB_HISTORY,
    EMPLOYMENT_WORKING_TIME,
    BENEFIT_PLANS
WHERE 
    PERSONAL.PERSONAL_ID = EMPLOYMENT.PERSONAL_ID 
    AND EMPLOYMENT.EMPLOYMENT_ID = JOB_HISTORY.JOB_HISTORY_ID 
    AND PERSONAL.BENEFIT_PLAN_ID = BENEFIT_PLANS.BENEFIT_PLANS_ID
    AND EMPLOYMENT.EMPLOYMENT_ID = EMPLOYMENT_WORKING_TIME.EMPLOYMENT_ID;

        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_shareholder = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT
	
    BP.PLAN_NAME AS Benefit_Plan_Name,
    CASE 
        WHEN P.SHAREHOLDER_STATUS = 1 THEN 'Share Holder'
        WHEN P.SHAREHOLDER_STATUS = 0 THEN 'Non Shareholde'
    END AS Shareholder_Status,
    (
        SELECT AVG(BP.DEDUCTABLE)
        FROM BENEFIT_PLANS AS BP
        WHERE BP.BENEFIT_PLANS_ID = BP.BENEFIT_PLANS_ID
    ) AS Average_Benefit_Paid
FROM
    PERSONAL P, 
    EMPLOYMENT E, 
    BENEFIT_PLANS BP
WHERE
    P.PERSONAL_ID = E.PERSONAL_ID
    AND P.BENEFIT_PLAN_ID = BP.BENEFIT_PLANS_ID
GROUP BY
    BP.PLAN_NAME,
    P.SHAREHOLDER_STATUS;
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_birthday = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT *
FROM PERSONAL
WHERE MONTH(BIRTH_DATE) = MONTH(GETDATE())
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_planefect = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
        P.PERSONAL_ID,
    P.CURRENT_FIRST_NAME,
    P.CURRENT_LAST_NAME,
    P.SOCIAL_SECURITY_NUMBER,
    P.CURRENT_ADDRESS_1,
    P.CURRENT_PHONE_NUMBER,
    P.CURRENT_PERSONAL_EMAIL,
    E.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
    ET.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH
FROM 
    PERSONAL P
JOIN 
    EMPLOYMENT E ON P.PERSONAL_ID = E.PERSONAL_ID
JOIN 
    EMPLOYMENT_WORKING_TIME ET ON E.EMPLOYMENT_ID = ET.EMPLOYMENT_ID
WHERE 
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH > 3;
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_employee_more_vacation = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
        P.PERSONAL_ID,
    P.CURRENT_FIRST_NAME,
    P.CURRENT_LAST_NAME,
    P.SOCIAL_SECURITY_NUMBER,
    P.CURRENT_ADDRESS_1,
    P.CURRENT_PHONE_NUMBER,
    P.CURRENT_PERSONAL_EMAIL,
    E.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
    ET.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH
FROM 
    PERSONAL P
JOIN 
    EMPLOYMENT E ON P.PERSONAL_ID = E.PERSONAL_ID
JOIN 
    EMPLOYMENT_WORKING_TIME ET ON E.EMPLOYMENT_ID = ET.EMPLOYMENT_ID
WHERE 
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH >= 6;
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_employee_in_hiringday = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
    p.CURRENT_FIRST_NAME + ' ' + p.CURRENT_LAST_NAME AS EmployeeName,
    j.DEPARTMENT AS Department,
    DATEADD(year, DATEDIFF(year, e.HIRE_DATE_FOR_WORKING, GETDATE()), e.HIRE_DATE_FOR_WORKING) AS AnniversaryDate
FROM 
    dbo.[EMPLOYMENT] e,
    dbo.[PERSONAL] p,
    dbo.[JOB_HISTORY] j
WHERE 
    e.PERSONAL_ID = p.PERSONAL_ID 
    AND e.EMPLOYMENT_ID = j.EMPLOYMENT_ID
    AND 
    (
        -- On their anniversary today
        (MONTH(e.HIRE_DATE_FOR_WORKING) = MONTH(GETDATE()) AND DAY(e.HIRE_DATE_FOR_WORKING) = DAY(GETDATE()))
        OR
        -- About to have their anniversary in the next 5 days
        (
            DATEDIFF(day, GETDATE(), DATEADD(year, DATEDIFF(year, e.HIRE_DATE_FOR_WORKING, GETDATE()), e.HIRE_DATE_FOR_WORKING)) >= 0
            AND DATEDIFF(day, GETDATE(), DATEADD(year, DATEDIFF(year, e.HIRE_DATE_FOR_WORKING, GETDATE()), e.HIRE_DATE_FOR_WORKING)) <= 5
        )
    )

        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

//create
const create_mydb_Em = async (idem, emnum, lname, mname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear) => {
    const updatedLastName = mname + ' ' + lname;
    let [results, fields] = await connection.query(
        'INSERT INTO `mydb`.`employee` (`idEmployee`, `EmployeeNumber`, `LastName`, `FirstName`, `SSN`, `PayRate`, `PayRates_idPayRates`, `VacationDays`, `PaidToDate`, `PaidLastYear`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idem, emnum, updatedLastName, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear],

    );
}

const createparate = async (idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC) => {
    let [results, fields] = await connection.query(
        'INSERT INTO `mydb`.`payrates`  (`idPayRates`, `PayRateName`, `Value`, `TaxPercentage`, `PayType`, `PayAmount`,`PT_LevelC` ) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC],

    );
}

const createPer = async (idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip, curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid) => {
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

const create_HRM_Em = async (employmentCode, employmentStatus, hireDateForWorking, workersCompCode, terminationDate, rehireDateForWorking, lastReviewDate, numberDaysRequirementOfWorkingPerMonth, personalId) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[EMPLOYMENT] (
                [EMPLOYMENT_CODE],
                [EMPLOYMENT_STATUS],
                [HIRE_DATE_FOR_WORKING],
                [WORKERS_COMP_CODE],
                [TERMINATION_DATE],
                [REHIRE_DATE_FOR_WORKING],
                [LAST_REVIEW_DATE],
                [NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH],
                [PERSONAL_ID]
            )
            VALUES (
                @employmentCode,
                @employmentStatus,
                @hireDateForWorking,
                @workersCompCode,
                @terminationDate,
                @rehireDateForWorking,
                @lastReviewDate,
                @numberDaysRequirementOfWorkingPerMonth,
                @personalId
            )
        `;

        const result = await request
            .input('employmentCode', employmentCode)
            .input('employmentStatus', employmentStatus)
            .input('hireDateForWorking', hireDateForWorking)
            .input('workersCompCode', workersCompCode)
            .input('terminationDate', terminationDate)
            .input('rehireDateForWorking', rehireDateForWorking)
            .input('lastReviewDate', lastReviewDate)
            .input('numberDaysRequirementOfWorkingPerMonth', numberDaysRequirementOfWorkingPerMonth)
            .input('personalId', personalId)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

const create_em_working_time = async (employmentId, yearWorking, monthWorking, numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[EMPLOYMENT_WORKING_TIME] (
                [EMPLOYMENT_ID],
                [YEAR_WORKING],
                [MONTH_WORKING],
                [NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH],
                [TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH]
            )
            VALUES (
                @employmentId,
                @yearWorking,
                @monthWorking,
                @numberDaysActualOfWorkingPerMonth,
                @totalNumberVacationWorkingDaysPerMonth
            )
        `;

        const result = await request
            .input('employmentId', employmentId)
            .input('yearWorking', yearWorking)
            .input('monthWorking', monthWorking)
            .input('numberDaysActualOfWorkingPerMonth', numberDaysActualOfWorkingPerMonth)
            .input('totalNumberVacationWorkingDaysPerMonth', totalNumberVacationWorkingDaysPerMonth)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employment working time:', error);
        throw error;
    }
};

const createJobHistory = async (employmentId, department, division, fromDate, thruDate, jobTitle, supervisor, location, typeOfWork) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[JOB_HISTORY] (
                [EMPLOYMENT_ID],
                [DEPARTMENT],
                [DIVISION],
                [FROM_DATE],
                [THRU_DATE],
                [JOB_TITLE],
                [SUPERVISOR],
                [LOCATION],
                [TYPE_OF_WORK]
            )
            VALUES (
                @employmentId,
                @department,
                @division,
                @fromDate,
                @thruDate,
                @jobTitle,
                @supervisor,
                @location,
                @typeOfWork
            )
        `;

        const result = await request
            .input('employmentId', employmentId)
            .input('department', department)
            .input('division', division)
            .input('fromDate', fromDate)
            .input('thruDate', thruDate)
            .input('jobTitle', jobTitle)
            .input('supervisor', supervisor)
            .input('location', location)
            .input('typeOfWork', typeOfWork)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating job history:', error);
        throw error;
    }
};

const createBenefitPlan = async (benefitid, planName, deductable, percentageCopay) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[BENEFIT_PLANS] (
                BENEFIT_PLANS_ID,
                [PLAN_NAME],
                [DEDUCTABLE],
                [PERCENTAGE_COPAY]
            )
            VALUES (
                @benefitid,
                @planName,
                @deductable,
                @percentageCopay
            )
        `;

        const result = await request
            .input('benefitid', benefitid)
            .input('planName', planName)
            .input('deductable', deductable)
            .input('percentageCopay', percentageCopay)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating benefit plan:', error);
        throw error;
    }
};


//getid
const getallpersonal = async () => {
    const pool = await poolPromise;
    const request = pool.request();
    const query = 'SELECT * FROM [dbo].[PERSONAL];';
    const result = await request.query(query);
    return result.recordset; // return only the recordset for further handling in the controller
};

const getIdpersonal = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = 'SELECT * FROM [dbo].[PERSONAL] WHERE PERSONAL_ID = @personalid';
    const result = await request.query(query);
    return result.recordset;
};
const getIdemployment = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = 'SELECT * FROM [dbo].[EMPLOYMENT] WHERE PERSONAL_ID = @personalid';
    const result = await request.query(query);
    return result.recordset;
};
const getIdemploymentworking = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = 'SELECT * FROM [dbo].[EMPLOYMENT_WORKING_TIME] WHERE EMPLOYMENT_ID = @personalid';
    const result = await request.query(query);
    return result.recordset;
};
const getIdjobhistory = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = 'SELECT * FROM [dbo].[JOB_HISTORY] WHERE EMPLOYMENT_ID = @personalid';
    const result = await request.query(query);
    return result.recordset;
};
//xem lại
const getIdbenefit = async (benefit) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('benefitid', sql.Int, benefit);
    const query = 'SELECT * FROM [dbo].[BENEFIT_PLANS] WHERE BENEFIT_PLANS_ID = @benefitid';
    const result = await request.query(query);
    return result.recordset;
};

const getallpayrate = async () => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`payrates`;')
    return results
}
const getIdpayrate = async (payrate) => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`payrates` WHERE `idPayRates` = ?;', [payrate])
    let employee = results && results.length > 0 ? results[0] : {};
    return employee
}
const getIdEmployee = async (employeeid) => {
    let [results, fields] = await connection.query('SELECT * FROM `mydb`.`employee` WHERE `idEmployee` = ?;', [employeeid])
    let employee = results && results.length > 0 ? results[0] : {};
    return employee
}

//Delete
const deletebyemployee = async (id) => {
    let [results, fields] = await connection.query(
        'DELETE FROM `mydb`.`employee`WHERE `idEmployee` = ?;',
        [id]
    )
}

const deletebyperson = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);

    // Construct the query with placeholders and execute it
    const query = `
        DELETE FROM EMPLOYMENT_WORKING_TIME WHERE EMPLOYMENT_ID IN (SELECT EMPLOYMENT_ID FROM EMPLOYMENT WHERE PERSONAL_ID = @personalid);
        DELETE FROM JOB_HISTORY WHERE EMPLOYMENT_ID IN (SELECT EMPLOYMENT_ID FROM EMPLOYMENT WHERE PERSONAL_ID = @personalid);
        DELETE FROM EMPLOYMENT WHERE PERSONAL_ID = @personalid;
        DELETE FROM PERSONAL WHERE PERSONAL_ID = @personalid;
    `;

    try {
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error('Error executing delete query:', err);
        throw err;
    }
};

const get_delete_benefit = async (benefitid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('benefitid', sql.Int, benefitid);
    const query = 'DELETE FROM [dbo].[BENEFIT_PLANS] WHERE BENEFIT_PLANS_ID = @benefitid';
    const result = await request.query(query);
    return result.recordset;
};


//update
const updateEm = async (idem, emnum, mname, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear) => {
    const updatedLastName = mname + ' ' + lname;

    let [results, fields] = await connection.query(
        'UPDATE `mydb`.`employee` SET `EmployeeNumber` = ?, `LastName` = ?, `FirstName` = ?, `SSN` = ?, `PayRate` = ?, `PayRates_idPayRates` = ?, `VacationDays` = ?, `PaidToDate` = ?, `PaidLastYear` = ? WHERE `idEmployee` = ?;',
        [emnum, updatedLastName, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear, idem]
    )
}

const update_payrate = async (idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC) => {

    let [results, fields] = await connection.query(
        'UPDATE `mydb`.`payrates` SET `PayRateName` = ?, `Value` = ?, `TaxPercentage` = ?, `PayType` = ?, `PayAmount` = ?, `PT_LevelC` = ? WHERE `idPayRates` = ?;',
        [PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC, idPayRates],
        'UPDATE `mydb`.`employee `SET `PayRate` = ? WHERE PayRates_idPayRates = ?;', [PayRateName, idPayRates]
    )

}

const updatePer = async (idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip, curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            UPDATE [dbo].[PERSONAL]
            SET
                CURRENT_FIRST_NAME = @fname,
                CURRENT_LAST_NAME = @lname,
                CURRENT_MIDDLE_NAME = @mname,
                BIRTH_DATE = @birthday,
                SOCIAL_SECURITY_NUMBER = @ssn,
                DRIVERS_LICENSE = @drivers,
                CURRENT_ADDRESS_1 = @adr1,
                CURRENT_ADDRESS_2 = @adr2,
                CURRENT_CITY = @curcity,
                CURRENT_COUNTRY = @curcountry,
                CURRENT_ZIP = @curzip,
                CURRENT_GENDER = @curgen,
                CURRENT_PHONE_NUMBER = @curphone,
                CURRENT_PERSONAL_EMAIL = @curmail,
                CURRENT_MARITAL_STATUS = @curstt,
                ETHNICITY = @ethnicity,
                SHAREHOLDER_STATUS = @sharestt,
                BENEFIT_PLAN_ID = @benefitid
            WHERE
                PERSONAL_ID = @idem
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
        console.error('Error updating employee:', error);
        throw error;
    }
};
//
const update_HRM_Em = async (employmentCode, employmentStatus, hireDateForWorking, workersCompCode, terminationDate, rehireDateForWorking, lastReviewDate, numberDaysRequirementOfWorkingPerMonth, personalId) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            UPDATE [dbo].[EMPLOYMENT] SET 
                [EMPLOYMENT_CODE] = @employmentCode,
                [EMPLOYMENT_STATUS] = @employmentStatus,
                [HIRE_DATE_FOR_WORKING] = @hireDateForWorking,
                [WORKERS_COMP_CODE] = @workersCompCode,
                [TERMINATION_DATE] = @terminationDate,
                [REHIRE_DATE_FOR_WORKING] = @rehireDateForWorking,
                [LAST_REVIEW_DATE] = @lastReviewDate,
                [NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH] = @numberDaysRequirementOfWorkingPerMonth
            WHERE
            PERSONAL_ID = @personalId
        `;

        const result = await request
            .input('employmentCode', employmentCode)
            .input('employmentStatus', employmentStatus)
            .input('hireDateForWorking', hireDateForWorking)
            .input('workersCompCode', workersCompCode)
            .input('terminationDate', terminationDate)
            .input('rehireDateForWorking', rehireDateForWorking)
            .input('lastReviewDate', lastReviewDate)
            .input('numberDaysRequirementOfWorkingPerMonth', numberDaysRequirementOfWorkingPerMonth)
            .input('personalId', personalId)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error updating employment:', error);
        throw error;
    }
};

const update_em_working_time = async (employmentId, yearWorking, monthWorking, numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            UPDATE [dbo].[EMPLOYMENT_WORKING_TIME] SET 
                [YEAR_WORKING] = @yearWorking,
                [MONTH_WORKING] = @monthWorking,
                [NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH] = @numberDaysActualOfWorkingPerMonth,
                [TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH] = @totalNumberVacationWorkingDaysPerMonth
            WHERE
            EMPLOYMENT_ID = @employmentId
        `;

        const result = await request
            .input('employmentId', employmentId)
            .input('yearWorking', yearWorking)
            .input('monthWorking', monthWorking)
            .input('numberDaysActualOfWorkingPerMonth', numberDaysActualOfWorkingPerMonth)
            .input('totalNumberVacationWorkingDaysPerMonth', totalNumberVacationWorkingDaysPerMonth)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error updating employment working time:', error);
        throw error;
    }
};

const update_JobHistory = async (employmentId, department, division, fromDate, thruDate, jobTitle, supervisor, location, typeOfWork) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            UPDATE [dbo].[JOB_HISTORY] SET 
                [DEPARTMENT] = @department,
                [DIVISION] = @division,
                [FROM_DATE] = @fromDate,
                [THRU_DATE] = @thruDate,
                [JOB_TITLE] = @jobTitle,
                [SUPERVISOR] = @supervisor,
                [LOCATION] = @location,
                [TYPE_OF_WORK] = @typeOfWork
            WHERE
            EMPLOYMENT_ID = @employmentId
        `;

        const result = await request
            .input('employmentId', employmentId)
            .input('department', department)
            .input('division', division)
            .input('fromDate', fromDate)
            .input('thruDate', thruDate)
            .input('jobTitle', jobTitle)
            .input('supervisor', supervisor)
            .input('location', location)
            .input('typeOfWork', typeOfWork)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error updating job history:', error);
        throw error;
    }
};

const update_BenefitPlan = async (benefitid, planName, deductable, percentageCopay) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            UPDATE [HRM].[dbo].[BENEFIT_PLANS] SET 
                [PLAN_NAME]= @planName,
                [DEDUCTABLE]=@deductable,
                [PERCENTAGE_COPAY]=@percentageCopay
            WHERE
            BENEFIT_PLANS_ID = @benefitid
            
        `;

        const result = await request
            .input('benefitid', benefitid)
            .input('planName', planName)
            .input('deductable', deductable)
            .input('percentageCopay', percentageCopay)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating benefit plan:', error);
        throw error;
    }
};




//dashboard
const get_dash_board_department = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = `SELECT JH.DEPARTMENT, COUNT(P.PERSONAL_ID) AS PERSON_COUNT
    FROM JOB_HISTORY JH
    INNER JOIN EMPLOYMENT E ON JH.EMPLOYMENT_ID = E.EMPLOYMENT_ID
    INNER JOIN PERSONAL P ON E.PERSONAL_ID = P.PERSONAL_ID
    GROUP BY JH.DEPARTMENT;`;
    const result = await request.query(query);
    return result.recordset;
};

const get_dash_board_department_vacation = async (personalid) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('personalid', sql.Int, personalid);
    const query = `SELECT J.DEPARTMENT, SUM(EW.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH) AS TotalVacationDays
    FROM JOB_HISTORY J
    JOIN EMPLOYMENT E ON J.EMPLOYMENT_ID = E.EMPLOYMENT_ID
    JOIN EMPLOYMENT_WORKING_TIME EW ON E.EMPLOYMENT_ID = EW.EMPLOYMENT_ID
    GROUP BY J.DEPARTMENT;`;
    const result = await request.query(query);
    return result.recordset;
};


module.exports = {
    getEmployeeDataFromMySql,
    getall_birthday, getall_planefect,
    getEmployeeDataFromSqlServer, getall_shareholder,
    getall_employee_more_vacation, getall_employee_in_hiringday,
    //create
    create_mydb_Em, createPer, getallpersonal,
    create_HRM_Em, createparate,
    create_em_working_time, createJobHistory, createBenefitPlan,
    //getID
    getIdEmployee, getIdpersonal, getallpayrate, getIdpayrate,
    getIdemployment, getIdemploymentworking, getIdjobhistory, getIdbenefit,
    // delete
    get_delete_benefit,
    deletebyemployee,
    deletebyperson,
    //DASHBOARD
    get_dash_board_department,
    get_dash_board_department_vacation,
    //update
    updateEm, updatePer, update_HRM_Em,
    update_em_working_time, update_JobHistory,
    update_BenefitPlan, update_payrate,




}