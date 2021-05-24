app.controller('accountpage', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope) {

$scope.country_name=sessionStorage.country_name_new;
$scope.lang_codes=sessionStorage.lang_code; 

if($scope.lang_codes == 'en')
{
	$scope.languages='English';
}
else{
	$scope.languages='Arabic';
}



if ($cookieStore.get('userinfo')) {
        $scope.loggedin = true;
		$scope.type = $cookieStore.get("userinfo").user_type;
		$scope.fullName = $cookieStore.get("userinfo").fullName; 
		$scope.email = $cookieStore.get("userinfo").email_address;
        $scope.country_code = $cookieStore.get("userinfo").country_code;  	
        $scope.mobile_number = $cookieStore.get("userinfo").phone_no;  
		 $scope.country_code = $cookieStore.get("userinfo").country_code;  
            if($cookieStore.get("userinfo").profile_image == ''){
                $scope.profileImage = '';
                console.log($scope.profileImage)
            }else{ 

                $scope.profileImage = profile_image_path +$cookieStore.get("userinfo").profile_image; 
            }
    } 


   
             
    

   $scope.login = function(){
        $location.path('/login');
    }

   $scope.register = function(){
        $location.path('/register');
    }
	 $scope.wallet = function(){
			$location.path('/wallet');
		}
  	$scope.my_address = function(){
        $location.path('/address');
    }
	
	 $scope.myorder = function(){
        $location.path('/order/myorder');
    }

   $scope.profile = function(){
        $location.path('/myaccount/profile');
    }
	
	
	 $scope.language = function(){
        $location.path('/language');
    }
	
	$scope.switch_country = function(){
        $location.path('/switch_country');
    }
	$scope.legal = function(){
        $location.path('/legal');
    }
});