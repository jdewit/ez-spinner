angular.module('ez.spinner', [])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('ezSpinnerInterceptor');
}])

.constant('ezSpinnerConfig', {
  ignorePathRegex: '', // Do not show a spinner on matching paths
  initWait: 300,
  maxWait: 15000
})

.provider('ezSpinnerService', function ezSpinnerService() {
  this.$get= [function() {
    return {
      callback: null,
      hidden: true,
      numLoadings: 0,
      show: function() {
        this.hidden = false;

        if (typeof this.callback === 'function') {
          this.callback(this.hidden);
        }
      },
      hide: function() {
        this.hidden = true;
        this.numLoadings = 0;

        if (typeof this.callback === 'function') {
          this.callback(this.hidden);
        }
      }
    };
  }];
})

.service('ezSpinnerInterceptor', ['$q', '$interval', 'ezSpinnerConfig', 'ezSpinnerService', function($q, $interval, ezSpinnerConfig, ezSpinnerService) {
  var t;

  var cancelTimeout = function() {
    if (t) {
      $interval.cancel(t);
    }
  };

  var pathNotIgnored = function(path) {
    return !(ezSpinnerConfig.ignorePathRegex && path.match(ezSpinnerConfig.ignorePathRegex));
  };

  return {
    'request': function(config) {
      cancelTimeout();

      if (pathNotIgnored(config.url)) {
        ezSpinnerService.numLoadings += 1;

        t = $interval(function() {
          if (ezSpinnerService.numLoadings > 0) {
            ezSpinnerService.show();
          }

          t = $interval(function() { // prevent spinner from hanging
            ezSpinnerService.hide();
          }, ezSpinnerConfig.maxWait, 1);
        }, ezSpinnerConfig.initWait, 1);
      }

      return config || $q.when(config);
    },
    'response': function(response) {
      if (pathNotIgnored(response.config.url)) {
        ezSpinnerService.numLoadings -= 1;

        if (ezSpinnerService.numLoadings < 1) {
          ezSpinnerService.hide();
          cancelTimeout();
        }
      }

      return response || $q.when(response);
    },
    'responseError': function(response) {
      if (pathNotIgnored(response.config.url)) {
        ezSpinnerService.numLoadings -= 1;

        if (ezSpinnerService.numLoadings < 1) {
          ezSpinnerService.hide();
          cancelTimeout();
        }
      }

      return $q.reject(response);
    }
  };
}])

.directive('ezSpinner', ['ezSpinnerService', function(ezSpinnerService) {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div class="ez-spinner" ng-hide="hidden"></div>',
    compile: function(element, attrs) {
      if (attrs.text) {
        element.append('<p>' + attrs.text + '</p>');
      }

      return function(scope) {
        scope.hidden = true;

        ezSpinnerService.callback = function(hidden) {
          scope.hidden = hidden;
        };
      };
    }
  };
}]);
