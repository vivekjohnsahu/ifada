app.controller('changepassword', function ($scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation,$rootScope) {
	
    $rootScope.selecthome();
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }

   
    loading.deactive();

    // function for back button on my account page created by sajal
    $scope.my_account = function(){
        $location.path("myaccount/account");
    }

   /*  $scope.home = function() {
        //$location.path('/home');
        window.history.back();
    } */

    /**
     * Funtion: pwd_change from changepassword.html
     * Name: Sajal Goyal
     * Created-on: 12/10/2018 at 02:00pm
     * Change the password by sending the http request
     */

    $scope.pwd_change = function (form) {
        
        var res = '';
        //if fields are invalid
		$scope.lang_codes=sessionStorage.lang_code;
	if($scope.lang_codes == 'en'){
        if ($scope[form].$error) {
            var error_str = '';

            if ($scope[form].old_pwd.$error.required !== undefined)
            {
                error_str += "Current Password, ";
            }
            if ($scope[form].new_pwd.$error.required !== undefined)
            {
                error_str += "New Password, ";
            }
            if ($scope[form].conf_pwd.$error.required !== undefined)
            {
                error_str += "Confirm New Password, ";
            }
            error_str = error_str.substr(0, error_str.lastIndexOf(', '));

            if (error_str !== '')
            {
                error_str = " <span style='font-weight:700;'>Following fields must have valid information:</span> <br/> " + error_str;
                // model.show('Alert', error_str);
                alert(error_str);
            }
        }
	}else
	{
		  if ($scope[form].$error) {
            var error_str = '';

            if ($scope[form].old_pwd.$error.required !== undefined)
            {
                error_str += "كلمة المرور الحالية, ";
            }
            if ($scope[form].new_pwd.$error.required !== undefined)
            {
                error_str += "كلمة سر جديدة, ";
            }
            if ($scope[form].conf_pwd.$error.required !== undefined)
            {
                error_str += "تأكيد كلمة المرور الجديدة, ";
            }
            error_str = error_str.substr(0, error_str.lastIndexOf(', '));

            if (error_str !== '')
            {
                error_str = " <span style='font-weight:700;'>يجب أن تحتوي الحقول التالية على معلومات صالحة:</span> <br/> " + error_str;
                // model.show('Alert', error_str);
                alert(error_str);
            }
        }
	}		
       if($scope.lang_codes == 'en'){
       if ($scope[form].$valid) {
                var reg = /^[^%\s]{6,}$/;
                var reg2 = /[a-zA-Z]/;
                var reg3 = /[0-9]/;
                if (reg.test($scope.new_pwd) == false) {
                    error_str = " Password should contain at least one Character & one Number and length should be 6 minimum! ";
                    // model.show('Alert', error_str);
                    alert(error_str);
                    return false;
                }
                if (reg2.test($scope.conf_pwd) == false) {
                    error_str = " Password should contain at least one Character & one Number and length should be 6 minimum! ";
                    // model.show('Alert', error_str);
                    alert(error_str);
                    return false;
                }
                if (reg3.test($scope.new_pwd) == false) {
                    error_str = " Password should contain at least one Character & one Number and length should be 6 minimum! ";
                    // model.show('Alert', error_str);
                    alert(error_str);
                    return false;
                }
        }
	   }else
	   {
		   if ($scope[form].$valid) {
                var reg = /^[^%\s]{6,}$/;
                var reg2 = /[a-zA-Z]/;
                var reg3 = /[0-9]/;
                if (reg.test($scope.new_pwd) == false) {
                    error_str = " يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل ، ويجب ألا يقل الطول عن 6 أحرف! ";
                    // model.show('Alert', error_str);
                    alert(error_str);
                    return false;
                }
                if (reg2.test($scope.conf_pwd) == false) {
                    error_str = " يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل ، ويجب ألا يقل الطول عن 6 أحرف!  ";
                    // model.show('Alert', error_str);
                    alert(error_str);
                    return false;
                }
                if (reg3.test($scope.new_pwd) == false) {
                    error_str = " يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل ، ويجب ألا يقل الطول عن 6 أحرف!  ";
                    // model.show('Alert', error_str);
                    alert(error_str);
                    return false;
                }
        }  
	   }
        
        
        if ($scope[form].$valid) {
			if($scope.lang_codes == 'en'){
				if ($scope.conf_pwd != $scope.new_pwd)
				{
					error_str += "Password and Confirm Password does not match.";
				}

				if (error_str !== '')
				{
					//error_str = " ollowing fields must have valid information " + error_str;
					// model.show('Alert', error_str);
					alert(error_str);
					return false;
				}
			}else
			{
				if ($scope.conf_pwd != $scope.new_pwd)
				{
					error_str += "كلمة المرور وتأكيد كلمة المرور غير متطابقتين.";
				}

				if (error_str !== '')
				{
					//error_str = " ollowing fields must have valid information " + error_str;
					// model.show('Alert', error_str);
					alert(error_str);
					return false;
				}
			}
            
            
             loading.active();
             //console.log($scope.old_pwd)
            //store cookie if check box for remember me is checked and codition goes true only otherwise none
            var args = $.param({
                'user_id'  : $cookieStore.get('userinfo').uid,
                'old_password'   :   $scope.old_pwd,
                'new_password'   :    $scope.new_pwd,
                'confirm_new_password'   :    $scope.conf_pwd,
                'language_code'   :    sessionStorage.lang_code,
            });

            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/auth/change_password',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;
                
                if (res.data.responseStatus == 'success') {
                    
                    //put cookie and redirect it    
                    
                    // $cookieStore.remove("upload_ads_type");
                    // $cookieStore.remove("uploads_ads_detail");
                    // $cookieStore.remove("interestids_cookies");
                    // $cookieStore.remove("register_step1");
                    // model.show('Alert', res.data.responseMessage);
				  if($scope.lang_codes == 'en'){
                    alert("Password Changed Successfully")
				  }else
				  {
					alert("تم تغيير الرقم السري بنجاح")  
				  }
                    $cookieStore.remove('userinfo');
                    $location.path('/login');

                } else {
                   
                    //Throw error if not logged in
                     //model.show('Alert', res.data.responseMessage);
                     alert(res.data.responseMessage);
                }


            })/* .finally(function () {
                loading.deactive();
            }); */ 
        }

    };

   /*  $scope.reg = function () {
        $location.path('/register_step1');
    } */
   /*  $scope.forgot = function () {

        $location.path('/forgot');
    } */



});