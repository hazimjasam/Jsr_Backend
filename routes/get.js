const express = require('express')
const action = require('../models/action')
const category = require('../models/category')
const employee = require('../models/employee')
const expenses = require('../models/expenses')
const Illness = require('../models/Illness')
const patient = require('../models/patient')
const proportion = require('../models/proportion')
const record = require('../models/record')
const revenues = require('../models/revenues')
const salary = require('../models/salary')
const fixed = require('../models/fixed')
const { getdate, Date_offset, day_name_in_arabic, tConvert, calculateAge, formatCurrancy ,gettime} = require('../redwheelframework/datemanager')
const appointments = require('../models/appointments')
const medication = require('../models/medication')
const alert_ = require('../models/alert_')
const warehouse = require('../models/warehouse')
const cheakUser = require('../middleware/cheakUser')
const general = require('../models/general')
const room = require('../models/room')
const creditor = require('../models/creditor')
const creditor_element = require('../models/creditor_element')
const creditor_paid = require('../models/creditor_paid')
const revenues_types = require('../models/revenues_types')
const expenses_types = require('../models/expenses_types')
const withdraw = require('../models/withdraw')
const sales = require('../models/sales')
const moment = require('moment')
const res = require('express/lib/response')
const stock = require('../models/stock')
const subcategory = require('../models/subcategory')
const subsubcategory = require('../models/subsubcategory')
const delivery_date_selection = require('../models/delivery_date_selection')
const order_list = require('../models/order_list')
const e = require('connect-flash')
const order = require('../models/order')
const banner = require('../models/banner');


const router = express.Router()








function discover_blood_type(index) {
    switch (index) {
        case 0:
            return "غير معروف"
            break;
        case 1:
            return "A+"
            break;
        case 2:
            return "A-"
            break;
        case 3:
            return "B+"
            break;
        case 4:
            return "B-"
            break;
        case 5:
            return "AB+"
            break;
        case 6:
            return "AB-"
            break;
        case 7:
            return "O+"
            break;
        case 8:
            return "O-"
            break;
        default:
            return "غير معروف"
            break;
    }
}

function mydate() {
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    return now.getFullYear() + '-' + month + '-' + day;
}
function ToDay() {
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    return day;
}
function startofmonth(index) {
    var now = new Date(index);
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;

    return now.getFullYear() + '-' + month + '-' + 01;
}
function getdatein_ar(index) {
    var now = index;
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    return day + '/' + month + '/' + now.getFullYear();
}


router.get("/", (req, res) => {

    var data = {}

    if (req.isAuthenticated()) {
        data.user = req.user
    }

    res.render("login", data)
})



router.get("/logeout", (req, res, next) => {

    if (req.isAuthenticated()) {
        req.logOut(() => {

        })
    }

    res.redirect("/")
})

router.get("/start", cheakUser, async (req, res) => {


    var drawer = (req.cookies?.drawer == "true")


    var box = 0
    var cre_late = 0
    var debit_late = 0

    general_ = await general.findOne({})

    if (req.user.accounts) {
        var expenses_all = await expenses.find()
        var revenues_all = await revenues.find()
        var withdraw_all = await withdraw.find()


        var expenses_money = 0
        var revenues_money = 0
        var withdraw_money = 0

        var creditor_left = 0
        var debit_left = 0

        for (var i = 0; i < expenses_all.length; i++) {

            expenses_money = expenses_money + expenses_all[i].price

        }
        for (var i = 0; i < revenues_all.length; i++) {

            revenues_money = revenues_money + revenues_all[i].price

        }
        for (var i = 0; i < withdraw_all.length; i++) {
            withdraw_money = withdraw_money + withdraw_all[i].price
        }

        box = revenues_money - expenses_money - withdraw_money


        var cre = await creditor.find({ complete: false, debit: false, alert_: { $lt: getdate() } }).where("alert_").ne('')
        cre_late = cre.length
        var deb = await creditor.find({ complete: false, debit: true, alert_: { $lt: getdate() } }).where("alert_").ne('')
        debit_late = deb.length


    }




    res.render("start", { index: 10000, title: "المراجعين", formatCurrancy: formatCurrancy, cre_late: cre_late, debit_late: debit_late, box: box, drawer: drawer, general: general_, user: req.user })







})

router.get("/orders", cheakUser, (req, res) => {

    var drawer = (req.cookies?.drawer == "true")












    res.render("orders", { index: 50, drawer: drawer, title: "طلبات اليوم", user: req.user })







})
router.get("/all", cheakUser, (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    //time now

    var d = new Date();

    var date_ = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()




    action.find({}).sort([['date', -1]]).exec((err, docs2) => {





        res.render("main", { index: 0, drawer: drawer, title: "المراجعين", calculateAge: calculateAge, actions: docs2, date: date_, user: req.user })

    })





})






router.get("/patient", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var id = req.query.id || "";
    var selected_doc = req.query.doc || "";

    _patient = await patient.findById(id)

    action.find({}).sort([['date', -1]]).exec((err, docs2) => {

        record.find({ patient_id: id }).sort({ createdAt: -1 }).exec((err, docs3) => {

            Illness.find({}).sort([['createdAt', -1]]).limit(65).exec((err, docs4) => {
                general.findOne({}).exec((er, doc2) => {


                    res.render("banners-patient", { index: 0, patients: _patient, title: "المراجعين", drawer: drawer, age: calculateAge(_patient.age), calculateAge: calculateAge, getdatein_ar: getdatein_ar, actions: docs2, record: docs3, ill: docs4, selected_doc: selected_doc, discover_blood_type: discover_blood_type, general: doc2, user: req.user })
                })
            })

        })

    })




})



router.get("/edit_patient", cheakUser, (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var id = req.query.id || "";

    if (req.query.last_page != null)
        var last_page = req.query.last_page || "";

    patient.findById(id).exec((err, doc) => {

        action.find({}).sort([['date', -1]]).exec((err, docs2) => {





            res.render("edit_patient", { index: 0, drawer: drawer, patients: doc, title: "تعديل", actions: docs2, last_page: last_page, user: req.user })





        })


    })

})

router.get("/add", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var name = req.query.name || "";
    var selected_action = req.query.action || "";
    var phone = req.query.phone || "";
    var appoid = req.query.appoid || ''

    if (appoid != '') {
        appointments.findByIdAndDelete(appoid, () => {




            action.find({}).sort([['date', -1]]).exec((err, docs) => {

                Illness.find({}).sort([['date', -1]]).exec((err, docs2) => {

                    res.render("add_patient", { index: 1, name: name, drawer: drawer, title: "اضافة مراجع جديد", actions: docs, ill: docs2, selected_action: selected_action, phone: phone, user: req.user })
                })


            })
        })
    } else {






        action.find({}).sort([['date', -1]]).exec((err, docs) => {

            Illness.find({}).sort([['date', -1]]).exec((err, docs2) => {

                res.render("add_patient", { index: 1, name: name, drawer: drawer, title: "اضافة مراجع جديد", actions: docs, ill: docs2, selected_action: selected_action, phone: phone, user: req.user })
            })


        })


    }

})
router.get("/add_stock", cheakUser, async (req, res) => {








    var drawer = (req.cookies?.drawer == "true")

    Illness.find({}).sort([['date', -1]]).exec((err, docs2) => {
        category.find({}).sort([['date', -1]]).exec((err, docs3) => {
            medication.find({}).sort({ name: 1 }).exec((err, doc4) => {
                warehouse.find({}).exec((err, doc5) => {
                    general.findOne({}).exec((err, _general) => {








                        res.render("add_app", { index: 30, title: "اضافة منتج", drawer: drawer, ill: docs2, category: docs3, meds: doc4, today: mydate(), warehouse: doc5, general: _general, user: req.user })
                    })
                })
            })


        })

    })

})

router.get("/products", cheakUser, (req, res) => {


    var drawer = (req.cookies?.drawer == "true")




    Illness.find({}).sort([['date', -1]]).exec((err, docs2) => {
        category.find({}).sort([['date', -1]]).exec((err, docs3) => {
            medication.find({}).sort({ name: 1 }).exec((err, doc4) => {
                warehouse.find({}).exec((err, doc5) => {
                    general.findOne({}).exec(async(err, _general) => {

                        var time_solts =[]


                       var delivery_solts = await delivery_date_selection.find().sort([['createdAt', -1]])

                       for(var i = 0 ; i < delivery_solts.length ; i++)
                       {
                        var x = (getdate().split('-').join(',')+","+delivery_solts[i].time.split(':').join(',')).split(',')
                       
                        var count =await order_list.find({appo:new Date(parseInt(x[0]),parseInt(x[1]),parseInt(x[2]),parseInt(x[3]),parseInt(x[4]))}).countDocuments()

                            if(delivery_solts[i].count > count )
                            {
                                time_solts.push(delivery_solts[i].time)
                            }

                       
                       
                       }



                        res.render("pharmacy", { index: 5, title: "العناصر", drawer: drawer, ill: docs2, category: docs3, meds: doc4, today: mydate(), warehouse: doc5, general: _general,time_solts:time_solts, user: req.user })
                    })
                })
            })


        })

    })



})

router.get("/med_details", (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var name = req.query.name || "";

    medication.findOne({ name: name }).lean().exec((err, doc) => {

        if (err) {
            res.send({ success: 2 })
        }
        else {

            if (doc) {
                res.send({ success: 1, med: doc })
            }
            else {
                res.send({ success: 2 })
            }
        }

    })


})

router.get("/appointments", cheakUser, (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var current_date = req.query.current_date || getdate();
    var date_sheet = (req.query.date_sheet != null) ? startofmonth(req.query.date_sheet) : startofmonth(getdate())

    var selected_action = req.query.selected_action || "الكل"

    var name = req.query.name || ''

    var col = '3e8e41';


    if (selected_action == "الكل") {

        var query = { date: current_date }
    }
    else {

        var query = { date: current_date, action: selected_action }
    }

    if (name != '') {

        query.name = { $regex: req.query.name }
    }



    /// how many days in the month
    var d = new Date(date_sheet);

    function daysInMonth() {
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    }

    var year = date_sheet.split('-')[0]
    var month = date_sheet.split('-')[1]






    function offset() {
        var dayname = day_name_in_arabic(startofmonth(date_sheet));
        if (dayname == "الاحـد")
            return 0;
        else if (dayname == "الاثنين")
            return 1;
        else if (dayname == "الثـلاثاء")
            return 2;
        else if (dayname == "الاربعاء")
            return 3;
        else if (dayname == "الخمـيس")
            return 4;
        else if (dayname == "الجمعة")
            return 5;
        else if (dayname == "السـبت")
            return 6;

    }




    count = [];




    action.find({}).sort([['date', -1]]).exec((err, docs) => {

        for (var i = 0; i < docs.length; i++) {

            if (docs[i].name == selected_action) {
                col = docs[i].color;
            }
        }

        appointments.find(query).sort([['time', 1]]).exec(async (err, docs2) => {

            days_count = daysInMonth()

            if (selected_action == "الكل") {
                for (var i = 1; i < days_count + 1; i++) {
                    var x = (i < 10) ? '0' + i : '' + i;
                    co = await appointments.count({ date: `${year}-${month}-${x}` }) || 0
                    count.push(co)
                }
            }
            else {
                for (var i = 1; i < days_count + 1; i++) {
                    var x = (i < 10) ? '0' + i : '' + i;
                    co = await appointments.count({ date: `${year}-${month}-${x}`, action: selected_action }) || 0
                    count.push(co)
                }
            }


            res.render("appointments", { index: 3, drawer: drawer, title: "المواعيد", days_count: daysInMonth(), offset: offset(), today: getdate(), actions: docs, current_date: current_date, year: year, month: month, selected_action: selected_action, appo: docs2, tConvert: tConvert, count: count, col: col, user: req.user })

        })
    })

})

router.get("/accounts", cheakUser, async (req, res) => {


    var drawer = (req.cookies?.drawer == "true")



    var start = req.query.start || getdate();
    var end = req.query.end || "";

    var revenues_type = req.query.revenues_type || ""
    var expenses_type = req.query.expenses_type || ""
    var employee_select = req.query.employee || ""
    var query_revenues = {};
    var query_expenses = {};
    if (revenues_type != '') {
        query_revenues.type = revenues_type
    }
    if (expenses_type != '') {
        query_expenses.type = expenses_type
    }
    if (employee_select != '') {
        query_revenues.data_entry_name = employee_select
        query_expenses.data_entry_name = employee_select
    }

    var expenses_all = await expenses.find()
    var revenues_all = await revenues.find()
    var withdraw_all = await withdraw.find()


    var expenses_money = 0
    var revenues_money = 0
    var withdraw_money = 0

    var creditor_left = 0
    var debit_left = 0

    for (var i = 0; i < expenses_all.length; i++) {

        expenses_money = expenses_money + expenses_all[i].price

    }
    for (var i = 0; i < revenues_all.length; i++) {

        revenues_money = revenues_money + revenues_all[i].price

    }
    for (var i = 0; i < withdraw_all.length; i++) {
        withdraw_money = withdraw_money + withdraw_all[i].price
    }


    if (end.length <= 0) {

        query_revenues.date = start
        query_expenses.date = start

        var _revenues = await revenues.find(query_revenues).sort([['createdAt', -1]])


        if (expenses_type == 'سحب' || expenses_type == '')
            var _withdraw = await withdraw.find({ date: start }).sort([['createdAt', -1]])
        else {
            _withdraw = []
        }

        if (expenses_type == 'سحب') {
            _expenses = []
        }
        else
            var _expenses = await expenses.find(query_expenses).sort([['createdAt', -1]])





    }
    else {




        var _revenues = await revenues.find(query_revenues).sort([['date', -1]]).where('date').gte(start).lte(end).sort([['createdAt', -1]])


        if (expenses_type == 'سحب')
            _expenses = []
        else
            var _expenses = await expenses.find(query_expenses).sort([['date', -1]]).where('date').gte(start).lte(end).sort([['createdAt', -1]])


        if (expenses_type == 'سحب' || expenses_type == '')
            var _withdraw = await withdraw.find({}).sort([['date', -1]]).where('date').gte(start).lte(end).sort([['createdAt', -1]])
        else {
            _withdraw = []
        }
    }


    var employees = await employee.find({}).sort([['date', -1]])
    var _fixed = await salary.find({}).sort([['date', -1]])


    var expenses_value = 0;
    var revenues_value = 0;
    var withdraw_value = 0;

    for (var i = 0; i < _withdraw.length; i++) {

        withdraw_value = withdraw_value + _withdraw[i].price
    }
    for (var i = 0; i < _expenses.length; i++) {

        expenses_value = expenses_value + _expenses[i].price
    }


    for (var i = 0; i < _revenues.length; i++) {
        revenues_value = revenues_value + _revenues[i].price
    }
    expenses_value = expenses_value + withdraw_value

    //دائن و مدين
    var money = 0
    var money_paid = 0
    var all_cre = await creditor.find({ complete: false, debit: false })
    for (var i = 0; i < all_cre.length; i++) {

        var all_cre_elements = await creditor_element.find({ creditor: all_cre[i].id })
        for (let y = 0; y < all_cre_elements.length; y++) {
            money = money + all_cre_elements[y].price
        }
        var all_cre_paid = await creditor_paid.find({ creditor: all_cre[i].id })
        for (let y = 0; y < all_cre_paid.length; y++) {
            money_paid = money_paid + all_cre_paid[y].price
        }

    }
    creditor_left = money - money_paid


    var debit_money = 0
    var debit_money_paid = 0
    var all_debit = await creditor.find({ complete: false, debit: true })
    for (var i = 0; i < all_debit.length; i++) {
        var money
        var money_paid
        var all_cre_elements = await creditor_element.find({ creditor: all_debit[i].id })

        for (let y = 0; y < all_cre_elements.length; y++) {
            debit_money = debit_money + all_cre_elements[y].price
        }
        var all_cre_paid = await creditor_paid.find({ creditor: all_debit[i].id })
        for (let y = 0; y < all_cre_paid.length; y++) {
            debit_money_paid = debit_money_paid + all_cre_paid[y].price
        }
    }
    debit_left = debit_money - debit_money_paid


    _expenses_types = await expenses_types.find()
    _revenues_types = await revenues_types.find()
    general_ = await general.findOne({})



    ///sales ////////////////////////////////////////////////
    var startQuery = ""
    var endQuery = ""




    if (moment(Date_offset(getdate(), -1)).isValid()) {
        startQuery = new Date(moment(Date_offset(getdate())).set({ hours: 0 }))
    }
    if (moment(Date_offset(getdate(), 1)).isValid()) {
        endQuery = new Date(moment(Date_offset(getdate(), 1)).set({ hours: 24 }))
    }

    var today_sales_value = 0;

    var today_sales = await sales.find().where("createdAt").gt(startQuery).lt(endQuery)





    for (var i; i < today_sales.length; i++) {

        today_sales_value = today_sales_value + (today_sales[i].price - today_sales[i].discount)
    }

    var startQuery2 = ""
    var endQuery2 = ""

    if (moment(Date_offset(getdate(), -2)).isValid()) {
        startQuery2 = new Date(moment(Date_offset(getdate(), -2)).set({ hours: 0 }))
    }
    if (moment(getdate()).isValid()) {
        endQuery2 = new Date(moment(getdate()).set({ hours: 24 }))
    }

    var lastday_sales_value = 0;
    var lastday_sales = await sales.find().where("createdAt").gt(startQuery2).lt(endQuery2)
    for (var i; i < lastday_sales.length; i++) {

        lastday_sales_value = lastday_sales_value + (lastday_sales[i].price - lastday_sales[i].discount)
    }
    ////////////////////////////////////////////////////////////


    res.render("accounts", { index: 20, drawer: drawer, title: "الحـسابات", general: general_, today_sales_value: today_sales_value, lastday_sales_value: lastday_sales_value, creditor_left: creditor_left, debit_left: debit_left, withdraw_money: withdraw_money, revenues_money: revenues_money, withdraw_value: withdraw_value, expenses_money: expenses_money, expenses_types: _expenses_types, revenues_types: _revenues_types, mydate: getdate(), expenses: _expenses, withdraw: _withdraw, datestart: start, dateend: end, expenses_value: expenses_value, revenues_value: revenues_value, revenues: _revenues, formatCurrancy: formatCurrancy, employees: employees, fixed: _fixed, user: req.user })





})
router.get("/creditor", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var mass = req.query.mass || false
    var mass2 = req.query.mass2 || ''

    var cre = await creditor.find({ complete: false, debit: false })
    var general_ = await general.findOne({})

    var total = 0
    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_element_ = await creditor_element.find({ creditor: cre[i].id })
        for (let y = 0; y < creditor_element_.length; y++) {
            sub_total = sub_total + creditor_element_[y].price


        }
        total = sub_total + total;

        cre[i].total_price = sub_total
    }
    var paid = 0
    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_paid_ = await creditor_paid.find({ creditor: cre[i].id })
        for (let y = 0; y < creditor_paid_.length; y++) {
            sub_total = sub_total + creditor_paid_[y].price

        }
        paid = paid + sub_total

        cre[i].total_paid = sub_total
    }

    res.render("creditor", { index: 21, drawer: drawer, title: "الدائن", creditor: cre, mass: mass, mass2: mass2, general: general_, getdatein_ar: getdatein_ar, formatCurrancy: formatCurrancy, total: total, paid: paid, user: req.user })
})
router.get("/debit", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var mass = req.query.mass || false
    var mass2 = req.query.mass2 || ''

    var cre = await creditor.find({ complete: false, debit: true })
    var general_ = await general.findOne({})

    var total = 0
    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_element_ = await creditor_element.find({ creditor: cre[i].id })
        for (let y = 0; y < creditor_element_.length; y++) {
            sub_total = sub_total + creditor_element_[y].price


        }
        total = sub_total + total;

        cre[i].total_price = sub_total
    }
    var paid = 0
    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_paid_ = await creditor_paid.find({ creditor: cre[i].id })
        for (let y = 0; y < creditor_paid_.length; y++) {
            sub_total = sub_total + creditor_paid_[y].price

        }
        paid = paid + sub_total

        cre[i].total_paid = sub_total
    }

    res.render("debit", { index: 22, title: "مدين", drawer: drawer, creditor: cre, mass: mass, mass2: mass2, general: general_, getdatein_ar: getdatein_ar, formatCurrancy: formatCurrancy, total: total, paid: paid, user: req.user })
})
router.get("/sales", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    datestart = req.query.datestart || getdate()
    dateend = req.query.dateend || getdate()

    var general_ = await general.findOne({})
    var _employees = await employee.find({ pharmacy: true })
    var _warehouse = await warehouse.find({})


    res.render("sales", { index: 24, title: "المبيعات", warehouse: _warehouse, employees: _employees, drawer: drawer, general: general_, getdatein_ar: getdatein_ar, formatCurrancy: formatCurrancy, user: req.user })
})
router.get("/archive", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")


    var general_ = await general.findOne({})



    res.render("archive", { index: 23, title: "الارشيف", drawer: drawer, general: general_, getdatein_ar: getdatein_ar, formatCurrancy: formatCurrancy, user: req.user })
})




router.get("/settings/:id", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")
    var massage = req.query.massage || "";

    var id = req.params.id;
    switch (id) {
        case "action":


            action.find({}).sort([['date', -1]]).exec((err, docs) => {

                Illness.find({}).sort([['date', -1]]).exec((err, docs2) => {
                    category.find({}).sort([['date', -1]]).exec((err, docs3) => {
                        warehouse.find({}).exec((err, docs4) => {

                            subcategory.find({}).sort([['date', -1]]).exec((err, docs5) => {
                                subsubcategory.find({}).sort([['date', -1]]).exec((err, docs6) => {

                                    delivery_date_selection.find().sort([['createdAt', -1]]).exec((err, docs7) => {



                                        res.render("actions", { index: 7, drawer: drawer, title: "الاعدادت >> التوجيهات", massage: massage, data: docs, data2: docs2, data3: docs3, data4: docs4, sub: docs5, subsub: docs6,delivery:docs7,gettime:gettime, user: req.user })
                                    })
                                })
                            })
                        })

                    })


                })

            })

            break;

        case "employees":

            action.find({}).exec((err, docs) => {

                employee.find({}).sort([['createdAt', 1]]).exec((err, docs2) => {


                    res.render("employees", { index: 8, drawer: drawer, title: "الاعدادت >> المـوظفين", action: docs, emp: docs2, user: req.user })
                })
            })

            break;

        case "general":



            general.findOne({}).exec(async (err, doc) => {
                var rooms = await room.find({})
                res.render("setting_general", { index: 9, drawer: drawer, title: "الاعدادت >> العامة", rooms: rooms, user: req.user, general: doc })
            })

            break;
        case "accounting":


            _revenues_types = await revenues_types.find({})
            _expenses_types = await expenses_types.find({})

            general.findOne({}).exec(async (err, doc) => {
                var rooms = await room.find({})
                res.render("setting_accounting", { index: 10, drawer: drawer, title: "الاعدادت >> اعدادات الحسابات", massage: massage, rooms: rooms, user: req.user, general: doc, revenues_types: _revenues_types, expenses_types: _expenses_types })
            })

            break;
        case "logsystem":




            datestart = req.query.datestart || getdate()
            dateend = req.query.dateend || getdate()

            var general_ = await general.findOne({})
            var _employees = await employee.find({ pharmacy: true })


            res.render("logsystem", { index: 11, drawer: drawer, title: "الاعدادت >>  Log system", datestart: datestart, dateend: dateend, employees: _employees, user: req.user })


            break;



        default:
            res.render("add_patient", { index: 1, drawer: drawer, name: name, title: "اضافة مراجع جديد", user: req.user })
            break;

    }



})












router.get("/statement", cheakUser, (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var id = req.query.id || '';
    var last_page = req.query.last_page || '/start'

    creditor.findById(id).exec(async (err, doc) => {

        if (doc) {


            var _creditor_element = await creditor_element.find({ creditor: doc.id }).sort([['createdAt', 1]])
            var _creditor_paid = await creditor_paid.find({ creditor: doc.id }).sort([['createdAt', 1]])

            var fullprice = 0
            for (let i = 0; i < _creditor_element.length; i++) {
                fullprice = fullprice + _creditor_element[i].price
            }
            var paidprice = 0
            for (let i = 0; i < _creditor_paid.length; i++) {
                paidprice = paidprice + _creditor_paid[i].price
            }

            general_ = await general.findOne({})
            res.render("statement", { index: -1, drawer: drawer, title: "كشف قائمة رقم : " + doc.bar_code, general: general_, creditor: doc, getdatein_ar: getdatein_ar, formatCurrancy: formatCurrancy, creditor_element: _creditor_element, creditor_paid: _creditor_paid, fullprice: fullprice, paidprice: paidprice, last_page: last_page, user: req.user })
        }
        else {
            res.render("error", { index: -1, drawer: drawer, mass: 'خطاء في استحصال معلومات الكشف' })
        }
    })

})
router.get("/statement_open", cheakUser, (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var bar_code = req.query.bar_code || '';
    var last_page = req.query.last_page || '/start'

    console.log(bar_code)

    creditor.findOne({ bar_code: bar_code }).exec(async (err, doc) => {

        if (doc) {


            var _creditor_element = await creditor_element.find({ creditor: doc.id }).sort([['createdAt', 1]])
            var _creditor_paid = await creditor_paid.find({ creditor: doc.id }).sort([['createdAt', 1]])

            var fullprice = 0
            for (let i = 0; i < _creditor_element.length; i++) {
                fullprice = fullprice + _creditor_element[i].price
            }
            var paidprice = 0
            for (let i = 0; i < _creditor_paid.length; i++) {
                paidprice = paidprice + _creditor_paid[i].price
            }

            general_ = await general.findOne({})
            res.render("statement", { index: -1, drawer: drawer, title: "كشف قائمة رقم : " + doc.bar_code, general: general_, creditor: doc, getdatein_ar: getdatein_ar, formatCurrancy: formatCurrancy, creditor_element: _creditor_element, creditor_paid: _creditor_paid, fullprice: fullprice, paidprice: paidprice, last_page: last_page, user: req.user })
        }
        else {
            res.render("error", { index: -1, drawer: drawer, user: req.user, mass: 'خطاء في استحصال معلومات الكشف' })
        }
    })

})

router.get("/single_product", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    var id = req.query.id || ''

    if (id == "")
        return res.render("error", { index: -1, drawer: drawer, user: req.user, mass: 'خطاء في استحصال معلومات المنتج' })

    var _stock = await stock.findById(id)
    var _warehouse = await warehouse.find()

    var ca =await category.find()
    var sub =await subcategory.find()
    var subsub =await subsubcategory.find()

    res.render("product_check", { index: -1, title: _stock.name, drawer: drawer, stock: _stock, warehouse: _warehouse,ca:ca,sub:sub,subsub:subsub, user: req.user })

})

router.get("/order/:id", cheakUser, async (req, res,next) => {
    var drawer = (req.cookies?.drawer == "true")

    var id = req.params.id || ''

    order_list.findById(id).exec(async(err,doc)=>{

        if(doc)
        {

           var orders =await order.find({link:doc.id}).sort([['createdAt', -1]]).lean()

           for(var i = 0 ; i < orders.length; i++)
           {

            
            var st = await stock.findById(orders[i].product_id)
            if(typeof(st) != 'undefined')
            {
            orders[i].img = st.images[0]
            orders[i].number = st.leftinstock
            }
            else{
                
                orders[i].number = 'المنتج محذوف'
            }

           }

            res.render("single_order", { index: -1,title:"طلب",last_page:'/orders',orders:orders,order_list:doc, drawer: drawer,formatCurrancy:formatCurrancy,getdatein_ar:getdatein_ar, user: req.user })
        }
        else
        {
            return next(Error("not order in that id found"))
        }
    })
})
router.get("/banners", cheakUser, async (req, res) => {

    var drawer = (req.cookies?.drawer == "true")

    
    
    var banners = await banner.find({}).sort([['createdAt', -1]])

    res.render("banners", { index: 12, title: "البنرات", drawer: drawer,banners:banners, user: req.user })

})


module.exports = router;