app.controller('login', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope) {

  $rootScope.selecthome();
   // alert();
    if ($cookieStore.get('userinfo')) {

        $location.path('/dashboard/home')
    }

    //create table at local database to store the data of users information at time of login
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS userinfo (id INTEGER PRIMARY KEY AUTOINCREMENT, uid, phone_no, email_address, country_id, date_added)');

    });

   /*  if ($cookieStore.get('userinfo')) {
        $location.path('/dashboard/home');
    } */

   // 
    loading.deactive();


    $scope.SentToforgot = function () {
        $location.path('/forgot');
    }

    $scope.signup = function () {
        $location.path('/register');
    }

    $scope.default_hit = function(){

        var args = $.param({
           country_id : sessionStorage.country,
           user_id : $cookieStore.get('userinfo').uid,
           token : sessionStorage.u_ids
        });
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/cart/opt_cart_by_token_over_user_id',
            data: args 

        }).then(function (response) {
            console.log(response);
        }).finally(function(){

        })
    }

   
    // $scope.mobile_no = '8299334781';
    $scope.phoneVerifiedStatus = false;
    $scope.loginuser = function (form) {
        ///console.log($scope.mobileno);return;
		
		$scope.lang_codes=sessionStorage.lang_code;
       if($scope.lang_codes =='en'){
        if ($scope[form].$error) {
            //  alert("Error");
            var error_str = '';
            if ($scope[form].mobileno.$error.required !== undefined || $scope[form].mobileno.$error.number) {
                error_str += "Mobile Number, ";
            }
            if ($scope[form].userpassword.$error.required !== undefined) {
                error_str += "Password";
            }

            if (error_str !== '') {
                error_str = "<span style='font-weight:700;'> Following field must have valid information:</span><br/>" + error_str;
               alert(error_str);
                // model.show('Alert', error_str);
            }
        };
		
		 
	}
	else
	{
		 if ($scope[form].$error) {
            //  alert("Error");
            var error_str = '';
            if ($scope[form].mobileno.$error.required !== undefined || $scope[form].mobileno.$error.number) {
                error_str += "رقم الهاتف المحمول, ";
            }
            if ($scope[form].userpassword.$error.required !== undefined) {
                error_str += "كلمه السر";
            }

            if (error_str !== '') {
                error_str = "<span style='font-weight:700;'>يجب أن تحتوي الحقول التالية على معلومات صالحة:</span><br/>" + error_str;
               alert(error_str);
                // model.show('Alert', error_str);
            }
        };
	}
        if ($scope[form].$valid) {

            // var reg5 = /^[0-9]{7,15}$/;
			 var reg5 = /^[0-9]{7,15}$/;
          if($scope.lang_codes =='en'){
				/*if (reg5.test($scope.mobileno) == false) {
					error_str = "Mobile Number should contain Numbers Only & Length should be 7 to 15";
					model.show('Alert', error_str);
					// alert(error_str);
					return false;
				} */

				if (jQuery.isEmptyObject($scope.userpassword)) {
					error_str += "Password";
					error_str = "<span style='font-weight:700;'> Following field must have valid information:</span><br/>" + error_str;
					model.show('Alert', error_str);
					// alert(error_str)
					return false;
				}
		  }
		  else
		  {
			 if (reg5.test($scope.mobileno) == false) {
					error_str = "يجب أن يحتوي رقم الجوال على أرقام فقط وطولها من 7 إلى 15";
					model.show('Alert', error_str);
					// alert(error_str);
					return false;
				} 

				if (jQuery.isEmptyObject($scope.userpassword)) {
					error_str += "Password";
					error_str = "<span style='font-weight:700;'> يجب أن يحتوي الحقل التالي على  معلومات صالحة:</span><br/>" + error_str;
					model.show('Alert', error_str);
					// alert(error_str)
					return false;
				}  
		  }
            loading.active();

            var args = $.param({
                login_mobile_number: $scope.mobileno,
                login_password: $scope.userpassword,
                language_code:sessionStorage.lang_code
            });

            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/auth/login',
                data: args //forms user object

            }).then(function (response) {
                console.log("---------------");
                console.log(response);
                
                if (response.data.responseStatus == 'success') {
                    db.transaction(function (tx) {
                        tx.executeSql('INSERT INTO userinfo ( uid, phone_no, email_address, country_id, date_added) VALUES ("' + response.data.data.id + '","' + response.data.data.mobile_number + '","' + response.data.data.email + '","' + response.data.data.country_id + '","' + response.data.data.created_date + '")');
                    });
                    var fname = response.data.data.first_name;
                    var lname = response.data.data.last_name;

                    var fullName = fname+" "+lname;
                    // console.log(fullName);
                    var userinfo = {
                        'uid': response.data.data.id,
                        'phone_no': response.data.data.mobile_number,
                        'email_address': response.data.data.email,
                        'country_id': response.data.data.country_id,
                        'fullName' : fullName,
                        'user_type' : response.data.data.user_type,
                        'address' : response.data.data.address,
                        'country_code' : response.data.data.country_code,
						 'profile_image' : response.data.data.profile_image,
                        'from'    : 'login',
                        'left_data':response.data.data  
                    }
                    $cookieStore.put('userinfo', userinfo);
                    $scope.default_hit();
					$rootScope.loginlogout();
                    $location.path('/dashboard/home');

                } else {

                    if(response.data.responseMessage == 'Your account is not verified please Verify OTP !'){
                        var setOTPCookies = {
                            'mobile_number': $scope.mobileno,
                            'from' : 'login'
                    }
                        $cookieStore.put('otpverification', setOTPCookies);
						if($scope.lang_codes =='en'){
							  alert('Please Verify OTP');
						}else
						{
							 alert('يرجى التحقق من OTP');
						}
                       
                        $location.path('/otp');
                        return false;
                    }else if(response.data.responseMessage == 'Invalid login credentials'){
                        if($scope.lang_codes =='en'){
                          alert('Mobile Number is Invalid');
						}else
						{
					      alert('رقم الجوال غير صالح');	
						}
                    
                    }else if(response.data.responseMessage =='Password does not match !'){
                        if($scope.lang_codes =='en'){
                         alert('Password is Invalid');
						}
						else
						{
						 alert('كلمة المرور غير صالحة');	
						}
                    
                    }else{

                        alert(response.data.responseMessage);
                    }
                    //model.show('Alert', response.data.responseMessage);
                }

            }).finally(function () {
                loading.deactive();
            });
         
        }
    };

/*     $scope.default_hit = function() {
        var args = $.param({
           
        });
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/default_lang_country',
            data: args 

        }).then(function (response) {

            res = response;

           console.log(res.data.data.default_language_country);

           if(res.data.data.status == 'success'){
            sessionStorage.country = res.data.data.default_language_country.default_country_id;
            sessionStorage.country_name = res.data.data.default_language_country.COUNTRY_NAME;
                sessionStorage.lang = res.data.data.default_language_country.default_language;
                sessionStorage.lang_code = res.data.data.default_language_country.language_code;
                sessionStorage.currency = res.data.data.default_language_country.currency;
               console.log("-----aaa-------"); 
               console.log(sessionStorage) 
               $translate.use(sessionStorage.lang_code);
               $location.path('/dashboard/home');
           }else{

           }

        })
    } */

});