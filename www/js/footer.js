
/* Input Form Close */
$('.input-form input').on('keyup click', function(){
    if ($(this).val() != '') {
        $(this).siblings('.input-close').show();
    }
});
$('.input-form input').on('blur', function(){
        $(this).siblings('.input-close').hide();
});
$('.input-form .input-close').on('click', function(){
    $(this).siblings('input').val('');
    $(this).siblings('input').focus();
});
    