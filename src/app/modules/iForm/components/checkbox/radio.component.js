(function(){

  'use strict';

  angular
    .module('radio.component', [])
    .directive('iRadio', iRadio);

  iRadio.$inject = [
    '$compile'
  ];
  function iRadio($compile) {
    return{
      restrict: 'E',
      replace: true,
      scope: true,
      compile: compileFn
    };

    function compileFn() {
      return {
        pre:
          function (scope, iElement, attrs) {

            var a = attrs;

            var fieldClasses = ' class="i-radio" ng-class="{error: checkErrors()}"';
            var inputName = (a.name) ? ' name="' + a.name + '"': '';
            var disabled = (a.disabled) ? ' ng-disabled="'+ a.disabled + '"' : '';
            var model = (a.model) ? ' ng-model="'+ a.model +'"' : '';
            var id = (a.id) ? ' id="'+ a.id || a.name +'"' : '';
            var xid = (a.xid) ? ' x-id="'+ a.xid +'"' : '';

            var label = '<label class="radiolabel" for="'+ id +'">'+a.label+'</label>';

            var html =
              '<div' + fieldClasses + '>' +
                '<input' +
                  id + xid +
                  ' type="radio"' +
                  model +
                  inputName +
                  disabled +
                '/>' +
                label +
              '</div>';

            var elementToInject = angular.element(html);
            iElement.replaceWith(elementToInject);
            $compile(elementToInject)(scope);
          }
      };
    }
  }

})();
