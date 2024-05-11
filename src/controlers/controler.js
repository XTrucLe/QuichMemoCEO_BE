const { getEmployeeDataFromMySql, getEmployeeDataFromSqlServer,
    getall_shareholder, getall_birthday, getall_planefect,
    getall_employee_more_vacation, getall_employee_in_hiringday,
    //create
    create_mydb_Em, createPer, create_HRM_Em, createparate,
    create_em_working_time, createJobHistory, createBenefitPlan,

    //get
    getIdpersonal, getIdEmployee, getIdpayrate,
    getIdemployment, getIdemploymentworking, getIdjobhistory, getIdbenefit,
    //delete
    get_delete_benefit,
    deletebyemployee, deletebyperson,
    //dashboard
    get_dash_board_department,
    get_dash_board_department_vacation,
    //update
    updateEm, updatePer, update_HRM_Em,
    update_em_working_time, update_JobHistory,
    update_BenefitPlan, update_payrate,
} = require('../services/service');
const { getallbenefit, getallemployment, getallemployment_working,
    getalljob_history, getallpersonal,
} = require('../services/svc_sqlsever')

const { getallusers, getallpayrate } = require('../services/svc_mysql')


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

const see_employee_in_hiringday = async (req, res) => {
    const data = await getall_employee_in_hiringday();
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
//create
const create_render = (req, res) => {
    res.render('cr_em_sqlsever.ejs')
}

const create_bf_render = (req, res) => {
    res.render('create.ejs')
}

const creates_personal = async (req, res) => {
    try {
        const {
            idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2,
            curcity, curcountry, curzip, curgen, curphone, curmail, curstt,
            ethnicity, sharestt, benefitid, emnum, payrate, idpayrate, vcd, paidtodate, paidlastyear
        } = req.body;
        await createPer(idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip,
            curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid);
        await create_mydb_Em(idem, emnum, mname, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear)
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const creates_payrate = async (req, res) => {
    try {
        const {
            idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC
        } = req.body;
        await createparate(idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC)
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const creates_hrm_em = async (req, res) => {
    try {
        const {
            employmentCode, employmentStatus, hireDateForWorking, workersCompCode,
            terminationDate, rehireDateForWorking, lastReviewDate, numberDaysRequirementOfWorkingPerMonth, personalId } = req.body;
        await create_HRM_Em(employmentCode, employmentStatus, hireDateForWorking, workersCompCode,
            terminationDate, rehireDateForWorking, lastReviewDate, numberDaysRequirementOfWorkingPerMonth, personalId);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const creates_ewt = async (req, res) => {
    try {
        const {
            employmentId, yearWorking, monthWorking,
            numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth } = req.body;
        await create_em_working_time(employmentId, yearWorking, monthWorking,
            numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const creates_jh = async (req, res) => {
    try {
        const {
            employmentId, department, division,
            fromDate, thruDate, jobTitle, supervisor, location, typeOfWork } = req.body;
        await createJobHistory(employmentId, department, division,
            fromDate, thruDate, jobTitle, supervisor, location, typeOfWork);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const creates_bnf = async (req, res) => {
    try {
        const {
            benefitid, planName, deductable, percentageCopay } = req.body;
        await createBenefitPlan(benefitid, planName, deductable, percentageCopay);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};
//get all table
const get_benefit = async (req, res) => {
    const data = await getallbenefit();
    return res.json({ data });
};
const get_employment = async (req, res) => {
    const data = await getallemployment();
    return res.json({ data });
};
const get_employment_working = async (req, res) => {
    const data = await getallemployment_working();
    return res.json({ data });
};
const get_job_history = async (req, res) => {
    const data = await getalljob_history();
    return res.json({ data });
};
const get_personal = async (req, res) => {
    const data = await getallpersonal();
    return res.json({ data });
};
const get_employee = async (req, res) => {
    let results = await getallusers();
    return res.json({ ListEmployee: results })
}
const get_payrate = async (req, res) => {
    let results = await getallpayrate();
    return res.json({ Listpayrates: results })
}

//getid
const getEmployeeId = async (req, res) => {
    const personalid = req.params.id;
    let personal = await getIdpersonal(personalid);
    let eployee = await getIdEmployee(personalid)
    res.render('edit.ejs', { personal, eployee });
}

const gethomepage = async (req, res) => {
    let results = await getallpersonal();
    return res.render('home_personal.ejs', { personal: results })
}

const get_benefitId = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdbenefit(benefit)
    res.render('editbenefit.ejs', { employee_update: eployee });
}

const get_employmentid = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdemployment(benefit)
    res.render('editbenefit.ejs', { employee_update: eployee });
}

const get_employment_workingid = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdemploymentworking(benefit)
    res.render('editbenefit.ejs', { employee_update: eployee });
}

const get_JobHistoryid = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdjobhistory(benefit)
    res.render('editbenefit.ejs', { employee_update: eployee });
}

// Delete


const deleteinfo = async (req, res) => {
    const id = req.body.idem;
    await deletebyemployee(id);
    await deletebyperson(id);
    return res.render('home_personal.ejs');
};

const delete_benefit = async (req, res) => {
    const benefit = req.params.id;
    let bnf = await getallbenefit(benefit);
    res.render('delete.ejs', { employee_update: bnf })

}
//update

const updatepersonal = async (req, res) => {
    const {
        idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2,
        curcity, curcountry, curzip, curgen, curphone, curmail, curstt,
        ethnicity, sharestt, benefitid, emnum, payrate, idpayrate, vcd, paidtodate, paidlastyear
    } = req.body;
    await updatePer(idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip,
        curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid);
    await updateEm(idem, emnum, lname, mname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear)
    let personal = await getIdpersonal();
    let eployee = await getIdEmployee()
    return res.send('ok baby oiiiiiii.ejs');
};
const getpayrateid = async (req, res) => {
    const payrate = req.params.id;
    let eployee = await getIdpayrate(payrate)
    res.render('create.ejs', { personal: eployee });
}
const updatepayrate = async (req, res) => {
    const { idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC

    } = req.body;
    await update_payrate(idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC);
    return res.send('ok baby oiiiiiii.ejs');
};
const update_employment = async (req, res) => {
    const { employmentCode, employmentStatus, hireDateForWorking, workersCompCode,
        terminationDate, rehireDateForWorking, lastReviewDate, numberDaysRequirementOfWorkingPerMonth, personalId
    } = req.body;
    await update_HRM_Em(employmentCode, employmentStatus, hireDateForWorking, workersCompCode,
        terminationDate, rehireDateForWorking, lastReviewDate, numberDaysRequirementOfWorkingPerMonth, personalId);
    return res.send('ok baby oiiiiiii.ejs');
};
const updateJobHistory = async (req, res) => {
    const { employmentId, department, division, fromDate, thruDate, jobTitle, supervisor, location, typeOfWork
    } = req.body;
    await update_JobHistory(employmentId, department, division, fromDate, thruDate, jobTitle, supervisor, location, typeOfWork);
    return res.send('ok baby oiiiiiii.ejs');
};
const update_employment_working = async (req, res) => {
    const { employmentId, yearWorking, monthWorking, numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth
    } = req.body;
    await update_em_working_time(employmentId, yearWorking, monthWorking, numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth);
    return res.send('ok baby oiiiiiii.ejs');
};


const update_benefit = async (req, res) => {
    const { benefitid, planName, deductable, percentageCopay
    } = req.body;
    await update_BenefitPlan(benefitid, planName, deductable, percentageCopay);
    return res.send('ok baby oiiiiiii.ejs');
};


//dashboard
const dash_board_department = async (req, res) => {
    const dash_board_department = await get_dash_board_department();
    return res.json({ dash_board_department });

}
const dash_board_department_vacation = async (req, res) => {
    const dash_board_department_vacation = await get_dash_board_department_vacation();
    return res.json({ dash_board_department_vacation });

}


module.exports = {
    gethomepage,
    see_income, see_vacationday,
    see_avg_shareholder, see_birthday, see_efectplan,
    see_employee_more_vacation, see_employee_in_hiringday,
    //create
    create_render, creates_personal, creates_hrm_em,
    creates_ewt, creates_jh, creates_bnf,
    create_bf_render, creates_payrate,
    //getall
    get_payrate, get_employment, get_benefit, get_employment_working,
    get_job_history, get_personal, get_employee,
    //get
    getEmployeeId, getpayrateid, get_JobHistoryid,
    get_benefitId, get_employmentid, get_employment_workingid,

    //delete
    delete_benefit, deleteinfo,
    //dashboard
    dash_board_department, dash_board_department_vacation,
    //update
    updatepersonal, updatepayrate, update_employment,
    updateJobHistory, update_employment_working,
    update_benefit,

};
