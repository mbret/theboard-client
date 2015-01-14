$(document).ready(function(){

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });

    /*
     * Toastr
     * Notification plugin
     */
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "7000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    // Display errors if present
    $('.notification').each(function(index){
        toastr[$(this).data('type')]( $(this).text() );
    });

    // Form register
    $("#form-register").validate({
        rules: {
            password: {
                required: true,
                minlength: 3
            },
            email: {
                required: true
            }
        }
    });
    // Form login (for now only required is needed)
    $("#form-login").validate({
        rules: {
            password: {
                required: true
            },
            email: {
                required: true
            }
        }
    });


});