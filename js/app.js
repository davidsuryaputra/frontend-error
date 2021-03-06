var rentalkika = angular.module('rentalkika', ['ngRoute', 'ngFileUpload']);

//frontend routing
rentalkika.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'pages/main.html',	
		title: "Home"
	})
	.when('/sewa_mobil', {
		templateUrl : 'pages/sewa_mobil.html',
		controller : 'FilterController',
		title: "Sewa Mobil"	
	})
	.when('/contact', {
		templateUrl : 'pages/contact.html',
		controller : 'ContactController',
		title: "Hubungi Kami"
	})
	.when('/register', {
		templateUrl : 'pages/register.html',
		controller: 'RegisterController',
		title: "Register Member"
	})
	.when('/register_partner', {
		templateUrl : 'pages/register_partner.html',
		controller: 'RegisterPartnerController',
		title: "Register Partner"
	})
	.when('/dashboard', {
		templateUrl : 'pages/backend/dashboard.html'
		//controller : 'DashboardController'
	})
	.otherwise({redirectTo : '/'});
	
});

//backend routing
rentalkika.config(function ($routeProvider) {
	$routeProvider
	.when('/admin/login', {
		title: "Admin Page",
		template: "haloxxx"
	});
});

rentalkika.run(function ($rootScope, $route, authService) {
	
	$rootScope.$on('$routeChangeSuccess', function () {
		//alert('route');
		document.title = $route.current.title;
	});	
	
	$rootScope.fbLoggedIn = authService.fb_logged_in();
	console.log($rootScope.fbLoggedIn);
	//init fb login
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '218120761958155',
	      xfbml      : true,
	      version    : 'v2.8'
	    });
	    FB.AppEvents.logPageView();
	  };
	
	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));	
	//end fb login
});


rentalkika.controller('FilterController', function ($scope, $http) {
	var config = { headers: {'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58'}};
	
	$http.get('http://128.199.249.233:1337/parse/classes/city', config).then(function (response) {
		$scope.cities = response.data.results;	
	}, function (error) {
		console.log(error);
	});
	
	$http.get('http://128.199.249.233:1337/parse/classes/car_class',  config).then(function (response) {
		$scope.car_classes = response.data.results;
	}, function (error) {
		console.log(error);
	});
	
	
	var configVehicleInit = {
		
		params: {
			include: 'pool_id.city_id,car_id.car_class_id,partner_id.user_id',		
		},
		headers: { 'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58' }
		
	};
		
	
	$http.get('http://128.199.249.233:1337/parse/classes/vehicle', configVehicleInit).then(function (response) {
		$scope.vehicle_exists = "yes";
		$scope.vehicles = response.data.results;
		console.log($scope.vehicles);
		var arr = response.data.results;
		$scope.years = [];
		for (i = 0; i < arr.length; i++) {
			if($scope.years.indexOf(arr[i].vehicle_year) == -1){
				$scope.years.push(arr[i].vehicle_year);			
			}
		}
	}, function (error) {
		console.log(error);
	});
	
	
	$scope.filter = { tahun_mobil : '', kelas_mobil : '', lokasi_mobil : ''};
	$scope.handleSubmit = function (){
		
		/*
		var config = {
			params : {
				where : {
					vehicle_year : $scope.filter.tahun_mobil,
					car_class : $scope.filter.kelas_mobil,
					lokasi_mobil : $scope.filter.lokasi_mobil,
					vehicle_status : 'available'
				}
			},
			headers : { 'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58' }
					
		};
		*/
		
	var config = {
		
		params: {
			where: {
				vehicle_year: $scope.filter.tahun_mobil,
				pool_id: {
					$inQuery: {
						where: {
							city_id: {
								$inQuery: {
									where: {
										city_name: $scope.filter.lokasi_mobil
									},
									className: "city"								
								}
							
							}
							//pool_address: "JL. DEF"						
						},
						className: "pool"					
					}		
				},
				car_id: {
					$inQuery: {
						where: {
							car_class_id: {
								$inQuery: {
									where: {
										name: $scope.filter.kelas_mobil									
									},
									className: "car_class"								
								}
							}						
						},
						className: "car"					
					}				
				}
				
			},
			include: 'pool_id.city_id,car_id.car_class_id,partner_id.user_id'
			
		},
		
		headers: { 'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58' }	
	};
		
		console.log(config);
		
		$http.get('http://128.199.249.233:1337/parse/classes/vehicle', config).then(function (response) {
			console.log(response.data.results);
			
			if (response.data.results.length == 0) {
				//alert('data tidak ditemukan');
				//$scope.vehicles = response.data.results;
				//$scope.notfound = 'Data tidak ditemukan';	
				$scope.vehicle_exists = "no";		
			}else{
				$scope.vehicle_exists = "yes";
				$scope.vehicles = response.data.results;
				console.log(response.data.results);
			}
			
			
		}, function (error){
			console.log(error);
		});	
	
	}
	
});

//objectId: "KugCcxETFE"
//include: 'pool_id'
rentalkika.controller('ContactController', function ($scope, $http) {
	var config = {
		/*
		params: {
			where: {
				vehicle_year: "2013",
				pool_id: {
					$inQuery: {
						where: {
							city_id: {
								$inQuery: {
									where: {
										city_name: "Jakarta"
									},
									className: "city"								
								}
							
							}
							//pool_address: "JL. DEF"						
						},
						className: "pool"					
					}		
				},
				car_id: {
					$inQuery: {
						where: {
							car_class_id: {
								$inQuery: {
									where: {
										name: "Box"									
									},
									className: "car_class"								
								}
							}						
						},
						className: "car"					
					}				
				}
				
			},
			include: 'pool_id.city_id,car_id.car_class_id',
			
		},
		*/
		headers: { 'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58' }	
	};
	
	
		$http.get('http://128.199.249.233:1337/parse/classes/vehicle', config).then(function (response){
			console.log(response.data.results);
		}, function (error) {
			console.log(response);
		});

});


/*
rentalkika.factory('authService', function($scope, $http, $location){
	
	var authService = {};
	
	authService.login = function () {
			
			var configLogin = {
			params: {
				username: $scope.login.username,
				password: $scope.login.password		
			},
			headers: {
				'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
				'Content-Type' : 'application/x-www-form-urlencoded'
				
			}
		}
	
		$http.get('http://128.199.249.233:1337/parse/login', configLogin).then(function (response) {
			//console.log(response.data);
			return $location.path('/dashboard');
		}, function (error){
			return $scope.error = error.data.error;
		});
		
	};	
	
	return authService;	
	
});
*/



rentalkika.controller('LoginController', function ($rootScope, $scope, $http, $route, $window, $location, sessionService, authService){
	

	
	
	$scope.login = { username: "", password: "" };
	if(sessionService.get('sessionToken') != null){
	//$scope.isLoggedIn = true;	
	$scope.hasNotsignedIn = false;	
	}else {
	$scope.hasNotsignedIn = true;	
	//$scope.isLoggedIn = false;
	}
	
	$scope.handleLogin = function () {
		
		//authService.login($scope);
		
		
		var configLogin = {
			params: {
				username: $scope.login.username,
				password: $scope.login.password		
			},
			headers: {
				'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
				'Content-Type' : 'application/x-www-form-urlencoded'
				
			}
		}
	
		$http.get('http://128.199.249.233:1337/parse/login', configLogin).then(function (response) {
			
					
			
			console.log(response.data);
			$.magnificPopup.close();
			sessionService.set('isLoggedIn', 'yes');
			sessionService.set('role', response.data.role_name);
			sessionService.set('sessionToken', response.data.sessionToken);
				
			$location.path('/dashboard');
			$scope.loggedIn = authService.app_logged_in();
				
		}, function (error){
			$scope.error = error.data.error;
		});
		
		
	}

	$scope.FBLogin = function (){
		authService.fbLogin().then(function (response) {
			
		var dataLoginFb = {
		authData: {
				facebook: {
					id: sessionService.get('fb_id'),
					access_token: sessionService.get('fb_access_token'),
					expiration_date: sessionService.get('fb_expiration_date')
				}				
			}
		}
		
		var configLoginFb = { 
		
			headers: {
				'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
				'Content-Type' : 'application/json'
				}
		};
		
		$http.post('http://128.199.249.233:1337/parse/users', dataLoginFb, configLoginFb).then(function (response) {
			console.log(response.data);
			$.magnificPopup.close();
			sessionService.set('isLoggedIn', 'yes');
			sessionService.set('role', response.data.role_name);
			sessionService.set('sessionToken', response.data.sessionToken);
				
			$location.path('/dashboard');
			$scope.loggedIn = authService.app_logged_in();
			console.log($scope.loggedIn);
		}, function (error) {
			console.log(error);
		});
			
		}, function (error) {
			console.log(error);
		});

		
	}
	
	$scope.logout = function () {
		
		sessionService.destroy('isLoggedIn');	
		sessionService.destroy('role');	
		sessionService.destroy('sessionToken');
		sessionService.destroy('fb_id');
		sessionService.destroy('fb_access_token');
		sessionService.destroy('fb_expiration_date');
		
		
		if(sessionService.get('sessionToken') != null){
		//$scope.isLoggedIn = true;	
		$scope.hasNotsignedIn = false;	
		}else {
		$scope.hasNotsignedIn = true;	
		//$scope.isLoggedIn = false;
		}
		
		$window.location.href = "/";
		//$scope.$apply(function () {
		//$location.path("/register");	
		//});
		//$route.reload();
		
		
		
	}
	
	
});

rentalkika.controller('RegisterController', function ($scope, $http, $location, Upload, $timeout, authService) {
	
	$scope.customer = {
	username: '', 
	email: '',
	password: '',
	passwordConfirmation: '',
	full_name: '',
	address: '',
	phone: '',
	family_name: '',
	family_phone: '',
	family_address: '',
	};
	
	$scope.registerFB = function () {
		
		authService.fbLogin().then(function(response){
			$scope.fbLoggedIn = authService.fb_logged_in();
			console.log($scope.fbLoggedIn);
		}, function (error) {
			console.log(error);		
		})
	}

	
	$scope.handleRegister = function (file) {
		
		var data = {
			username: $scope.customer.username,
			email: $scope.customer.email,
			password: $scope.customer.passwordConfirmation,
			full_name: $scope.customer.full_name,
			address: $scope.customer.address,
			phone: $scope.customer.phone,
			status: "waiting",
			role_name: "customer"
		};
		
		$scope.file = file;
		
		var configRegister = { 
		
			headers: {
				'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
				'Content-Type' : 'application/json'
				}
		};
	
		$http.post('http://128.199.249.233:1337/parse/users', data, configRegister).then(function (response) {
			console.log(response);	
			$scope.userObjectId = response.data.objectId;
			console.log($scope.userObjectId);

			//upload
			$scope.file.upload = Upload.http({
		      //url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
		      //data: {username: $scope.username, file: file},
		      url: 'http://128.199.249.233:1337/parse/files/'+$scope.file.name,
		      headers: {
		       'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
		       'Content-Type': $scope.file.type
		      },
		      data: $scope.file
		    });
		
		    $scope.file.upload.then(function (response) {
		      $timeout(function () {
		        $scope.file.result = response.data;
		        console.log(response.data);
		        //berhasil
					
				  var dataProfileCustomer = {
					user_id : {
						__type: "Pointer",
						className: "_User",
						objectId: $scope.userObjectId
					},
					family_name: $scope.customer.family_name,
					family_phone: $scope.customer.family_phone,
					family_address: $scope.customer.family_address,
					ktp_user: {
						name: response.data.name,
						url: response.data.url,
						__type: "File"
					}
				};
				
				$http.post('http://128.199.249.233:1337/parse/classes/customer', dataProfileCustomer, configRegister).then(function (response) {
					console.log(response.data);
					$location.path('/');
						
				}, function (error) {
					alert(error.data.error);
				});					
							        
		        
		      });
		    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
		        console.log(response.data);
		        //gagal
		    });
			//end upload

			
			
			
		}, function (error) {
			alert(error.data.error);
			//error first req
		});
	
	}


});


rentalkika.controller('RegisterPartnerController', function ($scope, $http, $location, Upload, $timeout, authService, sessionService) {
	
	$scope.partner = {
	username: '', 
	email: '',
	password: '',
	passwordConfirmation: '',
	full_name: '',
	address: '',
	phone: '',
	owner_name: '',
	owner_phone: '',
	owner_address: '',
	};
	
	
	$scope.registerFB = function () {
		
		authService.fbLogin().then(function(response){
			$scope.fbLoggedIn = authService.fb_logged_in();
			console.log($scope.fbLoggedIn);
		}, function (error) {
			console.log(error);		
		})
	}
	
	$scope.handleRegister = function (file) {
		
		var data = {
			username: $scope.partner.username,
			email: $scope.partner.email,
			password: $scope.partner.passwordConfirmation,
			full_name: $scope.partner.full_name,
			address: $scope.partner.address,
			phone: $scope.partner.phone,
			status: "waiting",
			role_name: "partner",
			authData: {
				facebook: {
					id: sessionService.get('fb_id'),
					access_token: sessionService.get('fb_access_token'),
					expiration_date: sessionService.get('fb_expiration_date')
				}				
			}
		};
		
		$scope.file = file;
		console.log($scope.file);
		
		
		var configRegister = { 
		
			headers: {
				'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
				'Content-Type' : 'application/json'
				}
		};
	
		$http.post('http://128.199.249.233:1337/parse/users', data, configRegister).then(function (response) {
			console.log(response);	
			$scope.userObjectId = response.data.objectId;
			console.log($scope.userObjectId);
			console.log($scope.file);
			
			
			//upload
			$scope.file.upload = Upload.http({
		      //url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
		      //data: {username: $scope.username, file: file},
		      url: 'http://128.199.249.233:1337/parse/files/'+$scope.file.name,
		      headers: {
		       'X-Parse-Application-Id' : 'gMKfl1wDyk3m6I5x0IrIjJyI87sumz58',
		       'Content-Type': $scope.file.type
		      },
		      data: $scope.file
		    });
		
		    $scope.file.upload.then(function (response) {
		      $timeout(function () {
		        $scope.file.result = response.data;
		        console.log(response.data);
		        //berhasil
					
				var dataProfileOwner = {
					user_id : {
						__type: "Pointer",
						className: "_User",
						objectId: $scope.userObjectId
					},
					partner_owner: $scope.partner.owner_name,
					owner_phone: $scope.partner.owner_phone,
					owner_address: $scope.partner.owner_address,
					ktp_owner: {
						name: response.data.name,
						url: response.data.url,
						__type: "File"
					}
				};
				
			$http.post('http://128.199.249.233:1337/parse/classes/partner', dataProfileOwner, configRegister).then(function (response) {
				console.log(response.data);
				$location.path('/');
					
			}, function (error) {
				alert(error.data.error);
			});				
							        
		        
		 });
		 
		    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
		        console.log(response.data);
		        //gagal
		    });
			//end upload
			
			
		}, function (error) {
			alert(error.data.error);
		});
		
	}


});

rentalkika.factory('sessionService', function () {
	
	var sessionService = {};
	
	sessionService.set = function (key, value) {
		return sessionStorage.setItem(key, value);
	};
	
	sessionService.get = function (key) {
		return sessionStorage.getItem(key);
	};
		
	sessionService.destroy = function (key) {
		return sessionStorage.removeItem(key);
	};	
	
	return sessionService;
	
});

rentalkika.factory('authService', function (sessionService, $rootScope, $q) {
	
	var authService = {};
	
	authService.fbLogin = function () {
			var defer = $q.defer();
			var FB = window.FB;
			
			FB.login(function(response) {
		 	console.log(response);
		 	
		 	/*
		 	authData: {
				facebook: {
					id: response.authResponse.userID,
					access_token: response.authResponse.accessToken,
					expiration_date: new Date(new Date().getTime() + response.authResponse.expiresIn * 1000).toISOString()
				}		 	
		 	}
		 	*/
		 	//;
		 	//response.authResponse.userID
		 	//response.authResponse.expiresIn;
		 	
	    if (response.authResponse) {
	    	sessionService.set('fb_id', response.authResponse.userID);
		 	sessionService.set('fb_access_token', response.authResponse.accessToken);
		 	sessionService.set('fb_expiration_date', new Date(new Date().getTime() + response.authResponse.expiresIn * 1000).toISOString());
	     //console.log('Welcome!  Fetching your information.... ');
	     FB.api('/me', function(response) {
	       defer.resolve('Good to see you, ' + response.name + '.');
	     	 console.log(response);
	     	 //$scope.fbName = response.name;
			 //var expDate = new Date(new Date().getTime() + $localStorage.expiresIn * 1000).toISOString();
				
	     });
	     //$location.path('/register');
	     //$rootScope.fbLoggedIn = true;
	     
	    } else {
	     defer.reject('User cancelled login or did not fully authorize.');
	     //console.log(response);
	    }
		});
		return defer.promise;
	
	};
	
	authService.fb_logged_in = function () {
		if(sessionService.get('fb_access_token') != null){
			return true;
		}else {
			return false;		
		}
	};
	
	authService.app_logged_in = function () {
		if(sessionService.get('sessionToken') != null){
			return true;
		}else {
			return false;		
		}
	};
	
	return authService;

});


rentalkika.directive('passwordConfirm', ['$parse', function ($parse) {
 return {
    restrict: 'A',
    scope: {
      matchTarget: '=',
    },
    require: 'ngModel',
    link: function link(scope, elem, attrs, ctrl) {
      var validator = function (value) {
        ctrl.$setValidity('match', value === scope.matchTarget);
        return value;
      }
 
      ctrl.$parsers.unshift(validator);
      ctrl.$formatters.push(validator);
      
      // This is to force validator when the original password gets changed
      scope.$watch('matchTarget', function(newval, oldval) {
        validator(ctrl.$viewValue);
      });

    }
  };
}]);


