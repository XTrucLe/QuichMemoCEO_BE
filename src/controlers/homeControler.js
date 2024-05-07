const { json } = require('express');
const { Request } = require('mssql');
const connect_sqlsever = require('../config/conn_sqlsever');

const { getallusers, getIdEmployee, createEm, updateEm, deleteEm,
    //-----------------------------------------------------------
    getall_payrate,
    //===========================================================
} = require('../services/svc_mysql')

const {
    getallbenefit, getallemployment, getallemployment_working, getalljob_history, getallpersonal, createAllpersonal,
    getIdpersonal
} = require('../services/svc_sqlsever')


const gethomecontroler = (req, res) => {

    return res.render('INTERGRATION')
}


const gethomepage = async (req, res) => {
    let results = await getallusers();
    return res.render('home.ejs', { ListEmployee: results })
}
const create = (req, res) => {
    res.render('create.ejs')
}
const createEmployee = async (req, res) => {
    let { idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear } = req.body;

    await createEm(idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear)
    let results = await getallusers();
    return res.json({ employee_create: results });
    //=====>đưa ra chuỗi 

};

const getEmployeeId = async (req, res) => {
    const employeeid = req.params.id;
    let employee = await getIdEmployee(employeeid);
    res.render('edit.ejs', { employee_update: employee })

}
const updateinfo = async (req, res) => {
    let { idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear } = req.body;
    await updateEm(idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear);
    let results = await getallusers();
    return res.json({ employee_update: results });
};

const deleteEmployee = async (req, res) => {
    const employeeid = req.params.id;
    let employee = await getIdEmployee(employeeid);
    res.render('delete.ejs', { employee_delete: employee })

}

const deleteinfo = async (req, res) => {
    const id = req.body.idem;
    await deleteEm(id);
    // res.redirect('/home')
    let results = await getallusers();
    return res.json({ employee_delete: results });
    //=> xóa đưa ra chuỗi 
};
//______________________________________________________//

const gethomepayrate = async (req, res) => {
    try {
        let results = await getall_payrate();
        return res.json({ ListEmployee: results });
    } catch (error) {
        // Handle error
        return res.status(500).json({ error: 'dit me may di ngu' });
    }

};
//=========================================================================================================================
//get table
const getbenefit = async (req, res) => {
    const data = await getallbenefit();
    return res.json({ data });
};
const getemployment = async (req, res) => {
    const data = await getallemployment();
    return res.json({ data });
};
const getemployment_working = async (req, res) => {
    const data = await getallemployment_working();
    return res.json({ data });
};
const getjob_history = async (req, res) => {
    const data = await getalljob_history();
    return res.json({ data });
};
const getpersonal = async (req, res) => {
    const data = await getallpersonal();
    return res.render('home_personal.ejs', { personal: data });
};

// create 
// const createper = (req, res) => {
//     res.render('cr_em_sqlsever.ejs')
// }

const createpersonal = async (req, res) => {
    try {
        const {
            idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip, curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid
        } = req.body;
        await createAllpersonal(idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip, curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid);
        res.send('Employee created successfully.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while creating the employee.');
    }
};

const getidpersonal = async (req, res) => {
    const personalid = req.params.id;
    let employee = await getIdpersonal(personalid);
    res.json({ employee_update: employee })

}



module.exports = {
    gethomecontroler, gethomepage, createEmployee, create, getEmployeeId, updateinfo,
    deleteEmployee, deleteinfo,
    //----------------------------
    gethomepayrate,
    //=================================
    getbenefit, getemployment, getemployment_working, getjob_history, getpersonal, createpersonal,
    getidpersonal,
}
