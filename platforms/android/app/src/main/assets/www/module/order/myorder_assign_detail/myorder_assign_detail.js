app.controller('myorder_assign_detail', function ($scope, $http, $location, $cookieStore, model, loading, $rootScope, $cordovaFileTransfer) {

$rootScope.selecthome();
    $scope.lang_codes=sessionStorage.lang_code; 
	
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }
    
    $scope.backtoorder = function () {
        $location.path('/order/myorder_assign');
        //window.history.back();
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
            order_id: $cookieStore.get('assignorderID'),
			delivery_boy_id: $cookieStore.get('delivery_boy_id'),
            user_id:$cookieStore.get("userinfo").uid,
            country_id: sessionStorage.country,
            language_code: sessionStorage.lang_code
        });
		//alert(args);
        loading.active();
        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/assign_order_detail',
            data: args //forms user object

        }).then(function (response) {

            res = response;

            console.log()
            if (res.data.data.status == 'success') {
				//$scope.data_exist='';
				//alert();
				$scope.alldetail = res.data.data.data.basic_info;
				$scope.detail_distribution = res.data.data.data.result.result;
				
				$scope.delivery_status = res.data.data.data.status_popup;
				
				$scope.delivery_address = JSON.parse(res.data.data.data.basic_info.delivery_address);
				   $scope.detail_date = res.data.data.data.basic_info.order_manufacturer_distribution[0].updated_date;
                $scope.detail = res.data.data.data.result.result[0];
                $scope.codamount = res.data.data.data.basic_info.final_amount - res.data.data.data.basic_info.wallet_used_amount;
                $scope.deliveryboy = res.data.data.data.deliveryboy;
				$scope.deliverd_order_status_msg = res.data.data.data.deliverd_order_status_msg;
				if($scope.deliverd_order_status_msg.status == 'failed'){
					//$scope.data_exist='2';
					 $scope.order_list='';	
				}else 
				{
					//$scope.data_exist='1';
					$scope.order_list = $scope.deliverd_order_status_msg;
				}
				
			
				
              
               // $scope.detail_date = res.data.data.basic_info.order_manufacturer_distribution[0].updated_date;
                /*var orderinfo = {
                    'order_on': res.data.data.delivery_address.updated_date,
                    'address': res.data.data.delivery_address.address,
                    'mobile_number': res.data.data.delivery_address.mobile_number,
                    'payment_type': res.data.data.basic_info.payment_type,
                    'wallet_used_amount': res.data.data.basic_info.wallet_used_amount,
                    'landmark' :  res.data.data.delivery_address.landmark,
                    'location' :  res.data.data.delivery_address.location,
                    'zipcode'  : res.data.data.delivery_address.zipcode,
                    
                }
                $cookieStore.put('orderinfo', orderinfo);*/

               /* $scope.item= [];
                for(var i=0; i<$scope.detail_distribution.length;i++){
                    $scope.item = res.data.data.basic_info.order_manufacturer_distribution[i].items;
                    
                }*/
                console.log($scope.item)
            } else {

                //Throw error if not logged in
                //model.show('Alert', res.data.responseMessage);
                alert(res.data.status);
            }

        }).finally(function () {
            loading.deactive();
        });
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
    //alert();
        $.confirm({
            title: 'Cancel Order!',
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
                            $.alert('Please Provide the Reason');
                            return;
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
                                    alert("Order Successfully Cancelled");
                                    $scope.ordersDetalisInit();
                                }
								/*else if(response.data.responseStatus == "can_not_cancel")
								{
									alert("Order Can't be Cancelled!!! ");
								}*/
								else {
                                      alert("Order Can't be Cancelled!!! ");
                                }
                            })
                        } else {
                            alert("Please Provide a Reason");
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
			  alert("Invoice has been sent to your email-id!");
           }else{
			 alert("'Invoice not sent to your email-id!");
           }

        }).finally(function () {
            loading.deactive();
        });

    }
   
    $scope.deliver_person =function(manufacturer_distribution_id,order_id)
    {
	    $scope.deliver_person_ids= angular.element('#delivery_boy_id').val();
		angular.element('#btn_type').triggerHandler('click');
		
	    loading.active();

          var args = $.param({
             country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             delivery_boy :$scope.deliver_person_ids,
			 order_id :order_id,
			 manufacturer_distribution_id :manufacturer_distribution_id,
			 language_code :sessionStorage.lang_code,
          
        }); 
		//alert(args);
		 $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/assign_delivery_boy',
            data: args 

        }).then(function (response) {
           res = response;
		   console.log(res);
		 
           if(res.data.responseStatus  == 'success'){
			   
			   if($scope.lang_codes == 'en')
			   {
				 alert("Assign Delivery Person Successfully!");  
			   }else
			   {
				  alert("تكليف شخص التسليم بنجاح!");    
			   }
			  
			   $scope.ordersDetalisInit();
           }
		   else if(res.data.responseMessage.status == 'already_assign'){
			  // alert('sandeep');
			    alert(res.data.responseMessage.error_msg);
			    $scope.ordersDetalisInit();
           }
		   else{
			   if($scope.lang_codes == 'en')
			   {
			    alert("Assign Delivery Person not Successfully!");
			   }else
			   {
				 alert("تعيين شخص التسليم ليس بنجاح!");   
			   }
           }

        }).finally(function () {
            loading.deactive();
        });
	    
    }
      
	  
	  $scope.order_status_updated =function(manufacturer_distribution_id,order_id,manufacturer_id)
     {
	    $scope.delivery_status= angular.element('#delivery_status').val();
		angular.element('#btn_type').triggerHandler('click');
		
	    loading.active();

          var args = $.param({
             country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             order_status :$scope.delivery_status,
			 order_id :order_id,
			 manufacturer_distribution_id :manufacturer_distribution_id,
			 manufacturer_id :manufacturer_id,
			language_code :sessionStorage.lang_code,
          
        }); 
		//alert(args);
		 $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/update_order_status',
            data: args 

        }).then(function (response) {
			
           res = response;
		   console.log(response);
		    
			//alert(res.data.data);
            if(res.data.responseStatus == 'success'){
				if($scope.lang_codes == 'en')
			   {
			    alert("Status Updated Successfully!");
			   }else
			   {
				 alert("تم تحديث الحالة بنجاح!");   
			   }
			    $scope.ordersDetalisInit();
           }
		    else if(res.data.responseStatus  == 'reloade_error'){
				//alert('sandeep');
			   $scope.ordersDetalisInit();
           }
		   
		   else{
			  alert(res.data.responseMessage.error_msg);
			  $scope.ordersDetalisInit();
           }

        }).finally(function () {
            loading.deactive();
        }); 
	    
     }
	
	 $scope.change_order_status =function(manufacturer_distribution_id,order_id,manufacturer_id)
     {
	    $scope.delivery_status_out= angular.element('#delivery_status_out').val();
		angular.element('#btn_type').triggerHandler('click');
		
	    loading.active();

          var args = $.param({
             country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             order_status :$scope.delivery_status_out,
			 order_id :order_id,
			 manufacturer_distribution_id :manufacturer_distribution_id,
			manufacturer_id :manufacturer_id,
			language_code :sessionStorage.lang_code,
          
        }); 
		//alert(args);
		 $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/update_order_status',
            data: args 

        }).then(function (response) {
           res = response;
		  // alert(res.data.data);
		  //console.log(res.data.responseStatus);
            if(res.data.responseStatus == 'success'){
				if($scope.lang_codes == 'en')
			   {
			    alert("Status Updated Successfully!");
			   }else{
				 alert("تم تحديث الحالة بنجاح!");   
			   }
			    $scope.ordersDetalisInit();
           }
		   else if(res.data.responseStatus== 'reloade_error'){
			   $scope.ordersDetalisInit();
           }
		   else{
			  alert(res.data.responseMessage.error_msg);
			  $scope.ordersDetalisInit();
           }

        }).finally(function () {
            loading.deactive();
        });
	    
    }
	
	
	
	 $scope.change_order_status_re =function(manufacturer_distribution_id,order_id,manufacturer_id)
     {
	    $scope.delivery_status_re= angular.element('#delivery_status_re').val();
		angular.element('#btn_type').triggerHandler('click');
		
	    loading.active();

          var args = $.param({
             country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             order_status :$scope.delivery_status_re,
			 order_id :order_id,
			 manufacturer_distribution_id :manufacturer_distribution_id,
			 manufacturer_id :manufacturer_id,
			language_code :sessionStorage.lang_code,
          
        }); 
		//alert(args);
		 $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/update_order_status',
            data: args 

        }).then(function (response) {
           res = response;
		   		    console.log(res.data.data);
					//alert(res.data.data);
            if(res.data.responseStatus == 'success'){
				if($scope.lang_codes == 'en')
			   {
			    alert("Status Updated Successfully!");
			   }else
			   {
				   alert("تم تحديث الحالة بنجاح!");
			   }
			   $scope.ordersDetalisInit();
           }
		   else if(res.data.responseStatus == 'reloade_error'){
			   $scope.ordersDetalisInit();
           }
		   
		   else{
			  alert(res.data.responseMessage.error_msg);
			  $scope.ordersDetalisInit();
           }

        }).finally(function () {
            loading.deactive();
        });
	    
    }
	
	
	
	 $scope.change_order_status_no =function(manufacturer_distribution_id,order_id,manufacturer_id)
     {
	    $scope.delivery_status_no= angular.element('#delivery_status_no').val();
		angular.element('#btn_type').triggerHandler('click');
		
	    loading.active();

          var args = $.param({
             country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             order_status :$scope.delivery_status_no,
			 order_id :order_id,
			 manufacturer_distribution_id :manufacturer_distribution_id,
			 manufacturer_id :manufacturer_id,
			 language_code :sessionStorage.lang_code,
          
        }); 
		//alert(args);
		 $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/update_order_status',
            data: args 

        }).then(function (response) {
           res = response;
		   //alert(res.data.responseStatus);
           if(res.data.responseStatus == 'success'){
			   if($scope.lang_codes == 'en')
			   {
			    alert("Status Updated Successfully!");
			   }else
			   {
				 alert("تم تحديث الحالة بنجاح!");   
			   }
			    $scope.ordersDetalisInit();
           }
		   else if(res.data.responseStatus == 'reloade_error'){
			   $scope.ordersDetalisInit();
           }
		   
		   else{
			 alert(res.data.responseMessage.error_msg);
			  $scope.ordersDetalisInit();
           }

        }).finally(function () {
            loading.deactive();
        });
	    
    }
});