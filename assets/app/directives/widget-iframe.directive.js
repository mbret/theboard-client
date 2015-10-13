(function() {
    'use strict';

    /**
     *
     *
     */
    angular
        .module('app.directives')
        .directive('widgetIframe', widgetIframe);

    widgetIframe.$inject = ['logger', 'APP_CONFIG', 'dataservice', 'widgetService'];

    /**
     * widget-iframe directive
     *
     * This new directive is about the widget iframe container
     */
    function widgetIframe (logger, APP_CONFIG, dataservice, widgetService) {

        return {
            restrict: 'AE', // attribute name
            scope: {
                widget: '=widget'
            },
            // Here we use a template. It means that everything inside will use the directive controller instead of parent
            templateUrl: APP_CONFIG.routes.templates + '/widget-iframe.tmpl.html',

            /**
             * Ran after angular compilation
             * Separation of concern (DOM only)
             * 
             * The iframe is always displayed but with visibility hidden when not active. Then we can get at the start of directive
             * the iframe dom element.
             */
            link: function(scope, element, attrs) {

                var widget = scope.widget;
                scope.widgetState = null;
                
                // Get iframe element as jquery
                var $widgetElt = element.find('.widget-iframe');
                var $widgetRawElt = $widgetElt[0]; // keep raw elt

                /**
                 * On load event
                 * When iframe is correctly loaded (url resolved)
                 * Put widget state to ready to make visible iframe
                 * - We need $apply as it's jquery binding
                 */
                $widgetElt.on("load" , function(e){
                    console.log(scope.widgetState);
                    scope.$apply(function(){
                        scope.widgetState = widgetService.VIEW_STATE_READY;
                    });
                });

                scope.$on('widget.state.changed', function(ev, widgetID, state){
                    if(widgetID === widget.id){
                        scope.widgetState = state;
                    }
                });
                
                /**
                 * When user send a signal to widget
                 */
                scope.$on('widget.signal', function(ev, widget, signal, hash){
                    if(scope.widgetState === widgetService.VIEW_STATE_READY){
                        // event to specific widget
                        if( angular.equals(widget, scope.widget) /* widget && widget.identityHTML == scope.widget.identityHTML*/ ){
                            $widgetRawElt.contentWindow.window.location.hash =  encodeURIComponent(hash);
                            window.scrollTo(0,0);
                        }
                        // event to everyone
                        else if(widget == null){
                            //$widgetElt[0].src = sUrl + '#' + encodeURIComponent(hash);
                            $widgetRawElt.contentWindow.window.location.hash = encodeURIComponent(hash);
                            window.scrollTo(0,0);
                        }
                        else{
                            // not for me
                        }
                    }
                });

                /**
                 * When the widget is prepared from controller.
                 * At this point widget is fully set and can be handle by the directive.
                 *
                 */
                scope.$on('widget.load', function(ev, targetWidget){
                    if(targetWidget.id === widget.id){
                        scope.widgetState = widgetService.VIEW_STATE_LOADING;
                        if( scope.iframeURL === widget.iframeURL ) forceReload();
                        else scope.iframeURL = widget.iframeURL; // maj url
                    }
                });
                
                scope.$on('widget.reload', function(ev, targetWidget){
                    if(targetWidget.id === widget.id){
                        scope.widgetState = widgetService.VIEW_STATE_RELOADING;
                        if( scope.iframeURL === widget.iframeURL ) forceReload();
                        else scope.iframeURL = widget.iframeURL; // maj url
                    }
                });
                
                // Force an iframe to reload, even if they have same url
                function forceReload(){
                    $widgetRawElt.contentWindow.window.location.hash = '';
                    $widgetRawElt.contentDocument.location.reload();
                }

            },
            // Controller is run after general controller but before link of this directive
            // It ran before compilation
            // http://jasonmore.net/angular-js-directives-difference-controller-link/
            // So we keep separation of concern (here is logic code)
            controller: function($scope, $element, widgetService, $uibModal, backstretch){

                var widget = $scope.widget; // We get widget as its a scoped var from html

                // Display option menu for specific widget
                // The dialog use another controller
                // We pass our sub controller (as the sub controller is defined inside parent he can reach the same var)
                $scope.showOptions = function($event) {
                    backstretch.pause();
                    var modalInstance = $uibModal.open({
                        templateUrl: APP_CONFIG.routes.templates + '/widget-iframe-options.tmpl.html',
                        controller: dialogController,
                        size: 'sm',
                        resolve: {
                            widget: function(){
                                return widget;
                            }
                        }
                    }).result
                        .then(function (result) {
                            $scope.result = result;
                        }).finally(function(){
                            backstretch.resume();
                            
                        })
                };

                // Controller for dialog box
                // We cannot use the same because the dialog is open in another controller with reduce scope
                // Instead of create new controller alonside others we define here a sub controller
                // We could have used the global var of the parent controller but we prefer doing a complete declaration (widgetService or widget was available from parent)
                var dialogController = function($scope, $modalInstance, widgetService, widget, modalService, notifService, APP_CONFIG){
                    $scope.widget = widget;

                    // Relative to modal
                    $scope.ok = function(){
                        $modalInstance.close(true);
                    };
                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };

                    // Relative to widgets
                    $scope.refresh = function(){
                        widgetService.sendSignal( widget, 'refresh' );
                    };
                    $scope.stop = function(){
                        widgetService.sendSignal( widget, 'stop' );
                    };
                    $scope.start = function(){
                        widgetService.sendSignal( widget, 'start' );
                    };

                    // Here we prepare different options the widget has configured
                    // A scope with specific options is created
                    // The html will loop over all these option and build a form that correspond
                    $scope.options = []; // This var is used by view to render all form
                    angular.forEach(widget.options, function(option){
                        var tmp = {
                            id: option.id,
                            label: option.name,
                            placeholder: option.placeholder,
                            type: option.type,
                            name: option.id,
                            value: option.value,
                            required: option.required,
                            tip: option.tip
                        };
                        // In case of select we need to do some more job
                        if(tmp.type === 'select'){
                            tmp.selectOptions = [];
                            // Loop over all select option to create the ng-options
                            angular.forEach(option.options, function(label , index){
                                var selectOption = { label:label, value:index };
                                tmp.selectOptions.push(selectOption);
                                if( label === option.value ){
                                    tmp.value = selectOption;
                                }
                            });
                        }
                        $scope.options.push(tmp);
                    });

                    // Form submit
                    $scope.updateOptionsFormSubmit = function(){
                        if($scope.updateOptionsForm.$valid){

                            // build options data
                            // Just an associative array of options
                            if(widget.hasOptions()){
                                var hasChanged = false;
                                // Loop over all options bound with <form>
                                // Set the new value to the widget
                                angular.forEach($scope.options, function(option, index){
                                    if(option.type === 'select'){
                                        // Option can be null
                                        if( option.value && option.value.label && (option.value.label !== widget.getOptionValue(option.id)) ){
                                            widget.setOptionValue(option.id, option.value.label);
                                            hasChanged = true;
                                        }
                                        else if( (!option.value || !option.value.label) && widget.getOptionValue(option.id) !== null ){
                                            widget.setOptionValue(option.id, null);
                                            hasChanged = true;
                                        }
                                    }
                                    else if ( option.value !== widget.getOptionValue(option.id) ){
                                        widget.setOptionValue(option.id, option.value);
                                        hasChanged = true;
                                    }
                                });
                                if( ! hasChanged){
                                    noChanges();
                                }
                                else{
                                    dataservice.updateWidget(widget)
                                        .then(function(){
                                            // Update local widget
                                            notifService.success( APP_CONFIG.messages.success.widget.updated );
                                            widget.buildIframeURL();
                                            widgetService.reload(widget);
                                            $scope.ok();
                                        }).catch(function(err){
                                            modalService.simpleError(err.message);
                                        });
                                }

                            }
                            else{
                                noChanges();
                            }
                            
                        }
                        else{
                            notifService.error( APP_CONFIG.messages.errors.form.invalid );
                        }

                        function noChanges(){
                            notifService.info( APP_CONFIG.messages.nochange );
                            $scope.ok();
                        }
                    }
                };
            }
        }
    }
})();
