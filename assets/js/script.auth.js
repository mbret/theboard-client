(function(){

    // Clean url if we come from angular
    location.hash = '';

    $(document).ready(function(){

        // Get config from server
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
        };
        
        // Display errors if present
        $('.notification').each(function(index){
            toastr[$(this).data('type')]( $(this).text() );
        });

        function onSignSuccess(data, textStatus, jqXHR){
            window.location.replace(APP_CONFIG.routes.app);
        }

        function onSignError(action, jqXHR, textStatus, errorThrown){
            switch(jqXHR.status){
                case 400:
                    toastr.error(action === "login" ? APP_CONFIG.messages.ERROR_400_LOGIN : APP_CONFIG.messages.ERROR_400_REGISTER);
                    break;
                default:
                    toastr.error(APP_CONFIG.messages.ERROR_500);
                    break;
            }
        }

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
                $.post(APP_CONFIG.routes.signup, data)
                    .done(onSignSuccess)
                    .fail(onSignError.bind(this, "login"));
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
                $.post( APP_CONFIG.routes.signin, data)
                    .done(onSignSuccess)
                    .fail(onSignError.bind(this, "register"));
            }
        });

    });
    
})();

