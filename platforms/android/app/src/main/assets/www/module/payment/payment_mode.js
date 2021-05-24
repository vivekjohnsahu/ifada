app.controller('payment_mode', function ($scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation, $rootScope, $routeParams) {

$rootScope.selecthome();
    
	$scope.currency=sessionStorage.currency_new;
    if (!$cookieStore.get('userinfo')) {
        $location.path("/login");
        return false;
    }

    if(!$cookieStore.get('cart')){
        //alert('Some Problem in Cart');
        $location.path('/cart');
        return false;
    }

    if($rootScope.wallet_amount == 0 || $rootScope.wallet_amount == 0.00){
        $("#checkbox1").attr("disabled", true);
    }
    // On ng-change of wallet checkbox for check that wallet have enough amount or not
    $scope.selectwallet = function(){
        if($('#checkbox1').prop('checked') == true){
            
            if($rootScope.wallet_amount >= $rootScope.finalTotal){
				
                $scope.form.payby = '';
                $scope.paybywallet = '1';
                $scope.is_wallet_apply = '1';
            }else{
				
                $scope.paybywallet = '';
                $scope.is_wallet_apply = '1';
				$scope.cod= '1';
				$scope.form.payby = '';
				
            }
			if(sessionStorage.lang_code == 'en'){
               alert('Pay by Wallet');
			}else
			{
			 alert('الدفع عن طريق محفظة');	
			}				
            //return false; 
        }else{
            $scope.paybywallet = '';
            $scope.is_wallet_apply = '';
			$scope.cod= '';
			$scope.form.payby = '';
        }
       
    }
    if(!$cookieStore.get('coupon_data')){
        var coupon_code = '';
        var coupon_id = '';
        var percentage = '';
    }else{
        var coupon_code = $cookieStore.get('coupon_data').coupon_code;
        var coupon_id = $cookieStore.get('coupon_data').coupon_id;
        var percentage = $cookieStore.get('coupon_data').percentage;
    }

    clearInterval(setget);

    $scope.form ={}
    $scope.payment = function(form){
		//alert($scope.form.payby);
		
        console.log($scope.is_wallet_apply)
        if($scope.paybywallet != 1){
		if(sessionStorage.lang_code == 'en'){
			if ($scope[form].$error) {
				
				var error_str = '';
				
					/*if ($scope[form].payby.$error.required !== undefined) {
					  error_str += "Payment Method";
					}*/
					
				   if ($scope.form.payby==undefined ||  $scope.form.payby == '')
				  {
				   error_str += "Payment Method";
				  }
					
					if (error_str !== '') {
						error_str = "<span style='font-weight:700;'> Following field must have valid information:</span><br/>" + error_str;
					   alert(error_str);
						return false;
					}
			}
		}else
		{
			if ($scope[form].$error) {
				
				var error_str = '';
				
					/*if ($scope[form].payby.$error.required !== undefined) {
					  error_str += "Payment Method";
					}*/
					
				   if ($scope.form.payby==undefined ||  $scope.form.payby == '')
				  {
				   error_str += "طريقة الدفع او السداد";
				  }
					
					if (error_str !== '') {
						error_str = "<span style='font-weight:700;'>يجب أن يحتوي الحقل التالي على معلومات صالحة:</span><br/>" + error_str;
					   alert(error_str);
						return false;
					}
			}
		}
    }
        if($scope.form.payby == '2'){
			    
          
            $scope.ref = null;
            $scope.getStateSecondWindow = function() 
            { 
			      localStorage.setItem('isCloseSelf', '');
				  localStorage.setItem('isCloseSelf', 'no');
                  $scope.ref.executeScript(
                    {code: "localStorage.getItem('isCloseSelf')"},
                    function(data)
                    {
                       // alert(JSON.parse(data)[0])
                          if (data == 'yes')
                        {
                        
                           // $cookieStore.put('order_id',JSON.parse(data)[1]);
                            $cookieStore.remove("coupon_data");
							localStorage.setItem('isCloseSelf','');
                            $rootScope.usercartvalue();
                           
                           $scope.ref.close();
                        } 
                    }
                );

            }
               
			     
                //$scope.onSubmit = function(){
                //$scope.ref = window.open('http://projects.tekshapers.in/nss/payments/getRSA.php' + '?orderId=' + $scope.data.orderId + '&amount=' + $scope.data.amount,'_blank','location=no');
                $scope.ref = window.open(payment_url +'completeorder/onlineOrder' + '?user_id='+$cookieStore.get('userinfo').uid+'&country_id='+sessionStorage.country+'&payment_mod='+$scope.form.payby+'&is_wallet_apply='+$scope.is_wallet_apply+'&address='+$cookieStore.get('aid')+'&coupon_code='+coupon_code+'&coupon_id='+coupon_id+'&currency='+sessionStorage.currency_new+'&percentage='+percentage ,'_blank','location=no');
                $scope.ref.addEventListener('loadstart', function(event) {
					  setInterval($scope.getStateSecondWindow, 5000);

				});
                $scope.ref.addEventListener('loadstop', function(event) {
                    setInterval($scope.getStateSecondWindow, 5000);
                });
				
			   $scope.ref.executeScript({code: "localStorage.removeItem('isCloseSelf')"});
                $scope.ref.addEventListener('exit', function(event) {  });
			    
                $location.path('/dashboard/home');
                return false;
				
        // http://localhost/ifadabeta/completeorder/onlineOrder?user_id=52&country_id=2&payment_mod=2&is_wallet_apply=2&address=5&coupon_code=IHIUH&coupon_id=1&percentage=10
        
        
        }

 
        console.log($scope.form.payby)
        loading.active();

        var args = $.param({
            user_id : $cookieStore.get('userinfo').uid,
            country_id : sessionStorage.country,
            payment_mod : $scope.form.payby,
            is_wallet_apply : $scope.is_wallet_apply,
            address : $cookieStore.get('aid'),
            coupon_code : coupon_code,
            coupon_id : coupon_id,
            percentage : percentage,
        });
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/cart/place_order',
            data: args 

        }).then(function (response) {

            res = response;
           if(res.data.data.status == 'success')
           {
                $cookieStore.put('order_id',res.data.data.order_id);
                $cookieStore.remove("coupon_data");
                $rootScope.usercartvalue();
                $location.path('/thankyou');
           }
           else{
               alert("Some Problem in Payment Check Your Cart Again");
                $location.path('/cart');
           }

        }).finally(function () {
            loading.deactive();
        });
       
        
    }
});