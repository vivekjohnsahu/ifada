app.controller('rewards', function ($scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation, $rootScope, $route) {

$rootScope.selecthome();

if (!$cookieStore.get('userinfo')) {
    $location.path("/login");
    return false;
}

$scope.myrewards = function(){
   
    loading.active();
        var args = $.param({
            user_id: $cookieStore.get('userinfo').uid,
            user_type: $cookieStore.get('userinfo').user_type
        });

        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/cart/reward',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            
            //  alert("response from the server ");
            if (res.data.responseStatus == 'success') {
                console.log(res); 
                $scope.redeemdata = res.data.data;
                $scope.loyality_points = res.data.data.loyalty_point_data;
                $scope.redeem_limit = res.data.data.redeem_limit;
                $scope.redeemhistory = res.data.data.reward_history;
                
            } else {
                alert(res.data.responseStatus);
            }
            // console.log(response);

        }).finally(function () {
            //loading.deactive();
        })
}

/* $scope.lesspoints = function(){

    alert('No Enough Points');
} */

$scope.reddempoints = function(){
    
    if($scope.loyality_points < $scope.redeem_limit){
		$scope.lang_codes=sessionStorage.lang_code;
		if($scope.lang_codes == 'en')
		{
          alert('You can not redeem now. Minimum point should be '+$scope.redeem_limit);
          return false;
		}
		else
		{
		 alert('لا يمكنك استبدالها الآن. يجب أن تكون النقطة الدنيا '+$scope.redeem_limit);
          return false;	
		}
    }
    console.log('gvhjfhjfc')
    loading.active();
    var args = $.param({
        user_id: $cookieStore.get('userinfo').uid,
        loyalty_point : $scope.redeemdata.loyalty_point_data
    });

    $http({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        url: app_url + '/cart/redeem_points',
        data: args //forms user object

    }).then(function (response) {
        loading.deactive();
        res = response;
        console.log(res)
        //  alert("response from the server ");
        if (res.data.data.status == 'success') {
			if($scope.lang_codes == 'en')
		    {
			  alert('Points Redeem Successfully');	
			}else
			{
			  alert('استبدال النقاط بنجاح');		
			}
            
            $scope.myrewards();
        } else {
			 if($scope.lang_codes == 'en')
		    {
              alert('Error..Points not Redeem');
			}
			else
			{
			  alert('خطأ .. لا يتم استبدال النقاط');	
			}
        }
        // console.log(response);

    }).finally(function () {
        //loading.deactive();
    })
    
}

});