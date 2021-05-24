app.controller('add_ticket', function ($scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation, $rootScope, $route) {

$rootScope.selecthome();

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }

    $scope.cart = function(){
        $location.path('/cart');
    }

    $scope.addticket = function (form) {
        $scope.lang_codes=sessionStorage.lang_code;
		if($scope.lang_codes == 'en')
		{
			if ($scope[form].$error) {
				//  alert("Error");
				var error_str = '';
				if ($scope[form].getorder.$error.required !== undefined ) {
					error_str += "Order Id, ";
				}
				if ($scope[form].getorder_dist.$error.required !== undefined ) {
					error_str += "Order Distribution,";
				}
				if ($scope[form].getcomplainttype.$error.required !== undefined) {
					error_str += "Complaint Type, ";
				}
				if ($scope[form].des.$error.required !== undefined) {
					error_str += "Description";
				}

				if (error_str !== '') {
					error_str = "<span style='font-weight:700;'> Following field must have valid information:</span><br/>" + error_str;
				   alert(error_str);
					// model.show('Alert', error_str);
				}
			};
	} else
	{
		 if ($scope[form].$error) {
				//  alert("Error");
				var error_str = '';
				if ($scope[form].getorder.$error.required !== undefined ) {
					error_str += "رقم التعريف الخاص بالطلب, ";
				}
				if ($scope[form].getorder_dist.$error.required !== undefined ) {
					error_str += "ترتيب التوزيع,";
				}
				if ($scope[form].getcomplainttype.$error.required !== undefined) {
					error_str += "نوع الشكوى, ";
				}
				if ($scope[form].des.$error.required !== undefined) {
					error_str += "وصف";
				}

				if (error_str !== '') {
					error_str = "<span style='font-weight:700;'>يجب أن يحتوي الحقل التالي على معلومات صالحة:</span><br/>" + error_str;
				   alert(error_str);
					// model.show('Alert', error_str);
				}
			};
	}		
        if ($scope[form].$valid) {
            loading.active();

            var args = $.param({
                user_id: $cookieStore.get("userinfo").uid,
                country_id: sessionStorage.country,
                language_code: sessionStorage.lang_code,
                complaint_type: $scope.getcomplainttype,
                description: $scope.des,
                order_id: $scope.getorder,
				getorder_dist: $scope.getorder_dist
            });

            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/raise_ticket',
                data: args //forms user object

            }).then(function (response) {
                console.log("---------------");
                console.log(response);
                if(response.data.data.status == 'success'){
                    //model.show('Info',response.data.responseMessage)
					$scope.lang_codes=sessionStorage.lang_code;
		            if($scope.lang_codes == 'en')
		            {
                       alert('Ticket has been raised successfully !')
					}else
					{
					   alert('لقد تم رفع التذكرة بنجاح !')
					}
                    $location.path('/list_ticket')
                }
            }).finally(function () {
                loading.deactive();
            });

        }

    }


    $scope.get_all_order= function(){
        var args = $.param({
            user_id:$cookieStore.get("userinfo").uid,
            country_id: sessionStorage.country,
        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/get_all_orders_ids',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log(res.data.responseCode);
            if (res.data.data.status == 'success') {
                $scope.getorders = res.data.data.get_ticket_data;

            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);

            }


        });
    }
	
	
	
	 $scope.get_orderdist= function(order_id){
        var args = $.param({
            user_id:$cookieStore.get("userinfo").uid,
            country_id: sessionStorage.country,
			order_id: order_id,
        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/get_order_distribution',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log(res.data.responseStatus);
            if (res.data.responseStatus == 'success') {
                $scope.getorders_dist = res.data.data;

            } else {
                   $scope.getorders_dist ="" ;
               

            }


        });
    }
	
	
	
	
	
	

    $scope.view_ticket = function(id){
        
        var ticketid = {
            'view_id': id,           
        }
        $cookieStore.put('ticketid', ticketid);

        $location.path('/view_ticket');
    }

   /*  $scope.cancel = function(){
        $location.path("/list_ticket");
    } */
});