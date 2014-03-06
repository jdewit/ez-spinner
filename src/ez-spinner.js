angular.module('ez.spinner', [])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('ezSpinnerInterceptor');
}])

.constant('ezSpinnerConfig', {
  ignorePathRegex: '', // Do not show a spinner on matching paths
  initWait: 500,
  maxWait: 15000
})

.provider('ezSpinnerService', function ezSpinnerService() {
  this.$get= [function() {
    return {
      callback: null,
      hidden: true,
      show: function() {
        this.hidden = false;

        if (typeof this.callback === 'function') {
          this.callback(this.hidden);
        }
      },
      hide: function() {
        this.hidden = true;

        if (typeof this.callback === 'function') {
          this.callback(this.hidden);
        }
      }
    };
  }];
})

.service('ezSpinnerInterceptor', ['$q', '$timeout', 'ezSpinnerConfig', 'ezSpinnerService', function($q, $timeout, ezSpinnerConfig, ezSpinnerService) {
  var numLoadings = 0,
      t;

  return {
    'request': function(config) {
      numLoadings++;

      if (t) {
        $timeout.cancel(t);
      }

      t = $timeout(function() {

        if (numLoadings && (!(ezSpinnerConfig.ignorePathRegex && config.url.match(ezSpinnerConfig.ignorePathRegex)))) {
          ezSpinnerService.show();
        }

        t = $timeout(function() { // prevent spinner from hanging
          numLoadings = 0;
          ezSpinnerService.hide();
        }, ezSpinnerConfig.maxWait);

      }, ezSpinnerConfig.initWait);

      return config || $q.when(config);
    },
    'response': function(response) {
      if ((--numLoadings) === 0) {
        ezSpinnerService.hide();
        $timeout.cancel(t);
      }

      return response || $q.when(response);
    },
    'responseError': function(response) {
      if (!(--numLoadings)) {
        ezSpinnerService.hide();
        $timeout.cancel(t);
      }

      return $q.reject(response);
    }
  };
}])

.directive('ezSpinner', ['ezSpinnerService', function(ezSpinnerService) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div class="ez-spinner" ng-hide="hidden"><div ng-transclude></div></div>',
    link: function(scope) {
      scope.hidden = true;

      ezSpinnerService.callback = function(hidden) {
        scope.hidden = hidden;
      };
    }
  };
}]);
