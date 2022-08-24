var PHE = printHtmlElement;
var socket = io();
var delay = false;







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
}





function Date_minTwoMonths(date) {
    var dt = new Date(date);

    var newdt = new Date(dt.setMonth(dt.getMonth() + 2))

    var month = (newdt.getMonth() + 1);
    var day = newdt.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;

    console.log(newdt.getFullYear() + '-' + month + '-' + day)
    return newdt.getFullYear() + '-' + month + '-' + day;
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


$("#search_box").keyup(function () {




    search()




})

function search() {
    socket.emit('search_med', { index: $("#search_box").val(), category: $('#categorysel').val(), type: $('#type').val(), warehouce: $('#warehouce').val() });
}

socket.on('update_med', function (doc) {




    var data = doc.docs;









    var dataTabel = $("#dataTabel")
    dataTabel.empty()
    for (let i = 0; i < data.length; i++) {



        var label = ""
        if (data[i].leftinstock <= 0) {

            label = `<div class="tag" style="background-color:#acacac">غير متوفر</div>`
        }
        else if (data[i].leftinstock < 10) {

            label = `<div class="tag" style="background-color:#e5e5e5">قارب النفاذ</div>`
        }
        else {
            label = `<div class="tag" style="color:red">متوفر</div>`
        }



        dataTabel.append(`
        
       
                         
                            <div class="table-grid" style='${(data[i].leftinstock <= 0 || !data[i].active) ? 'color:#a4a4a4' : ''}'>



                                <main style="padding: 1rem; "><img src='${(data[i].images.length > 0) ? '/images/' + data[i].images[0] : '/images/rndmed.png'}'
                                        style="width: 55px; border-radius: 5px;"></main>
                                        ${label}

                                <h4 class="text-grid">${data[i].name_ar}<div style="font-size: 16px; margin-top: 5px;"> 
                                ${data[i].size} </div>
                                </h4>
                                <h4 class="text-grid"><i class="fas fa-star yc"></i>${parseInt(data[i].avg)/parseInt(data[i].countRate)}<div style="font-size: 16px; margin-top: 5px;"> 
                                ${data[i].countRate} </div>
                                </h4>
                                <h4 class="text-grid">${(data[i].price_offer > 0)?'<s>'+formatCurrancy(data[i].price)+'</s>'+'<div style="font-size: 16px; margin-top: 5px;">'+data[i].price_offer+'</div>':formatCurrancy(data[i].price)}  
                                </h4>
                                <h4 class="text-grid ">${(data[i].sheet > 0) ? Math.floor((data[i].leftinstock / data[i].sheet)) : data[i].leftinstock}<div>${(data[i].sheet > 0) ? data[i].leftinstock : ''}<div></h4>
                              
                               
                                <main style="padding: 1rem; ">
                                    <button class="abtn pr" onclick="info('${data[i]._id}')"><i class="fas fa-info-circle"></i><div class='inner iinfo pa sh'>رقم الرف : <i>${data[i].shelf}</i></div></button>
                                   
                                    ${(data[i].leftinstock > 0 && data[i].active) ? `<button class="abtn" onclick="handleBarcode('${data[i]._id}')"><i class="fas fa-plus-circle"></i></button>` : ''}
                                </main>
                            </div>

                        </div>
        
        
        `)





        action_lable = "";

    }




});


function info (id)
{
   
    window.location.href = '/single_product?id='+id
}

























var wwww = $(window)
$("#innercaher").css(`height`, `${wwww.height() - 460}px`)


$(window).on('resize', function () {
    var win = $(this); //this = window
    console.log(win.height())
    $("#innercaher").css(`height`, `${win.height() - 460}px`)
});


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


  



    $.ajax({
        type: "POST",
        url: "/Casher",
        data: {
            bar_code: index
        }
    }).done(function (o) {

        //var id = Math.floor(Math.random() * 1000000);



        if (item_array.findIndex((index) => { return index.id === o.data._id }) == -1) {

            var volume_low = false;
            if (o.data.price_sheet > 0) {
                if (Math.floor(o.data.leftinstock / o.data.sheet) <= 0) {

                    total = total + o.data.price_sheet
                    var new_data = {
                        id: o.data._id,
                        price:o.data.price_sheet,
                        _type: 1,
                        count: 1,
                        name: o.data.name_ar
                    }
                    item_array.push(new_data)

                    volume_low = true;
                }
                else {
                    total = total + o.data.price
                    var new_data = {
                        id: o.data._id,
                        price:o.data.price,
                        _type: 0,
                        count: 1,
                        name: o.data.name_ar
                    }
                    item_array.push(new_data)
                }
            }
            else {
                total = total + o.data.price
                var new_data = {
                    id: o.data._id,
                    price:o.data.price,
                    _type: 0,
                    count: 1,
                    name: o.data.name_ar
                }
                item_array.push(new_data)
            }
            var ineerboxnumber = (o.data.sheet > 0) ? Math.floor(o.data.leftinstock / o.data.sheet) : o.data.leftinstock

            $('#innercaher').append(`
        <div id="${o.data._id}" max-count ='${ineerboxnumber}' max-count-sheet ='${o.data.leftinstock}'>
            <div  class="casher">
        <select id='s${o.data._id}' style="width: 100%" class="form-select"  onchange="change_sheet('${o.data._id}',this.value,'${o.data.price}','${o.data.price_sheet}')"
                        aria-label="Example select with button addon" name="type">
                        ${(!volume_low) ? `<option value="0" selected>${o.data.name_ar}</option>` : ``}
                        ${(o.data.price_sheet > 0) ? `<option value="1">${o.data.name_ar + "شريط"}</option>` : ""}
                       



                    </select>

                    <a onclick="handleBarcode('${o.data._id}')" style="color:rgb(41, 129, 237); font-size: 30px;"><i
                            class="fas fa-plus-circle pointer"></i></a>

                    <div id="v${o.data._id}">1</div>

                    <a  onclick="mine('${o.data._id}','${o.data.price}','${o.data.price_sheet}')"><i style="color:rgb(237, 70, 41) ; font-size: 30px;"
                            class="fas fa-minus-circle pointer"></i></a>
                    <div id="p${o.data._id}">${(!volume_low) ? formatCurrancy(o.data.price) : formatCurrancy(o.data.price_sheet)}</div>

                    
              </div>
              <hr>
              </div>

`)



        }
        else {//there is item already

            add(o.data._id, o.data.price, o.data.price_sheet)

        }
        $('#Casher').show(200)
        $('#total').text(formatCurrancy(total - $("#discount").val()))
        //$('#search_box').val(index)
        // socket.emit('search', { index: $("#search_box").val().trim(), sex: $("#sex").val() });
    })



}



function add(index, price, price_sheet) {
    if ($('#s' + index).val() == 0 && parseFloat($('#' + index).attr('max-count')) > parseFloat($('#v' + index).text()) || $('#s' + index).val() == 1 && parseFloat($('#' + index).attr('max-count-sheet')) > parseFloat($('#v' + index).text())) {
        if ($('#s' + index).val() == 0) {
            $('#v' + index).text(parseFloat($('#v' + index).text()) + 1)
            //total
            total = parseFloat(total) + parseFloat(price)
            $('#total').text(formatCurrancy(total - $("#discount").val()))

            $('#p' + index).text('')
            $('#p' + index).text(formatCurrancy(parseFloat(price) * parseFloat($('#v' + index).text())))

            //array
            var i = item_array.findIndex((i) => { return i.id === index })


            var count = item_array[i].count + 1;
            item_array[i] = {
                id: index,
                price:price,
                _type: 0,
                count: count,
                name: item_array[i].name
            }

        }
        else {
            $('#v' + index).text(parseFloat($('#v' + index).text()) + 1)
            //total
            total = parseFloat(total) + parseFloat(price_sheet)
            $('#total').text(formatCurrancy(total - $("#discount").val()))

            $('#p' + index).text('')
            $('#p' + index).text(formatCurrancy(parseFloat(price_sheet) * parseFloat($('#v' + index).text())))

            //array
            var i = item_array.findIndex((i) => { return i.id === index })


            var count = item_array[i].count + 1;
            item_array[i] = {
                id: index,
                price:price_sheet,
                _type: 1,
                count: count,
                name: item_array[i].name
            }
        }
    }
    else {

        $('#innercaher').prepend(`   <div class="cashermass"
                style="background-color: rgb(231, 77, 77); color: white; padding: 5px 30px 5px 5px; border-radius: 5px; margin-bottom: 8px;">
                <i class="fas fa-ban"></i> لايوجد عدد كافي من هذا المنتج داخل المخزن
            </div>`)

        setTimeout(() => { $(".cashermass").remove(); }, 1000)
    }
}
function mine(index, price, price_sheet) {
    if ($('#s' + index).val() == 0) {
        var num = parseFloat($('#v' + index).text()) - 1
        total = parseFloat(total) - parseFloat(price)
        if (num <= 0) {
            $('#' + index).remove()
        }
        $('#total').text(formatCurrancy(total - $("#discount").val()))
        $('#v' + index).text(num)

        $('#p' + index).text('')
        $('#p' + index).text(formatCurrancy(parseFloat(price) * parseFloat($('#v' + index).text())))

        //array
        var i = item_array.findIndex((i) => { return i.id === index })

        var count = item_array[i].count - 1;
        if (count <= 0) {
            item_array.splice(i, 1)
        }
        else {
            item_array[i] = {
                id: index,
                price:price,
                _type: 0,
                count: count,
                name: item_array[i].name
            }
        }
    }
    else {
        var num = parseFloat($('#v' + index).text()) - 1
        total = parseFloat(total) - parseFloat(price_sheet)
        if (num <= 0) {
            $('#' + index).remove()
        }
        $('#total').text(formatCurrancy(total - $("#discount").val()))
        $('#v' + index).text(num)

        $('#p' + index).text('')
        $('#p' + index).text(formatCurrancy(parseFloat(price_sheet) * parseFloat($('#v' + index).text())))

        //array
        var i = item_array.findIndex((i) => { return i.id === index })

        var count = item_array[i].count - 1;
        if (count <= 0) {
            item_array.splice(i, 1)
        }
        else {
            item_array[i] = {
                id: index,
                price:price_sheet,
                _type: 1,
                count: count,
                name: item_array[i].name
            }
        }
    }
}
function change_sheet(index, type, price, peice_sheet) {
    console.log("xx")
    if (type == 0) {
        total = total - (parseFloat($('#v' + index).text()) * peice_sheet)
        total = total + (parseFloat($('#v' + index).text()) * price)
        $('#p' + index).text('')
        $('#p' + index).text(formatCurrancy(parseFloat($('#v' + index).text()) * price))
        $('#total').text(formatCurrancy(total - $("#discount").val()))

        //array
        var i = item_array.findIndex((i) => { return i.id === index })



        item_array[i] = {
            id: index,
            price:price,
            _type: 0,
            count: item_array[i].count,
            name: item_array[i].name
        }

    }
    else if (type == 1) {
        total = total + (parseFloat($('#v' + index).text()) * peice_sheet)
        total = total - (parseFloat($('#v' + index).text()) * price)
        $('#p' + index).text('')
        $('#p' + index).text(formatCurrancy(parseFloat($('#v' + index).text()) * peice_sheet))
        $('#total').text(formatCurrancy(total - $("#discount").val()))

        //array
        var i = item_array.findIndex((i) => { return i.id === index })



        item_array[i] = {
            id: index,
            price:peice_sheet,
            _type: 1,
            count: item_array[i].count,
            name: item_array[i].name
        }
    }
}
function discountChange() {
    $("#discount").val(Math.ceil($("#discount").val()))
    $('#total').text(formatCurrancy(total - $("#discount").val()))
}
function closeCasher() {
    $('#innercaher').empty()
    total = 0;
    item_array = []
    $('#discount').val(0)
    $('#total').text('0')
    $('#Casher').hide(50)
    $("#name_client").val('')
    $("#location").val('')
    $("#phone_number").val('')
   
    
}

function Submit_receipt() {

    disable_btn('addbtn')

    if (item_array.length > 0) {
        $.ajax({
            type: "POST",
            url: "/casher_accounting",
            data: {
                total: total,
                name_client:$("#name_client").val(),
                location:$("#location").val(),
                discount:$("#discount").val(),
                phone_number:$("#phone_number").val(),
                time_slot: $('#time_slot').val(),
                item_array: JSON.stringify(item_array)
            }
        }).done(function (o) {


            enable_btn('addbtn','محاسبة')

            if (o.success == 1) {
                closeCasher()
                $('#alert').append(`
                <div id ='sm' class="card massage" style="flex: 1; display: block;">
                <div class="card-body">
                    <i class="fas fa-check-circle"></i>
                    ${o.mass}
                </div>
            </div>`)

                setTimeout(() => { $('#sm').remove() }, 5000)
                search()

                PHE.printElement(document.getElementById('main_con'));

            }
            else {
                closeCasher()
                $('#alert').append(`
                <div id ='sm2' class="card massage-error" style="flex: 1; display: block;">
                <div class="card-body">
                    <i class="fas fa-ban"></i>
                   ${o.mass}
                </div>
            </div>`)

                setTimeout(() => { $('#sm2').remove() }, 9000)
            }


        })
    }
}
