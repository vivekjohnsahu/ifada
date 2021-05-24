app.controller('cart', function ($rootScope, $scope, $http, $location, $interval, $cookieStore, model, loading, $filter, $route) {

$rootScope.selecthome();
    $rootScope.range = '';
    $rootScope.searchProduct = '';
    $scope.lang_codes=sessionStorage.lang_code;
    $scope.homePage = function () {
        $location.path('/dashboard/home');
    }

   /*  $scope.back = function () {
        $location.path('/dashboard/home');
    } */

    if($cookieStore.get('from') == 'thankyou'){
        $cookieStore.remove('from');
        $scope.fromcookie = true;
    }

   
    $scope.empty_cart = function(){

        if($rootScope.cart_data == ''){
			     if($scope.lang_codes =='en')
			      {
                   alert('You Have No Items In Your Shopping Cart.');
				  }else
				  {
					alert('لا يوجد لديك عناصر في سلة التسوق الخاصة بك.');  
				  }
        }else{

        $.confirm({
            title: 'Confirm!',
            content: 'Do you want to empty cart?',
            buttons: {
                confirm: function () {
                    //$.alert('Confirmed!');
                    $scope.empty_cart_hit();
                },
                cancel: function () {
                    //$.alert('Canceled!');
                }
            }
        });
        
        }
    }



    /**
     * Funtion: empty_cart from cart.html on ng-click
     * Name: Sajal Goyal
     * Created-on: 26/10/2018 at 04:00pm
     * Empty the cart
     */


    $scope.empty_cart_hit = function () {
        $rootScope.checkToken();

    if($cookieStore.get('userinfo')){
        var user_type = $cookieStore.get("userinfo").left_data.user_type;
        var uid = $cookieStore.get("userinfo").uid;
    }else{
        var uid = '';
        var user_type = '';
    }
        if ($scope.cart_data.length == 0) {
			if($scope.lang_codes =='en')
			{
			  model.show('Info', 'You Have No Items In Your Shopping Cart.')
               return false;	
			}else
			{
				model.show('Info', 'لا يوجد لديك عناصر في سلة التسوق الخاصة بك.')
                return false;	
			}
          
        }
        loading.active(); 

        var args = $.param({
            country_id: sessionStorage.country,
            language_code: sessionStorage.lang_code ,   
            user_id: uid,
            token:uuid
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/cart/empty_cart',
            data: args

        }).then(function (response) {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
            res = response.data;
// console.log(res)
            if (res.data.status == 'success') {
				  if($scope.lang_codes =='en')
			      {
                   alert("Cart has been empty")
				  }else
				  {
					 alert("العربة كانت فارغة")  
				  }
               $rootScope.usercartvalue()
            } else {
                alert('Error Occured')
            }

        })

    }

    $scope.deleteproduct = function (rowid) {
        $rootScope.checkToken();
        if($cookieStore.get('userinfo')){
            var user_type = $cookieStore.get("userinfo").left_data.user_type;
            var uid = $cookieStore.get("userinfo").uid;
        }else{
            var uid = '';
            var user_type = '';
        }
        // alert(rowid);
        // return
        loading.active();

        var args = $.param({
            rowid: rowid,
            language_code: sessionStorage.lang_code,
            user_id: uid,
            country_id: sessionStorage.country,
            token:uuid
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/cart/removeItemCart',
            data: args

        }).then(function (response) {
            //alert();
            loading.deactive();
            res = response.data;
            console.log(res);
            $rootScope.usercartvalue();
            if(res.data.cart_count == 0){
                $rootScope.usercartvalue();
				  if($scope.lang_codes =='en')
			      {
                    alert('Product Deleted Successfully');
				  }else
				  {
					alert('تم حذف المنتج بنجاح'); 
				  }
            }
           
        })

    }



    $scope.address_delivery = function() {
	
        
            if (!$cookieStore.get('userinfo')) {
				
				if($scope.lang_codes =='en')
			      {
                     alert('Please Login First !');
				  }else
				  {
					  alert('الرجاء تسجيل الدخول أولا');
				  }
               $location.path('/login');
                return; 
            }
            var args = $.param({
                user_id: $cookieStore.get('userinfo').uid,
                user_type: $cookieStore.get('userinfo').user_type,
                country_id: sessionStorage.country,
    
            });
    
            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/cart/check_stock_for_cart',
                data: args //forms user object
    
            }).then(function (response) {
                loading.deactive();
                res = response;
               // console.log(res.data.status)
                if(res.data.status == 'valid'){
                    
                    data = true;
                    $location.path('/addressdetail');
                    
                }else{
                    
                    if(res.data.group_out_product !== ''){
                           if($scope.lang_codes =='en')
							 {
                             model.show('Alert','This product <b>'+ res.data.group_out_product + "</b> is not associated with any product group for you");
							 }else
							 {
							  model.show('Alert','مجموعة <b>'+ res.data.group_out_product + "</b> هذا المنتج غير مرتبط بأي منتجات لك"); 
							 }
                            $location.path('/cart');
   
                       }else if(res.data.out_of_stock_product !== ''){
                             if($scope.lang_codes =='en')
							 {
							   model.show('Alert','Some products in cart is out of stock');	 
							 }else
							 {
								model.show('Alert','بعض المنتجات في العربة غير متوفرة');	  
							 }
                           
                           $location.path('/cart')
                       }
                }
    
                
            })
                  
    }

    // $scope.promocode = 'COP223229';
    
 //   $rootScope.promocode = $scope.promocode 

    $scope.initpomo = function(){
        if ($cookieStore.get('promocode')) {

            $rootScope.promocode = $cookieStore.get("promocode").codename
            $rootScope.apply_promo('apply');
            //$location.path('/dashboard/home')
        }
    }

    $scope.product_view = function (id) {
        // alert(id);return;
        var productinfo = {
            'id' : id,
            
        }
        $cookieStore.put('productinfo', productinfo);
        $location.path('/product/view');
    }
    
});