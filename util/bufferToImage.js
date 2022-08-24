
const fs = require("fs");
const path = require("path");


var electron = process.env.ELECTRON

async function bufferToImage(object) {

    return await new Promise((resolve, reject) => {


        if (object.mimetype == "image/png" || object.mimetype == "image/jpeg") {


            var crypto = require('crypto');
            var seed = crypto.randomBytes(20);
            var uniqueSHA1String = crypto
                .createHash('sha1')
                .update(seed)
                .digest('hex')
            var image_type = ""

            for (let i = object.name.length - 1; i >= 0; i--) {
                if (object.name[i] == ".") {
                    image_type = image_type.split("").reverse().join("");
                    break
                }

                image_type = image_type + object.name[i]
            }


            var fileName = "image-" + uniqueSHA1String + "." + image_type

            if (electron == "NO")
            {
                fs.writeFile(path.join(__dirname, `../public/images/${fileName}`), object.data, (err) => {
                    if (err) {
                        return reject(err.message)
                    }

                    resolve(fileName)

                })
            }
            else{


                if (! require('fs').existsSync('c:\\Users\\PC\\Documents\\images')){
                    require('fs').mkdirSync('c:\\Users\\PC\\Documents\\images');
                }

                fs.writeFile(path.join(`c:\\Users\\PC\\Documents\\images\\${fileName}`), object.data, (err) => {
                    if (err) {
                        return reject(err.message)
                    }

                    resolve(fileName)

                })
            }

        } else {
            reject("اختر صيفة صحيحة")
        }

    })

}

module.exports = bufferToImage