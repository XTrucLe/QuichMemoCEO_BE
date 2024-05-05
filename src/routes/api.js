const express = require('express');
const { gethomecontroler, gethomepage, createEmployee, create,
    getEmployeeId, updateinfo, deleteEmployee, deleteinfo,
    gethomepayrate,
    //===========================================================
    createpersonal, getbenefit, getemployment, getemployment_working, getjob_history, getpersonal,
    getidpersonal,
} = require('../controlers/homeControler');
const { getCombinedEmployeeData } = require('../controlers/controler')
const router = express.Router();
//-----------------------------------------------------------
//employee
router.get('/', gethomecontroler)
router.get('/home', gethomepage)
router.get('/create', create)
// router.post('/getEmployeeId/:id', getEmployeeId)
router.get('/create', create)
router.post('/deleteEmployee/:id', deleteEmployee)
router.post('/deleteinfo', deleteinfo)

//payrate
router.get('/payrates', gethomepayrate)

//===========================================================

router.get('/benefit', getbenefit)
router.get('/employment', getemployment)
router.get('/employment_working', getemployment_working)
router.get('/job_history', getjob_history)
router.get('/personal', getpersonal)
router.post('/personal/:id', getidpersonal)


// router.get('/personal', getpersonal)
//create
router.post('/createEmployee', createpersonal)


//--------------------------------------
router.get('/getinfo', getCombinedEmployeeData)

module.exports = router;