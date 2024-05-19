const {
    getEmployeeDataFromMySql, getEmployeeDataFromSqlServer,
    getall_shareholder, getall_birthday, getall_planefect,
    getall_employee_more_vacation, getall_employee_in_hiringday,
    //create
    create_mydb_Em, createPer, create_HRM_Em, createparate,
    create_em_working_time, createJobHistory, createBenefitPlan,
    createPer2,
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
    updateAll,
    updateEm, updatePer, update_HRM_Em,
    update_em_working_time, update_JobHistory,
    update_BenefitPlan, update_payrate,
} = require('../services/service');
const {
    getallbenefit, getallemployment, getallemployment_working,
    getalljob_history, getallpersonal, getPersonInfor, getManagerFields,
    // getPersonInfor,
} = require('../services/svc_sqlsever')

const {getallusers, getallpayrate} = require('../services/svc_mysql')
const {response} = require("express");


const see_income = async (req, res) => {
    try {
        const mysqlData = await getEmployeeDataFromMySql();
        const sqlServerData = await getEmployeeDataFromSqlServer();

        // Map MySQL data to combine with SQL Server data
        let combinedData = mysqlData.map(mysqlRow => {
            // Find matching SQL Server row based on PERSONAL_ID
            const matchingSqlServerRow = sqlServerData.find(sqlServerRow => sqlServerRow.EMPLOYMENT_ID === mysqlRow.idEmployee);

            // Prepare combined object
            const combinedObject = {
                employee_id: mysqlRow.idEmployee,
                personal_id: matchingSqlServerRow ? matchingSqlServerRow.PERSONAL_ID : null,
                first_name: mysqlRow.FirstName,
                last_name: mysqlRow.LastName,
                paid_to_date: mysqlRow.PaidToDate,
                paid_last_year: mysqlRow.PaidLastYear,
                value: mysqlRow.Value,
                current_gender: matchingSqlServerRow ? matchingSqlServerRow.CURRENT_GENDER: null,
                department: matchingSqlServerRow ? matchingSqlServerRow.DEPARTMENT : null,
                type_of_work: matchingSqlServerRow ? matchingSqlServerRow.TYPE_OF_WORKS : null,
                ethnicity: matchingSqlServerRow ? matchingSqlServerRow.ETHNICITY : null
            };

            return combinedObject;
        });

        // Sort the combined data by employee_id
        combinedData.sort((a, b) => a.employee_id - b.employee_id);

        // Send the sorted combined data as JSON
        res.json({Income: combinedData});
    } catch (error) {
        console.error('Error fetching combined employee data:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const see_vacationday = async (req, res) => {
    try {
        const mysqlData = await getEmployeeDataFromMySql();
        const sqlServerData = await getEmployeeDataFromSqlServer();

        // Map MySQL data to combine with SQL Server data
        let combinedData = mysqlData.map(mysqlRow => {
            // Find matching SQL Server row based on PERSONAL_ID
            const matchingSqlServerRow = sqlServerData.find(sqlServerRow => sqlServerRow.EMPLOYMENT_ID === mysqlRow.idEmployee);

            // Prepare combined object
            const combinedObject = {
                employee_id: mysqlRow.idEmployee,
                personal_id: matchingSqlServerRow ? matchingSqlServerRow.PERSONAL_ID : null,
                first_name: mysqlRow.FirstName,
                last_name: mysqlRow.LastName,
                vacation_days: mysqlRow.VacationDays,
                vacation_per_month: matchingSqlServerRow ? matchingSqlServerRow.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH : null,
                current_gender: matchingSqlServerRow ? matchingSqlServerRow.CURRENT_GENDER : null,
                department: matchingSqlServerRow ? matchingSqlServerRow.DEPARTMENT : null,
                type_of_work: matchingSqlServerRow ? matchingSqlServerRow.TYPE_OF_WORKS : null,
                ethnicity: matchingSqlServerRow ? matchingSqlServerRow.ETHNICITY : null
            };

            return combinedObject;
        });

        // Sort the combined data by employee_id
        combinedData.sort((a, b) => a.employee_id - b.employee_id);

        // Send the sorted combined data as JSON
        res.json({Vacation: combinedData});
    } catch (error) {
        console.error('Error fetching combined employee data:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const see_avg_shareholder = async (req, res) => {
    const data = await getall_shareholder();
    return res.json({data});
};

const see_birthday = async (req, res) => {
    const data = await getall_birthday();
    return res.json({data});
};

const see_employee_in_hiringday = async (req, res) => {
    const data = await getall_employee_in_hiringday();
    return res.json({data});
};

const see_efectplan = async (req, res) => {
    const data = await getall_planefect();
    return res.json({data});
};

const see_employee_more_vacation = async (req, res) => {
    const data = await getall_employee_more_vacation();
    return res.json({data});
};
const ManagerOverview=async (require, response)=>{
    const data=await getManagerFields()
    return response.json({overview: data})
}

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
            PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE,
            SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE, CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY,
            CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER, CURRENT_PERSONAL_EMAIL,
            CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID
        } = req.body;
        await createPer(PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE,
            SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE, CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY,
            CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER, CURRENT_PERSONAL_EMAIL,
            CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID);
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
        console.log(req.body)
        const {
            EMPLOYMENT_ID, EMPLOYMENT_CODE, EMPLOYMENT_STATUS, HIRE_DATE_FOR_WORKING, WORKERS_COMP_CODE,
            TERMINATION_DATE, REHIRE_DATE_FOR_WORKING, LAST_REVIEW_DATE, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
            PERSONAL_ID
        } = req.body;
        const [record] = await getPersonInfor(PERSONAL_ID)
        if (!record) {
            throw new Error('Incomplete employee information returned');
        }
        const {
            CURRENT_FIRST_NAME,
            CURRENT_LAST_NAME,
            CURRENT_MIDDLE_NAME,
            SOCIAL_SECURITY_NUMBER
        } = record
        await create_HRM_Em(EMPLOYMENT_ID, EMPLOYMENT_CODE, EMPLOYMENT_STATUS, HIRE_DATE_FOR_WORKING, WORKERS_COMP_CODE,
            TERMINATION_DATE, REHIRE_DATE_FOR_WORKING, LAST_REVIEW_DATE, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH, PERSONAL_ID);
        await create_mydb_Em(CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, SOCIAL_SECURITY_NUMBER, EMPLOYMENT_ID)
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
            numberDaysActualOfWorkingPerMonth, totalNumberVacationWorkingDaysPerMonth
        } = req.body;
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
            EMPLOYMENT_ID, DEPARTMENT, DIVISION, FROM_DATE, THRU_DATE,
            JOB_TITLE, SUPERVISOR, LOCATION, TYPE_OF_WORK
        } = req.body;
        await createJobHistory(EMPLOYMENT_ID, DEPARTMENT, DIVISION, FROM_DATE, THRU_DATE,
            JOB_TITLE, SUPERVISOR, LOCATION, TYPE_OF_WORK);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const creates_bnf = async (req, res) => {
    try {
        const {
            BENEFIT_PLANS_ID, PLAN_NAME, DEDUCTABLE, PERCENTAGE_COPAY
        } = req.body;
        await createBenefitPlan(BENEFIT_PLANS_ID, PLAN_NAME, DEDUCTABLE, PERCENTAGE_COPAY);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};
//get all table
const get_HRM = async (req, res) => {
    const data = await getEmployeeDataFromSqlServer();
    return res.json({data});
};
const get_mydb = async (req, res) => {
    const data = await getEmployeeDataFromMySql();
    return res.json({data});
};
const get_All = async (req, res) => {
    try {
        const mysqlData = await getEmployeeDataFromMySql();
        const sqlServerData = await getEmployeeDataFromSqlServer();

        // Combine data from both databases
        let combinedData = [];

        // MySQL Data
        mysqlData.forEach(mysqlRow => {
            // Find matching SQL Server row based on PERSONAL_ID
            const matchingSqlServerRow = sqlServerData.find(sqlServerRow => sqlServerRow.EMPLOYMENT_ID === mysqlRow.idEmployee);

            // Prepare combined object
            const combinedObject = {
                // Include all fields from MySQL data
                ...mysqlRow,
                // Include all fields from SQL Server data (if available)
                ...(matchingSqlServerRow || {})
            };

            combinedData.push(combinedObject);
        });

        // Send the combined data as JSON
        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching combined employee data:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const get_benefit = async (req, res) => {
    const data = await getallbenefit();
    return res.json({List_payrate: data});
};
const get_employment = async (req, res) => {
    const data = await getallemployment();
    return res.json({List_payrate: data});
};
const get_employment_working = async (req, res) => {
    const data = await getallemployment_working();
    return res.json({List_payrate: data});
};
const get_job_history = async (req, res) => {
    const data = await getalljob_history();
    return res.json({List_payrate: data});
};
const get_personal = async (req, res) => {
    const data = await getallpersonal();
    return res.json({data});
};
const get_employee = async (req, res) => {
    let results = await getallusers();
    return res.json({ListEmployee: results})
}
const get_payrate = async (req, res) => {
    let results = await getallpayrate();
    return res.json({Listpayrates: results})
}

//getid
const getEmployeeId = async (req, res) => {
    const personalid = req.params.id;
    let personal = await getIdpersonal(personalid);
    let employee = await getIdEmployee(personalid)
    res.json({personal, employee});
}

const getpayrateid = async (req, res) => {
    const personalid = req.params.id;
    let payrate = await getIdpayrate(personalid)
    res.json({payrate});
}

const gethomepage = async (req, res) => {
    let results = await getallpersonal();
    return res.render('home_personal.ejs', {personal: results})
}

const get_benefitId = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdbenefit(benefit)
    res.json({employee_update: eployee});
}

const get_employmentid = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdemployment(benefit)
    res.json({personal: eployee});
}

const get_employment_workingid = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdemploymentworking(benefit)
    res.json({personal: eployee});
}

const get_JobHistoryid = async (req, res) => {
    const benefit = req.params.id;
    let eployee = await getIdjobhistory(benefit)
    res.json({personal: eployee});
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
    res.json({employee_update: bnf})

}
//update
const update = async (req, res) => {
    const {
        PERSONAL_ID,
        CURRENT_FIRST_NAME,
        CURRENT_LAST_NAME,
        CURRENT_MIDDLE_NAME,
        BIRTH_DATE,
        SOCIAL_SECURITY_NUMBER,
        DRIVERS_LICENSE,
        CURRENT_ADDRESS_1,
        CURRENT_ADDRESS_2,
        CURRENT_CITY,
        CURRENT_COUNTRY,
        CURRENT_ZIP,
        CURRENT_GENDER,
        CURRENT_PHONE_NUMBER,
        CURRENT_PERSONAL_EMAIL,
        CURRENT_MARITAL_STATUS,
        ETHNICITY,
        SHAREHOLDER_STATUS,
        BENEFIT_PLAN_ID,
        JOB_HISTORY_ID,
        EMPLOYMENT_ID,
        DEPARTMENT,
        DIVISION,
        FROM_DATE,
        THRU_DATE,
        JOB_TITLE,
        SUPERVISOR,
        LOCATION,
        TYPE_OF_WORK,
        EMPLOYMENT_WORKING_TIME_ID,
        YEAR_WORKING,
        MONTH_WORKING,
        NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
        TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH,
        EMPLOYMENT_CODE,
        EMPLOYMENT_STATUS,
        HIRE_DATE_FOR_WORKING,
        WORKERS_COMP_CODE,
        TERMINATION_DATE,
        REHIRE_DATE_FOR_WORKING,
        LAST_REVIEW_DATE,
        NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH
    } = req.body;
    console.log((req.body))
    try {
        await updatePer(PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE, SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE,
            CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY, CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER,
            CURRENT_PERSONAL_EMAIL, CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID);
        await update_HRM_Em(EMPLOYMENT_CODE, EMPLOYMENT_STATUS, HIRE_DATE_FOR_WORKING, WORKERS_COMP_CODE, TERMINATION_DATE, REHIRE_DATE_FOR_WORKING,
            LAST_REVIEW_DATE, NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH, EMPLOYMENT_ID, PERSONAL_ID,)
        await update_em_working_time(EMPLOYMENT_WORKING_TIME_ID, YEAR_WORKING, MONTH_WORKING, NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
            TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH,)
        await update_JobHistory(JOB_HISTORY_ID, EMPLOYMENT_ID, DEPARTMENT, DIVISION, FROM_DATE, THRU_DATE, JOB_TITLE, SUPERVISOR, LOCATION, TYPE_OF_WORK)
        await updateEm(PERSONAL_ID, EMPLOYMENT_ID, CURRENT_MIDDLE_NAME, CURRENT_LAST_NAME, CURRENT_FIRST_NAME, SOCIAL_SECURITY_NUMBER,)

        return res.send('ok baby oiiiiiii.ejs');
    } catch (error) {
        console.error(error)
    }
};

const updatepayrate = async (req, res) => {
    const {
        idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC

    } = req.body;
    await update_payrate(idPayRates, PayRateName, Value, TaxPercentage, PayType, PayAmount, PT_LevelC);
    return res.send('ok baby oiiiiiii.ejs');
};

const update_benefit = async (req, res) => {
    const {
        benefitid, planName, deductable, percentageCopay
    } = req.body;
    await update_BenefitPlan(benefitid, planName, deductable, percentageCopay);
    return res.send('ok baby oiiiiiii.ejs');
};


//dashboard
const dash_board_department = async (req, res) => {
    const dash_board_department = await get_dash_board_department();
    const dash_board_department_vacation = await get_dash_board_department_vacation();
    return res.json({dash_board_department, dash_board_department_vacation});

}
const dash_board_department_vacation = async (req, res) => {
    return res.json({dash_board_department_vacation});

}


module.exports = {
    gethomepage,
    see_income, see_vacationday,
    see_avg_shareholder, see_birthday, see_efectplan,
    see_employee_more_vacation, see_employee_in_hiringday,
    ManagerOverview,
    //create
    create_render, creates_personal, creates_hrm_em,
    creates_ewt, creates_jh, creates_bnf,
    create_bf_render, creates_payrate,
    //getall
    get_payrate, get_employment, get_benefit, get_employment_working,
    get_job_history, get_personal, get_employee,
    //get
    getEmployeeId, get_JobHistoryid, getpayrateid,
    get_benefitId, get_employmentid, get_employment_workingid,
    get_HRM, get_mydb, get_All,
    //delete
    delete_benefit, deleteinfo,
    //dashboard
    dash_board_department, dash_board_department_vacation,
    //update 
    update,
    updatepayrate,
    update_benefit,

};
