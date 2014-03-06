describe('ezSpinnerSpec', function() {

  var el, $scope, $httpBackend, $interval, ezSpinnerService, ezSpinnerInterceptor, ezSpinnerConfig;

  beforeEach(function() {
    module('ez.spinner');
  });

  beforeEach(inject(function($compile, $rootScope, _$httpBackend_, _$interval_, _ezSpinnerService_, _ezSpinnerInterceptor_, _ezSpinnerConfig_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $interval = _$interval_;
    ezSpinnerService = _ezSpinnerService_;
    ezSpinnerInterceptor = _ezSpinnerInterceptor_;
    ezSpinnerConfig = _ezSpinnerConfig_;

    el = angular.element('<div ez-spinner></div>');

    $compile(el)($scope);
    $scope.$digest();
  }));

  it('should be able to show & hide spinner with ezSpinnerService', function() {
    ezSpinnerService.show();
    $scope.$digest();
    assert.isFalse(ezSpinnerService.hidden);
    assert.isFalse(el.hasClass('ng-hide'));

    ezSpinnerService.hide();
    $scope.$digest();
    assert.isTrue(ezSpinnerService.hidden);
    assert.isTrue(el.hasClass('ng-hide'));
  });

  it('should show & hide spinner with httpInterceptor', function() {
    var config = {
      url: 'some/url/path'
    };

    ezSpinnerInterceptor.request(config);

    $interval.flush(350); // flush init interval
    assert.isFalse(ezSpinnerService.hidden);

    $interval.flush(15050); // flush max interval
    assert.isTrue(ezSpinnerService.hidden);

    ezSpinnerInterceptor.request(config);
    $interval.flush(350); // flush init interval
    ezSpinnerInterceptor.request(config);
    $interval.flush(350); // flush init interval
    ezSpinnerInterceptor.response({config: config});
    assert.isFalse(ezSpinnerService.hidden);
    ezSpinnerInterceptor.response({config: config});
    assert.isTrue(ezSpinnerService.hidden);

    ezSpinnerInterceptor.request(config);
    $interval.flush(300); // flush init interval
    ezSpinnerInterceptor.request(config);
    $interval.flush(300); // flush init interval
    ezSpinnerInterceptor.responseError({config: config});
    assert.isFalse(ezSpinnerService.hidden);
    ezSpinnerInterceptor.responseError({config: config});
    assert.isTrue(ezSpinnerService.hidden);
  });

  it('should not show spinner with httpInterceptor if path is to be ignored', function() {
    var config = {
      url: 'some/ignore/path'
    };

    ezSpinnerConfig.ignorePathRegex = '.*(ignore).*';
    ezSpinnerInterceptor.request(config);

    assert.isTrue(ezSpinnerService.hidden);
  });


});

