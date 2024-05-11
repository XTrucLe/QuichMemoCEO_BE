const express = require('express');
const { gethomepage,
    see_income, see_vacationday,
    see_avg_shareholder, see_birthday,
    see_efectplan, see_employee_more_vacation,
    see_employee_in_hiringday,
    //create
    create_render, creates_personal,
    creates_hrm_em, creates_payrate,
    creates_ewt, creates_jh, creates_bnf, create_bf_render,
    //getall
    get_payrate, get_employment, get_benefit, get_employment_working,
    get_job_history, get_personal, get_employee,
    //get
    getEmployeeId, getpayrateid,
    get_benefitId, get_employmentid, get_employment_workingid,
    get_JobHistoryid,
    //delete
    delete_benefit, deleteinfo,
    //update
    updatepersonal, updatepayrate, update_employment,
    updateJobHistory, update_employment_working, update_benefit,
    //dashboard
    dash_board_department, dash_board_department_vacation,

} = require('../controlers/controler')
const router = express.Router();
//-----------------------------------------------------------
router.get('/personal', get_personal)
router.get('/employment', get_employment)
router.get('/employment_working', get_employment_working)
router.get('/job_history', get_job_history)
router.get('/payrate', get_payrate)
router.get('/benefit', get_benefit)
router.get('/employee', get_employee)



//-----------------------------------------------------------
//employee{
router.get('/home', gethomepage)

router.get('/income', see_income)
router.get('/vacation_days', see_vacationday)
router.get('/shareholder', see_avg_shareholder)
// inform
router.get('/employment_in_aniversary', see_employee_in_hiringday)
router.get('/birthday', see_birthday)
router.get('/efectplan', see_efectplan)
router.get('/more_vacation', see_employee_more_vacation)
//CROD
//create
router.get('/create', create_render)//không quan tâm
router.post('/creates_personal', creates_personal)
router.post('/creates_payrate', creates_payrate)
router.post('/employent', creates_hrm_em)
router.post('/employent_working_time', creates_ewt)
router.post('/job_history', creates_jh)
router.get('/createbenefit', create_bf_render)
router.post('/benefit', creates_bnf)
//delete
router.post('/personal/:id', getEmployeeId)
//xoá là xóa hết toàn bộ thông tin luôn
router.post('/deleteinfo', deleteinfo)
//update
router.post('/update_personal/:id', getEmployeeId)//
router.post('/update_personal', updatepersonal)

router.post('/update_employment/:id', get_employmentid)//
router.post('/update_employment', update_employment)

router.post('/update_JobHistory/:id', get_JobHistoryid)//
router.post('/update_JobHistory', updateJobHistory)

router.post('/update_employment_working_time/:id', get_employment_workingid)//
router.post('/update_employment_working_time', update_employment_working)
//
router.get('/benefitinfo', get_benefit)
router.post('/update_benefit/:id', get_benefitId)
router.post('/update_benefit', update_benefit)

//
//
router.get('/payrates', get_payrate)
router.post('/update_payrate/:id', getpayrateid)// sổ thông tin theo id
router.post('/update_payrate', updatepayrate)//update
//

//DASHBOARD
router.get('/dashboard_department', dash_board_department)
router.get('/dashboard_department_vacation', dash_board_department_vacation)






module.exports = router;