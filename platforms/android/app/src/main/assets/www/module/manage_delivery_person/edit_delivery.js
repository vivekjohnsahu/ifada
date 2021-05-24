app.controller('edit_delivery', function ($rootScope, $scope, $http, $location, $interval, $cookieStore, model, loading, $filter) {
   $rootScope.selecthome();
   
      $scope.backtohome = function () {
        $location.path('/manage_delivery');
      
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
	
	
	
	
	/*-----------------get Country Code -------------------------------*/
	  $scope.get_detail = function () {
        loading.active();
		
		   var args = $.param({
				id:$cookieStore.get("delivery_person"),
			    lang_code : sessionStorage.lang_code
				
            });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/get_edit_delivery_person_data',
            data: args,

        }).then(function (response) {
            res = response;
            console.log(res.data.responseStatus);
           if(res.data.responseStatus == 'success'){
            $scope.ids = res.data.data.deliver_person_details.id;
			$scope.id = $scope.ids;
		    $scope.email = res.data.data.deliver_person_details.email;
			$scope.fname = res.data.data.deliver_person_details.first_name;
			$scope.lname = res.data.data.deliver_person_details.last_name;
			$scope.mob_number = res.data.data.deliver_person_details.mobile_number;
			$scope.password = res.data.data.deliver_person_details.password;
			$scope.status = res.data.data.deliver_person_details.status;

			
	
           }else{
              // $scope.countrycode_list= '';
               //alert("No Country Code Exits");
           }

        }).finally(function () {
            loading.deactive();
        });


    }
	/*--------------------------------------------------------------------*/
	
	
	
	
	
	
    $scope.user_registers = function (form) {
        // loading.active();return
        var error_str = '';
	$scope.lang_codes=sessionStorage.lang_code;
	if($scope.lang_codes == 'en')
	{
        if ($scope[form].$error) {

            if ($scope[form].fname.$error.required !== undefined) {
                error_str += " First Name, ";
            }

            if ($scope[form].lname.$error.required !== undefined) {
                error_str += " Last Name, ";
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
			 if ($scope.status==undefined ||  $scope.status == '')
            {
              error_str += " Status, ";
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
	}else
	{
		  if ($scope[form].$error) {

            if ($scope[form].fname.$error.required !== undefined) {
                error_str += "الاسم الاول, ";
            }

            if ($scope[form].lname.$error.required !== undefined) {
                error_str += " الكنية, ";
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
			 if ($scope.status==undefined ||  $scope.status == '')
            {
              error_str += " الحالة, ";
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
                error_str = " First Name should contain Alphabets Only";
                model.show('Alert', error_str);
                // alert(error_str);
                return false;
            }

            if (reg4.test($scope.lname) == false) {
                error_str = "  Last Name should contain Alphabets Only";
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
	    }else
		{
			 if (reg4.test($scope.fname) == false) {
                error_str = " يجب أن يحتوي الاسم الأول على الحروف الهجائية فقط";
                model.show('Alert', error_str);
                // alert(error_str);
                return false;
            }

            if (reg4.test($scope.lname) == false) {
                error_str = " يجب أن يحتوي اسم العائلة على الحروف الهجائية فقط";
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
                error_str = "يجب أن تحتوي كلمة المرور على حرف ورقم واحد على الأقل ، ويجب ألا يقل طولها عن 6! ";
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
      /*  if($('#retailer').prop('checked') == true){
            // alert();return;
            $scope.retailer = 'on';
        }else{
            $scope.retailer = '';
          }*/
         $scope.country_code=$("#country_code").val();
        if (error_str == '') {

            loading.active();
            var args = $.param({
				id:$cookieStore.get("delivery_person"),
                country_id: sessionStorage.country,
				lang_code: sessionStorage.lang_code,
                first_name: $scope.fname,
                last_name: $scope.lname,
                email: $scope.email,
				language_code: sessionStorage.lang_code,
                mobile_number: $scope.mob_number,
                password: $scope.password,
				status: $scope.status,
            });
          
            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/edit_delivery_person',
                data: args //forms user object

            }).then(function (response) {
                //loading.deactive();
                res = response;

                console.log(response.data)
                if(res.data.responseCode == 200){
					   if($scope.lang_codes == 'en')
	                   {
						 model.show('Alert', 'Delivery Person updated Successfully!');   
					   }else
					   {
						  model.show('Alert', 'تم تسليم شخص التسليم بنجاح!');  
					   }
					  
					 // $scope.date_type2='inactive';
					  $location.path('manage_delivery');
                  
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