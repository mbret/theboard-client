(function() {
    'use strict';

    /**
     *
     * http://srobbin.com/jquery-plugins/backstretch/
     */
    angular
        .module('app.directives')
        .directive('widgetIframe', widgetIframe);

    widgetIframe.$inject = ['$rootScope', '$log', '$window', '$timeout', 'config'];

    /**
     * widget-iframe directive
     *
     * This new directive is about the widget iframe container
     */
    function widgetIframe ($rootScope, $log, $window, $timeout, config) {

        return {
            restrict: 'AE', // attribute name
            scope: {
                widget: '=widget'
            },
            // Here we use a template. It means that everything inside will use the directive controller instead of parent
            templateUrl: config.routes.templates + '/widget-iframe.tmpl.html',

            // Link is run after compilation
            // Separation of concern (here is DOM code)
            link: function(scope, element, attrs) {

                // Get jquery iframe element
                var $widgetElt = element.children('.widget-iframe');
                var $widgetRawElt = $widgetElt[0];
                var widgetID = scope.widget.identityHTML; // .Attr('id') return angular '{{foo}}' because directive is loaded before some angular work (you got it):/

                // This code is run after all render queue
                // Here all {{foo}} are replaced by value
                $timeout(function () {

                });

                /**
                 * On load event
                 * @description When iframe is loaded, send an init signal directly
                 */
                $widgetElt.bind("load" , function(e){

                });

                /**
                 * When user send a signal to widget
                 */
                scope.$on('widget-signal', function(ev, widget, signal, hash){
                    // event to specific widget
                    if( angular.equals(widget, scope.widget) /* widget && widget.identityHTML == scope.widget.identityHTML*/ ){
                        $widgetRawElt.contentWindow.window.location.hash =  encodeURIComponent(hash);
                    }
                    // event to everyone
                    else if(widget == null){
                        //$widgetElt[0].src = sUrl + '#' + encodeURIComponent(hash);
                        $widgetRawElt.contentWindow.window.location.hash = encodeURIComponent(hash);
                    }
                    else{
                        // not for me
                    }
                });

                scope.$on('widget-reload', function(ev, widget){
                    if(widget.id === scope.widget.id){
                        $widgetRawElt.contentWindow.window.location.hash = '';
                        $widgetRawElt.contentDocument.location.reload();
                    }
                });



            },
            // Controller is run after general controller but before link of this directive
            // It ran before compilation
            // http://jasonmore.net/angular-js-directives-difference-controller-link/
            // So we keep separation of concern (here is logic code)
            controller: function($scope, $element, widgetService, $modal){

                var widget = $scope.widget; // We get widget as its a scoped var from html

                // Display option menu for specific widget
                // The dialog use another controller
                // We pass our sub controller (as the sub controller is defined inside parent he can reach the same var)
                $scope.showOptions = function($event) {
                    var modalInstance = $modal.open({
                        templateUrl: config.routes.templates + '/widget-iframe-options.tmpl.html',
                        controller: dialogController,
                        size: 'sm',
                        resolve: {
                            widget: function(){
                                return widget;
                            }
                        }
                    })
                        .result.then(function (result) {
                            $scope.result = result;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                };

                // Controller for dialog box
                // We cannot use the same because the dialog is open in another controller with reduce scope
                // Instead of create new controller alonside others we define here a sub controller
                // We could have used the global var of the parent controller but we prefer doing a complete declaration (widgetService or widget was available from parent)
                var dialogController = function($scope, $modalInstance, widgetService, widget, modalService, notifService, config){
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
                            required: option.required
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
                            if($scope.options.length > 0){
                                console.log($scope.options);
                                // Loop over all options bound with <form>
                                // Set the new value to the widget
                                angular.forEach($scope.options, function(option, index){
                                    if(option.type === 'select'){
                                        // Option can be null
                                        if( option.value && option.value.label ){
                                            widget.setOptionValue(option.id, option.value.label);
                                        }
                                        else{
                                            widget.setOptionValue(option.id, null);
                                        }
                                    }
                                    else{
                                        widget.setOptionValue(option.id, option.value);
                                    }
                                });
                                widget.saveOptions()
                                    .then(function(){
                                        // Update local widget
                                        notifService.success( config.messages.success.widget.updated );
                                        widget.rebuildIframeURL(); // this method cause an automatic refresh
                                        $scope.ok();
                                    }).catch(function(err){
                                        modalService.simpleError(err.message);
                                    });
                            }
                            else{
                                notifService.info( config.messages.nochange );
                                $scope.ok();
                            }
                        }
                        else{
                            notifService.error( config.messages.errors.form.invalid );
                        }
                    }
                };
            }
        }
    }
})();
