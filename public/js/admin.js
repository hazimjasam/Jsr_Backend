var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

var coll = document.getElementsByClassName("collapsiblev2");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = "fit-content";
    }
  });
}


function disable_btn(id)
{
    $('#'+id).prop("disabled", true);
    $('#'+id).html('تحميل ...')
}
function enable_btn(id,index = '+ اضافة')
{
    $("#"+id).removeAttr('disabled');
    
    $('#'+id).html(index) 
}















