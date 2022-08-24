var PHE = printHtmlElement;
var socket = io();
var delay = false;

var add_med_panel = false





$('#category').on('change', () => {



    $('#label1').html('التصنيف (تحميل)')
    //$('#label2').html('التصنيف الثانوي (تحميل)')

    $('#subcategory').empty()
    $('#subsubcategory').empty()

    $.ajax({
        type: "POST",
        url: "/findsubs",
        data: { id: $('#category').val() }
    }).done(function (o) {


        if (o.success == 1) {

            $('#label1').html('التصنيف')
         
            $('#subcategory').append(`
            <option value="">
                                                       اختار
                                                    </option>
            `)


            for (var i = 0; i < o.subcategory.length; i++) {
                $('#subcategory').append(`
            <option value="${o.subcategory[i]._id}">
            ${o.subcategory[i].name}
        </option>
            `)
            }
        }


    })
})
$('#subcategory').on('change', () => {



    
    $('#label2').html('التصنيف الثانوي (تحميل)')

   
    $('#subsubcategory').empty()

    $.ajax({
        type: "POST",
        url: "/findsubsub",
        data: { id: $('#subcategory').val() }
    }).done(function (o) {


        if (o.success == 1) {

            $('#label2').html('التصنيف الثانوي')
         
           


            for (var i = 0; i < o.subcategory.length; i++) {
                $('#subsubcategory').append(`
            <option value="${o.subcategory[i]._id}">
            ${o.subcategory[i].name}
        </option>
            `)
            }
        }


    })
})



//take a pic and put it in the canvas




socket.on("connect", () => {

    socket.emit('search_med', { index: "", category: "الكل", type: "الجميع", warehouce: 'المخزن' })
})

function getdate() {
    //time now
    var d = new Date();

    var date_ = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()

    return date_;
}
function getdate_right() {
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

function showsideprice(i) {

    if (i > 1) {
        $('#price_sheetdiv').show()

    }
    else {
        $('#price_sheetdiv').hide()
        $('#price_sheet').val(0)
    }
}
function pricechange(i) {
    $('#price_sheet').val(Math.ceil(i / $('#sheet').val()))

    if ($('#pay_type').val() == 'فوري' || $('#pay_type').val() == 'بالاجل') {
        if ($('#eliteprice').val() > 0) {
            var pl = ($('#price').val() - ($('#eliteprice').val() / $('#number').val()))

            $('#pinfo').html('الربح للقطعة الواحدة : ' + pl);
        }
    }
    else {
        if ($('#eliteprice').val() > 0) {
            var pl = ($('#price').val() - ($('#eliteprice').val()))

            $('#pinfo').html('الربح للقطعة الواحدة : ' + pl);
        }
    }
}


//start the cam


var images_file = [];

$('#imagefile').on("change", function () {
    images_file = [];
    //diable submit button
    $(':input[type="button"]').prop('disabled', true);
    var fileSelecter = this;

    for (var i = 0; i < fileSelecter.files.length; i++) {


        loadImage(fileSelecter.files[i], (err, data) => {
            images_file.push(data)
            if (fileSelecter.files.length == i) {
                //enable submit button
                $(':input[type="button"]').prop('disabled', false);
            }
        })


    }
});


function loadImage(file, done) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        done(null, reader.result)
    };
    reader.onerror = function (error) {
        done(error, null)
    };
}




















function add_doc() {

    disable_btn('addbtn')



    var data = {

        select: $('#meds').val(),
        name_en: $("#namemed").val().trim(),
        name_ar: $("#name_ar").val().trim(),
        details_ar: $("#details").val(),
        history: $("#history").val(),
        details_en: $("#side_effect").val(),
        category: $("#category").val(),
        subcategory: $("#subcategory").val(),
        subsubcategory: $("#subsubcategory").val(),
        number: $("#number").val(),
        medical_reserve: $("#medical_reserve").val(),
        expire_date: $("#expire_date").val(),
        bar_code: $("#bar_code").val(),
        sheet: $("#sheet").val(),
        price: $("#price").val(),
        pay_type: $('#pay_type').val(),
        eliteprice: $('#eliteprice').val(),
        price_sheet: $("#price_sheet").val(),
        warehouce: $("#type_warehouce").val(),
        shelf: $('#shelf').val(),
        size:$('#size').val(),
        images: images_file
    }

    $.ajax({
        type: "POST",
        url: "/add_medication",
        data: data
    }).done(function (o) {

        enable_btn('addbtn')

        if (o.success == 1) {

            $(".massage").show();
            $('#mass').html(o.mss)
            $(".massage-error").hide();
        }
        else {
            $(".massage-error").show();
            $("#err").empty()
            $("#err").html(o.mss)
            $(".massage").hide();
        }
    })
}


$('#meds').on('change', () => {
    if ($('#meds').val() == 'جديد') {
        $('#new_med').slideDown()
    }
    else {
        $('#new_med').hide()
    }
})

$(".close").on('click', () => {
    add_med_panel = false;
    $('#add_doc').hide(150)
})


function show() {
    add_med_panel = true;
    $('#add_doc').fadeIn(150)
}






function putaill(index) {
    var e = $.Event("keypress", { which: 13 });

    $('.bootstrap-tagsinput').find('input').val(index).trigger(e);
    add_med_panel = false;

}






//casher
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

var total = 0;
var discount = 0;
var item_array = []




function handleBarcode(index) {


    if (add_med_panel) {
        $("#bar_code").val("")
        $("#bar_code").val(index)
        return
    }



    $.ajax({
        type: "POST",
        url: "/Casher",
        data: {
            bar_code: index
        }
    }).done(function (o) {

        //var id = Math.floor(Math.random() * 1000000);



    })
}



