const express = require('express')
const action = require('../models/action')
const category = require('../models/category')
const employee = require('../models/employee')
const expenses = require('../models/expenses')
const Illness = require('../models/Illness')
const items = require('../models/items')
const medication = require('../models/medication')
const router = express.Router()
const patient = require('../models/patient')
const record = require('../models/record')
const stock = require('../models/stock')
const save_base64 = require('../redwheelframework/save_image')
const { getdate, gettime, tConvert, day_name_in_arabic, calculateAge, Date_offset, formatCurrancy, getdatein_ar } = require('../redwheelframework/datemanager')
const bufferToImage = require('../redwheelframework/bufferImage')
const salary = require('../models/salary')
const revenues = require('../models/revenues')
const proportion = require('../models/proportion')
const fixed = require('../models/fixed')
const { json, redirect } = require('express/lib/response')
const recipe = require('../models/recipe')
const appointments = require('../models/appointments')
const warehouse = require('../models/warehouse')
const passport = require('passport')
const cheakUser = require('../middleware/cheakUser')
const bcrypt = require('bcrypt')
const bufferToImageV2 = require('../util/bufferToImage');
const general = require('../models/general')
const room = require('../models/room')
const creditor = require('../models/creditor')
const creditor_element = require('../models/creditor_element')
const creditor_paid = require('../models/creditor_paid')
const { query } = require('express')
const e = require('connect-flash')
const { parse } = require('dotenv')
const revenues_types = require('../models/revenues_types')
const expenses_types = require('../models/expenses_types')
const withdraw = require('../models/withdraw')
const sales = require('../models/sales')
const moment = require('moment')
const logosystem = require('../models/logosystem')
const subcategory = require('../models/subcategory')
const subsubcategory = require('../models/subsubcategory')
const order_list = require('../models/order_list')
const order = require('../models/order')
const delivery_date_selection = require('../models/delivery_date_selection')
const banner = require('../models/banner')



function login_patient(id, callback) {

    patient.findById(id).exec((err, doc) => {

        if (doc) {

            doc.date_entry = getdate();
            doc.save(() => {

                recording_logosystem(4, req.user.name, '   ?????????? ???????? ???????? ?????? ??????????   : ' + doc.action)
                callback(null);


            })
        }
        else {
            callback("???????????? ???????? ???????? ??????????????");
        }
    })
}




router.post("/auth", (req, res, next) => {
    passport.authenticate('user-local', {

    }, (err, user) => {
        if (err) {
            return res.send({ success: 0 })
        }
        else {


            if (!user) {
                return res.send({ success: 0 })
            }

            req.logIn(user, (err) => {
                if (err) {
                    return res.send({ success: 0 })
                }
                else {
                    res.send({ success: 1, user: user.name })

                    recording_logosystem(0, user.name)
                }
            })
        }

    })(req, res, next)
})


router.post("/add_patient", cheakUser, (req, res) => {



    //time now
    /*var d = new Date();

    var date_ = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()

    var date_time = date_ + + " " + d.getHours() + ":" + d.getMinutes();*/

    patient.findOne({ name: req.body.name }).exec((err, doc) => {



        if (doc) {
            return res.send({ success: 2, url: "/add", id: doc.id })
        }
        else {

            var bar_code = ((req.body.sex == 1) ? `M` : `F`) + '-' + calculateAge(req.body.age) + '-' + getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000);
            //save image 
            save_base64(req.body.image, "images", (filename) => {


                action.findOne({ name: req.body.action }).exec((err, doc) => {

                    var col = "7bd4b3";

                    if (doc) {

                        col = doc.color;

                    }




                    new patient({

                        name: req.body.name,
                        age: req.body.age,
                        sex: req.body.sex,
                        nationality: req.body.nationality,
                        phone_number: req.body.phone_number,
                        history: req.body.history.split(',').join(' '),
                        note: req.body.note,
                        action: req.body.action,
                        blood_type: req.body.blood_type | 0,
                        residence: req.body.residence,
                        date_entry: getdate(),
                        data_entry_name: req.user.name,
                        action_color: col,
                        image: filename,
                        main: req.body.main,
                        Attached: req.body.Attached,
                        Attached2: req.body.Attached2,
                        number_Children: req.body.number_Children,
                        occupation: req.body.occupation,
                        marital_Status: req.body.marital_Status,
                        bar_code: bar_code


                    }).save((err, doc) => {

                        if (err) {
                            return res.send({ success: 0, url: "/add" })
                        }
                        else {
                            res.send({ success: 1, url: "/add" })
                            req.app.settings.io.emit("info", "update")

                            recording_logosystem(1, req.user.name, '?????????? ?????????? ???????? : ' + req.body.name)
                        }



                    })



                })





            })
        }


    })





})
router.post("/edit_patient", cheakUser, (req, res) => {



    //time now
    /*var d = new Date();

    var date_ = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()

    var date_time = date_ + + " " + d.getHours() + ":" + d.getMinutes();*/

    patient.findById(req.body.id, (err, doc) => {



        if (doc) {





            action.findOne({ name: req.body.action }).exec((err, doc2) => {

                var col = "7bd4b3";

                if (doc2) {

                    col = doc2.color;

                }






                doc.age = req.body.age
                doc.sex = req.body.sex
                doc.nationality = req.body.nationality
                doc.phone_number = req.body.phone_number

                doc.note = req.body.note
                doc.action = req.body.action
                doc.blood_type = req.body.blood_type | 0
                doc.residence = req.body.residence
                doc.date_entry = getdate()
                doc.data_entry_name = req.user.name
                doc.action_color = col

                doc.Attached = req.body.Attached
                doc.Attached2 = req.body.Attached2

                doc.number_Children = req.body.number_Children
                doc.occupation = req.body.occupation
                doc.marital_Status = req.body.marital_Status



                doc.save((err, doc) => {



                    if (err) {

                        return res.send({ success: 0, url: "/add" })
                    }
                    else {
                        res.send({ success: 1, url: "/add" })

                        recording_logosystem(2, req.user.name, '  ?????????? ?????? ?????????????? ???????????? : ' + doc.name)
                    }



                })



            })






        }
        else {
            return res.send({ success: 0, url: "/add" })
        }


    })





})
router.post("/add_Illness", cheakUser, (req, res) => {




    Illness.findOne({ name: req.body.name }).exec((err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=?????????? ???????????? ?????????? ????????????");


        }
        else {



            new Illness({

                name: req.body.name


            }).save((err, doc) => {

                if (err) {
                    return res.send({ success: 0, url: "/add" })
                }

                res.redirect("/settings/action")



            })
        }


    })









})
router.post("/add_time", cheakUser, (req, res) => {


    var x = (getdate().split('-').join(',') + "," + req.body.time.split(':').join(',')).split(',')





    delivery_date_selection.findOne({ time: req.body.time }).exec((err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=?????????? ?????????? ????????????");


        }
        else {



            new delivery_date_selection({

                time: req.body.time,
                count: Math.floor(req.body.count),
                createdAt: new Date(new Date(parseInt(x[0]), parseInt(x[1]), parseInt(x[2]), parseInt(x[3]), parseInt(x[4])))

            }).save((err, doc) => {

                if (err) {
                    return res.send({ success: 0, url: "/add" })
                }

                res.redirect("/settings/action")



            })
        }


    })









})
router.post("/add_action", cheakUser, (req, res) => {


    action.findOne({ name: req.body.name }).exec((err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=?????????????? ?????????? ????????????");


        }
        else {



            new action({

                name: req.body.name,
                color: Math.floor(Math.random() * 16777215).toString(16)

            }).save((err, doc) => {

                if (err) {
                    return res.send({ success: 0, url: "/add" })
                }

                res.redirect("/settings/action")



            })
        }


    })









})
router.post("/add_warehouse", cheakUser, (req, res) => {


    warehouse.findOne({ name: req.body.name }).exec((err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=???????????? ?????????? ????????????");


        }
        else {



            new warehouse({

                name: req.body.name,


            }).save((err, doc) => {

                if (err) {
                    return res.send({ success: 0, url: "/add" })
                }

                res.redirect("/settings/action")

                recording_logosystem(1, req.user.name, ' ?????????? ??????????/ ????????????  : ' + doc.name)


            })
        }


    })









})
router.post("/add_category", cheakUser, (req, res) => {


    category.findOne({ name: req.body.name }).exec(async (err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=?????????????? ?????????? ????????????");


        }
        else {


            var image = ''

            if (req.files) {

                image = await bufferToImageV2(req.files.image)


            }


            new category({

                name: req.body.name,
                image: image

            }).save((err, doc) => {

                if (err) {
                    return res.send({ success: 0, url: "/add" })
                }

                res.redirect("/settings/action")
                recording_logosystem(1, req.user.name, ' ?????????? ??????????  : ' + req.body.name)



            })
        }


    })









})

router.post("/add_sucategory", cheakUser, (req, res) => {



    subcategory.findOne({ name: req.body.name, link: req.body.link }).exec(async (err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=?????????????? ?????????? ????????????");


        }
        else {


            if (typeof (req.body.images) != "undefined")
                var image = await save_base64(req.body.images[0], "images")




            new subcategory({

                name: req.body.name,
                link: req.body.link,
                image: image.split('/')[1]

            }).save((err, doc) => {

                if (err) {
                    console.log(req.body.images)
                    return res.send({ success: 0, url: "/add" })
                }
                else {
                    recording_logosystem(1, req.user.name, '  ?????????? ?????????? ????????  : ' + req.body.name)
                    return res.send({ success: 1, url: "/add" })
                }




            })
        }


    })









})
router.post("/add_susucategory", cheakUser, (req, res) => {



    subsubcategory.findOne({ name: req.body.name, link: req.body.link }).exec(async (err, doc) => {


        if (doc) {

            res.redirect("/settings/action?massage=?????????????? ?????????? ????????????");


        }
        else {


            if (typeof (req.body.images) != "undefined")
                var image = await save_base64(req.body.images[0], "images")


            new subsubcategory({

                name: req.body.name,
                link: req.body.link,
                image: image.split('/')[1]
            }).save((err, doc) => {

                if (err) {
                    return res.send({ success: 0, url: "/add" })
                }
                else {
                    recording_logosystem(1, req.user.name, '   ?????????? ?????????? ???????? ??????????  : ' + req.body.name)
                    return res.send({ success: 1, url: "/add" })
                }




            })
        }


    })









})

router.post("/add_banner", cheakUser, async(req, res) => {


   


       
       


            var image = ''

            if (req.files) {

                image = await bufferToImageV2(req.files.img)


            }

           

            new banner({

             
                product:req.body.product,
                image: image,

            }).save((err, doc) => {

              

                res.redirect("/banners")
                recording_logosystem(1, req.user.name, ' ?????????? ??????')



            })
        


    









})

router.post("/add_revenues_type", cheakUser, (req, res) => {


    revenues_types.findOne({ name: req.body.name }).exec((err, doc) => {


        if (doc) {

            res.redirect("/settings/accounting?massage=?????????? ?????????? ????????????");


        }
        else {



            new revenues_types({

                name: req.body.name,


            }).save((err, doc) => {


                res.redirect("/settings/accounting")

                recording_logosystem(1, req.user.name, ' ?????????? ?????? ??????????  : ' + req.body.name)


            })
        }


    })









})
router.post("/add_expenses_type", cheakUser, (req, res) => {


    expenses_types.findOne({ name: req.body.name }).exec((err, doc) => {


        if (doc) {

            res.redirect("/settings/accounting?massage=?????????? ?????????? ????????????");


        }
        else {



            new expenses_types({

                name: req.body.name,


            }).save((err, doc) => {


                res.redirect("/settings/accounting")

                recording_logosystem(1, req.user.name, ' ?????????? ?????? ??????????????  : ' + req.body.name)

            })
        }


    })









})

router.post("/settings/delete_action", cheakUser, (req, res) => {

    action.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")
        recording_logosystem(3, req.user.name, ' ?????? ??????  : ' + doc.name)
    })
})
router.post("/settings/delete_time", cheakUser, (req, res) => {

    delivery_date_selection.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")
        recording_logosystem(3, req.user.name, ' ?????? ???????? ??????  : ' + doc.time)
    })
})
router.post("/settings/delete_warehouse", cheakUser, (req, res) => {

    warehouse.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")
        recording_logosystem(3, req.user.name, ' ?????? ??????????/????????  :' + doc.name)
    })
})
router.post("/settings/delete_illness", cheakUser, (req, res) => {

    Illness.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")
        recording_logosystem(3, req.user.name, ' ?????? ??????????/??????????  : ' + doc.name)
    })
})
router.post("/settings/delete_category", cheakUser, (req, res) => {

    category.findByIdAndDelete(req.body.id, async (err, doc) => {



        subcategory.deleteMany({ link: req.body.id }, async (err) => {




            res.redirect("/settings/action")

            recording_logosystem(3, req.user.name, ' ?????? ??????   : ' + doc.name)
        })
    })
})
router.post("/delete_subcategory", cheakUser, (req, res) => {

    subcategory.findByIdAndDelete(req.body.id, async (err, doc) => {



        subsubcategory.deleteMany({ link: req.body.id }, function (err) {
            res.redirect("/settings/action")
        })

        recording_logosystem(3, req.user.name, ' ?????? ??????????   : ' + doc.name)
    })
})
router.post("/delete_subsubcategory", cheakUser, (req, res) => {

    subsubcategory.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")

        recording_logosystem(3, req.user.name, ' ?????? ?????????? ??????????   : ' + doc.name)
    })
})
router.post("/findsubs", cheakUser, async (req, res) => {

    var id = req.body.id || ''


    var _subcategory = await subcategory.find({ link: id }).lean()







    res.send({ success: 1, subcategory: _subcategory })
})
router.post("/findsubsub", cheakUser, async (req, res) => {

    var id = req.body.id || ''


    var _subcategory = await subsubcategory.find({ link: id }).lean()







    res.send({ success: 1, subcategory: _subcategory })
})
router.post("/settings/delete_revenue", cheakUser, (req, res) => {

    revenues_types.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")
        recording_logosystem(3, req.user.name, ' ?????? ?????? ??????????????   : ' + doc.name)
    })
})
router.post("/settings/delete_expenses", cheakUser, (req, res) => {

    expenses_types.findByIdAndDelete(req.body.id, async (err, doc) => {

        res.redirect("/settings/action")

        recording_logosystem(3, req.user.name, ' ?????? ?????? ??????????????   : ' + doc.name)
    })
})

















router.post('/add_employees', cheakUser, (req, res) => {



    employee.findOne({ name: req.body.name }).exec((err, doc) => {

        if (doc) {
            res.send({ success: 0, mass: '?????? ???????????? ?????????? ????????????' })
        }

        else {


            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.pwd, salt, (err, hash) => {
                    action.find({}).exec((err, docs) => {

                        var col = '3e8e41';
                        for (var i = 0; i < docs.length; i++) {
                            if (req.body.action == docs[i].name)
                                col = docs[i].color
                        }
                        if (req.body.image != "") {





                            save_base64(req.body.image, "images", (filename) => {



                                var data = {

                                    name: req.body.name,
                                    pwd: hash,
                                    job: req.body.job,
                                    phone: req.body.phone,
                                    email: req.body.email,
                                    image: filename,
                                    salary: req.body.salary,
                                    all: req.body.all,
                                    doctor: req.body.doctor,
                                    add: req.body.add,
                                    nures: req.body.nures,
                                    add: req.body.add,
                                    pharmacy: req.body.pharmacy,
                                    analytic: req.body.analytic,
                                    accounts: req.body.accounts,
                                    setting: req.body.setting,
                                    action: req.body.action,
                                    presentation: req.body.presentation,
                                    col: col

                                }

                                new employee(data).save((err) => {

                                    if (err) {
                                        res.send({ success: 0 })
                                    }
                                    else {

                                        res.send({ success: 1 })
                                        recording_logosystem(1, req.user.name, ' ?????????? ????????  ???????? : ' + req.body.name)
                                    }
                                })
                            })
                        }
                        else {
                            var data = {

                                name: req.body.name,
                                pwd: hash,
                                job: req.body.job,
                                phone: req.body.phone,
                                email: req.body.email,
                                image: '',
                                salary: req.body.salary,
                                all: req.body.all,
                                delivery: req.body.delivery,
                                add: req.body.add,
                                orders: req.body.orders,
                                add: req.body.add,
                                pharmacy: req.body.pharmacy,
                                analytic: req.body.analytic,
                                accounts: req.body.accounts,
                                setting: req.body.setting,
                                action: req.body.action,
                                presentation: req.body.presentation,
                                col: col
                            }
                            new employee(data).save((err) => {

                                if (err) {
                                    res.send({ success: 0, mass: '?????? ?????? ???????? ???????????? ?????????????? ??????????' })
                                }
                                else {

                                    res.send({ success: 1 })
                                    recording_logosystem(1, req.user.name, ' ?????????? ????????  ???????? : ' + req.body.name)
                                }
                            })
                        }
                    })
                })
            })
        }
    })


})
router.post('/add_fixed', cheakUser, (req, res) => {

    salary.findOne({ name: req.body.name }).exec((err, doc) => {

        if (doc) {
            res.send({ success: 2 })
        }
        else {
            new salary({
                name: req.body.name,
                salary_: req.body.salary_
            }).save((err) => {
                if (!err) {
                    salary.find({}).sort([['date', -1]]).exec((err, doc) => {

                        res.send({ success: 1, doc: doc })
                        recording_logosystem(1, req.user.name, ' ?????????? ?????????? ?????????????? ?????????? : ' + req.body.name)

                    })
                }
                else
                    res.send({ success: 3 })
            })
        }

    })


})
router.post('/add_withdraw', cheakUser, (req, res) => {

    new withdraw({
        price: parseFloat(req.body.price),
        date: req.body.date,
        data_entry_name: req.user.name,
    }).save(() => {
        res.redirect("back")
        recording_logosystem(5, req.user.name, ' ?????? ???????? withdraw : ' + parseFloat(req.body.price))
    })

})
router.post("/delete_fixed", cheakUser, (req, res) => {

    salary.findByIdAndDelete(req.body.id, async (err, doc) => {
        if (err) {
            res.send({ success: 2 })
        }
        else {

            salary.find({}).sort([['date', -1]]).exec((err, doc) => {

                res.send({ success: 1, doc: doc })
                recording_logosystem(3, req.user.name, ' ?????? ?????????? ???? ?????????????????? ??????????????  : ' + doc.name)

            })
        }
    })
})

router.post('/add_medication', cheakUser, (req, res) => {




    try {

        medication.findOne({ name_en: req.body.name_en }).exec(async (err, doc) => {


            if (doc) {
                res.send({ success: 2, mss: '?????? ???????????? ?????????? ????????????' })
            }
            else {


                var images = []





                if (typeof (req.body.images) != "undefined")
                    for (let index = 0; index < req.body.images.length; index++) {

                        images.push(await save_base64(req.body.images[index], "images"))

                    }


                new medication({
                    name_en: req.body.name_en,
                    name_ar: req.body.name_ar,
                    data_entry_name: req.user.name,
                    history: req.body.history.split(',').join(' '),
                    details_ar: req.body.details_ar,
                    details_en: req.body.details_en,

                    latest_date: getdate(),
                    category: req.body.category,
                    images: images
                }).save((err, doc) => {
                    if (!err) {



                        if (req.body.number > 0) {

                            var leftinstock = (req.body.price_sheet > 0 && req.body.sheet > 0) ? req.body.sheet * req.body.number : req.body.number;

                            new stock({
                                name_en: req.body.name_en,
                                name_ar: req.body.name_ar,

                                data_entry_name: req.user.name,
                                history: req.body.history.split(',').join(' '),
                                details_ar: req.body.details_ar,
                                details_en: req.body.details_en,
                                category: req.body.category,
                                subcategory: req.body.subcategory,
                                subsubcategory: req.body.subsubcategory,
                                images: images,
                                bar_code: req.body.bar_code,
                                sheet: req.body.sheet,
                                price: req.body.price,
                                price_sheet: req.body.price_sheet,
                                medical_reserve: req.body.medical_reserve,
                                quantity: req.body.number,
                                leftinstock: leftinstock,
                                expire_date: req.body.expire_date,
                                warehouse: req.body.warehouce,
                                shelf: req.body.shelf,
                                active: true,
                                avg: 0,
                                countRate: 0,
                                buy_price: req.body.eliteprice,
                                size: req.body.size,
                                date: getdate(),
                                medication: doc.id,

                            }).save((err) => {


                                res.send({ success: 1, mss: '???? ?????????? ???????????? ?????? ???????????? ' })
                                recording_logosystem(1, req.user.name, ' ?????????? ???????? ???????? ?????? ????????????  : ' + req.body.name_en)
                            })
                        }
                        else {
                            res.send({ success: 2, mss: "???????????? ?????????????? ?????????? ??????????????" })
                            recording_logosystem(1, req.user.name, ' ?????????? ???????? ????????  : ' + req.body.name_en)

                        }
                    }
                    else {
                        res.send({ success: 2, mss: '?????? ?????? ???????? ???????????? ?????????????? ?????????? *' })
                    }
                })

            }
        })

    } catch (err) {

        res.send({ success: 2, mss: err })
    }


})

router.post('/edit_stock', cheakUser, (req, res) => {

    active = (typeof (req.body.active) != 'undefined' && req.body.active == 'on')

    stock.findById(req.body.id).exec((err, doc) => {
        if (doc) {

            doc.expire_date = req.body.expire_date
            doc.shelf = req.body.shelf
            doc.price = req.body.price
            doc.price_offer = req.body.price_offer
            doc.shelf = req.body.shelf
            doc.bar_code = req.body.bar_code
            doc.warehouse = req.body.warehouse
            doc.leftinstock = req.body.leftinstock
            doc.data_entry_name = req.user.name
            doc.active = active
            doc.save(() => {


                res.redirect('back')
                recording_logosystem(2, req.user.name, '   ?????????? ?????? ???????????? ???? ???????????? ????????   : ' + doc.name_ar)
            })

        }
        else {
            res.send('error :id is not correct')
        }

    })
})

router.post('/add_expenses', cheakUser, async (req, res) => {


    var image_name = ""




    if (req.files) {
        if (req.files.image != undefined) {
            try {
                image_name = await bufferToImage(req.files.image, "images")


            } catch (error) {

            }
        }
    }

    var data = {

        type: req.body.type,
        name: req.body.name,
        details: req.body.details,
        price: req.body.price,
        date: req.body.date,
        data_entry_name: req.user.name,
        image: image_name
    }



    new expenses(data).save(() => {

        res.redirect("back")
        recording_logosystem(6, req.user.name, '  ?????????? ??????????????  : ' + parseFloat(req.body.price))
    })



})


router.post('/add_fixed_expenses', cheakUser, async (req, res) => {



    var _salary = await salary.find({})


    var pr2 = 0;

    var table = `<br>`


    for (var i = 0; i < _salary.length; i++) {
        pr2 = pr2 + _salary[i].salary_
        table = table + _salary[i].name + " : " + _salary[i].salary_ + "<br>"
    }


    var data = {


        type: "??????????????",
        name: "???????????????? ??????????????",
        details: table,
        price: pr2,
        date: req.body.date,
        data_entry_name: req.user.name,

    }




    new expenses(data).save(() => {


        res.redirect("back")
        recording_logosystem(6, req.user.name, '  ?????????? ?????????????? ??????????  : ' + parseFloat(req.body.price))
    })



})

router.post('/delete_expenses', cheakUser, async (req, res) => {


    expenses.findByIdAndDelete(req.body.id, async (err, doc) => {
        if (err) {
            res.send({ success: 2 })
        }
        else {



            res.redirect('back')
            recording_logosystem(12, req.user.name, '  ?????? ?????????????? ????????   : ' + parseFloat(doc.price))


        }
    })





})


router.post('/add_revenues', cheakUser, (req, res) => {


    if (req.body.doc_id != '') {
        if (req.body.proportion <= 100 && req.body.proportion > 0) {
            add_debit_employee(req.body.doc_id, req.body.name, (req.body.price * (req.body.proportion / 100)).toFixed(2), req.user.name, req.body.details)
        }
    }
    new revenues({
        type: req.body.type,
        name: req.body.name,
        details: req.body.details,
        price: req.body.price,
        date: req.body.date,
        data_entry_name: req.user.name,

    }).save(() => {


        res.redirect("back")
        recording_logosystem(7, req.user.name, '  ?????????? ???????????? ??????????   : ' + parseFloat(req.body.price))

    })




})


router.post('/add_date', cheakUser, async (req, res) => {


    var target = await patient.findOne({ name: req.body.name });

    var patient_id = (target != null) ? target.id : "";

    new appointments({

        name: req.body.name,
        phone_number: req.body.phone_number,
        reason: req.body.reason,
        patient_id: patient_id,
        action: req.body.action,
        time: req.body.time,
        date: req.body.date,
        data_entry_name: req.user.name,

    }).save(async (err) => {




        if (err) {
            res.send({ success: 2, err: err })
        }
        else {

            if (target != null) {
                target.last_appo = new Date(req.body.date)
                await target.save()
            }


            res.send({ success: 1 })
            recording_logosystem(1, req.user.name, '   ?????????? ???????? ????????    : ' + req.body.name)
        }

    })
})

router.post('/sginin_date', cheakUser, (req, res) => {




    appointments.findById(req.body.id).exec((err, doc_) => {

        if (doc_) {
            if (doc_.patient_id != '') {
                patient.findById(doc_.patient_id).exec((err, doc) => {




                    action.findOne({ name: doc_.action }).exec((err, doc2) => {


                        if (doc2) {
                            doc.action = doc2.name
                            doc.action_color = doc2.color
                            doc.date_entry = getdate();
                            doc.save((err, doc) => {
                                if (err) {
                                    res.send({ success: 2, err: err })
                                }
                                else {

                                    appointments.findByIdAndDelete(req.body.id, () => {

                                        res.send({ success: 1 })
                                        req.app.settings.io.emit("info", "update")
                                    })



                                }



                            })
                        }
                        else {
                            doc.action = "?????? ??????????"
                            doc.action_color = "7bd4b3"
                            doc.date_entry = getdate();
                            doc.save((err, doc) => {
                                if (err) {
                                    res.send({ success: 2, err: err })
                                }
                                else {

                                    appointments.findByIdAndDelete(req.body.id, () => {

                                        res.send({ success: 1 })
                                        req.app.settings.io.emit("info", "update")
                                        recording_logosystem(9, req.user.name, '   ?????????? ???????? ???????? ?????? ??????????    : ' + doc.action)
                                    })



                                }



                            })
                        }


                    });
                })

            }
            else {
                res.send({ success: 2 })
            }


        }
        else {
            res.send({ success: 2 })
        }

    })
})


router.post('/delete_date', cheakUser, (req, res) => {


    appointments.findByIdAndDelete(req.body.id, (err, doc) => {
        if (err) {
            res.send({ success: 2 })
        }
        else {



            res.send({ success: 1 })
            recording_logosystem(9, req.user.name, '   ?????? ???????? ????????   : ' + doc.name)

        }
    })





})


router.post('/Casher', cheakUser, (req, res) => {




    stock.findOne({ bar_code: req.body.bar_code }).where("leftinstock").gt(0).lean().exec((err, doc) => {

        if (doc) {

            if (doc.price_offer > 0)
                doc.price = doc.price_offer

            res.send({ success: 1, data: doc })
        }
        else {
            stock.findById(req.body.bar_code).where("leftinstock").gt(0).lean().exec((err, doc) => {

                if (doc) {

                    if (doc.price_offer > 0)
                        doc.price = doc.price_offer

                    res.send({ success: 1, data: doc })
                }

            })
        }

    })


})

router.post('/casher_accounting', cheakUser, async (req, res) => {

    var discount = req.body.discount || 0

    if (req.body.name_client.length <= 0 || req.body.item_array.length <= 0 || req.body.time_slot.length <= 0 || req.body.location.length <= 0)
        return res.send({ success: 0, mass: '  ?????? ???????? :  ?????????????????? ???????????????? ?????? ??????????  ' })

    var stop = false;


    var meds = JSON.parse(req.body.item_array)
    for (var i = 0; i < meds.length; i++) {
        var single_stock = await stock.findById(meds[i].id)

        if (meds[i].type == 0 && single_stock.sheet > 0)//type sheet // sale the full box with the number of sheets init
        {
            if (single_stock.leftinstock - (meds[i].count * single_stock.sheet) < 0) {
                stop = true;
            }
        }
        else if (meds[i].type == 1 && single_stock.sheet > 0)//type sheet // sale the sheets 
        {
            if (single_stock.leftinstock - meds[i].count < 0) {
                stop = true;
            }
        }
        else if (meds[i].type == 0 && single_stock.sheet <= 0)//type sheet // sale the sheets 
        {
            if (single_stock.leftinstock - meds[i].count < 0) {
                stop = true;
            }
        }

    }

    if (!stop) {
        for (var i = 0; i < meds.length; i++) {
            var single_stock = await stock.findById(meds[i].id)

            if (meds[i]._type == 0 && single_stock.sheet > 0)//type sheet // sale the full box with the number of sheets init
            {
                single_stock.leftinstock = single_stock.leftinstock - (meds[i].count * single_stock.sheet)
            }
            else if (meds[i]._type == 1 && single_stock.sheet > 0)//type sheet // sale the sheets 
            {
                single_stock.leftinstock = single_stock.leftinstock - (meds[i].count)
            }
            else if (meds[i]._type == 0 && single_stock.sheet <= 0)//type sheet // sale the sheets 
            {
                single_stock.leftinstock = single_stock.leftinstock - (meds[i].count)
            }
            await single_stock.save()
        }


        placeorder(req.body.name_client, discount, req.user.name, meds, req.body.time_slot, req.body.location, req.body.phone_number)
        res.send({ success: 1, mass: '???? ?????????? ?????????? ?????? ??????????????' })
    }
    else {
        res.send({ success: 0, mass: '  ?????? ???????? : ?????????? ???????? ???????????? ?????? ???????? ???????? ???????????????? ?????????????? ?????????? ' })
    }




})


router.post('/update_general', cheakUser, (req, res) => {



    general.findOne({}).exec(async (err, doc) => {



        if (req.files) {

            var image = await bufferToImageV2(req.files.img)
            doc.img = image;

        }
        doc.name = req.body.name;
        doc.name_en = req.body.name_en;
        doc.phone = req.body.phone;
        doc.phone_two = req.body.phone_two;
        doc.color = req.body.color;
        doc.location = req.body.location;

        doc.save((err) => {

            if (err) {
                res.send('error save edit the new data')
            }
            else {
                res.redirect('/settings/general')
                recording_logosystem(2, req.user.name, '?????????? ?????????????? ????????')
            }

        })

    })



})
router.post('/add_creditor_patient', cheakUser, (req, res) => {

    var patient_id = req.body.patient_id || ''


    patient.findById(patient_id).exec((err, doc) => {


        if (doc) {


            creditor.findOne({ payment_entry: false, patient: patient_id }).exec(async (err, old_creditor) => {


                if (old_creditor) {


                    new creditor_element({
                        creditor: old_creditor.id,
                        name: req.body.name,
                        details: req.body.details,
                        price: req.body.price,
                        data_entry_name: req.user.name,

                    }).save((err, doc) => {
                        if (err)
                            res.send(err)
                        else {

                            res.redirect('/patient_account?id=' + patient_id + '&mass2=' + old_creditor.bar_code)
                            recording_logosystem(10, req.user.name, '?????????? ???????? ?????????? : ' + req.body.price)
                        }
                    })

                } else {





                    new creditor({
                        type: 1,
                        name: doc.name,
                        bar_code: getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 5000),
                        company: '',
                        phone: doc.phone_number,
                        discount: 0,
                        details: '',
                        patient: doc.id,
                        data_entry_name: req.user.name,
                    }).save((err, creditor_doc) => {

                        if (err) {
                            res.send(err)
                        } else {



                            new creditor_element({
                                creditor: creditor_doc.id,
                                name: req.body.name,
                                details: req.body.details,
                                price: req.body.price,
                                data_entry_name: req.user.name,

                            }).save((err) => {
                                if (err)
                                    res.send(err)
                                else {

                                    res.redirect('/patient_account?id=' + patient_id + '&mass=' + 'true')
                                    recording_logosystem(10, req.user.name, '?????????? ???????? ?????????? : ' + req.body.price)
                                }
                            })


                        }
                    })
                }
            })


        }
        else {
            res.send('???????? ???? ?????????????? ?????????????? ????????????')
        }

    })

})
router.post('/catch_receipt', cheakUser, (req, res) => {
    var _creditor = req.body.creditor || ''
    var paid = req.body.price || 0
    var debit = req.body.debit || "false"




    paid = parseFloat(parseFloat(paid).toFixed(2))

    var alert = ''
    if (req.body.alert == 'd7') {
        alert = Date_offset(new Date(), 7)
    }
    else if (req.body.alert == 'd14') {
        alert = Date_offset(new Date(), 14)
    }
    else if (req.body.alert == 'd30') {
        alert = Date_offset(new Date(), 30)
    }




    creditor.findById(_creditor).exec(async (err, doc) => {
        if (doc) {
            //alert 



            //full price
            var full_price = 0
            var price_element = await creditor_element.find({ creditor: doc.id })
            for (let i = 0; i < price_element.length; i++) {
                full_price = full_price + price_element[i].price
            }
            //Paid price 
            var Paid_price = 0
            var Paid_element = await creditor_paid.find({ creditor: doc.id })
            for (let i = 0; i < Paid_element.length; i++) {
                Paid_price = Paid_price + Paid_element[i].price
            }
            if (paid > 0) {
                if (paid + Paid_price > full_price - doc.discount)
                    return res.send({ success: 0, mass: "???????????? ?????????????? ???????? ???? ????????????????" + (paid + Paid_price) + " " })

                console.log(paid + Paid_price)




                new creditor_paid({
                    creditor: doc.id,
                    price: paid,
                    data_entry_name: req.user.name
                }).save((err, creditor_paid_doc) => {
                    if (!err) {
                        doc.payment_entry = true;

                        if (paid + Paid_price == full_price - doc.discount) {
                            doc.complete = true;
                            if (doc.debit)
                                recording_logosystem(11, req.user.name, ' ?????????? ?????????? ?????? ?????????????? ???????????? : ' + doc.bar_code + ", ?????????? : " + paid + ', ???? ?????? ?????????????? ?? ?????????????? ?????????????? ???????? ????????????')
                            else
                                recording_logosystem(10, req.user.name, '?????????? ?????????? ?????? ?????????????? ???????????? : ' + doc.bar_code + ", ?????????? : " + paid + ', ???? ?????? ?????????????? ?? ?????????????? ?????????????? ???????? ????????????')
                        }
                        else {
                            if (doc.debit)
                                recording_logosystem(10, req.user.name, '?????????? ?????????? ?????? ?????????????? ???????????? : ' + doc.bar_code + ", ?????????? : " + paid)
                            else
                                recording_logosystem(10, req.user.name, '?????????? ?????????? ?????? ?????????????? ???????????? : ' + doc.bar_code + ", ?????????? : " + paid)
                        }

                        doc.alert_ = alert

                        doc.save((err) => {
                            if (!err) {


                                //add revenue
                                if (debit == 'false') {
                                    new revenues({
                                        type: '?????????? ????????',
                                        name: " ??????????  : " + doc.name,
                                        details: "?????????? ???? ?????????????? " + _creditor.bar_code,
                                        price: paid,
                                        link: creditor_paid_doc.id,
                                        date: getdate(),
                                        data_entry_name: req.user.name,
                                    }).save(() => {
                                        res.send({ success: 1 })
                                    })
                                } else {
                                    var data = {

                                        type: '?????? ????????',
                                        name: " ?????? :  " + doc.name,
                                        details: "?????? ???? ?????????????? " + _creditor.bar_code,
                                        price: req.body.price,
                                        link: creditor_paid_doc.id,
                                        date: getdate(),
                                        data_entry_name: req.user.name,
                                        image: ''
                                    }



                                    new expenses(data).save(() => {

                                        res.send({ success: 1 })
                                    })
                                }
                            }
                        })

                    }
                })
            }
            else {
                res.send({ success: 0, mass: '???????????? ?????? ???? ???????? ???????? ???? ??????' })
            }
        }
        else {
            res.send({ success: 0, mass: '???????? ???? ?????????????? ?????????????? ??????????????' })
        }
    })
})

router.post('/add_creditor', cheakUser, (req, res) => {


    var paid = parseFloat(req.body.paid) || 0
    var type = req.body.type || 0

    if (parseFloat(req.body.price) < parseFloat(paid)) {
        return res.redirect('/creditor?mass2=???????? ???????????? ???????????? ???????? ???? ???????????? ?? ')
    }
    else if (req.body.name == '' || req.body.name == '') {
        return res.redirect('/creditor?mass2=?????? ???????? ???????? ???????????? ?????????????? ??????????')
    }
    else {

        var alert = ''
        if (req.body.alert == 'd7') {
            alert = Date_offset(new Date(), 7)
        }
        else if (req.body.alert == 'd14') {
            alert = Date_offset(new Date(), 14)
        }
        else if (req.body.alert == 'd30') {
            alert = Date_offset(new Date(), 30)
        }


        new creditor({
            type: type,
            name: req.body.title,
            bar_code: getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 5000),
            company: req.body.company,
            phone: req.body.phone_number,
            discount: req.body.discount,
            alert_: alert,
            patient: '',
            data_entry_name: req.user.name,
        }).save((err, creditor_doc) => {

            if (err) {
                res.send(err)
            } else {

                new creditor_element({
                    creditor: creditor_doc.id,
                    name: req.body.name,
                    details: req.body.details,
                    price: req.body.price,
                    data_entry_name: req.user.name,

                }).save((err) => {
                    if (err)
                        res.send(err)
                    else {

                        recording_logosystem(10, req.user.name, '?????????? ???????? ?????????? : ' + req.body.price)
                        if (paid > 0) {
                            new creditor_paid({
                                creditor: creditor_doc.id,
                                price: paid,
                                data_entry_name: req.user.name
                            }).save((err, creditor_paid_doc) => {

                                new revenues({
                                    type: '?????????? ????????',
                                    name: " ?????????? ???????? ????????????  : " + creditor_doc.name,
                                    details: "?????????? ???? ?????????????? " + creditor_doc.bar_code,
                                    price: paid,
                                    link: creditor_paid_doc.id,
                                    date: getdate(),
                                    data_entry_name: req.user.name,
                                }).save(() => {
                                    return res.redirect('/creditor?mass=true')
                                })

                            })

                        }
                        else
                            return res.redirect('/creditor?mass=true')
                    }
                })
            }
        })
    }
})
router.post('/add_debit', cheakUser, (req, res) => {


    var paid = parseFloat(req.body.paid) || 0
    var type = req.body.type || 0

    if (parseFloat(req.body.price) < parseFloat(paid)) {
        console.log("" + req.body.price + ": " + paid)
        return res.redirect('/debit?mass2=???????? ???????????? ???????????? ???????? ???? ???????????? ?? ')
    }
    else if (req.body.name == '' || req.body.name == '') {
        return res.redirect('/debit?mass2=?????? ???????? ???????? ???????????? ?????????????? ??????????')
    }
    else {

        var alert = ''
        if (req.body.alert == 'd7') {
            alert = Date_offset(new Date(), 7)
        }
        else if (req.body.alert == 'd14') {
            alert = Date_offset(new Date(), 14)
        }
        else if (req.body.alert == 'd30') {
            alert = Date_offset(new Date(), 30)
        }


        new creditor({
            type: type,
            name: req.body.title,
            bar_code: getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 5000),
            company: req.body.company,
            phone: req.body.phone_number,
            discount: req.body.discount,
            alert_: alert,
            patient: '',
            debit: true,
            data_entry_name: req.user.name,
        }).save((err, creditor_doc) => {

            if (err) {
                res.send(err)
            } else {

                new creditor_element({
                    creditor: creditor_doc.id,
                    name: req.body.name,
                    details: req.body.details,
                    price: req.body.price,
                    data_entry_name: req.user.name,

                }).save((err) => {
                    if (err)
                        res.send(err)
                    else {
                        recording_logosystem(11, req.user.name, '?????????? ???????? ?????????? : ' + req.body.price)
                        if (paid > 0) {
                            new creditor_paid({
                                creditor: creditor_doc.id,
                                price: paid,
                                data_entry_name: req.user.name
                            }).save((err, creditor_paid_doc) => {
                                var data = {

                                    type: '?????? ????????',
                                    name: "  ???????????? ???????????? ???????? :  " + creditor_doc.name,
                                    details: "?????? ???? ?????????????? " + creditor_doc.bar_code,
                                    price: paid,
                                    link: creditor_paid_doc.id,
                                    date: getdate(),
                                    data_entry_name: req.user.name,
                                    image: ''
                                }



                                new expenses(data).save(() => {

                                    return res.redirect('/debit?mass=true')
                                })

                            })

                        }
                        else
                            return res.redirect('/debit?mass=true')
                    }
                })
            }
        })
    }
})
function add_debit_employee(id = '', name, _price, user_name, details, callback = () => { }) {
    var price = parseFloat(_price)

    if (id == '')
        return callback('no id')


    employee.findById(id).exec((err, doc) => {


        if (doc) {


            creditor.findOne({ payment_entry: false, patient: id, debit: true }).exec(async (err, old_creditor) => {


                if (old_creditor) {


                    new creditor_element({
                        creditor: old_creditor.id,
                        name: name,
                        details: details,
                        price: price,
                        data_entry_name: user_name,

                    }).save((err, doc) => {
                        if (err)
                            callback(err)
                        else {

                            callback(null)
                        }
                    })

                } else {





                    new creditor({
                        type: 1,
                        name: doc.name,
                        bar_code: getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 5000),
                        company: '',
                        phone: '',
                        discount: 0,
                        details: '',
                        patient: doc.id,
                        data_entry_name: user_name,
                        debit: true
                    }).save((err, creditor_doc) => {

                        if (err) {
                            callback(err)
                        } else {



                            new creditor_element({
                                creditor: creditor_doc.id,
                                name: name,
                                details: details,
                                price: price,
                                data_entry_name: user_name,

                            }).save((err) => {
                                if (err)
                                    callback(err)
                                else {
                                    recording_logosystem(11, req.user.name, '?????????? ???????? ?????????? : ' + price)
                                    callback(null)
                                }
                            })


                        }
                    })
                }
            })


        }
        else {
            callback('???????? ???? ?????????????? ?????????????? ????????????')
        }

    })

}

router.post('/add_room', cheakUser, (req, res) => {

    room.findOne({ floor: req.body.floor, room: req.body.room }).exec((err, doc) => {


        if (doc) {
            res.send({ success: 0 })
        }
        else {

            if (Math.ceil(req.body.floor) > 0 && Math.ceil(req.body.room) > 0 && Math.ceil(req.body.beds) > 0) {


                new room({
                    floor: Math.ceil(req.body.floor),
                    room: Math.ceil(req.body.room),
                    beds: Math.ceil(req.body.beds),
                }).save((err) => {
                    if (err) {

                        console.log(err)
                    }
                    else {
                        res.send({ success: 1 })
                        recording_logosystem(1, req.user.name, '?????????? ???????? ??????????')
                    }
                })
            }
            else {

                res.send({ success: 0 })
            }
        }

    })
})
router.post('/delete_room', cheakUser, (req, res) => {


    room.findByIdAndDelete(req.body.id, (err) => {
        if (err) {
            res.send('?????? ???????? ')
        }
        else {


            recording_logosystem(3, req.user.name, '?????? ????????')
            res.redirect('/settings/general')


        }
    })





})
//serches /////////////////////////////////////////////////////////////////////////////////////////
router.post("/serach_creditor", cheakUser, async (req, res) => {





    var query = { "$or": [{ "name": { $regex: req.body.serach } }, { "company": { $regex: req.body.serach } }, { "bar_code": req.body.serach }] }

    query.complete = false;
    query.debit = false;

    if (req.body.type != -1)
        query.type = req.body.type

    if (req.body.filter == '??????????????') {
        query.alert_ = { $lt: getdate() }


        var cre = await creditor.find(query).lean().sort([['createdAt', -1]]).where("alert_").ne('')
    }
    else {
        var cre = await creditor.find(query).lean().sort([['createdAt', -1]])
    }




    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_element_ = await creditor_element.find({ creditor: cre[i]._id })
        for (let y = 0; y < creditor_element_.length; y++) {
            sub_total = sub_total + creditor_element_[y].price


        }
        var sub_total2 = 0;
        var creditor_paid_ = await creditor_paid.find({ creditor: cre[i]._id })
        for (let y = 0; y < creditor_paid_.length; y++) {
            sub_total2 = sub_total2 + creditor_paid_[y].price

        }

        if (new Date(cre[i].alert_) < new Date()) {
            cre[i].late = '<div class="tag" style="background-color:#feb631">?????????? : ' + Math.floor((new Date().getTime() - new Date(cre[i].alert_).getTime()) / (1000 * 3600 * 24)) + " ?????? </div>";
        }
        else {
            if (cre[i].alert_ != '')
                cre[i].late = '<div class="tag">?????? ??????????????  ' + cre[i].alert_ + "</div>"
            else
                cre[i].late = '????????'
        }


        cre[i].total_price = sub_total
        cre[i].total_paid = sub_total2
    }



    res.send({ success: 1, creditor: cre })
})
router.post("/serach_debit", cheakUser, async (req, res) => {





    var query = { "$or": [{ "name": { $regex: req.body.serach } }, { "company": { $regex: req.body.serach } }, { "bar_code": req.body.serach }] }

    query.debit = true;
    query.complete = false;




    if (req.body.type != -1 && req.body.type != 3)
        query.type = req.body.type

    if (req.body.type == 3) {
        query.company = { "$ne": '' }
    }

    if (req.body.filter == '??????????????')
        query.alert_ = { $lt: getdate() }

    var cre = await creditor.find(query).lean().sort([['createdAt', -1]])



    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_element_ = await creditor_element.find({ creditor: cre[i]._id })
        for (let y = 0; y < creditor_element_.length; y++) {
            sub_total = sub_total + creditor_element_[y].price


        }
        var sub_total2 = 0;
        var creditor_paid_ = await creditor_paid.find({ creditor: cre[i]._id })
        for (let y = 0; y < creditor_paid_.length; y++) {
            sub_total2 = sub_total2 + creditor_paid_[y].price

        }

        if (new Date(cre[i].alert_) < new Date()) {
            cre[i].late = '<div class="tag" style="background-color:#feb631">?????????? : ' + Math.floor((new Date().getTime() - new Date(cre[i].alert_).getTime()) / (1000 * 3600 * 24)) + " ?????? </div>";
        }
        else {
            if (cre[i].alert_ != '')
                cre[i].late = '<div class="tag">?????? ??????????????  ' + cre[i].alert_ + "</div>"
            else
                cre[i].late = '????????'
        }


        cre[i].total_price = sub_total
        cre[i].total_paid = sub_total2
    }



    res.send({ success: 1, creditor: cre })
})
router.post("/serach_sales", cheakUser, async (req, res) => {

    var emp = req.body.employee || '????????'
    var type = req.body.type





    var query = { "$or": [{ "name": { $regex: req.body.serach } }, { "company": { $regex: req.body.serach } }, { "bar_code": req.body.serach }] }


    if (emp != '????????')
        query.data_entry_name = emp



    if (req.body.start.length > 0 && req.body.end.length > 0) {
        var startQuery = ""
        var endQuery = ""




        if (moment(req.body.start).isValid()) {
            startQuery = new Date(moment(req.body.start).set({ hours: 0 }))
        }
        if (moment(req.body.end).isValid()) {
            endQuery = new Date(moment(req.body.end).set({ hours: 24 }))
        }

        var cre = await sales.find(query).lean().sort([['createdAt', -1]]).where("createdAt").gt(startQuery).lt(endQuery)
    }
    else {
        var cre = await sales.find(query).lean().limit(50).sort([['createdAt', -1]])
    }






    res.send({ success: 1, creditor: cre })
})
router.post("/serach_archive", cheakUser, async (req, res) => {


    var offset = req.body.offset || 0



    var query = { "$or": [{ "name": { $regex: req.body.serach } }, { "company": { $regex: req.body.serach } }, { "bar_code": req.body.serach }] }

    if (req.body.filter == '????????????')
        query.debit = false;
    else if (req.body.filter == '????????????')
        query.debit = true;

    query.complete = true;






    var cre = await creditor.find(query).lean().sort([['createdAt', -1]]).limit(50)



    for (let i = 0; i < cre.length; i++) {
        var sub_total = 0;
        var creditor_element_ = await creditor_element.find({ creditor: cre[i]._id })
        for (let y = 0; y < creditor_element_.length; y++) {
            sub_total = sub_total + creditor_element_[y].price


        }
        var sub_total2 = 0;
        var creditor_paid_ = await creditor_paid.find({ creditor: cre[i]._id })
        for (let y = 0; y < creditor_paid_.length; y++) {
            sub_total2 = sub_total2 + creditor_paid_[y].price

        }




        cre[i].total_price = sub_total
        cre[i].total_paid = sub_total2
    }



    res.send({ success: 1, creditor: cre })
})
////////////////deletes ///////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/delete_catch_receipt', cheakUser, (req, res) => {


    var debit = req.body.debit || 'false'

    creditor_paid.findByIdAndDelete(req.body.id, (err, doc) => {
        if (err) {
            res.send({ success: 0, mass: '?????? ????????' })
        }
        else {


            if (debit == 'false') {
                revenues.findOneAndDelete({ link: req.body.id }).exec((err) => {
                    res.send({ success: 1 })
                    recording_logosystem(12, req.user.name, ' ?????? ?????????? ???????????? ???????? ??????????  : ' + doc.price)
                })
            }
            else if (debit == 'true') {
                expenses.findOneAndDelete({ link: req.body.id }).exec((err) => {
                    res.send({ success: 1 })
                    recording_logosystem(12, req.user.name, ' ?????? ?????????? ???????????? ???????? ??????????  : ' + doc.price)
                })
            }







        }
    })
})
router.post('/delete_creditor', cheakUser, (req, res) => {

    creditor.findByIdAndDelete(req.body.id, (err, doc) => {
        if (err) {
            res.send('?????? ????????')
        }
        creditor_element.deleteMany({ creditor: req.body.id }, function (err) {
            creditor_paid.deleteMany({ creditor: req.body.id }, function (err) {
                res.send('???? ??????????')
                recording_logosystem(12, req.user.name, ' ?????? ??????????  ?????????? , ?????? ??????????????  : ' + doc.bar_code)
            })
        })

    })
})
router.post('/delete_order_single', cheakUser, (req, res) => {

    id = req.body.id || ''

    order.findByIdAndDelete(req.body.id, (err, doc) => {
        if (err) {
            res.send('?????? ????????')
        }
        else {
            res.send({success : 1})
            recording_logosystem(3, req.user.name, ' ?????? ?????? ???? ???????????? ???? ?????????? ????????:  ' + doc.name)
        }
    })
})



router.post('/accounts_box_data', cheakUser, async (req, res) => {

    var end = req.body.end || ''
    var start = req.body.start || getdate()

    var query_revenues = {};
    var query_expenses = {};

    if (end.length <= 0) {

        query_revenues.date = start
        query_expenses.date = start

        var _revenues = await revenues.find(query_revenues).sort([['createdAt', -1]]).lean()


        if (expenses_type == '??????' || expenses_type == '')
            var _withdraw = await withdraw.find({ date: start }).sort([['createdAt', -1]]).lean()
        else {
            _withdraw = []
        }

        if (expenses_type == '??????') {
            _expenses = []
        }
        else
            var _expenses = await expenses.find(query_expenses).sort([['createdAt', -1]]).lean()





    }
    else {


        var _expenses = await expenses.find({}).sort([['date', -1]]).where('date').gte(start).lte(end).sort([['createdAt', -1]]).lean()
        var _revenues = await revenues.find({}).sort([['date', -1]]).where('date').gte(start).lte(end).sort([['createdAt', -1]]).lean()
        var _withdraw = await withdraw.find({}).sort([['date', -1]]).where('date').gte(start).lte(end).sort([['createdAt', -1]]).lean()
    }





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

    res.send(_expenses)
})

router.post('/get_clinical_reservation', cheakUser, async (req, res) => {

    var record_ = await record.find({ sign_out: false, type: true }).lean()


    res.send({ success: 1, record_: record_ })

})

router.post('/auto_accounting_update', cheakUser, async (req, res) => {

    general.findOne({}).exec((err, doc) => {

        if (doc) {
            if (req.body.accounting_bed_reservation > 0)
                doc.accounting_bed_reservation = req.body.accounting_bed_reservation


            doc.save(() => {

                res.redirect('back')
            })
        }
    })
})

router.post('/delete_stock', cheakUser, async (req, res) => {

    var id = req.body.id || ''


    stock.findByIdAndDelete(id, (err, doc) => {

        if (err) {

            res.send(err)
        }
        else {
            res.send({ success: 1 })

            medication.findByIdAndDelete(doc.medication, (err) => {
                recording_logosystem(3, req.user.name, ' ?????? ???????? ???? ???????????? , ?????? ???????????? : ' + doc.name_ar)
            })


        }
    })

})

router.post("/serach_logo", cheakUser, async (req, res) => {

    var emp = req.body.employee || '????????'

    var type = req.body.type || -1




    var query = {}


    if (emp != '????????')
        query.employee = emp

    if (type != -1)
        query.type_ = parseInt(type)

    if (req.body.start.length > 0 && req.body.end.length > 0) {
        var startQuery = ""
        var endQuery = ""




        if (moment(req.body.start).isValid()) {
            startQuery = new Date(moment(req.body.start).set({ hours: 0 }))
        }
        if (moment(req.body.end).isValid()) {
            endQuery = new Date(moment(req.body.end).set({ hours: 24 }))
        }
    }

    var logs = await logosystem.find(query).lean().sort([['createdAt', -1]]).where("createdAt").gt(startQuery).lt(endQuery)

    res.send({ success: 1, logs: logs })
})

router.post("/serach_orders", cheakUser, async (req, res) => {





    var query = { "$or": [{ "name": { $regex: req.body.serach } }, { "bar_code": req.body.serach }] }

    query._createdAt = getdate()



    var orders = await order_list.find(query, '-warehouse').limit(75).lean()

    res.send({ success: 1, orders: orders })
})


function placeorder(name, discount, data_entry_name, meds, time_slot, location, phone_number) {


    console.log(name)


    var mode = false

    if (time_slot != '????????') {
        var x = (getdate().split('-').join(',') + "," + time_slot.split(':').join(',')).split(',')
        var appo = new Date(parseInt(x[0]), parseInt(x[1]), parseInt(x[2]), parseInt(x[3]), parseInt(x[4]))


    }
    else {
        var appo = new Date()
        mode = true;
    }


    new order_list({
        mode: mode,
        name: name,
        _createdAt: getdate(),
        discount: discount,
        bar_code: getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 100) + '-' + Math.floor(Math.random() * 5000),
        data_entry_name: data_entry_name,
        appo: appo,
        location: location,
        phone_number: phone_number
    }).save(async (err, doc) => {

        console.log(meds)

        for (var i = 0; i < meds.length; i++) {


            await new order({
                name: meds[i].name,
                count: meds[i].count,
                price: meds[i].price,
                product_id: meds[i].id,
                link: doc.id
            }).save()




        }

        recording_logosystem(1, req.user.name, '    ?????????? ?????? ??????????   ' + " ???? ?????? : " + discount)

    })

}

function recored_sale() {
    new sales({
        name: req.body.name || '',
        company: req.body.name || '',
        price: req.body.total,
        bar_code: getdate().replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 5000),
        discount: req.body.discount || 0,
        data_entry_name: req.user.name,
        med_list: meds
    }).save((err, sales_doc) => {

        new revenues({
            type: '???????????? ????????????????',
            name: '????????????',
            details: '',
            price: req.body.total - sales_doc.discount,
            link: sales_doc.id,
            date: getdate(),
            data_entry_name: req.user.name,
        }).save((err) => {
            if (err)
                console.log(err)
            res.send({ success: 1, mass: ' ?????? ?????????? ?????????? ?????????? : ???? ?????????? ' + req.body.total + ' ?????? ?????????????? ' })
            recording_logosystem(8, req.user.name, '   ???????????? ??????????  : ' + req.body.total + " ???? ?????? : " + sales_doc.discount)
        })



    })
}


function recording_logosystem(type, employee, details = '') {

    var data = {
        type_: type,
        employee: employee,
        details: details
    }

    new logosystem(data).save()

}



module.exports = router;