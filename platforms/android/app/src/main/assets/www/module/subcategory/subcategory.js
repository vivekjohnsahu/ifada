app.controller('sub_category', function ($route, $filter, $scope, $http, $location, $interval, $cookieStore, $window, model, $locale, loading, $rootScope) {

$rootScope.selecthome();
    // console.log($rootScope.searchresult);return;
	$scope.lang_codes=sessionStorage.lang_code;  
	$scope.currency=sessionStorage.currency_new;
    $rootScope.sort = '';

    if ($cookieStore.get('userinfo')) {
        var user_type = $cookieStore.get('userinfo').user_type;
        var uid = $cookieStore.get('userinfo').uid;
        uuid = ''
    } else {
        var user_type = '';
        var uid = '';
    }

    if ($cookieStore.get('value_pack')) {
        $scope.value_pack = true;
        $cookieStore.remove('value_pack');
    }
    $scope.cat_id = $cookieStore.get('subcategoryInfo').subcatid;

    if ($cookieStore.get('subcategoryInfo').from == 'home') {
        loading.active();
    }

    $scope.cart = function () {
        $location.path('/cart');
    }

    var ID;
    var savehit = false;
    $scope.fetch_product_list = function (id, url, apply = null) {
        // alert(apply)
        var brands = $scope.brand_array;
        console.log(brands);
        var brand_str = '';
        angular.forEach(brands, (value, key) => {
            //console.log(value);
            if (brand_str == '') {
                brand_str = value;
            } else {
                brand_str += ',' + value;
            }
        });
        console.log(brand_str);

        var manufacturer = $scope.manufacturer_array;
        console.log(manufacturer);
        var manufacturer_str = '';
        angular.forEach(manufacturer, (value, key) => {
            //console.log(value);
            if (manufacturer_str == '') {
                manufacturer_str = value;
            } else {
                manufacturer_str += ',' + value;
            }
        });
        console.log(manufacturer_str);
        $rootScope.brand_str = brand_str;
        $rootScope.manufacturer_str = manufacturer_str ;

        //var manufacturer_input = JSON.parse(brands);
        // alert(id);
        $("#all").removeClass("input_default_focus");
        var suburl;
        if (url) {
            suburl = url;
        } else {
            suburl = $cookieStore.get('subcategoryInfo').url

        }
        if (id) {

            if (id !== 'all') {
                ID = id;
                $('.all-sub-cat_buttons').removeClass('selection');
                $('#sub_cat_'+id).addClass('selection');
            } else {
                $('.all-sub-cat_buttons').removeClass('selection');
                $('#all').addClass('selection');
                ID = $cookieStore.get('subcategoryInfo').subcatid;
            }


        } else {
            ID = $cookieStore.get('subcategoryInfo').subcatid;
        }


        // alert(ID);
        loading.active();


        var args = $.param({
            category_id: ID,
            country_id: sessionStorage.country,
            language_code: sessionStorage.lang_code,
            user_type: user_type,
            user_id: uid,
            cat_url: suburl,
            sort_by: $scope.sort,
            brand: brand_str,
            token: uuid,
            //retailer_id : 47
        });
        if (apply == 'apply') {
            var range = $scope.minRangeSlider.minValue + "-" + $scope.minRangeSlider.maxValue
            $rootScope.range = range;
            console.log(range)
            var args = $.param({
                category_id: ID,
                country_id: sessionStorage.country,
                language_code: sessionStorage.lang_code,
                user_type: user_type,
                user_id: uid,
                cat_url: suburl,
                sort_by: $scope.sort,
                brand: brand_str,
                manufacture_id: manufacturer_str,
                range: range,
                token : uuid

                //retailer_id : 47
            });
        }

        // console.log(args);return;

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/product_list',
            data: args

        }).then(function (response) {

            res = response;
            //console.log(res.data.responseStatus);    
            //return;

            if (res.data.responseStatus == 'success') {
                console.log(res.data.data.category_product.products);
                $scope.categoryData = res.data.data.category_data[0];

                if ($scope.brand_data == '' || $scope.brand_data == undefined) {
                    $scope.brand_data = res.data.data.brand_data;
                }

              
                if (!id) {

                    if (id == 'all') {
                        $scope.categorysubData = "";//res.data.data.category_data[0].sub;
                    } else {
                        $scope.categorysubData = res.data.data.category_data[0].sub;
                    }

                    console.log("-------------------");
                    if ($scope.categorysubData.length == 0) {
                        $scope.categorysubData = "";
                    }

                    $scope.slickConfig0Loaded = true;
                    $scope.slickConfig0 = {
                        method: {},
                        dots: false,
                        infinite: false,
                        speed: 100,
                        autoplay: false,
                        // autoplaySpeed: 2500,
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 4,
                                    infinite: true,
                                    dots: false,
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 3.5,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 3,
                                }
                            },
                            {
                                breakpoint: 360,
                                settings: {
                                    slidesToShow: 2,
                                }
                            }
                        ]
                    };
                }
                $scope.category_product = res.data.data.category_product;
                $scope.image_path = res.data.data.category_product.image_path;
                $scope.min_price = res.data.data.category_product.min_price_for_slider;
                $scope.max_price = res.data.data.category_product.max_price_for_slider;
               
                $scope.minRangeSlider = {
                    minValue: $scope.min_price,
                    maxValue: $scope.max_price,
                    options: {
                        step: 0.01,
                        precision: 3

                    },

                };

                //alert( $scope.minRangeSlider)
                if ($scope.manufacturer_list == '' || $scope.manufacturer_list == undefined) {

                    $scope.manufacturer_list = res.data.data.manufacturer_list;
                }

                $scope.total_rows_remainder = res.data.data.category_product.total_rows % 10;
                $scope.total_rows_page = res.data.data.category_product.total_rows / 10;
                console.log($scope.total_rows_page);
                if ($scope.total_rows_remainder >= 1 && $scope.total_rows_remainder <= 9) {
                    $scope.total_rows_page = $scope.total_rows_page + 1;
                    $scope.total_pageno = Math.floor($scope.total_rows_page);

                }
                $rootScope.product = res.data.data.category_product.products;
                savehit =  true;
                $location.path('/subcategory');
            } else {

                alert(res.data.data.responseStatus);
            }

        }).finally(function () {
            loading.deactive();
			AOS.init({
				easing: 'ease',
				duration: 1000
		    });
        });

    }

    $scope.init = function (id) {
        var max_heightss = $(".accordion-panel_" + id).css("maxHeight");
        var iScrollHeight = $(".accordion-panel_" + id).prop("scrollHeight");
        if (max_heightss != "0px") {
            $("#accord_" + id).removeClass("selected");
            $(".accordion-panel_" + id).css('max-height', '0');
        } else {
            $("#accord_" + id).addClass("selected");
            $(".accordion-panel_" + id).css('max-height', iScrollHeight + 'px');
        }
    }
    if ($cookieStore.get("userinfo")) {
        var userID = $cookieStore.get("userinfo").uid;
        var user_type = $cookieStore.get("userinfo").user_type;
        uuid = ''
    } else {
        var userID = '';
        var user_type = '';
    }
    $scope.see_alls = function () {
        // loading.active();
        // alert($cookieStore.get('subcategoryInfo').subcatid);
        var args = $.param({
            product_type: $cookieStore.get('subcategoryInfo').subcatid,
            country_id: sessionStorage.country,
            language_code: sessionStorage.lang_code,
            user_id: userID,
            user_type: user_type,
			token : uuid
        });

        if ($cookieStore.get('subcategoryInfo').subcatid == 1) {
            $scope.feature_name = 'Best_picks_of_the_season';
        } else if ($cookieStore.get('subcategoryInfo').subcatid == 2) {
            $scope.feature_name = 'product_of_the_day';
        } else {
            $scope.feature_name = 'Featured_Product';
        }

        // console.log(args);return;

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
            // console.log(res.data);
            // return;


            if (res.data.data.status == 'success') {
                console.log(res.data.data.view_all)
                $scope.best_picks_of_the_season = res.data.data.view_all;
                $rootScope.is_in_wishlist = res.data.data.view_all[0].menu_varient_data.is_in_wishlist;
                $location.path('/subcategory');
            } else {

                alert(res.data.status);
            }

        }).finally(function () {
            loading.deactive();
        });

    }

    if ($cookieStore.get('subcategoryInfo').from == 'home') {
        $scope.see_alls();

    } else {
        $scope.fetch_product_list();
    }


    $scope.product_view = function (id, url) {
		  suburl = $cookieStore.get('subcategoryInfo').url;
		   ID = $cookieStore.get('subcategoryInfo').subcatid;
         // alert(suburl);
        // return;

        var productinfo = {
            'id': id,
			'category_id' : ID,
            'url': suburl,
			
        }
        $cookieStore.put('productinfo', productinfo);
        $location.path('/product/view');
    }

    //slider



    $scope.changeMinSlider = function () {
        console.log($scope.minRangeSlider)
    }

    //slider
    $scope.searchproducts = function () {
        // alert($scope.searchProduct);
        if ($scope.searchProduct == undefined || $scope.searchProduct == "") {
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
            'search': $scope.searchProduct
        }
        $cookieStore.put('search', search_key);
        $rootScope.searchProduct = $scope.searchProduct;
        $rootScope.searchBar();
    }


    $scope.filter = function (form) {
        //console.log($scope.sort);  
        $scope.fetch_product_list('all');

    }

    $scope.brand_array = [];
    //$scope.brand_ids = [];
    $scope.Filtering = function (id) {

        /*  getBrandDataFromFilter  = {
             'brand_id':id
         }
           */

        if ($('#brand_' + id).prop("checked") == true) {
            console.log($scope.brands);
            brand_array = $scope.brand_array.push(id);
            console.log(brand_array)
        }
        else if ($('#brand_' + id).prop("checked") == false) {
            //let index = $scope.brand_array.findIndex( getBrandDataFromFilter => getBrandDataFromFilter.id === id );
            //console.log(index)
            var index = $scope.brand_array.indexOf(id);
            $scope.brand_array.splice(index, 1);
        }
        console.log($scope.brand_array)

    }


    $scope.manufacturer_array = [];
    //$scope.manufacturer_ids = [];
    $scope.Filtering_manufacturer = function (id) {

        /*  getBrandDataFromFilter  = {
             'manufacturer_id':id
         }
           */
          console.log(id)

        if ($('#manufacturer_' + id).prop("checked") == true) {
            console.log($scope.brands);
            manufacturer_array = $scope.manufacturer_array.push(id);
            console.log(manufacturer_array)
        }
        else if ($('#manufacturer_' + id).prop("checked") == false) {
            //let index = $scope.manufacturer_array.findIndex( getBrandDataFromFilter => getBrandDataFromFilter.id === id );
            //console.log(index)
            var index = $scope.manufacturer_array.indexOf(id);
            $scope.manufacturer_array.splice(index, 1);
        }
        console.log($scope.manufacturer_array)

    }


    $scope.taptowish = function (id, wishlist_status) {
        //  alert(id+ " "+ wishlist_status);
        $rootScope.addToWishlist(id, wishlist_status);
        setTimeout(function () {
            $scope.see_alls();
        }, 1000)
    }


    $scope.taptowishlist = function (id, wishlist_status) {
        //  alert(id+ " "+ wishlist_status);return;
        $rootScope.addToWishlist(id, wishlist_status);
        // //  $route.reload();
        setTimeout(function () {
            $scope.fetch_product_list('all');
        }, 1000)
    }
    /** 
         * Pagination on Scrolling
         */
    $scope.page = 0;
    $scope.scrollPagination = function (id, url) {
        // console.log(id+ "-------- "+url);
        // console.log($cookieStore.get('subcategoryInfo'))
        // return;

        $("#all").removeClass("input_default_focus");
        var suburl;
        if (url) {
            suburl = url;
        } else {
            suburl = $cookieStore.get('subcategoryInfo').url
        }
        if (id) {

            if (id !== 'all') {
                ID = id;
            } else {
                ID = $cookieStore.get('subcategoryInfo').subcatid;
            }


        } else {
            ID = $cookieStore.get('subcategoryInfo').subcatid;
        }
        
        $(window).scroll(function () {
            var window_top = $(window).scrollTop();
            var div_top = $('#main-div2').offset().top;
            var div_height = $('#main-div2').outerHeight();
            console.log("outside");
            var sum = div_top + div_height + 3 - window.innerHeight;
            console.log(window_top + " " + sum + " outside");
            
            if (window_top == sum) {
                console.log("inside");
                console.log($rootScope.product)
                if ($rootScope.product.length < 10) {
                   
                } else {
                    var pageNo = $scope.page;
                   

                    if (pageNo > $scope.total_pageno) {
                        
                        return
                    }


                    ++pageNo;

                    if(savehit == true){
                        savehit = false;
                    $('#searchloder').addClass('show').removeClass('hide');
                    var args = $.param({
                        category_id: ID,
                        country_id: sessionStorage.country,
                        language_code: sessionStorage.lang_code,
                        user_type: user_type,
                        user_id: uid,
                        cat_url: suburl,
                        sort_by: $rootScope.sort,
                        brand: $rootScope.brand_str,
                        manufacture_id: $rootScope.manufacturer_str,
                        range: $rootScope.range,
                        page: pageNo,
                        token : uuid
                    });
                    // alert(args);
                    $http({
                        method: 'POST',
                        url: app_url + '/product_list',
                        data: args, //forms user object
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function (response) {
                        $('#searchloder').addClass('hide').removeClass('show');
                        //console.log(response.data);return;
                        if (response.data.responseStatus == 'success') {
                            savehit = true;
                            $scope.page = pageNo;
                            angular.forEach(response.data.data.category_product.products, function (value, key) {
                                $rootScope.product.push(value);
                            });
                        } else {
                            alert("Something went wrong");
                        }
                    });
                    // paused = true;\
                }
                }
            } else {

            }

            /* }else{
               if( paused ){
                  paused = false;
              }  */
        });
    }


    /**
     * End of Function
     */


    $scope.loadchild = function (id, url) {

       //alert(sessionStorage.seq)
        var subcategoryInfo = {
            'subcatid': id,
            'url': url,
            'from': 'category'
        }
        subcategoryInfosss = {
            'subcatid': id,
            'url': url,
            'from': 'category'
        }

        $cookieStore.put('subcategoryInfo',subcategoryInfo);
        var date = new Date();
        fromDateString = $filter('date')(date, 'dd-MM-yyyy')
      // alert(sessionStorage.seq++)
      if($cookieStore.get('seq')){

          sessionStorage.seq = $cookieStore.get('seq')
          sessionStorage.seq++
          $cookieStore.put('seq',sessionStorage.seq)
      }else{
        sessionStorage.seq++
        $cookieStore.put('seq',sessionStorage.seq)
        
      }

        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO catlog (seq_id, subca_id, url_type, from_where, date_added) VALUES (?,?,?,?,?)',[sessionStorage.seq, id, url, 'subcategory', fromDateString],function(tx, res){
                console.log(res)
                if(res.rowsAffected > 0){

                    sessionStorage.lastid = sessionStorage.seq;
                }else{
                    sessionStorage.lastid = '';
                }
                $route.reload();
            });
        });

    }

// console.log($coo..kieStore.get('subcategoryInfo'));
// alert($scope.valuekey)
    if($cookieStore.get('from')){
        $scope.valuekey = $cookieStore.get('from');
    }else{

        $scope.valuekey = $cookieStore.get('subcategoryInfo').from
    }


    $scope.backToGo = function () {
     //  alert($cookieStore.get('seq'))
     //  console.log(sessionStorage.seq)
       console.log(sessionStorage.lastid)

       if($cookieStore.get('seq')){

        sessionStorage.lastid = $cookieStore.get('seq')
        
    }
      // return


        if(sessionStorage.lastid == '' || sessionStorage.lastid == 1){
            
           
           // $location.path('/category');
		   window.history.back();
            

            return
        }

        db.transaction(function (tx) { 
               tx.executeSql('DELETE FROM catlog WHERE seq_id=?', [sessionStorage.lastid], function (tx, results) { 
                get  = results.rowsAffected
               console.log(results)
               console.log(get)
               if(get == 1){
                sessionStorage.lastid = sessionStorage.lastid - 1
                sessionStorage.seq = sessionStorage.lastid
                $cookieStore.put('seq',sessionStorage.lastid)
               }else{
              //  $location.path('/category');
			   window.history.back();
                return
               }
                // if(sessionStorage.lastid !== 0){

                //     sessionStorage.lastid = sessionStorage.lastid - 1
                //     sessionStorage.seq = sessionStorage.lastid
                // }else{
                    
                //     sessionStorage.lastid = ''
                //     $location.path('/category');
                //     return
                // }
                
                // console.log(sessionStorage.lastid)
                // if(sessionStorage.lastid == '' || sessionStorage.lastid < 1){
                //     loading.active();
                //     $location.path('/category');
                //     return
                // }
                tx.executeSql('SELECT * FROM catlog WHERE seq_id=?', [sessionStorage.lastid], function (tx, results) { 
             
                    console.log(results)

                    var subcategoryInfo = {
                        'subcatid': results.rows[0].subca_id,
                        'url': results.rows[0].url_type,
                        'from': results.rows[0].from_where
                    }
                  //  alert(sessionStorage.seq)
            
                    $cookieStore.put('subcategoryInfo',subcategoryInfo);
                    $route.reload();
                 }, null); 
               
                
                
             }, null);
              


            }, null); 

          


        

          
        


    }

});