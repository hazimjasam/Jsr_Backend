
var socket = io();
var delay = false;

//setTimeout(()=>socket.emit('search', ''),1000);
socket.on("connect", () => {

    socket.emit('search_orders', { index: "" })
})

function mintes(index) {
    var diff = Math.abs(new Date(index) - new Date());

    return Math.floor((diff/1000)/60);
}
function gettime(index) {

    var date = new Date(index);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


$("#search_box").keyup(function () {



    socket.emit('search_orders', { index: $("#search_box").val().trim(), sex: $("#sex").val(), login: $('#login').val(), action2: $('#action_type').val() });



})
$("#sex").change(function () {





    socket.emit('search', { index: $("#search_box").val().trim(), sex: $("#sex").val(), login: $('#login').val(), action2: $('#action_type').val() });



})
$("#login").change(function () {




    socket.emit('search', { index: $("#search_box").val().trim(), sex: $("#sex").val(), login: $('#login').val(), action2: $('#action_type').val() });



})

$("#action_type").change(function () {




    socket.emit('search', { index: $("#search_box").val().trim(), sex: $("#sex").val(), login: $('#login').val(), action2: $('#action_type').val() });



})




socket.on('update_orders', function (doc) {


    var appodata = doc;
   


  

   



    var dataTabel = $("#data_tabel")
    dataTabel.empty()
   
    for (let i = 0; i < appodata.length; i++) {

        var state= ''
        if(appodata[i].status == 0)
        state = '<div class="tag2" style="background-color:rgb(236 178 77);">معلق</div>'
        else if(appodata[i].status == 1)
        state = '<div class="tag2" style="background-color:rgb(129 236 77);">استلم الطلب من المخزن</div>'
        else if(appodata[i].status == 2)
        state = '<div class="tag2" style="background-color:rgb(77 181 236);">ارسال الطلب الى الزبون</div>'
        else if(appodata[i].status == 3)
        state = '<div class="tag2" style="background-color: rgb(228 94 86);">الغاء الطلب</div>'
        else if(appodata[i].status == 4)
        state = '<div class="tag2" style="background-color:rgb(233 134 231);">تم تسليم الطلب</div>'

      
        dataTabel.append(`
            
            <tr>
                            
                           
                                
                            
                        
                            <td  >${(appodata[i].customer_id != '')?appodata[i].name:appodata[i].name + " (غير مسجل) "}<div><a href="tel:${appodata[i].phone_number}">${appodata[i].phone_number}</a></div></td>
                            <td  >${(appodata[i].mode)?'فوري':'حجز موعد'}</td>
                            <td  >${(appodata[i].mode)?"قبل : "+'<i class="tag">'+mintes(appodata[i].appo)+ " دقيقة </div>": "اليوم ساعة : "+gettime(appodata[i].appo)}</td>
                            <td  >${appodata[i].location}</td>
                            <td>
                            ${appodata[i].price}<div><i>مع خصم : ${appodata[i].discount}</i></div>
                         </td>
                                    <td>
                                       ${state}
                                    </td>
                                    <td> <button class="abtn"   onclick=gps('/order/${appodata[i]._id}')><i class="fas fa-eye"></i></button>
                                       
                                    <button class="abtn"   onclick=gps('https://www.google.com/maps/search/?api=1&query=${appodata[i].lat},${appodata[i].lng}')><i class="fas fa-map-marker-alt"></i></button>
                                       
                                        
                                       
                                      
                                    </td>
                
                        </tr>
            
            
            `)
    }

// <button class="abtn" id="xxx${appodata[i]._id}" onclick="add_from_appo ('${appodata[i].name}','${appodata[i].action}','${appodata[i].phone_number}')"><i class="fas fa-file-signature"></i></button>


});





function add() {
    window.location.href = "/add?name=" + $("#search_box").val();
}
function add_from_appo(name, index, phone) {
    window.location.href = "/add?name=" + name + '&action=' + index + '&phone=' + phone;
}

function gps(index) {
   
    
    window.open(index, '_blank').focus();
}
function open(index) {
   
    
    window.location.href = index
}










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

    $('#search_box').val(index)
    socket.emit('search', { index: $("#search_box").val().trim(), sex: $("#sex").val() });
}