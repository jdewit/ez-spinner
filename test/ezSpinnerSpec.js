describe('ezSpinnerSpec', function() {

  var el, $scope, $httpBackend, $timeout, ezSpinnerService, ezSpinnerInterceptor, ezSpinnerConfig;

  beforeEach(function() {
    module('ez.spinner');
  });

  beforeEach(inject(function($compile, $rootScope, _$httpBackend_, _$timeout_, _ezSpinnerService_, _ezSpinnerInterceptor_, _ezSpinnerConfig_) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
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

    $timeout.flush(); // flush init timeout
    assert.isFalse(ezSpinnerService.hidden);

    $timeout.flush(); // flush max timeout
    assert.isTrue(ezSpinnerService.hidden);

    ezSpinnerInterceptor.request(config);
    $timeout.flush(); // flush init timeout
    ezSpinnerInterceptor.request(config);
    $timeout.flush(); // flush init timeout
    ezSpinnerInterceptor.response({config: config});
    assert.isFalse(ezSpinnerService.hidden);
    ezSpinnerInterceptor.response({config: config});
    assert.isTrue(ezSpinnerService.hidden);

    ezSpinnerInterceptor.request(config);
    $timeout.flush(); // flush init timeout
    ezSpinnerInterceptor.request(config);
    $timeout.flush(); // flush init timeout
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

