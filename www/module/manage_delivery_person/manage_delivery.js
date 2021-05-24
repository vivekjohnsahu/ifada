app.controller('manage_delivery', function ($rootScope, $scope, $http, $location, $interval, $cookieStore, model, loading, $filter) {
	
	$rootScope.selecthome();
	
       $scope.backwithremove = function () {
        $location.path('/dashboard/home');
 
    }

	$scope.add = function ()
	{
      $location.path('/add_delivery');
	}
	
	
	$scope.edit = function (id)
	{
	   $cookieStore.put('delivery_person', id);	
       $location.path('/edit_delivery');
	}
	
    
	/*--------------------------------------------------------------------*/
	
	
	
    $scope.ordersInit = function () {
	
		 if($scope.date_type2)
		 {
			 $scope.new_status2=$scope.date_type2;
		 }
		 else
		 {
			$scope.new_status2='active'; 
		 }
		
		//alert($scope.new_status2)

        loading.active();
		
		
		

        var args = $.param({
            country_id: sessionStorage.country,
             user_id: $cookieStore.get('userinfo').uid,
             language_code : sessionStorage.lang_code,
			 status : $scope.new_status2
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/manage_delivery_person',
            data: args 

        }).then(function (response) {

            res = response;
           if(res.data.data.status == 'success'){
            $scope.order_list = res.data.data.listing;
			$scope.types= $scope.new_status2;
           }else{
                 $scope.order_list= '';
                // alert("Delivery Person Doesn't Exist");
           }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });


    }
	
	
	
	/*--------------------------delete--------------------------------------*/
	
	$scope.delete = function (id)
	{
	     loading.active();

         var args = $.param({
             delivery_boy_id: id
     
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/delete_delivery_person',
            data: args 

        }).then(function (response) {

            res = response;
           if(res.data.data.status == 'success'){
			   $scope.lang_codes=sessionStorage.lang_code;
				if($scope.lang_codes == 'en')
				{
			      model.show('Alert', 'Delivery Person Deleted Successfully!'); 
				}else
				{
				 model.show('Alert', 'تم تسليم الشخص المحذوف بنجاح!'); 	
				}
             $scope.date_type2='active';			 
             $scope.ordersInit();
			
           }else{
              
           }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });
	  
	}
	
	
	/*----------------------------delete------------------------------------*/
	
	/*----------------------------status-------------------------------------*/
	 $scope.status_data = function () {

        loading.active();

        var args = $.param({
             user_id: $cookieStore.get('userinfo').uid,
			 country_id: sessionStorage.country,
             status : $scope.date_type
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/manage_delivery_person',
            data: args 

        }).then(function (response) {

            res = response;
           if(res.data.data.status == 'success'){
                  $scope.order_list = res.data.data.listing;
				  $scope.types=$scope.date_type;
				
            }else{
                   $scope.order_list= '';
                   //alert("No Data Founds!");
                 }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });


    }
	
	/*-----------------------------status--------------------------------------*/
	
	
	/*--------------------------Restore--------------------------------------*/
	
	$scope.restore = function (id)
	{
	     loading.active();

         var args = $.param({
             delivery_boy_id: id
     
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/restore_delivery_person',
            data: args 

        }).then(function (response) {

            res = response;
           if(res.data.data.status == 'success'){
			   $scope.lang_codes=sessionStorage.lang_code;
				if($scope.lang_codes == 'en')
				{
			     model.show('Alert', 'Delivery Person updated Successfully!');  
				}else
				{
				  model.show('Alert', 'تم تسليم شخص التسليم بنجاح!');
				}
             $scope.date_type2='delete';			 
             $scope.ordersInit();
			 //$location.path('/manage_delivery');
           }else{
              
           }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });
	  
	}
	
	
	/*----------------------------Restore------------------------------------*/
	/*----------------------------search--------------------------------------*/
	 $scope.search_record = function(){
		 if($scope.date_type)
		 {
			 $scope.new_status=$scope.date_type;
		 }
		 else
		 {
			$scope.new_status='active'; 
		 }
	
		   // loading.active();
            var args = $.param({
             user_id: $cookieStore.get('userinfo').uid,
			 country_id: sessionStorage.country,
			 name :$("#target").val(),
             status : $scope.new_status,
        });
        

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/manage_delivery_person',
            data: args 

        }).then(function (response) {

            res = response;
           if(res.data.data.status == 'success'){
                  $scope.order_list = res.data.data.listing;
				  $scope.types=$scope.date_type;
				
            }else{
                     $scope.order_list= '';
					 //$scope.ordersInit();
                   //alert("No Data Founds!");
                 }

        }).finally(function () {
           // loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });
		
	 }
	 
	/*-----------------------------search-------------------------------------*/
	
	
	
	
	
    

	
	
   
});