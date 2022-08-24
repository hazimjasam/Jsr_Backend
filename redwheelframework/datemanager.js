var moment = require('moment');


function getdate() {
    //time now
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    return now.getFullYear() + '-' + month + '-' + day;
}
function gettime(time = new Date) {

    var date = time;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function day_name_in_arabic(date) {

    var dt = moment(date)
    name_en = dt.format('dddd')
    name_ar =''
    if(name_en == "Sunday")
    {
        name_ar = "الاحـد" 
    }
    else if(name_en == "Monday")
    {
        name_ar = "الاثنين" 
    }
    else if(name_en == "Tuesday")
    {
        name_ar = "الثـلاثاء" 
    }
    else if(name_en == "Wednesday")
    {
        name_ar = "الاربعاء" 
    }
    else if(name_en == "Thursday")
    {
        name_ar = "الخمـيس" 
    }
    else if(name_en == "Friday")
    {
        name_ar = "الجمعة" 
    }
    else if(name_en == "Saturday")
    {
        name_ar = "السـبت" 
    }
    return name_ar;

}
function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM ' : ' PM '; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

function calculateAge(rowDate) {



    var dateFragment = rowDate.split("-")
    var data = new Date(dateFragment[0], dateFragment[1] - 1, dateFragment[2])

    var ageDifMs = Date.now() - data.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function formatCurrancy(price) {
    
   
    var the_price = price.toFixed(2)
       
   
    var fractional_number = the_price.toString().split(".")
   
        var isLower = false

        if (the_price < 0) {
            isLower = true
        }

        var StringPrice = Math.abs(fractional_number[0]).toString()

        var StringArray = StringPrice.split("").reverse()
        var newArray = []
        var counter = 0;


        for (let i = 0; i < StringArray.length; i++) {
            if (counter == 3) {
                newArray.push(",")
                counter = 0
            }
            newArray.push(StringArray[i])
            counter++
        }

        if (isLower) {
            newArray.push("-")
        }

        return newArray.reverse().join("") + ((fractional_number[1] == '00')?'' :'.'+fractional_number[1])
    
}
function Date_offset(date,days = 0 ,months = 0) {
    var dt = new Date(date);

    dt.setDate(dt.getDate()+ days)
    var newdt = new Date(dt.setMonth(dt.getMonth() + months))

    var month = (newdt.getMonth() + 1);
    var day = newdt.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;


    return newdt.getFullYear() + '-' + month + '-' + day;
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

module.exports = {
    getdate, gettime,day_name_in_arabic,tConvert,calculateAge,Date_offset,formatCurrancy,getdatein_ar
}