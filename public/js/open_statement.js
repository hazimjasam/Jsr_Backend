
var barcode = '';
var interval;

document.addEventListener('keydown', function (evt) {
    if (interval)
        clearInterval(interval)
    if (evt.code == "Enter") {
        if (barcode)
            handleBarcode(barcode)
        barcode = ''
        return
    }



    if (evt.code != "ShiftLeft" && evt.code != "ShiftRight")
        barcode += evt.key


    interval = setInterval(() => barcode = "", 60);
})

function handleBarcode(index) {


 



   window.location.href = '/statement_open?bar_code='+index+'&last_page='+window.location.pathname



}