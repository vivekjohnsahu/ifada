app.controller('myprofile', function ($scope, $http, $location, $interval, $cookieStore, model, $locale, loading, $route,$rootScope) {

$rootScope.selecthome();

    // $scope.select_country = "INDIA";
    // return;

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
        return false;
    }
    
    $scope.maxDate = new Date();
    $scope.monthSelectorOptions = {
        format: "dd-MM-yyyy"
    }
    

    /* Upload adds link */

    $scope.upload_ad = function () {
        $location.path('/upload_ads');
    }

    $scope.my_account = function () {
        $location.path("myaccount/account");
    }

    /* End Upload adds link  Here*/

    /* Update Profile of advertiser Link Form */

    $scope.update_advertise_info = function () {
        $location.path('myaccount/advertise_up');
    }

    /* End Update Profile of advertiser Link Form */


    /* Change Password  for advertiser Link Form */

    $scope.changepassword_advertise = function () {
        $location.path('/changepassword');
    }
    /* get Profile data for perticular user id  */


    $scope.toAddress = function(){
        $location.path("/address/add");
    }


    //Function to fetch the User's Data
    $scope.fetchcountry = function(){  
        loading.active();      
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded' //'multipart/form-data' 
            },
            method: 'POST',
            url: app_url + '/get_country',
            //data: args
        }).then(function (response) {  
            loading.deactive();
            console.log(response);
            res = response;   
            if (res.data.data.status == 'success') {
                $scope.Countries = res.data.data.country;   
                console.log($scope.Countries);             
            } else {    
                model.show('Alert', res.data.responseMessage);
                $location.path('/dashboard/myprofile');
            }
        }).finally(function () {
            loading.deactive();
        })
    }



    $scope.myprofile_data = function () {
        loading.active();
        //console.log("Profile data initialize")

        var args = $.param({
            'user_id': $cookieStore.get("userinfo").uid,
            language_code: sessionStorage.lang_code
            // 'country_id' : sessionStorage.country
        });

        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/basic_info',
            data: args //forms user object
 
        }).then(function (response) {
            loading.deactive();
            res = response;
            // console.log(res.data.data);return;
            if (res.data.data.status == 'success') {
                console.log(res);
                //put cookie and redirect it    
                $scope.fname = res.data.data.basic_info.first_name;
                $scope.lname = res.data.data.basic_info.last_name;
                $scope.email = res.data.data.basic_info.email;
                $scope.mobile = res.data.data.basic_info.mobile_number;
                $scope.address = res.data.data.basic_info.address;
                $scope.country = res.data.data.basic_info.COUNTRY_NAME;
                $scope.fetchcountry();
                $scope.select_country = res.data.data.basic_info.country_id;
                $scope.fetchcity();
                $scope.select_city = res.data.data.basic_info.city_id;
                $scope.city = res.data.data.basic_info.CITY_NAME;
                $scope.image = res.data.data.basic_info.image;

               
            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);
            }
        });

    }

    /*Update user profile */

    $scope.updateUserProfile = function (form) {
        var error_str = '';
       	$scope.lang_codes=sessionStorage.lang_code;
		if($scope.lang_codes == 'en')
		{ 
			if ($scope[form].$error) {

				if ($scope[form].fname.$error.required !== undefined) {
					error_str += "First Name, ";
				}
				
				if ($scope[form].lname.$error.required !== undefined) {
					error_str += "Last Name, ";
				}

			   /*  if ($scope[form].email.$error.required !== undefined || $scope[form].email.$error.email) {
					error_str += "Email Id, ";
				}
				if ($scope[form].mobile.$error.required !== undefined) {
					error_str += "Mobile Number, ";
				} */

				if ($scope[form].address.$error.required !== undefined) {
					error_str += "Address, ";
				}
				
				
				if ($scope[form].select_country.$error.required !== undefined) {
					error_str += "Country, ";
				}

				if ($scope[form].select_city.$error.required !== undefined) {
					error_str += "City, ";
				}
			}
			setTimeout(function () {
				error_str = error_str.substr(0, error_str.lastIndexOf(', '));
				if (error_str !== '') {
					error_str = " <span style='font-weight:700;'>Following fields must have valid information:</span></br>" + error_str;
					model.show('Alert', error_str);
					return false;
				}
			}, 400);
	  } else
      {
		
		    if ($scope[form].$error) {

				if ($scope[form].fname.$error.required !== undefined) {
					error_str += "الاسم الاول, ";
				}
				
				if ($scope[form].lname.$error.required !== undefined) {
					error_str += "الكنية, ";
				}

			   /*  if ($scope[form].email.$error.required !== undefined || $scope[form].email.$error.email) {
					error_str += "Email Id, ";
				}
				if ($scope[form].mobile.$error.required !== undefined) {
					error_str += "Mobile Number, ";
				} */

				if ($scope[form].address.$error.required !== undefined) {
					error_str += "عنوان, ";
				}
				
				
				if ($scope[form].select_country.$error.required !== undefined) {
					error_str += "بلد, ";
				}

				if ($scope[form].select_city.$error.required !== undefined) {
					error_str += "مدينة, ";
				}
			}
			setTimeout(function () {
				error_str = error_str.substr(0, error_str.lastIndexOf(', '));
				if (error_str !== '') {
					error_str = " <span style='font-weight:700;'>يجب أن تحتوي الحقول التالية على معلومات صالحة:</span></br>" + error_str;
					model.show('Alert', error_str);
					return false;
				}
			}, 400);
	  }		  
        if (error_str == '') {
           
      
            loading.active();

            // alert();
            var args = $.param({
                user_id: $cookieStore.get("userinfo").uid,
                first_name: $scope.fname,
                last_name: $scope.lname,
                address: $scope.address,
                country_id : $scope.select_country,
                city_id : $scope.select_city,
                language_code : sessionStorage.lang_code,
                image : $scope.image,
            });

            

            // alert(args);return;

            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + '/edit_account',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;

                console.log("response from the server ");
                console.log(res);

                if (res.data.data.status == 'success') {
                   
                    //console.log("Profile updated")
                    var fname = response.data.data.user_account.first_name;
                    var lname = response.data.data.user_account.last_name;
    
                    var fullName = fname+" "+lname;
    
                    var fullName = {
                        'fullName' : fullName
                    }
                    $cookieStore.put("FullName",fullName);
					if($scope.lang_codes == 'en')
		            {
						 model.show('Alert', 'Profile Updated Successfully');
					}else{
						  model.show('Alert', 'تم تحديث الملف الشخصي بنجاح');
					}
                   
                    $route.reload();
                    //$location.path('/dashboard/home');
                    
                } else {

                    //Throw error if not logged in

                    model.show('Alert', res.data.responseMessage);
                    $location.path('/dashboard/myprofile');
                }
            }).finally(function () {
                //loading.deactive();
            })
        
    }
}


   


    //defualt country
   
    //default city
    $scope.fetchcity = function(){
        // alert($scope.select_country);
        loading.active();
        // $scope.Cities = "";
        var args = $.param({
            'country_id': $scope.select_country
           // 'file' : profile_image
        });
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded' //'multipart/form-data' 
            },
            method: 'POST',
            url: app_url + '/get_city',
            data: args
        }).then(function (response) {  
            loading.deactive();
            // console.log(response);

            res = response;   
            if (res.data.data.status == 'success') {
                // console.log(res.data.data.city);
                if(!res.data.data.city){
					$scope.lang_codes=sessionStorage.lang_code;
					if($scope.lang_codes == 'en')
					{ 
                    // console.log("in the false");return;
                    model.show('Alert','No Cities Found!');
					}else
					{
					  model.show('Alert','لا توجد مدن!');	
					}
                    $scope.Cities = "";
                    console.log($scope.Cities);
                    return false;
                }else{
                    $scope.Cities = res.data.data.city;   
                    //console.log(res.data.data.city[0].state_id)
                    $scope.select_city = res.data.data.city[0].id;   
                    console.log($scope.CitiesInit); 
                }
            } else {    
                model.show('Alert', res.data.responseMessage);
                $location.path('/dashboard/myprofile');
            }
        }).finally(function () {
            loading.deactive();
        })
    }

    $scope.fileNameChanged = function() {
        
         navigator.camera.fileNameChanged(onSuccess, onFail, { quality: 75, targetWidth: 320,
        targetHeight: 320, destinationType: 0 }); 
        //destination type was a base64 encoding
        function onSuccess(imageData) {
            //preview image on img tag
            $('#image-preview').attr('src', "data:image/jpeg;base64,"+imageData);
            //setting scope.lastPhoto 
            $scope.lastPhoto = dataURItoBlob("data:image/jpeg;base64,"+imageData);
            console.log($scope.lastPhoto)
        }
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    } 
    function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
     var byteString = atob(dataURI.split(',')[1]);
     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    
     var ab = new ArrayBuffer(byteString.length);
     var ia = new Uint8Array(ab);
     for (var i = 0; i < byteString.length; i++)
     {
        ia[i] = byteString.charCodeAt(i);
     }
    
     var bb = new Blob([ab], { "type": mimeString });
     return bb; 
    }

    /* var imagedata= formData.append('photo', $scope.lastPhoto, $scope.publish.name+'.jpg')
    console.log(imagedata) */
});
