app.controller('legal', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope) {

  $scope.terms_n_conditions = function(){
        $location.path('/terms');
    }
    $scope.privacy_policy = function(){
        $location.path('/policy');
    }
	
	 $scope.home = function() {
        //$location.path('/home');
        window.history.back();
    }

});