app.controller('dash_home', function ($scope, $http, $location, $cookieStore, $timeout, loading, model, $rootScope, $route) {
    
	  $rootScope.selecthome();
    if (!$cookieStore.get('userinfo')) {
        $scope.loggedin = false;
       
    }
   	$scope.lang_codes=sessionStorage.lang_code;   
    $rootScope.range = '';
    $rootScope.searchProduct = '';
	localStorage.removeItem('isCloseSelf');
	localStorage.setItem("isCloseSelf", "no");
	
	$rootScope.isCloseSelf= localStorage.getItem("isCloseSelf");
	
	//alert($scope.isCloseSelf);

    if ($cookieStore.get('userinfo')) {
        $scope.loggedin = true;
		$scope.type = $cookieStore.get("userinfo").user_type;
    }
    
    $scope.product_view = function(id,category_id,url,manu_id){

        var productinfo = {
            'id' : id,
            'category_id' : category_id,
			'url' : url,
			
        }
        $cookieStore.put('productinfo', productinfo);

      //  $cookieStore.put('id',id);
        $cookieStore.put('manu_id',manu_id);
        $location.path('/product/view');
    }
    // if (!$cookieStore.get('storeinfo')) {
    //     $location.path('/store');
    //     return false;
    // }

    $scope.login = function(){
        $location.path('/login');
    }
	$scope.gotoSearchPage = function(){
		$location.path('/search')
	}
	
	$scope.category_data = function () {

        loading.active();

        var args = $.param({
            country_id: sessionStorage.country,//$scope.search,
            Language_code: sessionStorage.lang_code
        })
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/category_api',
            data: args

        }).then(function (response) {

            res = response;

          console.log(res.data.data);
          if(res.data.data.status == 'success'){
            $scope.category_data = res.data.data.category; 
            //$location.path('/category');
			console.log("-------------------------------------------")
            console.log($scope.category_data);
          }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });

        

    }
	
    $scope.setdata = 0;
    
    $scope.season_fetch =   function(){
        
         loading.active();
        if(!$cookieStore.get("userinfo")){
            var userID = '';
            var user_type = '';
        }else{
            var userID = $cookieStore.get("userinfo").uid;
            var user_type = $cookieStore.get('userinfo').user_type;
        }

        var args = $.param({
            country_id: sessionStorage.country,
            user_id : userID,
            user_type : user_type,
			lang_code: sessionStorage.lang_code
        });
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/home_page',
            data: args 

        }).then(function (response) {

            res = response;

           console.log(res);

           if(res.data.data.status == 'success'){
                $scope.setdata = 1;
                $scope.best_picks_of_the_season = res.data.data.best_picks_of_the_season;
                $scope.offer = res.data.data.offer;
                if(res.data.data.banner_category.length > 0){

                    $scope.banner_category = res.data.data.banner_category;
                    $scope.banner_category_image_path = res.data.data.banner_category_image_path;
                  //  alert($scope.banner_category.length)
                }
                $scope.product_of_the_day = res.data.data.product_of_the_day;
				$scope.mobile_app_product = res.data.data.mobile_app_product;
				console.log($scope.mobile_app_product);
                $scope.best_picks_of_the_featured_products = res.data.data.best_picks_of_the_featured_products;
				
                 $rootScope.currency = res.data.data.country_data[0].currency;
				 sessionStorage.currency_new ='';
				 sessionStorage.currency_new = res.data.data.country_data[0].currency;
                $scope.dairy_product = res.data.data.dairy_product;
                $scope.slider = res.data.data.banner;
                $scope.country_name = res.data.data.country_name.name;
				$scope.popular_category = res.data.data.popular_category;
				
				sessionStorage.country_name_new = res.data.data.country_name.name;
				
                $scope.slickConfig0Loaded = true;
                $scope.slickConfig0 = {
                  method: {},
                  dots: true,
                  infinite: true,
                  speed: 100,
				  autoplay:true,
				  autoplaySpeed:3000,
				  arrows:false,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 1,
                        infinite: true,
                        dots: true,
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 1,
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                      }
                    },
                    {
                      breakpoint: 360,
                      settings: {
                        slidesToShow: 1,
                      }
                    }
                  ]
                };
                console.log($scope.slider);
                $scope.sliderCount =  $scope.slider.length;
           }

           setTimeout(function(){

               loading.deactive();
			   AOS.init({
				easing: 'ease',
				duration: 1000
			  });
           },400)

        }).finally(function () {
           // loading.deactive();
        });

    }

    var i = 1;
    var j = 3;
    var k = 1;

    var first_length = 3;
    var second_length = 5;
    var third_length = 1;
    // $scope.offer[1].ad_big_image = 'assets/img/advert_1.png';
    // $scope.offer[3].ad_big_image = 'assets/img/advert_1.png';
    setInterval(function(){ 
        

        if(first_length > i){
            $('#custom_slider').attr('data-offerid', $scope.offer[i].URL)
            $('#custom_slider').attr('data-catid', $scope.offer[i].category_id)
            //$('#custom_slider').attr('src',$scope.offer[i].ad_big_image)
            i++;
        }else{
            i = 0;
        }

        if(second_length > j){

            $('#custom_second_slider').attr('data-offerid', $scope.offer[i].URL)
            $('#custom_second_slider').attr('data-catid', $scope.offer[i].category_id)
            //$('#custom_second_slider').attr('src',$scope.offer[j].ad_big_image)
            j++;
        }else{
            j = 3;
        }


        if($scope.banner_category.length > 0 && third_length >= k){

            urlseg = $scope.banner_category_image_path +'/'+ $scope.banner_category[k].banner_image;
            $('#custom_third_slider').attr('data-offerid', $scope.banner_category[k].url)
            $('#custom_third_slider').attr('data-catid', $scope.banner_category[k].id)
            $('#custom_third_slider').attr('src',urlseg)
            k++;
        }else{
            k = 0
        }


    },6000);



    // return false;
    $scope.toLocationFetch = function () {
        $location.path('/store');
    }

    $scope.category = function () {
        $location.path('dashboard/category')
    }
	$scope.pop_category = function () {
        $location.path('pop_category')
    }
	
	$scope.pop_category_single = function(id) {
		
		var pop_category_dataInfo = {
			'catid': id,
		}
       $cookieStore.put('pop_category_data', pop_category_dataInfo);
       $location.path('/pop_category');
  }
	
	
    $scope.useroffers = function () {
        $location.path('offers')
    }

    $scope.home = function () {
        //$location.path('dashboard/home')
        $route.reload()
    }
    $scope.notification = function () {

        $location.path('notification')

    }
	
	$scope.myorder_assign = function(){
        $location.path('/order/myorder_assign');
    }
    $scope.my_coupons = function () {

        $location.path('mycoupons')

    }

    $scope.see_all = function(subcatid){
		
        var subcategoryInfo = {
            'subcatid': subcatid,
            'from':'home'
        }
        $cookieStore.put('subcategoryInfo', subcategoryInfo);

        $location.path('/subcategory');
    }
	
	$scope.manage_delivery_person = function(){
		$location.path('/manage_delivery');
	}
	
    $scope.signout = function () {
        $rootScope.DeleteData();
        $cookieStore.remove("userinfo");
        $cookieStore.remove("storeinfo");
        $location.path('/login');
    }

    $scope.subcategory = function (id) {
        $cookieStore.put('id', id);
        $location.path('subcategory')

    }

/* Function For Hot Deals */

    $scope.hot_deals = function(){
        $cookieStore.put('id', 7);
        $location.path('subcategory')
    }

    $scope.product_list = function (productListID, categoryName) {

        var categoryInfo = {
            'categoryName': categoryName,
            'productListID': productListID
        }
        $cookieStore.put('categoryInfo', categoryInfo);

        $location.path('/product/list');
    }



    /**
     * Funtion: slider from home.html on ng-init
     * Name: Sajal Goyal
     * Created-on: 12/10/2018 at 06:45pm
     * slider by sending the http request
     */

    $scope.sliders = function () {
// alert()/
        loading.active();

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'GET',
            url: app_url + '/bannerapi'
            //data: args 

        }).then(function (response) {

            res = response;

            if (res.data.response == 'success') {
                //console.log(res.data.data)
                $scope.slider = res.data.data;
                $scope.sliderCount = res.data.count;
                //console.log($scope.slider)
                $location.path('/dashboard/home');
            } else {

                alert(res.data.status);
            }

        }).finally(function () {
           // loading.deactive();
        });



    }

    /* $scope.initAutocomplete =  function(){
            console.log("hellooo");
            var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: -33.8688, lng: 151.2195},
              zoom: 13,
              mapTypeId: 'roadmap'
            });
    
            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            console.log(searchBox);
    
            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
              searchBox.setBounds(map.getBounds());
            });
    
            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
              console.log("in the listener");
              var places = searchBox.getPlaces();
              alert(places);
              if (places.length == 0) {
                return;
              }
    
              // Clear out the old markers.
              markers.forEach(function(marker) {
                marker.setMap(null);
              });
              markers = [];
    
              // For each place, get the icon, name and location.
              var bounds = new google.maps.LatLngBounds();
              places.forEach(function(place) {
                if (!place.geometry) {
                  console.log("Returned place contains no geometry");
                  return;
                }
                var icon = {
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25)
                };
    
                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                  map: map,
                  icon: icon,
                  title: place.name,
                  position: place.geometry.location
                }));
    
                if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }
              });
              map.fitBounds(bounds);
            });
          }
 */

    
$scope.searchresults = function(){
    // alert($scope.searchProduct);return;
    if($scope.searchProduct == undefined || $scope.searchProduct == ""){
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

   /*  $scope.product_view = function (pid) {
        $cookieStore.put('productviewID', pid);
        $location.path('/product/view')
    } */


    $scope.language = function(){
        $location.path('/language');
    }
    $scope.myorder = function(){
        $location.path('/order/myorder');
    }
    $scope.category = function(){
        $location.path('/category');
    }
    $scope.profile = function(){
        $location.path('/myaccount/profile');
    }
    $scope.cart = function(){
        $location.path('/cart');
    }
    $scope.register = function(){
        $location.path('/register');
    }
    $scope.wishlist = function(){
        $location.path('/wishlist');
    }
    $scope.valuedpack = function(){
        $location.path('/value_packs');
    }
    $scope.manage_ticket = function(){
        $location.path('/list_ticket');
    }
    $scope.switch_country = function(){
        $location.path('/switch_country');
    }
    $scope.wallet = function(){
        $location.path('/wallet');
    }
    $scope.rewards = function(){
        $location.path('/rewards');
    }
    $scope.language = function(){
        $location.path('/language');
    }
    $scope.change_password = function(){
        $location.path('/changepassword');
    }
    $scope.contact_us = function(){
        $location.path('/contactus');
    }
    $scope.about_us = function(){
        $location.path('/aboutus');
    }
    $scope.privacy_policy = function(){
        $location.path('/policy');
    }
    $scope.my_address = function(){
        $location.path('/address');
    }
    $scope.logout = function(){
        $cookieStore.remove('userinfo');
        $cookieStore.remove('aid');
        $cookieStore.remove('cart');
        $cookieStore.remove('orderID');
        $cookieStore.remove('orderinfo');
        $cookieStore.remove('productinfo');
        $cookieStore.remove('search');
        $cookieStore.remove('subcategoryInfo');
        $cookieStore.remove('ticketid');
        $cookieStore.remove('FullName');
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM userinfo');
        });
        $rootScope.loginlogout();

        $location.path('/login');
    }

   /*  if($cookieStore.get("userinfo")){
        $scope.fullName = $cookieStore.get("userinfo").fullName;
        $scope.profileImage = $cookieStore.get("userinfo").profile_image;
        
    } */

    if($cookieStore.get("FullName")){
        $scope.fullName = $cookieStore.get("FullName").fullName;  
        if($cookieStore.get("userinfo").profile_image == ''){
            $scope.profileImage = '';
            console.log($scope.profileImage)
        }else{

            $scope.profileImage = profile_image_path +$cookieStore.get("userinfo").profile_image; 
        }
    }else{  
        if($cookieStore.get("userinfo")){
            $scope.fullName = $cookieStore.get("userinfo").fullName; 
            if($cookieStore.get("userinfo").profile_image == ''){
                $scope.profileImage = '';
                console.log($scope.profileImage)
            }else{ 

                $scope.profileImage = profile_image_path +$cookieStore.get("userinfo").profile_image; 
            }
        }      
    }

    if($cookieStore.get("userinfo")){
        $scope.address = $cookieStore.get("userinfo").address;
    }

    $scope.toswitchCountry = function(){
        $location.path("/switch_country");
    }

    $scope.addToWishlist = function(id){
        // alert(id);
        if(!$cookieStore.get("userinfo")){
            alert("Please Login First");
            return false;
        }else{
            var userID = $cookieStore.get("userinfo").uid;
        }
        loading.active();
        var args = $.param({
            'country_id': sessionStorage.country,
            'menu_varient_id' : id,
            'user_id' : userID
        });

        // alert(args);return;
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/add_wishlist',
            data: args

        }).then(function (response) {

            res = response;
            // console.log("wwwwwwwwwwwwwwwwwww");
            // console.log(res.data.data);
            // return;
            if (res.data.data.add_wishlist == 'success') {
                model.show("Alert","Added To Wishlist Successfully");
            } else {
                model.show("Alert","Something went wrong");
            }
        }).finally(function () {
           // loading.deactive();
        });
    }

    $scope.taptowish = function(id, wishlist_status){
        // alert(id+ " "+wishlist_status);return;
        $rootScope.addToWishlist(id, wishlist_status);
        $route.reload();
  }

  $scope.details = function(weightid) {
    console.log(weightid.target.dataset.catid);
    id = weightid.target.dataset.catid;
    url = weightid.target.dataset.offerid
    //return
    var subcategoryInfo = {
        'subcatid': id,
        'url': url
    }
    $cookieStore.put('subcategoryInfo', subcategoryInfo);
    $cookieStore.put('from','home');
      $location.path('/subcategory');
  }
  
  
    

});





