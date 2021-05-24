app.controller('productlist', function ($scope, $http, $location,$route, $interval, $cookieStore, model, $locale, loading, $rootScope) {

    $rootScope.selecthome();
    $rootScope.sort = '';
    $rootScope.range = '';
    $rootScope.searchProduct = '';
	
	$scope.currency=sessionStorage.currency_new;
	$scope.lang_codes=sessionStorage.lang_code;  
    
$scope.product_view = function (id,url) {
    // alert(id);return;
    var productinfo = {
        'id' : id,
        'url' : url
    }
    $cookieStore.put('productinfo', productinfo);
    $location.path('/product/view');
}

$scope.backtopage = function(){
        $cookieStore.remove('from');
        $cookieStore.remove('manufacturer_array');
        $cookieStore.remove('brand_array');
        $rootScope.range = '';
        $rootScope.searchProduct = '';
        model.hide();
        window.history.back();
}


if($rootScope.teks =='1')
	{
		$rootScope.searchProduct = $cookieStore.get('search').search;
        $rootScope.searchBar();
	} 

$scope.searchproducts = function(){
    $rootScope.range = '';
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

$scope.init =function(id){
    var max_heightss = $(".accordion-panel_"+id).css("maxHeight");
 var iScrollHeight = $(".accordion-panel_"+id).prop("scrollHeight");
 if(max_heightss!="0px"){
     $("#accord_"+id).removeClass("selected");
      $(".accordion-panel_"+id).css('max-height', '0');
 }else{
     $("#accord_"+id).addClass("selected");
       $(".accordion-panel_"+id).css('max-height', iScrollHeight+'px');
 }
}
 
$scope.filter = function(form) {
    //console.log($scope.sort); 
    $rootScope.searchProduct = $cookieStore.get('search').search;
    var range = $scope.minRangeSlider.minValue + "-" + $scope.minRangeSlider.maxValue
    console.log(range)
    $rootScope.range = range;
    $rootScope.sort = $scope.sort;
    $rootScope.searchBar();
    
}

 //slider
 

    $scope.changeMinSlider = function(){
    console.log($scope.minRangeSlider)
    }

    //slider

$scope.brand_array = [];
//$scope.brand_ids = [];
 $scope.Filtering = function(id){
    
   /*  getBrandDataFromFilter  = {
        'brand_id':id
    }
      */
    if($('#brand_'+id).prop("checked") == true){
        console.log($scope.brands);
        brand_array = $scope.brand_array.push(id); 
       console.log(brand_array) 
    }
    else if($('#brand_'+id).prop("checked") == false){
        //let index = $scope.brand_array.findIndex( getBrandDataFromFilter => getBrandDataFromFilter.id === id );
        //console.log(index)
        var index = $scope.brand_array.indexOf(id);
        $scope.brand_array.splice(index, 1);
    }
    $cookieStore.put('brand_array',$scope.brand_array);
   
 }

 $scope.manufacturer_array = [];
    //$scope.manufacturer_ids = [];
    $scope.Filtering_manufacturer = function (id) {

       /*  getBrandDataFromFilter  = {
        'manufacturer_id':id
    }
      */
    if($('#manufacturer_'+id).prop("checked") == true){
        console.log($scope.manufacturer);
        manufacturer_array = $scope.manufacturer_array.push(id); 
       console.log(manufacturer_array) 
    }
    else if($('#manufacturer_'+id).prop("checked") == false){
        //let index = $scope.manufacturer_array.findIndex( getBrandDataFromFilter => getBrandDataFromFilter.id === id );
        //console.log(index)
        var index = $scope.manufacturer_array.indexOf(id);
        $scope.manufacturer_array.splice(index, 1);
    }
    $cookieStore.put('manufacturer_array',$scope.manufacturer_array);
   

    }


$scope.taptowishlist = function(id, wishlist_status){
    //  alert(id+ " "+ wishlist_status);return;
    $rootScope.addToWishlist(id, wishlist_status);
    /* setTimeout(function(){
        $scope.searchproducts();
    }, 1000) */
}


       
});


