app.controller('mycoupons', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope, $route) {

$rootScope.selecthome();

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }

  //  var GlobalUID = $cookieStore.get('userinfo').uid; //Global Uid for get the response by sending the http request.

    
    //loading.deactive();

    $scope.backtohome = function () {
        $location.path('/dashboard/home');
        //window.history.back();
    }

    $scope.orders = function () {
        $location.path('myaccount/account');
        //window.history.back();
    }

    $scope.currentDate = new Date();

    /**
     * Funtion: ordersInit from my_orders.html on ng-init
     * Name: Sajal Goyal
     * Created-on: 05/10/2018 at 12:45pm
     * Get the order list by sending the http request
     */


    $scope.ordersInit = function () {

        loading.active();

        var args = $.param({
            country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             user_type: $cookieStore.get('userinfo').user_type,
             language_code : sessionStorage.lang_code
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/my_coupons',
            data: args 

        }).then(function (response) {

            res = response;

           console.log(res.data.responseStatus);
           if(res.data.responseStatus == 'success'){
            $scope.order_list = res.data.data.my_coupon;
           }else{
               $scope.order_list= '';
			   $scope.lang_codes=sessionStorage.lang_code; 
			   if($scope.lang_codes =='en')
			   {
				  alert("Coupon Doesn't Exist");  
			   }else
			   {
				  alert("القسيمة لا توجد");   
			   }
               
           }

        }).finally(function () {
            loading.deactive();
        });


    }

    $scope.orderDetails = function (orderID) {
        $location.path('/order/myorderdetails');
    }

});