ez-spinner
==============

Show a spinner on ajax requests using an http interceptor or via the ezSpinnerService.

Demo
----

See <a href="http://plnkr.co/edit/veyt75SMdhyD9wR2WwsY?p=preview">plunkr of index.html</a> 

Install
-------

```bash
$ bower install ez-spinner
```

Usage 
-----

1. Add ez.spinner to your apps modules.
2. Include dist assets to your page
3. Add ez-spinner directive anywhere on your page
4. Style the '.ez-spinner' div with your own css

```html
  <body ng-app="yourApp">
    <ez-spinner><p>Chill out dude</p><ez-spinner>
  </body>
```


## Using the ezSpinnerService

``` js
yourApp.controller(function($scope, ezSpinnerService) {

  $scope.showSpinner = function() {
    ezSpinnerService.show();  
  };

  $scope.hideSpinner = function() {
    ezSpinnerService.hide();  
  };

});
```

***
Generated with <a href="http://github.com/jdewit/generator-ez-module">ez-module generator</a>
