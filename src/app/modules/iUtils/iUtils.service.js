(function(){
  'use strict';
  angular.module('iUtils.module')
    .service('iUtils', iUtils);

  function iUtils() {
    return{
      string2Object: string2Object,
      parseValidators: parseValidators,
      deepFind: deepFind,
      objectByString: objectByString,
      arrayify: arrayify,
      objectify: objectify,
      getIndex: getIndex,
      guid: guid
    };
  }

  function string2Object(value) {
    return value.split('|').reduce(function (accumulator, val) {
      var pair = val.trim().split(':');
      accumulator[pair[0]] = pair[1] || null;
      return accumulator;
    }, {});
  }

  function parseValidators(validators) {
    return validators.split('|').reduce(function(accumulator, validator) {
      var tuple = validator.trim().split(':');
      var name = tuple[0];
      var rules = tuple.slice(1, tuple.length);
      accumulator[name] = rules && rules.length > 0 ? rules : null;
      return accumulator;
    }, {});

  }

    // use string to find
    function deepFind(obj, path) {
      var paths = path.split('.');
      var current = obj;
      var i;

      for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    }

  function objectByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }

  function arrayify(collection) {
    if (angular.isArray(collection)) {
      return collection;
    } else if (angular.isObject(collection)) {
      return Object.keys(collection).map(function(key) {
        var item = collection[key];
        item.$key = key;
        return item;
      });
    }
  }

  function objectify(collection) {
    if (angular.isArray(collection)) {
      return collection.reduce(function(object, item) {
        var key = item.$key;
        delete item.$key;
        object[key] = item;
        return object;
      }, {});
    } else if (angular.isObject(collection)) {
      return collection;
    }
  }

  function getIndex(item, collection) {
    if (angular.isArray(collection)) {
      return collection.indexOf(item);
    } else if (angular.isObject(collection)) {
      return Object.keys(collection)
        .filter(function(key){
          return collection[key] === item;
        })[0];
    }
  }

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


})();
