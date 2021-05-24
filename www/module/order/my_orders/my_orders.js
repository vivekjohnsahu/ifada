app.controller('myorders', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope, $route) {

$rootScope.selecthome();
$scope.lang_codes=sessionStorage.lang_code;
			
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
             language_code : sessionStorage.lang_code
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/my_order',
            data: args 

        }).then(function (response) {

            res = response;

           console.log(res.data.data.order_list);
           if(res.data.data.status == 'success'){
            $scope.order_list = res.data.data.order_list;
           }else{
               $scope.order_list= '';
			   if($scope.lang_codes =='en')
			   {
				 alert("Order Doesn't Exist");   
			   }else
			   {
				   alert("النظام لا يوجد");  
			   }
              
           }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });


    }

    /**
     * created by Nitin
     * created on 16/10/2018
     * Function Name : deleteOrder
     * this function will delete the order according to the orderno
     */

    $scope.deleteOrder = function (no) {

        $.confirm({
            title: 'Cancel Order!',
            content: '' +
                '<form action="" class="formReason">' +
                '<div class="form-group">' +
                '<label>Reason</label>' +
                '<input type="text" placeholder="Enter Reason Here" class="name form-control" required />' +
                '</div>' +
                '</form>',
            buttons: {

                formSubmit: {
                    text: 'Submit',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if (!name) {
							if($scope.lang_codes =='en')
							{
                             $.alert('Please Provide the Reason');
                             return false;
							}else
							{
							 $.alert('يرجى تقديم السبب');
                             return false;	
							}
                        }
                        loading.active();

                        var name = this.$content.find('.name').val(); //to get the prompt value

                        var args = $.param({
                            'uid': GlobalUID,
                            'order_no': no,
                            'reason': name
                        });

                        //alert(name);return false; 
                        if (name != "") {
                            $http({
                                headers: {
                                    //'token': '40d3dfd36e217abcade403b73789d732',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                method: 'POST',
                                url: app_url + '/profileapi/cancelOrder',
                                data: args
                            }).then(function (response) {
                                loading.deactive();
                                // console.log(response);
                                // return false;
                                // $.alert('Confirmed!');
                                if (response.data.status == "success") {
									if($scope.lang_codes =='en')
									{
									  alert("Order Successfully Cancelled");
									}else
									{
									  alert("تم إلغاء الطلب بنجاح");	
									}
                                   
                                    $scope.ordersInit();
                                } else {
									 if($scope.lang_codes =='en')
									 {
										alert("Something went wrong.");
									 }else
									 {
										 alert("هناك خطأ ما.");
									 }
                                }
                            })
                        } else {
							if($scope.lang_codes =='en')
							{
							  alert("Please Provide the Reason");
							}else
							{
							 alert("يرجى تقديم السبب");	
							}
                           
                            $scope.ordersInit();
                        }
                    }
                },
                cancel: function () {

                }
            }
        })
    }
    //End of Function

    $scope.orderDetails = function (orderID) {
        $cookieStore.put('orderID', orderID);
        $location.path('/order/myorderdetails');
    }

});