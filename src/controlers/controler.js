const { getEmployeeDataFromMySql, getEmployeeDataFromSqlServer,
    getall_shareholder, getall_birthday, getall_planefect,
    getall_employee_more_vacation, createEm, createPer,
} = require('../services/service');

const see_income = async (req, res) => {
    try {
        const mysqlData = await getEmployeeDataFromMySql();
        const sqlServerData = await getEmployeeDataFromSqlServer();

        // Map MySQL data to combine with SQL Server data
        let combinedData = mysqlData.map(mysqlRow => {
            // Find matching SQL Server row based on PERSONAL_ID
            const matchingSqlServerRow = sqlServerData.find(sqlServerRow => sqlServerRow.PERSONAL_ID_PERSONAL === mysqlRow.idEmployee);

            // Prepare combined object
            const combinedObject = {
                employee_id: mysqlRow.idEmployee,
                personal_id: matchingSqlServerRow ? matchingSqlServerRow.PERSONAL_ID_PERSONAL : null,
                first_name: mysqlRow.FirstName,
                last_name: mysqlRow.LastName,
                paid_to_date: mysqlRow.PaidToDate,
                paid_last_year: mysqlRow.PaidLastYear,
                value: mysqlRow.Value,
                current_gender: matchingSqlServerRow ? matchingSqlServerRow.CURRENT_GENDER_PERSONAL : null,
                department: matchingSqlServerRow ? matchingSqlServerRow.DEPARTMENT_JOB_HISTORY : null,
                type_of_work: matchingSqlServerRow ? matchingSqlServerRow.TYPE_OF_WORK_DESCRIPTION : null,
                ethnicity: matchingSqlServerRow ? matchingSqlServerRow.ETHNICITY_PERSONAL : null
            };

            return combinedObject;
        });

        // Sort the combined data by employee_id
        combinedData.sort((a, b) => a.employee_id - b.employee_id);

        // Send the sorted combined data as JSON
        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching combined employee data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const see_vacationday = async (req, res) => {
    try {
        const mysqlData = await getEmployeeDataFromMySql();
        const sqlServerData = await getEmployeeDataFromSqlServer();

        // Map MySQL data to combine with SQL Server data
        let combinedData = mysqlData.map(mysqlRow => {
            // Find matching SQL Server row based on PERSONAL_ID
            const matchingSqlServerRow = sqlServerData.find(sqlServerRow => sqlServerRow.PERSONAL_ID_PERSONAL === mysqlRow.idEmployee);

            // Prepare combined object
            const combinedObject = {
                employee_id: mysqlRow.idEmployee,
                personal_id: matchingSqlServerRow ? matchingSqlServerRow.PERSONAL_ID_PERSONAL : null,
                first_name: mysqlRow.FirstName,
                last_name: mysqlRow.LastName,
                vacation_days: mysqlRow.VacationDays,
                vacation_per_month: matchingSqlServerRow ? matchingSqlServerRow.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH_EMPLOYMENT_WORKING_TIME : null,
                current_gender: matchingSqlServerRow ? matchingSqlServerRow.CURRENT_GENDER_PERSONAL : null,
                department: matchingSqlServerRow ? matchingSqlServerRow.DEPARTMENT_JOB_HISTORY : null,
                type_of_work: matchingSqlServerRow ? matchingSqlServerRow.TYPE_OF_WORK_DESCRIPTION : null,
                ethnicity: matchingSqlServerRow ? matchingSqlServerRow.ETHNICITY_PERSONAL : null
            };

            return combinedObject;
        });

        // Sort the combined data by employee_id
        combinedData.sort((a, b) => a.employee_id - b.employee_id);

        // Send the sorted combined data as JSON
        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching combined employee data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const see_avg_shareholder = async (req, res) => {
    const data = await getall_shareholder();
    return res.json({ data });
};

const see_birthday = async (req, res) => {
    const data = await getall_birthday();
    return res.json({ data });
};
const see_efectplan = async (req, res) => {
    const data = await getall_planefect();
    return res.json({ data });
};

const see_employee_more_vacation = async (req, res) => {
    const data = await getall_employee_more_vacation();
    return res.json({ data });
};


//CROD
// const createEmployee = async (req, res) => {
//     let { idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear } = req.body;

//     await createEm(idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear)
//     let results = await getallusers();
//     return res.json({ employee_create: results });
//     //=====>đưa ra chuỗi 

// };
const create = (req, res) => {
    res.render('cr_em_sqlsever.ejs')
}

const creates = async (req, res) => {
    try {
        const {
            idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2,
            curcity, curcountry, curzip, curgen, curphone, curmail, curstt,
            ethnicity, sharestt, benefitid, emnum, payrate, idpayrate, vcd, paidtodate, paidlastyear
        } = req.body;
        await createPer(idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip,
            curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid);
        await createEm(idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear)
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};



module.exports = {
    see_income, see_vacationday,
    see_avg_shareholder, see_birthday, see_efectplan,
    see_employee_more_vacation, create, creates
};
