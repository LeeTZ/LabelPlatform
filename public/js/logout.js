function logout(){
    $.cookie("userId", null, { path: '/' });
    window.location = $(location)[0].origin;


}
$(document).ready(function() {
    if ($.cookie('isSuper') === "false") {
        $('#overview').hide();
    }
});
$('#logout').click(function(){
    logout();
});