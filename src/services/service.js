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
            PERSONAL.PERSONAL_ID,
            PERSONAL.CURRENT_FIRST_NAME,
            PERSONAL.CURRENT_LAST_NAME,
            PERSONAL.CURRENT_MIDDLE_NAME,
            PERSONAL.BIRTH_DATE,
            PERSONAL.SOCIAL_SECURITY_NUMBER,
            PERSONAL.DRIVERS_LICENSE,
            PERSONAL.CURRENT_ADDRESS_1,
            PERSONAL.CURRENT_ADDRESS_2,
            PERSONAL.CURRENT_CITY,
            PERSONAL.CURRENT_COUNTRY,
            PERSONAL.CURRENT_ZIP,
            PERSONAL.CURRENT_GENDER,
            PERSONAL.CURRENT_PHONE_NUMBER,
            PERSONAL.CURRENT_PERSONAL_EMAIL,
            PERSONAL.CURRENT_MARITAL_STATUS,
            PERSONAL.ETHNICITY,
            PERSONAL.SHAREHOLDER_STATUS,
            PERSONAL.BENEFIT_PLAN_ID,
            JOB_HISTORY.JOB_HISTORY_ID,
            JOB_HISTORY.DEPARTMENT,
            JOB_HISTORY.DIVISION,
            JOB_HISTORY.FROM_DATE,
            JOB_HISTORY.THRU_DATE,
            JOB_HISTORY.JOB_TITLE,
            JOB_HISTORY.SUPERVISOR,
            JOB_HISTORY.LOCATION,
            JOB_HISTORY.TYPE_OF_WORK,
            EMPLOYMENT.EMPLOYMENT_ID,
            EMPLOYMENT.EMPLOYMENT_CODE,
            EMPLOYMENT.EMPLOYMENT_STATUS,
            EMPLOYMENT.HIRE_DATE_FOR_WORKING,
            EMPLOYMENT.WORKERS_COMP_CODE,
            EMPLOYMENT.TERMINATION_DATE,
            EMPLOYMENT.REHIRE_DATE_FOR_WORKING,
            EMPLOYMENT.LAST_REVIEW_DATE,
            EMPLOYMENT.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
            EMPLOYMENT_WORKING_TIME.EMPLOYMENT_WORKING_TIME_ID,
            EMPLOYMENT_WORKING_TIME.YEAR_WORKING,
            EMPLOYMENT_WORKING_TIME.MONTH_WORKING,
            EMPLOYMENT_WORKING_TIME.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
            EMPLOYMENT_WORKING_TIME.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH,
            BENEFIT_PLANS.BENEFIT_PLANS_ID,
            BENEFIT_PLANS.PLAN_NAME,
            BENEFIT_PLANS.DEDUCTABLE,
            BENEFIT_PLANS.PERCENTAGE_COPAY,
        
            CASE 
                WHEN JOB_HISTORY.TYPE_OF_WORK = 1 THEN 'full time'
                WHEN JOB_HISTORY.TYPE_OF_WORK = 0 THEN 'part time'
                ELSE 'other' 
            END AS TYPE_OF_WORKS
       FROM 
            PERSONAL
            JOIN EMPLOYMENT ON PERSONAL.PERSONAL_ID = EMPLOYMENT.PERSONAL_ID
            LEFT JOIN EMPLOYMENT_WORKING_TIME ON EMPLOYMENT.EMPLOYMENT_ID = EMPLOYMENT_WORKING_TIME.EMPLOYMENT_ID
            LEFT JOIN JOB_HISTORY ON EMPLOYMENT.EMPLOYMENT_ID = JOB_HISTORY.JOB_HISTORY_ID
            JOIN BENEFIT_PLANS ON PERSONAL.BENEFIT_PLAN_ID = BENEFIT_PLANS.BENEFIT_PLANS_ID;

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
                WHEN P.SHAREHOLDER_STATUS = 0 THEN 'Non Shareholder'
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
            p.CURRENT_FIRST_NAME + ' ' + p.CURRENT_LAST_NAME AS FullName,
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
const create_mydb_Em = async (CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, SOCIAL_SECURITY_NUMBER, EMPLOYMENT_ID) => {
    const updatedLastName = `${CURRENT_LAST_NAME} ${CURRENT_MIDDLE_NAME}`;

    const EmployeeNumber = Math.floor(Math.random() * 11000)

    let [results, fields] = await connection.query(
        'INSERT INTO `mydb`.`employee` (`idEmployee`,`EmployeeNumber`, `LastName`, `FirstName`, `SSN`, `PayRates_idPayRates`) VALUES (?, ?, ?, ?, ?,?)',
        [EMPLOYMENT_ID, EmployeeNumber , updatedLastName, CURRENT_FIRST_NAME, SOCIAL_SECURITY_NUMBER, 1]
    );
}

const createparate = async (idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC) => {
    let [results, fields] = await connection.query(
        'INSERT INTO `mydb`.`payrates`  (`idPayRates`, `PayRateName`, `Value`, `TaxPercentage`, `PayType`, `PayAmount`,`PT_LevelC` ) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC],
    );
}

const createPer2 = async (PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME,
                          SOCIAL_SECURITY_NUMBER) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[PERSONAL] (
                PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, 
                SOCIAL_SECURITY_NUMBER, 
            )
            VALUES (@PERSONAL_ID, @CURRENT_FIRST_NAME, @CURRENT_LAST_NAME, @CURRENT_MIDDLE_NAME,
                @SOCIAL_SECURITY_NUMBER)
        `;

        const result = await request
            .input('PERSONAL_ID', PERSONAL_ID)
            .input('CURRENT_FIRST_NAME', sql.NVarChar(255), CURRENT_FIRST_NAME)
            .input('CURRENT_LAST_NAME', sql.NVarChar(255), CURRENT_LAST_NAME)
            .input('CURRENT_MIDDLE_NAME', sql.NVarChar(255), CURRENT_MIDDLE_NAME)
            .input('SOCIAL_SECURITY_NUMBER', sql.NVarChar(255), SOCIAL_SECURITY_NUMBER)

            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

const createPer = async (PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE,
                         SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE, CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY,
                         CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER, CURRENT_PERSONAL_EMAIL,
                         CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID) => {
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
            VALUES (@PERSONAL_ID, @CURRENT_FIRST_NAME, @CURRENT_LAST_NAME, @CURRENT_MIDDLE_NAME, @BIRTH_DATE,
                @SOCIAL_SECURITY_NUMBER, @DRIVERS_LICENSE, @CURRENT_ADDRESS_1, @CURRENT_ADDRESS_2, @CURRENT_CITY,
                @CURRENT_COUNTRY, @CURRENT_ZIP, @CURRENT_GENDER, @CURRENT_PHONE_NUMBER, @CURRENT_PERSONAL_EMAIL,
                @CURRENT_MARITAL_STATUS, @ETHNICITY, @SHAREHOLDER_STATUS, @BENEFIT_PLAN_ID)
        `;

        const result = await request
            .input('PERSONAL_ID', PERSONAL_ID)
            .input('CURRENT_FIRST_NAME', sql.NVarChar(255), CURRENT_FIRST_NAME)
            .input('CURRENT_LAST_NAME', sql.NVarChar(255), CURRENT_LAST_NAME)
            .input('CURRENT_MIDDLE_NAME', sql.NVarChar(255), CURRENT_MIDDLE_NAME)
            .input('BIRTH_DATE', sql.NVarChar(255), BIRTH_DATE)
            .input('SOCIAL_SECURITY_NUMBER', sql.NVarChar(255), SOCIAL_SECURITY_NUMBER)
            .input('DRIVERS_LICENSE', sql.NVarChar(255), DRIVERS_LICENSE)
            .input('CURRENT_ADDRESS_1', sql.NVarChar(255), CURRENT_ADDRESS_1)
            .input('CURRENT_ADDRESS_2', sql.NVarChar(255), CURRENT_ADDRESS_2)
            .input('CURRENT_CITY', sql.NVarChar(255), CURRENT_CITY)
            .input('CURRENT_COUNTRY', sql.NVarChar(255), CURRENT_COUNTRY)
            .input('CURRENT_ZIP', sql.Int, CURRENT_ZIP)
            .input('CURRENT_GENDER', sql.NVarChar(255), CURRENT_GENDER)
            .input('CURRENT_PHONE_NUMBER', sql.NVarChar(255), CURRENT_PHONE_NUMBER)
            .input('CURRENT_PERSONAL_EMAIL', sql.NVarChar(255), CURRENT_PERSONAL_EMAIL)
            .input('CURRENT_MARITAL_STATUS', sql.NVarChar(255), CURRENT_MARITAL_STATUS)
            .input('ETHNICITY', sql.NVarChar(255), ETHNICITY)
            .input('SHAREHOLDER_STATUS', sql.Int, SHAREHOLDER_STATUS)
            .input('BENEFIT_PLAN_ID', sql.Int, BENEFIT_PLAN_ID)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

const create_HRM_Em = async (EMPLOYMENT_ID, EMPLOYMENT_CODE, EMPLOYMENT_STATUS, HIRE_DATE_FOR_WORKING, WORKERS_COMP_CODE,
                             TERMINATION_DATE, REHIRE_DATE_FOR_WORKING, LAST_REVIEW_DATE, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH, PERSONAL_ID) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[EMPLOYMENT] (
                [EMPLOYMENT_ID],
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
                @EMPLOYMENT_ID,
                @EMPLOYMENT_CODE,
                @EMPLOYMENT_STATUS,
                @HIRE_DATE_FOR_WORKING,
                @WORKERS_COMP_CODE,
                @TERMINATION_DATE,
                @REHIRE_DATE_FOR_WORKING,
                @LAST_REVIEW_DATE,
                @NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
                @PERSONAL_ID
            )
        `;

        const result = await request
            .input('EMPLOYMENT_CODE', sql.NVarChar(255), EMPLOYMENT_CODE)
            .input('EMPLOYMENT_STATUS', sql.NVarChar(255), EMPLOYMENT_STATUS)
            .input('HIRE_DATE_FOR_WORKING', sql.NVarChar(255), HIRE_DATE_FOR_WORKING)
            .input('WORKERS_COMP_CODE', sql.NVarChar(255), WORKERS_COMP_CODE)
            .input('TERMINATION_DATE', sql.Date, TERMINATION_DATE)
            .input('REHIRE_DATE_FOR_WORKING', sql.Date, REHIRE_DATE_FOR_WORKING)
            .input('LAST_REVIEW_DATE', sql.Date, LAST_REVIEW_DATE)
            .input('NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH', sql.Int, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH)
            .input('PERSONAL_ID', sql.Int, PERSONAL_ID)
            .input('EMPLOYMENT_ID', sql.Int, EMPLOYMENT_ID)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

const create_em_working_time = async (EMPLOYMENT_ID, EMPLOYMENT_WORKING_TIME_ID, YEAR_WORKING, MONTH_WORKING, NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH, TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[EMPLOYMENT_WORKING_TIME] (
                [EMPLOYMENT_ID],
                [EMPLOYMENT_WORKING_TIME_ID],
                [YEAR_WORKING],
                [MONTH_WORKING],
                [NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH],
                [TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH]
            )
            VALUES (
                @EMPLOYMENT_ID,
                @EMPLOYMENT_WORKING_TIME_ID, 
                @YEAR_WORKING, 
                @MONTH_WORKING, 
                @NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH, 
                @TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH
            )
        `;

        const result = await request
            .input('EMPLOYMENT_ID', sql.Int, EMPLOYMENT_ID)
            .input('YEAR_WORKING', sql.NVarChar(255), YEAR_WORKING)
            .input('MONTH_WORKING', sql.Int, MONTH_WORKING)
            .input('NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH', sql.Int, NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH)
            .input('TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH', sql.Int, TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH)
            .input('EMPLOYMENT_WORKING_TIME_ID', sql.Int, EMPLOYMENT_WORKING_TIME_ID)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employment working time:', error);
        throw error;
    }
};

const createJobHistory = async (EMPLOYMENT_ID, DEPARTMENT, DIVISION, FROM_DATE, THRU_DATE,
                                JOB_TITLE, SUPERVISOR, LOCATION, TYPE_OF_WORK) => {
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
                @EMPLOYMENT_ID,
                @DEPARTMENT,
                @DIVISION,
                @FROM_DATE,
                @THRU_DATE,
                @JOB_TITLE,
                @SUPERVISOR,
                @LOCATION,
                @TYPE_OF_WORK
            )
        `;

        const result = await request
            .input('EMPLOYMENT_ID', EMPLOYMENT_ID)
            .input('DEPARTMENT', DEPARTMENT)
            .input('DIVISION', DIVISION)
            .input('FROM_DATE', FROM_DATE)
            .input('THRU_DATE', THRU_DATE)
            .input('JOB_TITLE', JOB_TITLE)
            .input('SUPERVISOR', SUPERVISOR)
            .input('LOCATION', LOCATION)
            .input('TYPE_OF_WORK', TYPE_OF_WORK)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating job history:', error);
        throw error;
    }
};

const createBenefitPlan = async (BENEFIT_PLANS_ID, PLAN_NAME, DEDUCTABLE, PERCENTAGE_COPAY) => {
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
                @BENEFIT_PLANS_ID,
                @PLAN_NAME,
                @DEDUCTABLE,
                @PERCENTAGE_COPAY
            )
        `;

        const result = await request
            .input('BENEFIT_PLANS_ID', BENEFIT_PLANS_ID)
            .input('PLAN_NAME', PLAN_NAME)
            .input('DEDUCTABLE', DEDUCTABLE)
            .input('PERCENTAGE_COPAY', PERCENTAGE_COPAY)
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
    const query = `
    SELECT 
        -- Fields from PERSONAL
        p.PERSONAL_ID, 
        p.CURRENT_FIRST_NAME,
        p.CURRENT_LAST_NAME,
        p.CURRENT_MIDDLE_NAME,
        p.BIRTH_DATE,
        p.SOCIAL_SECURITY_NUMBER,
        p.DRIVERS_LICENSE,
        p.CURRENT_ADDRESS_1,
        p.CURRENT_ADDRESS_2,
        p.CURRENT_CITY,
        p.CURRENT_COUNTRY,
        p.CURRENT_ZIP,
        p.CURRENT_GENDER,
        p.CURRENT_PHONE_NUMBER,
        p.CURRENT_PERSONAL_EMAIL,
        p.CURRENT_MARITAL_STATUS,
        p.ETHNICITY,
        p.SHAREHOLDER_STATUS,
        p.BENEFIT_PLAN_ID,
        
        -- Fields from EMPLOYMENT
        e.EMPLOYMENT_ID,
        e.EMPLOYMENT_CODE,
        e.EMPLOYMENT_STATUS,
        e.HIRE_DATE_FOR_WORKING,
        e.WORKERS_COMP_CODE,
        e.TERMINATION_DATE,
        e.REHIRE_DATE_FOR_WORKING,
        e.LAST_REVIEW_DATE,
        e.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
        
        -- Fields from JOB_HISTORY
        jh.JOB_HISTORY_ID,
        jh.EMPLOYMENT_ID AS JH_EMPLOYMENT_ID,
        jh.DEPARTMENT,
        jh.DIVISION,
        jh.FROM_DATE,
        jh.THRU_DATE,
        jh.JOB_TITLE,
        jh.SUPERVISOR,
        jh.LOCATION,
        jh.TYPE_OF_WORK,
        
        -- Fields from EMPLOYMENT_WORKING_TIME
        ewt.EMPLOYMENT_WORKING_TIME_ID,
        ewt.EMPLOYMENT_ID AS EWT_EMPLOYMENT_ID,
        ewt.YEAR_WORKING,
        ewt.MONTH_WORKING,
        ewt.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
        ewt.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH,
        
        -- Fields from BENEFIT_PLANS
        bp.BENEFIT_PLANS_ID,
        bp.PLAN_NAME,
        bp.DEDUCTABLE,
        bp.PERCENTAGE_COPAY
    FROM 
        PERSONAL p
    LEFT JOIN 
        EMPLOYMENT e ON p.PERSONAL_ID = e.PERSONAL_ID
    LEFT JOIN 
        JOB_HISTORY jh ON e.EMPLOYMENT_ID = jh.EMPLOYMENT_ID
    LEFT JOIN 
        EMPLOYMENT_WORKING_TIME ewt ON e.EMPLOYMENT_ID = ewt.EMPLOYMENT_ID
    LEFT JOIN 
        BENEFIT_PLANS bp ON p.BENEFIT_PLAN_ID = bp.BENEFIT_PLANS_ID
    WHERE 
        p.PERSONAL_ID = @personalid
    ORDER BY 
        p.PERSONAL_ID;
    
    
    `;
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

const deletebyperson = async (employmentId) => {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('employmentId', sql.Int, employmentId);

    // Construct the query with placeholders and execute it
    const query = `
        DECLARE @personalId INT;
        SELECT @personalId = PERSONAL_ID FROM EMPLOYMENT WHERE EMPLOYMENT_ID = @employmentId;

        DELETE FROM EMPLOYMENT_WORKING_TIME WHERE EMPLOYMENT_ID = @employmentId;
        DELETE FROM JOB_HISTORY WHERE EMPLOYMENT_ID = @employmentId;
        DELETE FROM EMPLOYMENT WHERE EMPLOYMENT_ID = @employmentId;
        DELETE FROM PERSONAL WHERE PERSONAL_ID = @personalId;
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
const updateEm = async (PERSONAL_ID, EMPLOYMENT_ID, CURRENT_MIDDLE_NAME, CURRENT_LAST_NAME, CURRENT_FIRST_NAME, SOCIAL_SECURITY_NUMBER,) => {
    const updatedLastName = CURRENT_MIDDLE_NAME + ' ' + CURRENT_LAST_NAME;

    let [results, fields] = await connection.query(
        'UPDATE `mydb`.`employee` SET `EmployeeNumber`=?, `LastName` = ?, `FirstName` = ?, `SSN` = ? WHERE `idEmployee` = ?;',
        [EMPLOYMENT_ID, updatedLastName, CURRENT_FIRST_NAME, SOCIAL_SECURITY_NUMBER, PERSONAL_ID]
    )
}

const update_payrate = async (idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC) => {

    let [results, fields] = await connection.query(
        'UPDATE `mydb`.`payrates` SET `PayRateName` = ?, `Value` = ?, `TaxPercentage` = ?, `PayType` = ?, `PayAmount` = ?, `PT_LevelC` = ? WHERE `idPayRates` = ?;',
        [PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC, idPayRates],
        'UPDATE `mydb`.`employee `SET `PayRate` = ? WHERE PayRates_idPayRates = ?;', [PayRateName, idPayRates]
    )

}

const updatePer = async (PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE, SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE,
                         CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY, CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER,
                         CURRENT_PERSONAL_EMAIL, CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
        UPDATE [dbo].[PERSONAL]
        SET 
            [CURRENT_FIRST_NAME] = @CURRENT_FIRST_NAME,
            [CURRENT_LAST_NAME] = @CURRENT_LAST_NAME,
            [CURRENT_MIDDLE_NAME] = @CURRENT_MIDDLE_NAME,
            [BIRTH_DATE] = @BIRTH_DATE,
            [SOCIAL_SECURITY_NUMBER] = @SOCIAL_SECURITY_NUMBER,
            [DRIVERS_LICENSE] = @DRIVERS_LICENSE,
            [CURRENT_ADDRESS_1] = @CURRENT_ADDRESS_1,
            [CURRENT_ADDRESS_2] = @CURRENT_ADDRESS_2,
            [CURRENT_CITY] = @CURRENT_CITY,
            [CURRENT_COUNTRY] = @CURRENT_COUNTRY,
            [CURRENT_ZIP] = @CURRENT_ZIP,
            [CURRENT_GENDER] = @CURRENT_GENDER,
            [CURRENT_PHONE_NUMBER] = @CURRENT_PHONE_NUMBER,
            [CURRENT_PERSONAL_EMAIL] = @CURRENT_PERSONAL_EMAIL,
            [CURRENT_MARITAL_STATUS] = @CURRENT_MARITAL_STATUS,
            [ETHNICITY] = @ETHNICITY,
            [SHAREHOLDER_STATUS] = @SHAREHOLDER_STATUS,
            [BENEFIT_PLAN_ID] = @BENEFIT_PLAN_ID
        WHERE 
            [PERSONAL_ID] = @PERSONAL_ID;
        `;

        const result = await request
            .input('PERSONAL_ID', PERSONAL_ID)
            .input('CURRENT_FIRST_NAME', sql.NVarChar(255), CURRENT_FIRST_NAME)
            .input('CURRENT_LAST_NAME', sql.NVarChar(255), CURRENT_LAST_NAME)
            .input('CURRENT_MIDDLE_NAME', sql.NVarChar(255), CURRENT_MIDDLE_NAME)
            .input('BIRTH_DATE', sql.NVarChar(255), BIRTH_DATE)
            .input('SOCIAL_SECURITY_NUMBER', sql.NVarChar(255), SOCIAL_SECURITY_NUMBER)
            .input('DRIVERS_LICENSE', sql.NVarChar(255), DRIVERS_LICENSE)
            .input('CURRENT_ADDRESS_1', sql.NVarChar(255), CURRENT_ADDRESS_1)
            .input('CURRENT_ADDRESS_2', sql.NVarChar(255), CURRENT_ADDRESS_2)
            .input('CURRENT_CITY', sql.NVarChar(255), CURRENT_CITY)
            .input('CURRENT_COUNTRY', sql.NVarChar(255), CURRENT_COUNTRY)
            .input('CURRENT_ZIP', sql.Int, CURRENT_ZIP)
            .input('CURRENT_GENDER', sql.NVarChar(255), CURRENT_GENDER)
            .input('CURRENT_PHONE_NUMBER', sql.NVarChar(255), CURRENT_PHONE_NUMBER)
            .input('CURRENT_PERSONAL_EMAIL', sql.NVarChar(255), CURRENT_PERSONAL_EMAIL)
            .input('CURRENT_MARITAL_STATUS', sql.NVarChar(255), CURRENT_MARITAL_STATUS)
            .input('ETHNICITY', sql.NVarChar(255), ETHNICITY)
            .input('SHAREHOLDER_STATUS', sql.Int, SHAREHOLDER_STATUS)
            .input('BENEFIT_PLAN_ID', sql.Int, BENEFIT_PLAN_ID)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};
//
const update_HRM_Em = async (EMPLOYMENT_CODE, EMPLOYMENT_STATUS, HIRE_DATE_FOR_WORKING, WORKERS_COMP_CODE, TERMINATION_DATE, REHIRE_DATE_FOR_WORKING,
                             LAST_REVIEW_DATE, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH, EMPLOYMENT_ID, PERSONAL_ID) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
        UPDATE [dbo].[EMPLOYMENT]
        SET 
            [EMPLOYMENT_CODE] = @EMPLOYMENT_CODE,
            [EMPLOYMENT_STATUS] = @EMPLOYMENT_STATUS,
            [HIRE_DATE_FOR_WORKING] = @HIRE_DATE_FOR_WORKING,
            [WORKERS_COMP_CODE] = @WORKERS_COMP_CODE,
            [TERMINATION_DATE] = @TERMINATION_DATE,
            [REHIRE_DATE_FOR_WORKING] = @REHIRE_DATE_FOR_WORKING,
            [LAST_REVIEW_DATE] = @LAST_REVIEW_DATE,
            [NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH] = @NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH
        WHERE 
            [EMPLOYMENT_ID] = @PERSONAL_ID;
        
        `;

        const result = await request
            .input('EMPLOYMENT_CODE', sql.NVarChar(255), EMPLOYMENT_CODE)
            .input('EMPLOYMENT_STATUS', sql.NVarChar(255), EMPLOYMENT_STATUS)
            .input('HIRE_DATE_FOR_WORKING', sql.NVarChar(255), HIRE_DATE_FOR_WORKING)
            .input('WORKERS_COMP_CODE', sql.NVarChar(255), WORKERS_COMP_CODE)
            .input('TERMINATION_DATE', sql.NVarChar(255), TERMINATION_DATE)
            .input('REHIRE_DATE_FOR_WORKING', sql.NVarChar(255), REHIRE_DATE_FOR_WORKING)
            .input('LAST_REVIEW_DATE', sql.NVarChar(255), LAST_REVIEW_DATE)
            .input('NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH', sql.Int, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH)
            .input('PERSONAL_ID', PERSONAL_ID)
            .input('EMPLOYMENT_ID', sql.Int, EMPLOYMENT_ID)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error updating employment:', error);
        throw error;
    }
};

const update_em_working_time = async (EMPLOYMENT_WORKING_TIME_ID, YEAR_WORKING, MONTH_WORKING, NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH, TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH,) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
        UPDATE [dbo].[EMPLOYMENT_WORKING_TIME]
        SET 
            [YEAR_WORKING] = @YEAR_WORKING,
            [MONTH_WORKING] = @MONTH_WORKING,
            [NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH] = @NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
            [TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH] = @TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH
        WHERE 
            [EMPLOYMENT_WORKING_TIME_ID] = @EMPLOYMENT_WORKING_TIME_ID;
        
        `;

        const result = await request
            .input('YEAR_WORKING', sql.NVarChar(255), YEAR_WORKING)
            .input('MONTH_WORKING', sql.Int, MONTH_WORKING)
            .input('NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH', sql.Int, NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH)
            .input('TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH', sql.Int, TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH)
            .input('EMPLOYMENT_WORKING_TIME_ID', sql.Int, EMPLOYMENT_WORKING_TIME_ID)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error updating employment working time:', error);
        throw error;
    }
};

const update_JobHistory = async (JOB_HISTORY_ID, EMPLOYMENT_ID, DEPARTMENT, DIVISION, FROM_DATE, THRU_DATE, JOB_TITLE, SUPERVISOR, LOCATION, TYPE_OF_WORK) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
        UPDATE [dbo].[JOB_HISTORY]
        SET 
            [DEPARTMENT] = @DEPARTMENT,
            [DIVISION] = @DIVISION,
            [FROM_DATE] = @FROM_DATE,
            [THRU_DATE] = @THRU_DATE,
            [JOB_TITLE] = @JOB_TITLE,
            [SUPERVISOR] = @SUPERVISOR,
            [LOCATION] = @LOCATION,
            [TYPE_OF_WORK] = @TYPE_OF_WORK
        WHERE 
            [EMPLOYMENT_ID] = @EMPLOYMENT_ID;
        `;

        const result = await request
            .input('JOB_HISTORY_ID', sql.Int, JOB_HISTORY_ID)
            .input('EMPLOYMENT_ID', sql.Int, EMPLOYMENT_ID)
            .input('DEPARTMENT', sql.NVarChar(255), DEPARTMENT)
            .input('DIVISION', sql.NVarChar(255), DIVISION)
            .input('FROM_DATE', sql.Date, FROM_DATE)
            .input('THRU_DATE', sql.Date, THRU_DATE)
            .input('JOB_TITLE', sql.NVarChar(255), JOB_TITLE)
            .input('SUPERVISOR', sql.NVarChar(255), SUPERVISOR)
            .input('LOCATION', sql.NVarChar(250), LOCATION)
            .input('TYPE_OF_WORK', sql.Int, TYPE_OF_WORK)
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
    create_HRM_Em, createparate, createPer2,
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