const express = require('express');
const users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = express.Router()
const category = require('../models/category');
const stock = require('../models/stock');
const subcategory = require('../models/subcategory');
const subsubcategory = require('../models/subsubcategory');
const banner = require('../models/banner');
const { find } = require('../models/category');

function checkToken(req, res, next) {

    var token = req.headers.authorization || ""


    if (token.length == 0) {
        res.status(400)
        return next(Error("not auth"))
    }


    jwt.verify(token, process.env.JWT_SECRAT, (err, user) => {

        if (err) {
            res.status(400)
            return next(Error("not auth"))
        }

        users.findById(user.id, (err, doc) => {

            if (err) {
                res.status(400)
                return next(Error("not auth"))
            }

            if (!doc) {
                res.status(400)
                return next(Error("not auth"))
            }

            req.jwtuser = doc

            next()

        })




    })


}


router.get("/category", async (req, res, next) => {


    var _category = await category.find({}).lean()

    for (var i = 0; i < _category.length; i++) {

        _category[i].number = await stock.find({ category: _category[i]._id }).countDocuments()

           
      
    }


    res.json(_category)


})
router.get("/get_sub", async (req, res, next) => {

    var id = req.query.id || ''

   
    var sub = await subcategory.find({link:id}).sort({name:1}).lean()

 
    for (var i = 0; i < sub.length; i++) {

        sub[i].subsub = await subsubcategory.find({ link: sub[i]._id }).sort({name:1}).lean()

           
      
    }

    res.json(sub)


})
router.get("/get_subsub", async (req, res, next) => {

    var id = req.query.id || ''

   
    var sub = await subsubcategory.find({link:id}).sort({name:1}).lean()


    res.json(sub)


})

router.get("/products", async (req, res, next) => {

    var lang = req.query.lang || 'ar'

    var offset = req.query.offset || 0

   
    var subsub = req.query.subsub || ''

    var fliter = {
        subsubcategory: subsub,
        active:true,
    }

    fliter.leftinstock =  { $gt: 0 }

    var products = await stock.find(fliter,"name_en name_ar details_ar details_en images leftinstock price price_offer avg countRate size subsubcategory").lean()

    

    for(var i = 0 ; i < products.length ; i++)
    {
        products[i].name =  products[i].name_ar
        products[i].details =  products[i].details_ar
    }



    res.json(products)


})

router.get("/banners", async (req, res, next) => {


    var banners = await banner.find({}).sort([['createdAt', -1]]).lean()

   
    for(var i = 0 ; i < banners.length ; i++)
    {
        banners[i].item = await stock.findOne({name_ar:banners[i].product},"name_en name_ar details_ar details_en images leftinstock price price_offer avg countRate size subsubcategory").lean()
        
            banners[i].item.name =  banners[i].item.name_ar
            banners[i].item.details =  banners[i].item.details_ar
        
    }
   


    res.json(banners)


})
router.get("/similar_products", async (req, res, next) => {



    var subsub = req.query.subsub || ''


    var products = await stock.find({subsubcategory:subsub},"name_en name_ar details_ar details_en images leftinstock price price_offer avg countRate size subsubcategory").sort([['createdAt', -1]]).limit(5).lean()

    for(var i = 0 ; i < products.length ; i++)
    {
        products[i].name =  products[i].name_ar
        products[i].details =  products[i].details_ar
    }
   


    res.json(products)
})
router.get("/get_product_name", async (req, res, next) => {

    var name = req.query.product || ''

    var product = await stock.findOne({name_ar:name},"name_en name_ar details_ar details_en images leftinstock price price_offer avg countRate size").lean()

    product.name =  product.name_ar
    product.details =  product.details_ar
   


    res.json(product)


})





module.exports = router;