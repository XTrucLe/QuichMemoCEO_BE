const express = require('express');
// const { gethomecontroler, gethomepage, createEmployee, create,
//     getEmployeeId, updateinfo, deleteEmployee, deleteinfo,
//     gethomepayrate,
//     //===========================================================
//     createpersonal, getbenefit, getemployment, getemployment_working, getjob_history, getpersonal,
// getidpersonal,} = require('../controlers/homeControler');
const { see_income, see_vacationday,
    see_avg_shareholder, see_birthday,
    see_efectplan, see_employee_more_vacation,
    create_render, creates_personal, gethomepage,
    creates_hrm_em,
    creates_ewt, creates_jh, creates_bnf,
    getEmployeeId,
    dash_board_department, create_bf_render,

} = require('../controlers/controler')
const router = express.Router();
//-----------------------------------------------------------
//employee{
//     router.get('/', gethomecontroler)
router.get('/home', gethomepage)
//     router.get('/create', create)
//     router.get('/create', create)
//     router.post('/deleteEmployee/:id', deleteEmployee)
//     router.post('/deleteinfo', deleteinfo)

//     //payrate
//     router.get('/payrates', gethomepayrate)

//     //===========================================================

//     router.get('/benefit', getbenefit)
//     router.get('/employment', getemployment)
//     router.get('/employment_working', getemployment_working)
//     router.get('/job_history', getjob_history)
//     router.get('/personal', getpersonal)
//     router.post('/personal/:id', getidpersonal)


//     // router.get('/personal', getpersonal)
//     //create
//     router.post('/createEmployee', createpersonal)


//     //--------------------------------------
// }

router.get('/income', see_income)
router.get('/vacation_days', see_vacationday)
router.get('/shareholder', see_avg_shareholder)
// inform
router.get('/birthday', see_birthday)
router.get('/efectplan', see_efectplan)
router.get('/more_vacation', see_employee_more_vacation)
//CROD

router.get('/create', create_render)
router.post('/creates_personal', creates_personal)
router.post('/employent', creates_hrm_em)
router.post('/employent_working_time', creates_ewt)
router.post('/job_history', creates_jh)
router.get('/createbenefit', create_bf_render)
router.post('/benefit', creates_bnf)


router.post('/personal/:id', getEmployeeId)


//DASHBOARD
router.get('/dashboard', dash_board_department)





module.exports = router;