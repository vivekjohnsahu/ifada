app.controller('wishlist', function ($scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation, $rootScope, $route) {
 
 $rootScope.selecthome();
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }

    $scope.whiteListData = function () {

        loading.active();

        var args = $.param({
            user_id:$cookieStore.get("userinfo").uid,
            country_id: sessionStorage.country,
            language_code: sessionStorage.lang_code
        })
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/wishlist', 
            data: args

        }).then(function (response) {

            res = response;

          console.log(res.data.data);
          if(res.data.data.status == 'success'){
              console.log(res.data.data.wishlist);
            $scope.whitelist_data = res.data.data.wishlist; 
          }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });
    }

    $scope.removeWishlistItem = function(id){
        // alert(id);return;
        loading.active();

        var args = $.param({
            'wishlist_id' : id,
            'user_id' : $cookieStore.get("userinfo").uid
        })
        // alert(args);return;
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/delete_wishlist',
            data: args

        }).then(function (response) {

            res = response;

           console.log(res.data.data);
          if(res.data.data.delete_wishlist.status == 'success'){
			   $scope.lang_codes=sessionStorage.lang_code;
				if($scope.lang_codes == 'en')
				{
                  alert("Wishlist Item Deleted Successfully");
				}else
				{
				   alert("تم حذف عنصر قائمة الامنيات بنجاح");	
				}					
            $route.reload();
          }

        }).finally(function () {
            loading.deactive();
        });
    }

    $scope.searchproducts = function(){

        if($scope.searchProduct == undefined || $scope.searchProduct == ""){
			    $scope.lang_codes=sessionStorage.lang_code;
				if($scope.lang_codes == 'en')
				{
					  model.show("Alert","Please Provide the Search Value");
                      return false;
				}else
				{
					  model.show("Alert","يرجى تقديم قيمة البحث");
                      return false;
				}
          
        }
        var search_key = {
            'search' : $scope.searchProduct
        }
        $cookieStore.put('search',search_key);
        $rootScope.searchProduct = $scope.searchProduct;
        $rootScope.searchBar();
    }


        
    $scope.product_view = function (id,url) {
        // alert(id);return;
        var productinfo = {
            'id' : id,
            'url' : url
        }
        $cookieStore.put('productinfo', productinfo);
        $location.path('/product/view');
    }

});