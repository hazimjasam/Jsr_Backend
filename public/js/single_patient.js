

        function send_doc() {
            $.ajax({
                type: "POST",
                url: "/add_doc",
                data: {
                    name: $('#name_ill').val(),
                    type: $('#type').val(),
                    id: $('#id').val(),
                    floor: $('#floor').val(),
                    room: $('#room').val(),
                    bed: $('#bed').val(),
                }
            }).done(function (o) {


                if (o.success == 0) {

                    $('.massage-error').show()
                    $('#err').html(o.mass)
                }
                else {
                    location.reload();
                }

            })
        }


    var socket = io();
    var ready = false;
    var record = ""
    var medlist = []

    function add_doc() {
        if ($("#add_doc").css("display") == "flex") {
            $("#add_doc").fadeOut(200)
        } else {
            $("#add_doc").fadeIn(200)
        }

    }
    function open_scan() {
        $("#add_scan").fadeToggle(200)
    }
    function open_recipe() {
        $("#add_recipe").fadeToggle(200)
    }


    $("#close").on("click", () => {
        $("#add_doc").hide(200)
    })





    var  images_file = [];

    $('#imagefile').on("change", function () {
        images_file = [];
        //diable submit button
        $(':input[type="button"]').prop('disabled', true);
        var fileSelecter = this;

        for (var i = 0; i < fileSelecter.files.length; i++) {


            loadImage(fileSelecter.files[i], (err, data) => {
                images_file.push(data)
                if(fileSelecter.files.length == i)
                {
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







    $(document).ready(() => {


        var index = ($("#his").text().trim()).split(',');





        for (var i = 0; i < index.length; i++) {
            putaill(index[i]);
        }

        ready = true;

    })

    function select_doc(index, _id) {

        record = index;



        $('.docbtn').css('background-color', '#ffffff')

        $('#' + _id).css('background-color', 'rgb(112, 147, 194)')

        find_items(record)

    }


    $("#history").change(() => {
        if (ready) {
            socket.emit('update_patient_history', { the_id:$('#content').attr("patient_id"), history: $("#history").val().trim() });
        }
    })

    $("#note").change(() => {

        console.log("cc")
        if (ready) {
            socket.emit('update_patient_note', { the_id: $('#content').attr("patient_id"), note: $("#note").val() });
        }
    })


    function changeAction(_id, _action) {
        $.ajax({
            type: "POST",
            url: "/switch_action",
            data: {
                id: _id,
                action: _action
            }
        }).done(function (o) {
            console.log(o);

            if (o.success == 1) {

                $('#' + o.id).text(o.action)
                $('#' + o.id).css("background-color", "#" + o.col)
                $('#xxx' + o.id).css("background-color", "#9eca98")
            }
        })

    }





    function add_note_item() {



        $.ajax({
            type: "POST",
            url: "/add_item",
            data: {
                mode: 0,
                note: $("#note_box").val(),
                patient: $('#content').attr("patient_id"),
                record: record
            }

        }).done(function (o) {

            if (o.success == 1) {
                find_items()
            }
        })
    }
    function add_recipe_item() {







        $.ajax({
            type: "POST",
            url: "/add_item",
            data: {
                mode: 2,
                name: $('#content').attr("patients_name"),
                note: $("#note_box").val(),
                patient: $('#content').attr("patient_id"),
                record: record,
                med_list: JSON.stringify(medlist)
            }

        }).done(function (o) {

            if (o.success == 1) {
                find_items()
                $('#add_recipe').hide();
            }
        })
    }
    function add_sacn_item() {

        $("#add_scan").fadeOut(200)

        $.ajax({
            type: "POST",
            url: "/add_item",
            data: {
                mode: 1,
                name: $('#content').attr("patients_name"),
                note: $("#scan_note").val(),
                patient: $('#content').attr("patient_id"),
                record: record,
                images: images
            }

        }).done(function (o) {

            if (o.success == 1) {
                find_items()


            }
        })
    }



    
    function add_images_item() {

        $("#add_scan").fadeOut(200)

        $.ajax({
            type: "POST",
            url: "/add_item",
            data: {
                mode: 1,
                name: $('#content').attr("patients_name"),
                note: $("#img_note").val(),
                patient: $('#content').attr("patient_id"),
                record: record,
                images: images_file
            }

        }).done(function (o) {

            if (o.success == 1) {
                find_items()


            }
        })
    }


    function find_items() {


        socket.emit('get_items', { the_id: $('#content').attr("patient_id"), record: record, name:$('#content').attr("patients_name") });

    }
    $('.medname').keyup(() => {


        $('#med').show()
        socket.emit('search_med_name', { index: $('.medname').val(), id: $('#content').attr("patient_id") })
    })

    socket.on('update_med_name', (docs) => {


        var data = docs.data


        $('#med').empty();

        if ($('.medname').val() != '') {



            for (var i = 0; i < data.length; i++) {


                $('#med').append(`
        
        
                                        <div class='showmed' array-name='${data[i].name}'>
                                            <a onclick='select_med("${data[i].name}")'>
                                            <div>${data[i].name}</div>
                                            ${(data[i].notallowed != '') ? `<div style="font-size: small;  color: rgb(145, 12, 12);"> ${" يتعارض مع التاريخ الطبي  : <snap class='tag2'>" + data[i].notallowed} </sanp> </div>` : ''}
                                            </a>
                                        </div>
        
        `)

            }
        }
    })




    function select_med(index) {
        $('#med').empty();

        $('.medname').val(index)

        $('#med_details').hide()

        $('#med').on('click', () => {
            $('#med').hide()
        })
    }
    function add_med() {

        var id = Date.now()

        medlist.push({ medname: $('.medname').val(), medvalue: $('.medvalue').val(), mednote: $('.mednote').val(), id: id })

        $('#medlist').append(`
        
<div class ="medlist showmed drltr pointer" array-name='${$('.medname').val()}' style="font-size:21px"> <div class ='flex'><div class="num" style = 'margin-right:8px'></div><div style="font-weight: bold;flex:3;">${$('.medname').val() + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'}</div><div style = 'flex:2'>${$('.medvalue').val()}</div><a class="x list-delete noselect" array-delete="${id}"><i class="fas fa-times-circle"></i></a> </div> <div>${$('.mednote').val()}</div> </div>
        `)



        $('.medname').val('')
        $('.medvalue').val('')
        $('.mednote').val('')

        colormedlist();
    }


    $(document).on("click", '.list-delete', (e) => {
        var id = $(e.currentTarget).attr("array-delete");

        for (let i = 0; i < medlist.length; i++) {
            if (medlist[i].id == id) {
                medlist.splice(i, 1)
            }
        }

        $(e.currentTarget).parent("div").parent("div").remove()
        $('#med_details').hide()
        colormedlist()
    })

    function colormedlist() {
        var key = false;
        var medlist = document.querySelectorAll(".medlist");
        var num = document.querySelectorAll(".num");
        for (var i = 0; i < medlist.length; i++) {
            if (!key) {
                medlist[i].style.backgroundColor = "#EEEEEE";
                key = true;
            }
            else {
                medlist[i].style.backgroundColor = "#FFFFFF";
                key = false;
            }

            num[i].innerHTML = '' + (i + 1) + '.'
        }
    }



    $('.close').on('click', (e) => {
        $(e.currentTarget).parent("div").parent('div').parent('div').fadeOut(100)
    })


    $(document).on("mouseenter", '.showmed', (e) => {

        var id = $(e.currentTarget).attr("array-name");

        $.ajax({
            type: "GET",
            url: `/med_details?name=${id}`,
        }).done(function (o) {

            if (o.success == 1) {

                $('#med_det').text(o.med.details)
                $('#med_not').html(dottext(o.med.history))
                $('#med_side').text(o.med.side_effect)
                $('#med_eff').text(o.med.Active_ingredient_name)

                $('#med_details').css('transform', ' translate(50%, -50%)')
                $('#med_details').show()
            }

        })




    })
    $(document).on("mouseleave", '.showmed', (e) => {
        console.log("scs")

        $('#med_details').hide()
    })

    $(document).on("mouseenter", '.showmed_in', (e) => {

        var id = $(e.currentTarget).attr("array-name");

        $.ajax({
            type: "GET",
            url: `/med_details?name=${id}`,
        }).done(function (o) {

            if (o.success == 1) {

                $('#med_det').text(o.med.details)
                $('#med_not').html(dottext(o.med.history))
                $('#med_side').text(o.med.side_effect)
                $('#med_eff').text(o.med.Active_ingredient_name)

                $('#med_details').css('transform', ' translate(-55%, -50%)')
                $('#med_details').show()
                $('#med_details').css('top', e.screenY + 110);
                $('#med_details').css('left', e.screenX);
            }


        })



    })
    $(document).on("mouseleave", '.showmed_in', (e) => {
        console.log("scs")

        $('#med_details').hide()
    })


    function dottext(index) {
        var subject_text = ""
        var text = index.replace(",", '\n').replace(",", '\r').replace(",", '\n')
        subject_text = '<li style="color:black">' + text;

        subject_text = subject_text.replace(/\n/g, '</li><li style="color:black">')
            .replace(/\r/g, '</li><li style="color:black">')
            .replace(/\r\n/g, '</li><li style="color:black">')
        console.log(subject_text)

        return subject_text;
    }



    socket.on('update_items', (doc) => {


        draw_items(doc.items, doc.recipe, doc.selected_record)


    })

    function draw_items(data, recipes, selected_record) {

        $('#items').empty();

        if (selected_record.sign_out) {
            var color = 'rgb(254 212 212)'

            $('#tools').hide()
        }
        else {
            var color = 'rgb(212, 233, 254)'

            $('#tools').slideDown(200)
        }

        if (selected_record.type) {
            $('#items').append(`  <div class="card" style="position: relative; background-color: ${color};">
                                            <div class="card-body flex">
                                                العرض السريري
                                                <div  style="position: absolute; left: 5%; ">
                                                <span style=" left: 5%; margin-right: 50px;">  رقم الطابق : ${selected_record.floor} </span>
                                                <span style="margin-right: 20px;"> رقم الغرفة : ${selected_record.room}</span>
                                                <span style="margin-right: 20px;"> رقم السرير : ${selected_record.bed}</span>
                                               
                                                <span style="margin-right: 20px;"> ${(selected_record.sign_out) ? 'تم تسجيل الخروج' : `<a class="btn btn-primary" onclick="patient_sgin_out('${selected_record._id}')"> تسجيل الخروج</a>`}</span>
                                            </div>
                                            </div>

                                        </div>`)
        }



        for (var i = 0; i < data.length; i++) {

            if (data[i].mode == 0) {
                $('#items').append(` <div class="card" style="margin-top: 10px;">
                                            <div class="card-body" style="background-color: rgb(249, 251, 253);">
                                                <div class="flex" style ="font-size: small;">
                                                    <div style="flex: 1;">ملاحظة</div>
                                                    <div><i class="fas fa-clock" style="margin-left: 5px;"></i> ${data[i].date}
                                                       ${data[i].time}</div>
                                                    <div><i class="fas fa-id-badge"
                                                            style="margin-left: 5px;margin-right: 20px;"></i>${data[i].data_entry_name}
                                                    </div>

                                                </div>
                                                <hr style="margin: 0.3rem 0">

                                                <h5>
                                                    ${data[i].note}
                                                </h5>

                                            </div>
                                        </div>`)

            }
            else if (data[i].mode == 2) {

                var meds = []
                var selected_recipe;
                for (var x = 0; x < recipes.length; x++) {
                    if (data[i]._id == recipes[x].item_id) {

                        meds = recipes[x].med_list
                        selected_recipe = recipes[x]
                    }

                }

                var list = ''
                for (var y = 0; y < meds.length; y++) {
                    list = list + `<div class ="showmed_in medlist drltr pointer" array-name='${meds[y].medname}' style="font-size:21px; background-color:  ${(y % 2 == 0) ? '#f1f1f0' : 'white'}; "> <div class ='flex'><div style = 'margin-right:8px'>${(y + 1) + '. '}</div><div style="font-weight: bold;flex:3;">${meds[y].medname + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'}</div><div style = 'flex:2'>${meds[y].medvalue}</div> </div> <div>${meds[y].mednote}</div> </div>`
                }

                $('#items').append(` <div  class="card" style="margin-top: 10px;  max-width: 550px;">
                                            <div class="card-body" style="background-color: rgb(223 233 246);">
                                                <div class="flex" style ="font-size: small; gap:5px">
                                                    <div >وصفة طبية</div>
                                                    <a onclick="print_recipe('${data[i]._id}')" style="flex: 1;"><i class="fas fa-print"></i></a>
                                                    <div><i class="fas fa-clock"></i> ${data[i].date}
                                                       ${data[i].time}</div>
                                                    <div><i class="fas fa-id-badge"
                                                            style="margin-left: 5px;m"></i>${data[i].data_entry_name}
                                                    </div>

                                                </div>
                                                <hr style="margin: 0.3rem 0">

                                                <div id='${data[i]._id}' class="card" style="background-color: #fdfdfd;">
                <br>
                <div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center;">
                        <div>
                            <div style="font-size: 20px; font-weight: bold; color: blue;"> ${selected_recipe.data_entry_name}</div>
                            <div style="height: 12px;"></div>
                            <div>طبيب</div>
                        </div>
                        <div>
                            <div style="font-size: 20px; font-weight: bold;">${selected_recipe.data_entry_name}</div>

                            <div>طبيب</div>
                        </div>
                        <div>
                            <div style="font-size: 20px; font-weight: bold;">${selected_recipe.data_entry_name}</div>
                            <div>طبيب</div>
                        </div>

                    </div>

                </div>
                <div class="card-body">
                    <div style=" min-height: 400px; ">
                        <hr style="border: 1px solid rgb(0, 47, 150); opacity: 1;">
                        <div
                            style="display: grid; grid-template-columns: 2fr 1fr ; text-align: right; padding: 0 0.5rem;">
                            <div>
                                ${selected_recipe.name + 'الاسم : '}
                            </div>
                            <div>
                                الـعمر  :  + ${$('#content').attr("age")}
                            </div>
                            <div>
                                ${selected_recipe.date}
                            </div>
                        </div>
                        <hr style="border: 1px solid rgb(0, 47, 150); opacity: 1;">

                        <div>

                            <div id="medlist">
                                ${list}
                            </div>


                           
                        </div>


                    </div>


                </div>

            </div>
                                                
                                              
                                                    
                                                  
                                              

                                            </div>
                                        </div>`)
            }
            else if (data[i].mode == 1) {

                var list = ''
                var list2 = ''

                if (data[i].images.length == 1) {
                    list2 = `<img style='width:500px' src='${data[i].images[0]}'>`
                }
                else {
                    for (var x = 0; x < data[i].images.length; x++) {
                        list = list + `<img class='itemimage' src='${data[i].images[x]}'>`
                    }
                }


                $('#items').append(` <div class="card" style="margin-top: 10px; ${(list2 != '') ? ' max-width: 550px;' : ''}">
                                            <div class="card-body" style="background-color: rgb(223 233 246);">
                                                <div class="flex" style ="font-size: small;">
                                                    <div style="flex: 1;">ملاحظة</div>
                                                    <div><i class="fas fa-clock" style="margin-left: 5px;"></i> ${data[i].date}
                                                       ${data[i].time}</div>
                                                    <div><i class="fas fa-id-badge"
                                                            style="margin-left: 5px;margin-right: 20px;"></i> ${data[i].data_entry_name}
                                                    </div>

                                                </div>
                                                <hr style="margin: 0.3rem 0">

                                                <h5>
                                                    ${data[i].note}
                                                </h5>
                                                <br>
                                                <div style ='display: grid; grid-template-columns: 1fr 1fr 1fr;'>
                                                    ${list}
                                                    </div>
                                                <div>
                                                    ${list2}
                                                </div>

                                            </div>
                                        </div>`)


            }
            else if (data[i].mode == 3) {

                $('#items').append(` <div class="card" style="margin-top: 10px;">
                                            <div class="card-body" style="background-color: rgb(241 224 225);">
                                                <div class="flex" style ="font-size: small;">
                                                    <div style="flex: 1;">موعد</div>
                                                    <div><i class="fas fa-clock" style="margin-left: 5px;"></i> ${data[i].date}
                                                       ${data[i].time}</div>
                                                    <div><i class="fas fa-id-badge"
                                                            style="margin-left: 5px;margin-right: 20px;"></i>${data[i].data_entry_name}
                                                    </div>

                                                </div>
                                                <hr style="margin: 0.3rem 0">

                                                <h4 style='text-align: center;'>
                                                    ${data[i].note_extra}
                                                </h4>
                                                <h5>
                                                    ${data[i].note}
                                                </h5>

                                            </div>
                                        </div>`)


            }
        }



        var $target = $('#items');
        $target.animate({ scrollTop: $target.height() + 8000 }, 200);
    }





    function putaill(index) {
        var e = $.Event("keypress", { which: 13 });

        $('.bootstrap-tagsinput').find('input').val(index).trigger(e);







        socket.emit('update_patient_history', { the_id: $('#content').attr("patient_id"), history: $("#history").val() });
    }



    var images = []



    var scanRequest = {
        "use_asprise_dialog": true, // Whether to use Asprise Scanning Dialog
        "show_scanner_ui": false, // Whether scanner UI should be shown
        "twain_cap_setting": { // Optional scanning settings
            "ICAP_PIXELTYPE": "TWPT_RGB" // Color
        },
        "output_settings": [{
            "type": "return-base64",
            "format": "jpg"
        }]
    };



    function scan() {
        images = []
        $("#add_scan").fadeToggle(200)
        scanner.scan(displayImagesOnPage, scanRequest);
    }
    function open_imge()
    {
        $("#add_images").fadeToggle(200)
    }

    /** Processes the scan result */
    function displayImagesOnPage(successful, mesg, response) {
        if (!successful) { // On error
            console.error('Failed: ' + mesg);
            return;
        }
        if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
            console.info('User cancelled');
            return;
        }
        var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
        for (var i = 0;
            (scannedImages instanceof Array) && i < scannedImages.length; i++) {
            var scannedImage = scannedImages[i];
            images.push((scannedImage.src).toString().split("\n").join(""))


            var elementImg = scanner.createDomElementFromModel({
                'name': 'img',
                'attributes': {
                    'class': 'scanned',
                    'src': scannedImage.src
                }
            });
            (document.getElementById('images') ? document.getElementById('images') : document.body).appendChild(elementImg);
        }
    }


    function add_date() {

        if ($('#time').val() != '' && $('#appo_date').val() != '') {
            $.ajax({
                type: "POST",
                url: "/add_item",
                data: {
                    mode: 3,
                    note: $("#appo_note").val(),
                    patient: $('#content').attr("patient_id"),
                    record: record,
                    name: $('#content').attr("patients_name"),
                    phone_number: $('#content').attr("patients_phone_number"),
                    action: $('#content').attr("patients_action"),
                    time: $('#time').val(),
                    reason: $('#content').attr("patients_name") +'  تم الاضافة من قبل الطبيب',
                    date: $('#appo_date').val(),

                }
            }).done(function (o) {


                if (o.success == 1) {
                    find_items()
                }
            })
        }
    }
    $("#form").submit(function (e) {
        e.preventDefault();
        $("#add_appo").hide(100)
    });
    function open_date() {
        $('#add_appo').fadeToggle(100)
    }
    function edit_patient(index) {
        window.location.href = "/edit_patient?id=" + index + "&last_page=" + window.location.href;
    }


    function roomtype() {

        $('#sleep_det').slideToggle()

    }

    function patient_sgin_out(index) {
        $.ajax({
            type: "POST",
            url: "/patient_sgin_out",
            data: {
                id: index
            }


        }).done(function (o) {

            if (o.success == 1) {
                find_items()
            }

        })
    }


    function patient_account(id) {
        window.location.href = '/patient_account?id=' + id
    }

    var PHE = printHtmlElement;
    function print_recipe(id){
        console.log(id)
        PHE.printElement(document.getElementById(id));
    }

