(function(){
  'use strict';
  angular.module('iForm.module', ['iForm.components'])
    .directive('iForm', iForm);

  iForm.$inject = ['$compile'];
  function iForm($compile) {
    return {
      restrict: 'E',
      scope: true,
      transclude: true,
      link: linkFn,
      controller: 'FormController',
      controllerAs: 'formCtrl'
    };


    function linkFn(s,e,a,c, $transcludeFn) {
      var submit = (a.submit) ? ' ng-submit="'+ a.submit +'"' : '';
      var name = a.name || a.id;
      var classes = ' class="i-form ' + (a.classes || '') + ' "';
      var xId = (a.xId) ? ' x-id="' + a.xId + '"': '';

      var formElement =
        '<form ' + classes + xId +
          'name="' + name + '"' +
          'id="' + name + '" novalidate' +
               submit +
        '>' +
        '</form>';

      var html = $compile(formElement)(s);
      var form = s[name];
      s.form = form;

      $transcludeFn(s, function (clone) {
        html.append(clone);
        e.replaceWith(html);
      });

      function submitIfValid(event) {
        event.preventDefault();
        c.submitted = true;
        if (form.$valid) {
          c.submit();
        }
      }
    }
  }

})();
