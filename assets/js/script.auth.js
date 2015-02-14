(function(){

    // Clean url if we come from angular
    location.hash = '';

    $(document).ready(function(){

        var APP_CONFIG = window.APP_CONFIG;

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
            },
            submitHandler: function(form){
                var data = {
                    email: $("#form-register input[name='email']").val(),
                    password: $("#form-register input[name='password']").val()
                };
                $.post( APP_CONFIG.routes.api.auth.signup, data)
                    .done(function(data, textStatus, jqXHR){
                        //localStorage.token = data.token;
                        var redirectURL = data.redirect;
                        //$.cookie('SID', data.token, 'localhost');
                        window.location.replace(redirectURL);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        switch(jqXHR.status){
                            case 400:
                                var message = (jqXHR.responseText) ? jqXHR.responseText : 'Invalid credentials';
                                toastr.error( message );
                                break;
                            default:
                                toastr.error( 'An error occured' );
                                console.error(jqXHR, textStatus);
                                break;
                        }
                    })
                    .always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {

                    });

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
            },
            submitHandler: function(form){
                var data = {
                    email: $("#form-login input[name='email']").val(),
                    password: $("#form-login input[name='password']").val()
                };
                $.post( APP_CONFIG.routes.api.auth.signin, data)
                    .done(function(data, textStatus, jqXHR){
                        //localStorage.token = data.token;
                        var redirectURL = data.redirect;
                        //$.cookie('SID', data.token, 'localhost');
                        window.location.replace(redirectURL);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        switch(jqXHR.status){
                            case 400:
                                toastr.error( 'Invalid credentials' );
                                break;
                            default:
                                toastr.error( 'An error occured' );
                                console.error(jqXHR, textStatus);
                                break;
                        }
                    })
                    .always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {

                    });

            }
        });



    });
    
})();

