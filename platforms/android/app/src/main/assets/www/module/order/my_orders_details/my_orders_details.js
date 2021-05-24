app.controller('orderdetails', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope, $cordovaFileTransfer) {

    $rootScope.selecthome();
    $scope.lang_codes=sessionStorage.lang_code;
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }
    
    $scope.backtoorder = function () {
        $location.path('/order/myorder');
       // window.history.back();
    }

    $scope.fullName = $cookieStore.get("userinfo").fullName;
    $scope.profile_image = profile_image_path+$cookieStore.get("userinfo").profile_image;
    $scope.profile_image_found = $cookieStore.get("userinfo").profile_image;
    /**
     * Funtion: ordersDetalisInit from my_orders_details.html on ng-init
     * Name: Sajal Goyal
     * Created-on: 10/10/2018 at 11:00am
     * Get the order details by sending the http request
     */


     $scope.trackOrder = function(m_id,id){
    var ids = {
        'order_id' : id,
        'm_id' : m_id
    }
       $cookieStore.put('orderids',ids);
       $location.path('/order/track_order') 
         
     }

    $scope.ordersDetalisInit = function () {
        loading.active();

        var args = $.param({
        order_id: $cookieStore.get('orderID'),
            user_id:$cookieStore.get("userinfo").uid,
            country_id: sessionStorage.country,
            language_code: sessionStorage.lang_code
        });
        loading.active();
        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/order_summary',
            data: args //forms user object

        }).then(function (response) {

            res = response;

            console.log(res.data.data)
            if (res.data.data.status == 'success') {
                $scope.detail = res.data.data.basic_info;
				$manu_ids=$scope.detail.manufacturer_ids;
				console.log($manu_ids);
				
                $scope.codamount = res.data.data.basic_info.final_amount - res.data.data.basic_info.wallet_used_amount;
                $scope.delivery_address = res.data.data.delivery_address;
                $scope.detail_distribution = res.data.data.basic_info.order_manufacturer_distribution;
				$scope.payment_status = res.data.data.basic_info.order_manufacturer_distribution;
				$scope.payment_status_new = res.data.data.basic_info.payment_status;
		        $scope.detail_date = res.data.data.basic_info.order_manufacturer_distribution[0].updated_date;
                $scope.payment_type_new = res.data.data.basic_info.payment_type;
                var orderinfo = {
                  //  'order_on': res.data.data.delivery_address.updated_date,
				     'order_on': res.data.data.basic_info.order_manufacturer_distribution[0].updated_date,
                    'address': res.data.data.delivery_address.address,
                    'mobile_number': res.data.data.delivery_address.mobile_number,
                    'payment_type': res.data.data.basic_info.payment_type,
                    'wallet_used_amount': res.data.data.basic_info.wallet_used_amount,
                    'landmark' :  res.data.data.delivery_address.landmark,
                    'location' :  res.data.data.delivery_address.location,
                    'zipcode'  : res.data.data.delivery_address.zipcode,
                    
                }
                $cookieStore.put('orderinfo', orderinfo);

                $scope.item= [];
                for(var i=0; i<$scope.detail_distribution.length;i++){
                    $scope.item = res.data.data.basic_info.order_manufacturer_distribution[i].items;
                    
                }
                console.log($scope.item)
            } else {

                //Throw error if not logged in
                //model.show('Alert', res.data.responseMessage);
                alert(res.data.status);
            }

        }).finally(function () {
            loading.deactive();
        });
		
		
		$rootScope.get_notification();
    }

    $scope.rating = 5;
    $scope.currentfeedback = "Excellent";
    $scope.ratings = [ {
        current: 5,
        max: 5
    }];
    
    $scope.getSelectedRating = function (rating) {
        console.log(rating);
        $scope.rating = rating ;

    switch(rating){
        case 0:
        $scope.currentfeedback = ' &#9786; Very Bad';
        break;

        case 1 :
        $scope.currentfeedback = "Bad";
        break;

        case 2 :
        $scope.currentfeedback = "Average";
        break;

        case 3 :
        $scope.currentfeedback = "Good";
        break;
        
        case 4 :
        $scope.currentfeedback = "Very Good";
        break;

        case 5 :
        $scope.currentfeedback = "Excellent";
        break;

    }
       // $scope.currentfeedback = rating
    }

    $scope.values = function(menu_id,menu_varient_id,order_id,manufacturer_id) {
        $scope.menu_id = menu_id;
        $scope.menu_varient_id = menu_varient_id;
        $scope.order_id = order_id;
        $scope.manufacturer_id = manufacturer_id;
        
    }

    $scope.form = {}
    $scope.revieworder = function(form){
       
        loading.active();

         var args = $.param({
            country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             /* language_code : sessionStorage.lang_code*/ 
             menu_id :$scope.menu_id,
             menu_variant_id : $scope.menu_varient_id,
             rating : $scope.rating,
             comments : $scope.form.comment,
             order_id : $scope.order_id,
             order_manufacturer_distribution_id : $scope.manufacturer_id,
        }); 
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/add_review',
            data: args 

        }).then(function (response) {

            res = response;

           console.log(res);return;
           if(res.data.data.status == 'success'){
            $scope.order_list = res.data.data.order_list;
           }else{
               $scope.order_list= '';
            alert("Order Doesn't Exist");
           }

        }).finally(function () {
            loading.deactive();
        });

    }


    $scope.downloadinvoice = function (invoicedatas, invoiceurl) {

        // alert(invoicedatas);
        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {

            if (status.hasPermission) {

                if (invoicedatas == null) {
                    alert('Some Problem in Invoice');
                    return false;
                }

                document.addEventListener('deviceready', function () {
                    var url = $scope.myordersdetails.invoice_data.invoice_name;
                    var targetPath = cordova.file.externalDataDirectory + invoicedatas;
                    var trustHosts = true;
                    var options = {};
                    // alert(url);
                    // alert(targetPath);
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                        .then(function (result) {
                            // Success!
                            //  alert('result' + JSON.stringify(result));
                            //$scope.error = result;
                            cordova.plugins.MediaScannerPlugin.scanFile(targetPath, successCallback, errorCallback);

                            function successCallback() {
                                alert('Downalod Completed');
                                $scope.complete = 'Downalod Completed';
                            };

                            function errorCallback() {
                                alert('error');
                            };
                            cordova.exec(null, null, 'ScanMedia', 'mediaScanner', [result.nativeURL]);
                        }, function (err) {
                            alert(('err' + JSON.stringify(err)));
                            $scope.error = err;
                            // Error
                        }, function (progress) {
                            // alert(('progress' + progress));
                            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                        });
                }, false);
            } else {

                permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);

                function error() {
                    alert('Permission required !!! ');
                }

                function success(status) {
                    // alert(status)
                    if (!status.hasPermission) {
                        error();
                    } else {
                        $scope.downloadinvoice(invoicedatas);
                    }
                }


                //alert("No :( ");
            }

        });





    }
    /**
     * Created By Nitin Kumar
     * Dated on 17/10/2018
     * Start of Function
     * function name : orderAgain
     * work on clicking on Order Again and work using reorder API
     */
    $scope.orderAgain = function (no) {
        loading.active();

        var args = $.param({
            'uid': GlobalUID,
            'order_no': no,
            'device_type': "android"
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/profileapi/reorder',
            data: args

        }).then(function (response) {
            res = response;
            // console.log(res);
            if (res.data.status == 'success') {
                console.log(res);
                //put cookie and redirect it    
                //model.show('Alert', res.data.responseMessage);
                $location.path('/cart');

            } else {
                //Throw error if not logged in
                //model.show('Alert', res.data.responseMessage);
                alert(res.data.status);
            }

        }).finally(function () {
            loading.deactive();
        });
    }

    //End of Function
    $scope.deleteOrder = function (m_id,id) {

        $.confirm({
            title: 'Cancel Order! ',
            theme: 'light',
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
                        
                        
                        if ($.trim(name) == '') {
							if($scope.lang_codes == 'en')
							{
							   $.alert('Please Provide the Reason');
                               return;	
							}else
							{
							   $.alert('يرجى تقديم السبب');
                               return;	
							}
                          
                        }
                        
                        loading.active();

                        var name = this.$content.find('.name').val(); //to get the prompt value

                        var args = $.param({
                           
                            'order_id': id,
                            'manufacturer_distribution_id': m_id,
                            'cancel_reason' : name,
                            'user_id' : $cookieStore.get('userinfo').uid
                        });

                        //alert(name);return false; 
                        if (name != "") {
                            $http({
                                headers: {
                                    //'token': '40d3dfd36e217abcade403b73789d732',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                method: 'POST',
                                url: app_url + '/cancel_order',
                                data: args
                            }).then(function (response) {
                                loading.deactive();
                                 
                                // $.alert('Confirmed!');
                                if (response.data.responseStatus == "success") {
									if($scope.lang_codes == 'en')
							        {
									 alert("Order Successfully Cancelled");	
									}else
									{
								 	alert("تم إلغاء الطلب بنجاح");	
									}
                                    
                                    $scope.ordersDetalisInit();
                                } /*else {
                                    alert("Order Can't be Cancelled,<br> Date Exceeds!!! ");
                                }*/
								else if(response.data.responseStatus == "error")
								{
									 if($scope.lang_codes == 'en')
							         {
									  alert("Order Can't be Cancelled");	 
									 }else
									 {
									   alert("لا يمكن إلغاء الطلب"); 
									 }
									  
									  $scope.ordersDetalisInit();
								}
								else {
									 if($scope.lang_codes == 'en')
							         {
									   alert("As per the cancellation Policy, Now you are not eligible to cancel this order");
									 }else
									 {
									  alert("وفقًا لسياسة الإلغاء ، أنت الآن غير مؤهل لإلغاء هذا الطلب"); 
									 }
									
									  $scope.ordersDetalisInit();
                                }
                            })
                        } else {
							       if($scope.lang_codes == 'en')
							         {
									  alert("Please Provide a Reason");	 
									 }else
									 {
									  alert("يرجى تقديم سبب"); 
									 }
                           
                            $scope.ordersDetalisInit();
                        }
                    }
                },
                 cancel: function () {

                } 
            }
        })
    }

  $scope.invoice = function(m_id,id){
         loading.active();
         var args = $.param({
              country_id: sessionStorage.country,
			  order_id: id,
              manufacture_id: m_id,
         
        }); 
        //alert(args);
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/invoice',
            data: args 

        }).then(function (response) {
           res = response;
           //console.log(res.data.data.status);
		   //alert(res.data.data.status);
           if(res.data.data.status == 'success'){
			   if($scope.lang_codes == 'en')
			   {
				  alert("Invoice has been sent to your email-id!");  
			   }else
			   {
				  alert("تم إرسال الفاتورة إلى معرف البريد الإلكتروني الخاص بك!");  
			   }
			 
           }else{
			   if($scope.lang_codes == 'en')
			   {
			      alert("'Invoice not sent to your email-id!");
			   }else
			   {
				 alert("'الفاتورة لم ترسل إلى معرف البريد الإلكتروني الخاص بك!");  
			   }
           }

        }).finally(function () {
            loading.deactive();
        });

    }
   

});