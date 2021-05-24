app.controller('notification', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope) {

$rootScope.selecthome();
    //alert()
    if (!$cookieStore.get('userinfo')) {
        $location.path("/login");
        return false;
    }
	
	
	
	 $scope.backtohome = function () {
        $location.path('/dashboard/home');
      
    }
	
	$scope.more_notification =function (id)
	{
		   loading.active();
		   var args = $.param({
              order_id : id,
              });
			  
		$http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/update_order_status_notification',
            data: args 

        }).then(function (response) {
               res = response;
           if(res.data.responseCode == 200){
                  $cookieStore.put('orderID', id);	
                  $location.path('/order/myorderdetails')
            } else {
                 
        
            }

        }).finally(function () {
            loading.deactive();
        });
			  
			  
		
	}
    
 

    $scope.notify = function (form) {
        loading.active();
		
		   var args = $.param({
             user_id : $cookieStore.get('userinfo').uid,
			 country_id:sessionStorage.country
              });
		
		

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/get_notifaction',
		
            data: args 

        }).then(function (response) {

            res = response;

           if(res.data.responseCode == 200){
			  
                  $scope.count = res.data.data.get_order_notifaction.count;
				  $scope.notificationdata = res.data.data.get_order_notifaction.res;
            } if(res.data.data.get_order_notifaction.status =='error')
			{
				  $scope.count = '';
				  $scope.notificationdata = '';
				  $scope.No_Record_founds =res.data.data.get_order_notifaction.msg;
			}
			

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });


    };
});