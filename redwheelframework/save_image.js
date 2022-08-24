
const fs = require("fs");
const path = require('path');

var electron = process.env.ELECTRON

async function save_base64(image, file, callback) {

   return await new Promise((resolve, rejects) => {

      //there is a file
      if (image != "") {

         //the image base64 but it dose not start with i , so split the unwanted characters
         var img = image.split(',')

         //see the image in base64
         //console.log("the image :" +img[1]);

         //see the file type
         var base64 = img[1]
         var filename = Date.now().toString()
         var fileType;
         if (base64.charAt(0) == '/') {
            fileType = "jpg"
         }
         else if (base64.charAt(0) == 'i') {
            fileType = "png"
         } else {


            if (typeof callback === 'function') {
               callback("");
            }


            return rejects("صوره غلط")
         }

         //save the image from the base64
         if (electron == "NO") {
            fs.writeFile(path.join(__dirname, "../public/" + file + "/" + filename + "." + fileType), base64, 'base64', (err) => {
               if (err) {
                  console.log(err);
                  if (typeof callback === 'function') {
                     callback("");
                  }
                  return rejects()


               }


               if (typeof callback === 'function') {
                  callback(file + "/" + filename + "." + fileType);
               }
               return resolve(file + "/" + filename + "." + fileType)
            });
         }
         else{
            fs.writeFile('c:\\Users\\PC\\Documents\\images\\' + filename + "." + fileType, base64, 'base64', (err) => {
               if (err) {
                  console.log(err);
                  if (typeof callback === 'function') {
                     callback("");
                  }
                  return rejects()


               }


               if (typeof callback === 'function') {
                  callback(file + "/" + filename + "." + fileType);
               }
               return resolve(file + "/" + filename + "." + fileType)
            });
         }


      }
      else // no file found
      {
         if (typeof callback === 'function') {
            callback("");
         }
         return rejects("")

      }



   })
}


module.exports = save_base64;


