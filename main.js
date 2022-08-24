const express = require('express');
const { app, BrowserWindow } = require('electron')
const path = require('path');
const cookieParser = require('cookie-parser')
const db = require('./util/database');

const { getdate } = require('./redwheelframework/datemanager')

//routes

//init
require('dotenv').config();
db.initDataBase();

const port = process.env.PORT || 5000;
var e_app = express()
//socket io
const http = require('http');
const server = http.createServer(e_app);
const { Server } = require("socket.io");
const patient = require('./models/patient');
const action = require('./models/action');
const fileUpload = require('express-fileupload')
const items = require('./models/items');
const medication = require('./models/medication');
const salary = require('./models/salary');
const recipe = require('./models/recipe');
const appointments = require('./models/appointments');
const alert_ = require('./models/alert_');
const stock = require('./models/stock');
const passport = require("passport")
const passportStrategy = require('./util/passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const employee = require('./models/employee');
const general = require('./models/general');
const record = require('./models/record');
const order_list = require('./models/order_list');
const order = require('./models/order');
const io = new Server(server);

/*
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1450,
        height: 800,
        minWidth: 1450,
        minHeight: 800,
        autoHideMenuBar: true,
        webPreferences: {
            
            nodeIntegration:false
        }
    })

    win.loadURL(`http://localhost:${port}`)
}



app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

*/






//midleware
e_app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
e_app.set('io', io);
e_app.set('hamza', "io");
e_app.set('view engine', 'ejs');
e_app.set('views', path.join(__dirname, 'views'));
if(process.env.ELECTRON == 'NO')
e_app.use(express.static(path.join(__dirname, "public")))
else{
    //genrate the dir
    if (! require('fs').existsSync('c:\\Users\\PC\\Documents\\images')){
        require('fs').mkdirSync('c:\\Users\\PC\\Documents\\images');
    }
    e_app.use(express.static(path.join(__dirname, "public")))
    e_app.use(express.static('c:\\Users\\PC\\Documents'))
}
e_app.use(express.json())
e_app.use(express.json({ limit: '10mb' }));
e_app.use(express.urlencoded({ limit: '10mb', extended: true }))
e_app.use(cookieParser())


e_app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/session',
        ttl: 12 * 60 * 60,
        autoRemove: 'native'
    })
}))


employee.findOne({}, (err, doc) => {
    if (!doc) {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash("1111", salt, (err, hash) => {

                var data = {
                    name: "admin",
                    pwd: hash,
                    job: "مسؤول",
                    image: '',

                    all: true,
                    delivery: false,
                    add: true,
                    orders: true,
                    appointment: true,
                    pharmacy: true,
                    analytic: true,
                    accounts: true,
                    setting: true,
                    presentation: true,
                    delete: true,
                }
                new employee(data).save()
            })
        })


    }
})


general.findOne({}, (err, doc) => {

    if (!doc) {
        new general({
            name: "العجلة الحمراء للبرمجيات",
            name_en: "Red Wheel",
            phone: "9647807311475",
            phone_two: "9647807311475",
            img: 'logo.png'
        }).save()
    }
})


e_app.use(flash())
e_app.use(require('./middleware/flashMessage').flashMessage)
e_app.use(passport.initialize())
e_app.use(passport.session())

passportStrategy.userStrategy(passport)
passportStrategy.serializeUser(passport)
passportStrategy.deserializeUser(passport)


e_app.use(require('morgan')('dev'))
e_app.use(function (req, res, next) {
    // check if client sent cookie
    var cookie = req.cookies.drawer;
    if (cookie === undefined) {
        // no: set a new cookie
        var isOpen = false
        res.cookie('drawer', isOpen, { maxAge: 24 * 60 * 60 * 1000 * 100, secure: false });

    } else {


    }
    next(); // <-- important!
});






e_app.get("/jquery.js", (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules/jquery/dist/jquery.min.js"))
})

e_app.use("/api/", require('./api/get'))
e_app.use("/api/", require('./api/post'))
e_app.use("/", require('./routes/get'))
e_app.use("/", require('./routes/post'))



e_app.get('/setup',(req,res)=>{
    employee.findOne({}, (err, doc) => {
        if (!doc) {
    
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash("1111", salt, (err, hash) => {
    
                    var data = {
                        name: "admin",
                        pwd: hash,
                        job: "مسؤول",
                        image: '',
    
                        all: true,
                        doctor: true,
                        add: true,
                        nures: true,
                        appointment: true,
                        pharmacy: true,
                        analytic: true,
                        accounts: true,
                        setting: true,
                        presentation: true,
                        delete: true,
                    }
                    new employee(data).save()
                })
            })
    
    
        }

        res.send('ok')
    })
})



//error handle
e_app.use(require('./middleware/errorHandle').notFound);
e_app.use(require('./middleware/errorHandle').errorHandler);



/*setTimeout(myFunction, 8000)

function myFunction()
{
    io.emit('mass', "hi form io");
    console.log("mass is sended")
}*/
function Date_minTwoMonths(date) {
    var dt = new Date(date);

    var newdt = new Date(dt.setMonth(dt.getMonth() + 2))

    var month = (newdt.getMonth() + 1);
    var day = newdt.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;


    return newdt.getFullYear() + '-' + month + '-' + day;
}

//////////////////////////////////// socket io functions //////////////////////////////////////////////


io.on('connection', (socket) => {
    console.log('a user connected');
    e_app.set("socket", socket)
    socket.on('search', (data) => {




        function calculateAge(rowDate) {



            var dateFragment = rowDate.split("-")
            var data = new Date(dateFragment[0], dateFragment[1] - 1, dateFragment[2])

            var ageDifMs = Date.now() - data.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        var query = { "$or": [{ "name": { $regex: data.index } }, { "bar_code": data.index }] }


        if (data.sex == "ذكر") {
            query.sex = 1
        }
        else if (data.sex == "انثى") {
            query.sex = 2
        }

        if (data.login == 'yes') {
            query.date_entry = getdate()
        }



        if (data.action) {
            if (data.login != 'bed') {
                if (data.action != 'الكل')
                    query.action = data.action
                query.date_entry = getdate()
            }

        }

        if (data.action2) {
            if (data.login != 'bed') {
                if (data.action2 != 'الكل')
                    query.action = data.action2
            }


        }


        patient.find(query).sort([['createdAt', -1]]).limit(50).lean().exec((err, docs) => {

            appointments.find({ "name": { $regex: data.index }, patient_id: '' }).limit(10).lean().exec((err, docs3) => {



                if (data.index.length == 0) {
                    docs3 = []
                }

                if (docs) {
                    action.find({}).exec((err, docs2) => {
                        record.find({ type: true, sign_out: false }).exec((err, record) => {

                            for (let i = 0; i < docs.length; i++) {
                                // docs[i]._id = docs[i]._id.toString()
                                docs[i].age = calculateAge(docs[i].age)
                                docs[i].bed = ''
                                for (let y = 0; y < record.length; y++) {
                                    if (record[y].patient_id == docs[i]._id)
                                        docs[i].bed = "ط : " + record[y].floor + "," + "غ : " + record[y].room + "," + "س : " + record[y].bed
                                    
                                }
                            }

                            //res.render("main", { index: 0, patients: docs, title: "المراجعين", calculateAge: calculateAge })
                            socket.emit('update', { docs: docs, actions: docs2, appo: docs3 })
                        })

                    })
                }
            })


        })
    })


    socket.on('search_small', (data) => {





        var query = { "$or": [{ "name": { $regex: data.index } }] }


        patient.find(query, "name image phone_number action").sort([['date', -1]]).limit(5).exec((err, docs) => {




            //res.render("main", { index: 0, patients: docs, title: "المراجعين", calculateAge: calculateAge })
            socket.emit('update_small', docs)





        })
    })

    socket.on('search_orders', (data) => {



// search by name or bar_code

        var query = { "$or": [{ "name": { $regex: data.index } }, { "bar_code": data.index }] }

        

      
//only today
        query._createdAt = getdate()

    
        
    
    
      
    
    
       
        order_list.find(query, "-warehouse").sort([['createdAt', -1]]).where("status").ne(4).limit(100).lean().exec(async(err, docs) => {

//get the price
            for(var i =0; i < docs.length ; i++)
            {
               
                var price = 0
                var _order = await order.find({link:docs[i]._id})

                for(var y =0; y < _order.length ; y++)
                {
                    price = price + (_order[y].price * _order[y].count)
                }


              price = price - docs[i].discount
                

                docs[i].price = price

              
                
            }



            //res.render("main", { index: 0, patients: docs, title: "المراجعين", calculateAge: calculateAge })
            socket.emit('update_orders', docs)





        })
    })


    socket.on('update_patient_history', (data) => {








        patient.findById(data.the_id).exec((err, doc) => {



            doc.history = data.history.trim();

            doc.save()



        })


    })

    socket.on('update_patient_note', (data) => {



        patient.findById(data.the_id).exec((err, doc) => {



            doc.note = data.note;

            doc.save()



        })


    })


    socket.on('get_items', async (data) => {


        var selected_record = await record.findOne({ patient_id: data.the_id, name: data.record }).lean()

        items.find({ patient: data.the_id, record: data.record }).sort([['createdAt', 1]]).lean().exec((err, docs) => {

            recipe.find({ name: data.name }).lean().exec((err, docs2) => {



                socket.emit('update_items', { items: docs, recipe: docs2, selected_record: selected_record })
            })



        })
    })


    socket.on('search_med', (data) => {


       


        var query = { "$or": [{ "name_en": { $regex: data.index } },{ "history": { $regex: data.index } }, { "bar_code": data.index }, { "name_ar": { $regex: data.index } }] }

        

        if (data.category != "الكل") {
            query.category = data.category
        }
        if (data.warehouce != 'المخزن') {
            query.warehouse = data.warehouce
        }

        query.active = true

        if (data.type != 'الجميع') {
            if (data.type == 'قارب النفاذ') {
                query.leftinstock = { $lte: 10, $gte: 1 }
            }
            else if (data.type == 'غير متوفر') {
                query.leftinstock = { $lte: 0 }
            }
            else if (data.type == 'منتهي الصلاحية') {
                query.expire_date = { $lt: getdate(), $ne:''}
            }
            else if (data.type == 'قارب انتهاء الصلاحية') {
                query.expire_date = { $lt: Date_minTwoMonths(getdate()) , $gte: getdate() }
            }
            else if (data.type == 'غير الفعال') {
                query.active = false
            }
            else if (data.type == 'التخفيضات')
            {
                
                query.price_offer = { $gt: 0}
            }
        }


        stock.find(query,'name_ar size avg countRate shelf price price_offer leftinstock images active').sort([['date', -1]]).limit(50).lean().exec((err, docs) => {

         

            socket.emit('update_med', { docs: docs })
        })
    })


    socket.on('search_med_name', (data) => {



        var query = { "$or": [{ "name": { $regex: data.index } }, { "name_ar": { $regex: data.index } }] }


        medication.find(query, "name history").sort([['date', -1]]).limit(10).lean().exec((err, docs) => {



            patient.findById(data.id, 'history').exec((err, doc) => {


                var pathistory = doc.history.trim().split(',')


                for (var i = 0; i < docs.length; i++) {
                    var notallowed = []

                    var medhistory = docs[i].history.split(',')

                    for (var x = 0; x < pathistory.length; x++) {
                        if (medhistory.includes(pathistory[x])) {
                            notallowed.push(pathistory[x])

                        }
                    }

                    docs[i].notallowed = notallowed.join(",")

                }





                socket.emit('update_med_name', { data: docs })



            })


        })
    })


    socket.on('update_alert', (data) => {

        if (data.name == 'update') {
            alert_.find({}).sort([['createdAt', -1]]).limit(5).exec((err, docs) => {

                socket.broadcast.emit("alert", { data: docs });

            })
        }
        else {



            alert_.findOne({ name: data.name }).exec((err, doc) => {

                if (doc) {
                    alert_.find({}).sort([['createdAt', -1]]).limit(5).exec((err, docs) => {

                        socket.broadcast.emit("alert", { data: docs });

                    })

                }
                else {

                    new alert_({
                        name: data.name
                    }).save(() => {
                        alert_.find({}).sort([['createdAt', -1]]).limit(5).exec((err, docs) => {

                            socket.broadcast.emit("alert", { data: docs });

                        })
                    })
                }
            })
        }
    })






});






/*e_app.listen(port, () => {
    console.log("\x1b[33m%s\x1b[0m", `server started at port ${port}`)
})*/









server.listen(port, () => {
    console.log("\x1b[33m%s\x1b[0m", `server started at port ${port}`);
});