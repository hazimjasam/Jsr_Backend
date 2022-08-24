const fs = require('fs');
const path = require("path");


var electron = process.env.ELECTRON

async function bufferToImage(object, folder) {

    return await new Promise((resolve, reject) => {

        if (object.mimetype == "image/png" || object.mimetype == "image/jpeg" || object.mimetype == "image/svg+xml") {


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


            var fileName = "image-" + uniqueSHA1String + "." + image_type.toLowerCase()

            //save the image from the base64
            if (electron == "NO") {
                fs.writeFile(path.join(__dirname, `../public/${folder}/${fileName}`), object.data, (err) => {
                    if (err) {
                        return reject(err.message)
                    }

                    resolve(folder + "/" + fileName)

                })
            }
            else{
                fs.writeFile( `c:\\Users\\PC\\Documents\\${folder}\\${fileName}`, object.data, (err) => {
                    if (err) {
                        return reject(err.message)
                    }

                    resolve(folder + "/" + fileName)

                })
            }

        } else {
            reject("اختر صيفة صحيحة")
        }

    })

}

module.exports = bufferToImage