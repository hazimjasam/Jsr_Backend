const express = require('express');
const users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const stock = require('../models/stock');
const router = express.Router()



router.post("/login", (req, res, next) => {



    users.findOne({ username: req.body.username }, (err, doc) => {
        if (err) {
            return next(err)
        }

        if (!doc) {
            return next(Error("خطا في اسم المستخدم"))
        }

        bcrypt.compare(req.body.password, doc.password, (err, isMatch) => {
            if (err) {
                return next(err)
            }
            if (!isMatch) {
                return next(Error("خطا في كلمة السر"))
            }

            jwt.sign({ user: doc.id, date: Date.now() }, process.env.JWT_SECRAT, {}, (err, token) => {
                if (err) {
                    return next(err)
                }
                res.json(token)
            })

        })


    })
})




router.post("/sign", (req, res, next) => {

    var data = {
        username: req.body.username,
        password: req.body.password,
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(data.password, salt, (err, hash) => {

            data.password = hash;


            new users(data).save((err, doc) => {

                jwt.sign({ user: doc.id, date: Date.now() }, process.env.JWT_SECRAT, {}, (err, token) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(token)
                })
            })
        })
    })
})


router.post("/rink", (req, res, next) => {

    var number = req.body.number || 5

    var id = req.body.id || ''


    stock.findById(id).exec((err,doc)=>{

        if(doc)
        {
            doc.countRate =doc.countRate +1
            doc.avg = doc.avg + number

            doc.save(()=>{

                res.json("تم تقيم المنتج بنجاح")
            })
        }
        else{
            res.json("حدث خطاء ")
        }
    })



})




module.exports = router;