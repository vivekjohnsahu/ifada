app.controller('new_pass', function ($scope, $http, $location, $cookieStore, $timeout, loading, model, $rootScope) {

$rootScope.selecthome();
 if ($cookieStore.get('userinfo')) {
    $location.path('/dashboard/home');
}

$scope.forgot = function(form){
    
    //if fields are invalid
	$scope.lang_codes=sessionStorage.lang_code;
	if($scope.lang_codes == 'en'){
			if ($scope[form].$error) {
				var error_str = '';
			  
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
	 }
     else 
	 {
		 if ($scope[form].$error) {
				var error_str = '';
			  
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
					var reg2 = /[a-zA-Z]/;
					var reg3 = /[0-9]/;

					if (reg2.test($scope.new_pwd) == false) {
						error_str = " Password should contain at least one Character & one Number and length should be 6 minimum! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}
					if (reg3.test($scope.conf_pwd) == false) {
						error_str = " Password should contain at least one Character & one Number and length should be 6 minimum! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}
					
				}
	  }else
	  { 
             if ($scope[form].$valid) {   
					var reg2 = /[a-zA-Z]/;
					var reg3 = /[0-9]/;

					if (reg2.test($scope.new_pwd) == false) {
						error_str = " يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل ، ويجب ألا يقل الطول عن 6 أحرف! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}
					if (reg3.test($scope.conf_pwd) == false) {
						error_str = " يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل ، ويجب ألا يقل الطول عن 6 أحرف! ";
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
						error_str += "New Password and Confirm Password does not match.";
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
						error_str += "كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين.";
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

            var args = $.param({
                'user_id_verify': $cookieStore.get('userid'),
                'change_password' : $scope.new_pwd,
                'conform_password' : $scope.conf_pwd
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/auth/reset_password',
                data: args //forms user object

            }).then(function (response) {

                res = response;
                console.log(response);
                if (res.data.responseStatus == 'success') {
                   if($scope.lang_codes == 'en'){
                     alert('Password is successfully changed');
				   } else {
					    alert('تم تغيير كلمة المرور بنجاح'); 
				   }
                   
                   $cookieStore.remove('userid');
                   if(response.data.data.result.user_type == '6'){
                       console.log('fdsdsfd')
                    $location.path('/login');
                    }else{
                        var userinfo = {
                            'uid': response.data.data.result.id,
                            'phone_no': response.data.data.result.mobile_number,
                            'email_address': response.data.data.result.email,
                            'country_id': response.data.data.result.country_id,
                            'fullName' : response.data.data.result.first_name+" "+response.data.data.result.last_name,
                            'profile_image' : response.data.data.result.profile_image
                        }
                        $cookieStore.put('userinfo', userinfo);
                        console.log('ddddddfdsdsfd')
                        $location.path('/dashboard/home');
                    }
                } else {
                        if($scope.lang_codes == 'en'){
                          alert('Password not changed')
						}else{
							 alert('كلمة المرور لم تتغير')
						}
                }
            }).finally(function () {
                loading.deactive();
            });
        }


}
});    