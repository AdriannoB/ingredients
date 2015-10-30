(function () {
  'use strict';
  angular.module('iValid.module')
    .directive('iValid', iValidate)
    .directive('iFormat', iFormat);

  iValidate.$inject = [
    '$parse',
    'iValid',
    'iUtils'
  ];
  function iValidate($parse, iValid, iUtils) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: LinkFn
    };

    function LinkFn(scope, element, attrs, ngModel) {
      if (attrs.iValid.length > 0) {
        attrs.iValid = attrs.iValid.replace(/\s+/g, '');

        var validationObject = iUtils.parseValidators(attrs.iValid);

        angular.forEach(validationObject, function (rules, key) {
          var validator = iValid.validators[key];

          if (validator.dynamic) {
            ngModel.$validators[key] = function (value) {
              var parsedRules = rules.map(function (rule) {
                return $parse(rule);
              });
              var args = [value, scope].concat(parsedRules);
              return validator.definition.apply(this, args);
            };
            scope.$watchGroup(rules, ngModel.$validate, true);
          } else {
            ngModel.$validators[key] = function (value) {
              var args = [value].concat(rules);
              return validator.definition.apply(this, args);
            };
          }
        });

        ngModel.$label = attrs.label;

        scope.$watch('errors', function () {
          scope.errors = ngModel.$error;
          scope.isDirty = ngModel.$dirty;
        }, true);

        // adds error object to scope of the field

        scope.checkErrors = checkErrors;
        scope.getErrorMessage = getErrorMessage;

      }

      function checkErrors() {
        var obj = scope.errors;
        if (obj == null) return false;
        if (obj.length > 0)    return true;
        if (obj.length === 0)  return false;
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) return true;
        }
        return false;
      }

      function getErrorMessage(key) {
        if (typeof iValid.validators[key] === 'undefined') {
          console.info('Unknown validator: ', key);
          return void 0;
        }
        return iValid.validators[key].message;
      }

    }
  }

  iFormat.$inject = [
    'iValid',
    'iUtils'
  ];
  function iFormat(iValid, iUtils) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: LinkFn
    };

    function LinkFn(scope, element, attrs, ngModel) {

      if (attrs.iFormat.length > 0) {
        attrs.iFormat = attrs.iFormat.replace(/\s+/g, '');

        var formatterObject = iUtils.string2Object(attrs.iFormat);

        angular.forEach(formatterObject, function (param, key) {

          var view_value;

          function formatFn(value) {
            var return_value;

            if (iValid.formatters[key] === undefined) {
              return console.info('Unknown formatter: ' + key)
            }

            if (iValid.formatters[key].definition(value, param)) {

              // if OK
              return_value = value;
              view_value = return_value;
              ngModel.$setValidity(key, true);
            } else {

              //if NOT ok
              return_value = view_value;
              ngModel.$setViewValue(view_value || '');
              ngModel.$render();
              ngModel.$setValidity(key, true);
            }
            return return_value;
          }

          ngModel.$formatters.push(formatFn);
          ngModel.$parsers.push(formatFn);

        });
      }
    }
  }

})();
