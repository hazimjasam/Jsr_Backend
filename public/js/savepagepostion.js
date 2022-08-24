$('#content').scroll(function () {
    sessionStorage.scrollTop = $(this).scrollTop();
});
$(document).ready(function () {
    if (sessionStorage.scrollTop != "undefined") {
        $('#content').scrollTop(sessionStorage.scrollTop);
    }
});