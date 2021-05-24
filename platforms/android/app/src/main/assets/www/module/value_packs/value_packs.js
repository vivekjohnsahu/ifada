app.controller('value_packs', function ($translate, $scope, $http, $location, $interval, $cookieStore, loading, $rootScope, $cordovaFile) {


$rootScope.selecthome();

$scope.lang_codes=sessionStorage.lang_code;  
    //alert();
/**
     * Funtion: val_packs from value_packs.html on ng-init
     * Name: Sajal Goyal
     * Created-on: 26/11/2018 at 06:45pm
     * sending the http request
     */
$scope.val_packs = function(){
    
    loading.active();

        var args = $.param({
            country_id : sessionStorage.country,
            lang_code : sessionStorage.lang_code,
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
               console.log(res.data.data.offer)
               $scope.valpacks =  res.data.data.offer;
               
            return;
               $location.path('/dashboard/home');
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

$scope.searchproducts = function(){

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

$scope.product_list = function(id,url){
var packs = {
    'subcatid': id,
    'url' : url
}
   $cookieStore.put('value_pack','value_pack');
   $cookieStore.put('subcategoryInfo',packs);
   $location.path('/subcategory');
}

});