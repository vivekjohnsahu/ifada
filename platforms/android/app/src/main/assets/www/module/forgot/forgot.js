app.controller('forgot', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope) {

$rootScope.selecthome();
    
    loading.deactive();

    if ($cookieStore.get('userinfo')) {
        $location.path('/dashboard/home');
    }


    //alert();
    /*if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }*/

    // function for back button on login page created by sajal
    $scope.backToLogin = function () {
        $location.path('/login');
        //window.history.back();
    }

    /*  $scope.home = function() {
         //$location.path('/home');
         window.history.back();
     } */

    /**
     * Function Name : forgot_password
     * Created By : Sajal Goyal
     * Created Date : 10/10/2018 at 06:05pm
     * Post The Mobile Number send the OTP By http request
     */


    $scope.forgot_password = function (form) {
		var res = '';
		 $scope.lang_codes=sessionStorage.lang_code;
         if($scope.lang_codes =='en'){
        //if fields are invalid
				if ($scope[form].$error) {
					var error_str = '';
					
					if ($scope[form].mobile_no.$error.required !== undefined || $scope[form].mobile_no.$error.number) {
						error_str += "Mobile Number ";
					}

					if (error_str !== '') {
						error_str = "<span style='font-weight:700;'> Following field must have valid information:</span><br/> " + error_str;
						// model.show('Alert', error_str);
						alert(error_str);
					}
				};
	    }else
		{
			if ($scope[form].$error) {
					var error_str = '';
					
					if ($scope[form].mobile_no.$error.required !== undefined || $scope[form].mobile_no.$error.number) {
						error_str += "رقم الهاتف المحمول ";
					}

					if (error_str !== '') {
						error_str = "<span style='font-weight:700;'>يجب أن يحتوي احقل التالي على  معلومات صالحة:</span><br/> " + error_str;
						// model.show('Alert', error_str);
						alert(error_str);
					}
				};
		}
		
		
        if ($scope[form].$valid) {
            var reg5 = /^[0-9]{7,15}$/;
            if($scope.lang_codes =='en'){
				if (reg5.test($scope.mobile_no) == false) {
					error_str = "Mobile Number should contain Numbers Only & Length should be 7 to 15";
					model.show('Alert', error_str);
					// alert(error_str);
					return false;
				} 
			}
			else
			{
					if (reg5.test($scope.mobile_no) == false) {
					error_str = "يجب أن يحتوي رقم الجوال على أرقام فقط وطولها من 7 إلى 15";
					model.show('Alert', error_str);
					// alert(error_str);
					return false;
				} 

			}
            loading.active();

            var args = $.param({
                mobile_number_varify: $scope.mobile_no,
                Language_code:sessionStorage.lang_code
            });

            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/auth/forget',
                data: args //forms user object

            }).then(function (response) {

                res = response;
                
                if(res.data.responseStatus == 'error'){
					if($scope.lang_codes =='en'){
                       alert('Please Enter Registered Mobile Number');
					}else
					{
					   alert('الرجاء إدخال رقم الجوال المسجل');
					}
                }else{
					if($scope.lang_codes =='en'){
						alert('OTP Has been Sent Successfully on Your Email Address');
					}
					else
					{
					    alert('تم إرسال OTP بنجاح على عنوان بريدك الإلكتروني');
					}
                      
                    var setOTPCookies = {
                        'mobile_number': $scope.mobile_no,
                        'from' : 'forgot'
                }
                    $cookieStore.put('otpverification', setOTPCookies);
                    $location.path('/otp')     
                }
                // if (res.data.status == 'pass') {
                //     //put cookie and redirect it    
                //     //model.show('Alert', res.data.responseMessage);
                //     $cookieStore.put('userid',res.data.uid);
                //     var setOTPCookies = {
                //         'mobile': $scope.mobile_no,
                //         'uid': response.data.uid,
                //         'status': response.data.status,
                //         'from': 'login'
                //     }
                //     $cookieStore.put('otpverification', setOTPCookies);
                //     alert('Otp send successfully');
                //     $location.path('/otp');
                //     // return false;

                // } else {

                //     //Throw error if not logged in
                //     //model.show('Alert', res.data.responseMessage);
                //     alert("Invalid Mobile Number")
                // }


            }).finally(function () {
                loading.deactive();
            });




        }

    };

    /*  $scope.login = function () {
         $location.path('/login');
     } */

});