app.controller('user_register', function ($rootScope, $scope, $http, $location, $interval, $cookieStore, model, loading, $filter) {

$rootScope.selecthome();

    $scope.backwithremove = function(){
        $cookieStore.remove('regdata');
        window.history.back();
    } 

    if ($cookieStore.get('userinfo')) {
        $location.path('/dashboard/home');
        return false;
    }

    if($cookieStore.get('regdata')){
    $scope.fname = $cookieStore.get('regdata').fname
    $scope.lname = $cookieStore.get('regdata').lname
    $scope.mob_number = $cookieStore.get('regdata').mob_number
    $scope.email = $cookieStore.get('regdata').email
    $scope.referal_code = $cookieStore.get('regdata').referal_code
    $scope.retailer = $cookieStore.get('regdata').retailer
    $scope.conditions = $cookieStore.get('regdata').conditions
    }

    $scope.terms = function () {

        var regdata = {
            fname:$scope.fname,
            lname:$scope.lname,
            mob_number:$scope.mob_number,
            email:$scope.email,
            referal_code:$scope.referal_code,
            retailer:$scope.retailer,
            conditions:$scope.conditions
        }
        $cookieStore.put('regdata',regdata)

        $location.path('/terms');
    }

	
	/*-----------------get Country Code -------------------------------*/
	  $scope.countryInit = function () {
        loading.active();
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/get_country_code',
            data: '' 

        }).then(function (response) {
            res = response;
           console.log(res.data.responseStatus);
           if(res.data.responseStatus == 'success'){
            $scope.countrycode_list = res.data.data.country_code;
			console.log($scope.countrycode_list);
           }else{
               $scope.countrycode_list= '';
            alert("No Country Code Exits");
           }

        }).finally(function () {
            loading.deactive();
        });


    }
	/*--------------------------------------------------------------------*/
	
	
	
	$scope.login = function(){
        $location.path('/login');
    }
	
	
	
	
	
	
	
    $scope.user_registers = function (form) {
        // loading.active();return
        var error_str = '';
		$scope.lang_codes=sessionStorage.lang_code;
		if($scope.lang_codes == 'en')
		{
			
				if ($scope[form].$error) {

				if ($scope[form].fname.$error.required !== undefined) {
					error_str += "First Name, ";
				}

				if ($scope[form].lname.$error.required !== undefined) {
					error_str += "Last Name, ";
				}

				if ($scope[form].email.$error.required !== undefined || $scope[form].email.$error.email) {
					error_str += "Email Id, ";
				}
				if ($scope[form].mob_number.$error.required !== undefined) {
					error_str += "Mobile Number, ";
				}

				if ($scope[form].password.$error.required !== undefined) {
					error_str += "Password, ";
				}

				 if ($scope[form].terms.$error.required !== undefined) {
					error_str += "Terms & Conditions, ";
				} 
				

			}
			setTimeout(function () {
				error_str = error_str.substr(0, error_str.lastIndexOf(', '));
				if (error_str !== '') {
					error_str = " <span style='font-weight:700;'>Following fields must have valid information:</span></br>" + error_str;
					//model.show('Alert', error_str);
					alert(error_str)
					return false;
				}
			}, 100);
			
			
		}else{
			   if ($scope[form].$error) {

				if ($scope[form].fname.$error.required !== undefined) {
					error_str += "الاسم الاول, ";
				}

				if ($scope[form].lname.$error.required !== undefined) {
					error_str += "الكنية, ";
				}

				if ($scope[form].email.$error.required !== undefined || $scope[form].email.$error.email) {
					error_str += "عنوان الايميل, ";
				}
				if ($scope[form].mob_number.$error.required !== undefined) {
					error_str += "رقم الهاتف المحمول, ";
				}

				if ($scope[form].password.$error.required !== undefined) {
					error_str += "كلمه السر, ";
				}

				 if ($scope[form].terms.$error.required !== undefined) {
					error_str += "البنود و الظروف, ";
				} 
				

			}
			setTimeout(function () {
				error_str = error_str.substr(0, error_str.lastIndexOf(', '));
				if (error_str !== '') {
					error_str = " <span style='font-weight:700;'>يجب أن تحتوي الحقول التالية على معلومات صالحة:</span></br>" + error_str;
					//model.show('Alert', error_str);
					alert(error_str)
					return false;
				}
			}, 100);
			
		}
        

        if($scope[form].$valid){
            var reg1 = /^[^%\s]{6,}$/;
            var reg2 = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
            var reg3 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            var reg4 = /^[a-zA-Z ]+$/;
            //var reg5 = /^[^0][0-9]{6,15}$/;
            var reg5 = /^[0-9]{7,15}$/;
            var reg6 = /^(?=.*?[a-z])(?=.*?[0-9]).{6,}/;
            if($scope.lang_codes == 'en')
		{
					if (reg4.test($scope.fname) == false) {
						error_str = "First Name should contain Alphabets Only";
						model.show('Alert', error_str);
						// alert(error_str);
						return false;
					}

					if (reg4.test($scope.lname) == false) {
						error_str = "Last Name should contain Alphabets Only";
						model.show('Alert', error_str);
						// alert(error_str);
						return false;
					}

					if (reg3.test($scope.email) == false) {
						error_str = " Please enter proper Email-ID ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}

					if (reg1.test($scope.password) == false) {
						error_str = " Password should contain at least one Character & Number and length should be 6 minimum! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}

					if (reg5.test($scope.mob_number) == false) {
						error_str = "Mobile Number should contain Numbers Only & Length should be 7 to 15";
						model.show('Alert', error_str);
						// alert(error_str);
						return false;
					}
					if (reg6.test($scope.password) == false) {
						error_str = " Password should contain at least one Character & one Number and length should be 6 minimum! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}
	    }
           else {
		      if (reg4.test($scope.fname) == false) {
						error_str = "يجب أن يحتوي الاسم الأول على الحروف الهجائية فقط";
						model.show('Alert', error_str);
						// alert(error_str);
						return false;
					}

					if (reg4.test($scope.lname) == false) {
						error_str = "يجب أن يحتوي اسم العائلة على الحروف الهجائية فقط";
						model.show('Alert', error_str);
						// alert(error_str);
						return false;
					}

					if (reg3.test($scope.email) == false) {
						error_str = " الرجاء إدخال معرف البريد الإلكتروني المناسب ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}

					if (reg1.test($scope.password) == false) {
						error_str = " يجب أن تحتوي كلمة المرور على حرف ورقم واحد على الأقل ، ويجب ألا يقل طولها عن 6! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}

					if (reg5.test($scope.mob_number) == false) {
						error_str = "يجب أن يحتوي رقم الجوال على أرقام فقط وطولها من 7 إلى 15";
						model.show('Alert', error_str);
						// alert(error_str);
						return false;
					}
					if (reg6.test($scope.password) == false) {
						error_str = " يجب أن تحتوي كلمة المرور على حرف واحد ورقم واحد على الأقل ، ويجب ألا يقل الطول عن 6 أحرف! ";
						// model.show('Alert', error_str);
						alert(error_str);
						return false;
					}
		   
	   }		
        }
		
		
        if($('#retailer').prop('checked') == true){
            // alert();return;
            $scope.retailer = 'on';
        }else{
            $scope.retailer = '';
          }
         $scope.country_code=$("#country_code").val();
        if (error_str == '') {

            loading.active();
            var args = $.param({
                first_name: $scope.fname,
                last_name: $scope.lname,
                email: $scope.email,
                mobile_number: $scope.mob_number,
                password: $scope.password,
                language_code: sessionStorage.lang_code,
                referal_code: $scope.referal_code,
                i_am_retailer : $scope.retailer,
				country_code : $scope.country_code
            });
          
            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/auth/registration',
                data: args //forms user object

            }).then(function (response) {
                //loading.deactive();
                res = response;

                console.log("response from the server ")
                console.log(response.data)
                if(res.data.responseCode == 200){
                   
                    var setOTPCookies = {
                        'email': res.data.data.email,
                        'first_name': res.data.data.first_name,
                        'last_name': res.data.data.last_name,
                        'mobile_number': res.data.data.mobile_number,
                        'user_id': res.data.data.user_id,
                        'user_type': res.data.data.user_type,
                        'status':res.data.data.status,
                        'is_verify': res.data.data.is_verify,
                        'from' : 'register'
                    }
                    $cookieStore.put('otpverification', setOTPCookies);
					 if($scope.lang_codes == 'en')
					 {
						alert('Registered Successfully') 
					 }else
					 {
						alert('مسجل بنجاح')  
					 }
		          
                    
                    //console.log($cookieStore.get('otpverification'))
                    $cookieStore.remove('regdata');
                    $location.path('/otp');
                }else{
                    alert(res.data.responseMessage.error_msg);
                    return false;
                }

            }).finally(function () {
                loading.deactive();
            }) 
        }

    }
});