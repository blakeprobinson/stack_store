'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);

var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt', 'ngCookies']);
app.controller('MainController', function ($scope, $rootScope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Men', state: 'products' },
        { label: 'Women', state: 'women' },
        { label: 'Join us', state: 'join' },
        { label: 'Log In', state: 'login'},
        { label: 'Product list', state: 'products' },
        { label: 'My Orders', state: 'orders'}
    ];
    $scope.adminItems= [
        { label: 'Create product', state: 'admin.itemCreate' },
        { label: 'Modify User', state: 'admin.userModify'},
        { label: 'Modify Order', state: 'admin.orderModify'},
        { label: 'Create Product Cat Pg', state: 'admin.productCatCreate'}
    ]





});


app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope) {

    // Images of beautiful Fullstack people.
    $scope.images = [
        'https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large',
        'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg',
        'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg',
        'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg',
        'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large',
        'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large'
    ];

});
'use strict';
app.config(function ($stateProvider) {

    
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin.html'
    });

});


'use strict';
app.controller('AdminController', function ($scope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Create Item', state: 'itemCreate' },
        { label: 'Modify User', state: 'userModify' }
    ];

});

app.directive('adminNavbar', function () {
    return {
        restrict: 'E',
        scope: {
          items: '='
        },
        templateUrl: 'js/common/directives/navbar/navbar.html'
    };
});
'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {


    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *men* state.
    $stateProvider.state('men', {
        url: '/products/men',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *women* state.
    $stateProvider.state('women', {
        url: '/products/women',
        // controller: 'categoryController',
        controller: function ($scope, GetItemsFactory, $state, $stateParams) {
			console.log("before", $scope.items, $state.current);
			GetItemsFactory.getItems().then(function(items){	
				$scope.items = items;
				console.log(items);
			});
		},
        templateUrl: 'js/allitems/allitems.html',
    })
});


app.controller('allItemsController', function ($scope, AuthService, GetItemsFactory, $state, $stateParams, $cookieStore, OrderFactory) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});


	$scope.addToOrder = function(specificItem){
		console.log('got into the addToOrder function'); //part one always add it to the cookie
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {itemId: specificItem._id, quantity: 1};
		 console.log('order', order);
			if(order){ //if user has an order on a cookie
 
				order.forEach(function(itemLine){
					if(itemLine.itemId === specificItem._id){
						itemLine.quantity++;
						resolved = true;
					}	
				});
				if(!resolved){
					order.push(line);
				}
			}
			else{
				order.push(line);
			}


		$cookieStore.put('Order', order);

		// var user = AuthService.getLoggedInUser();
		// if(user){
		// 	//OrderFactory.getOrders(user._id)//
		// }
	}
});



app.controller('categoryController', function ($scope, GetItemsFactory, $state, $stateParams) {

	$scope.getCategory = function (category){
		console.log("men controller", category);
			GetItemFactory.getCategoryItems().then(function(items, err){
					if(err) throw err;
						else{
							$scope.items = items;
					};
			});
	};
});




(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function ($location) {

        if (!window.io) throw new Error('socket.io not found!');

        var socket;

        if ($location.$$port) {
            socket = io('http://localhost:1337');
        } else {
            socket = io('/');
        }

        return socket;

    });

    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        var onSuccessfulLogin = function (response) {
            var data = response.data;
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        };

        this.getLoggedInUser = function () {

            if (this.isAuthenticated()) {
                return $q.when({ user: Session.user });
            }

            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });

        };

        this.login = function (credentials) {
            console.log(credentials);
            return $http.post('/login', credentials).then(onSuccessfulLogin);
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

        this.isAuthenticated = function () {
            return !!Session.user;
        };

    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, this.destroy);
        $rootScope.$on(AUTH_EVENTS.sessionTimeout, this.destroy);

        this.create = function (sessionId, user) {
            this.id = sessionId;
            this.user = user;
        };

        this.destroy = function () {
            this.id = null;
            this.user = null;
        };

    });

})();
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html'
    });

});

app.controller('HomeCtrl', function ($scope) {
});
app.controller('productreviewscontroller', function($scope){
    $scope.rate1 = 0;

    $scope.rate2 = 6;

    $scope.reviewslist = [
        {
            rating: 5,
            text: "These are quite simply the best glasses, nay the best ANYTHING I've ever owned! " +
            "When I put them on, an energy beam shoots out of my eyeballs that makes everything I look at " +
            "burst into flames!! My girlfriend doesn't appreciate it, though."
        },
        {
            rating: 1,
            text: "These glasses are the worst! Who made these? When I opened the package they sprung out and sucked " +
            "onto my face like the monster in ALIEN! I had to beat myself in the head with a shovel to get them off! " +
            "Who ARE you people? What is wrong with you? Have you no dignity? Don't you understand what eyeglasses are " +
            "FOR?"
        },
        {
            rating: 4,
            text: "The glasses are just OK — to spice things up I chopped up some scallions and added some heavy cream, a pinch of tartar, " +
            "some anchovy paste, basil and a half pint of maple syrup. The glass in the glasses still came out crunchy though. " +
            "I'm thinking of running them through a mixmulcher next time before throwing everything in the oven."
        }
    ]
})
app

    .constant('ratingConfig', {
        max: 5,
    })

    .directive('reviewstar', ['ratingConfig', function(ratingConfig) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                value: '='
            },
            controller: "productreviewscontroller",
            template: '<div id="showme" ng-mouseleave="reset()"><i id="showme" ng-repeat="number in range" ' +
                'ng-mouseenter="enter(number)" ng-click="assign(number)" ' +
                'ng-class="{\'glyphicon glyphicon-star icon-gold\': number <= val, ' +
                '\'glyphicon glyphicon-star icon-gray\': number > val}"></i></div>',
            link: function(scope, element, attrs, index) {
                var maxRange = angular.isDefined(attrs.max) ? scope.$eval(attrs.max) : ratingConfig.max;
                scope.range = [];
                for(var i = 1; i <= maxRange; i++ ) {
                    scope.range.push(i);
                };

                scope.val = scope.value;

                //console.log(scope);


            }
        };
    }]);

app.controller('productstar', function($scope) {

    $scope.rate1 = 0;

    $scope.rate2 = 6;

    $scope.val = $scope.rating;

});
'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {

    // Register our *item* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams, $cookieStore, AuthService, OrderFactory ) {

	//get input from user about item (id from url )
	//check id vs database
	//if not found, redirect to search page
	//if found send tempalateUrl

	GetItemFactory.getItem($stateParams.name).then(function(item, err){
		if(err) $state.go('home');
		else{
			$scope.item = item[0];
			}
	});

	$scope.addToOrder = function(){
		
		AuthService.isAuthenticated().then(function(answer){
			var order = $cookies.get('Order');
			var line = {item: $scope.item, quantity: 1};
			if(!order){
				$cookies.put('Order', line);
			}
			else{
				order.push(line);
				$cookies.put('Order', order);
			}

			if(answer){
				OrderFactory.addItem()
			}
		})
	}
});
'use strict';
app.config(function ($stateProvider) {

    // Register our *itemCreate* state.
    $stateProvider.state('admin.itemCreate', {
        url: '/itemCreate',
        controller: 'itemCreateController',
        templateUrl: 'js/itemCreate/itemCreate.html',
        resolve: {
        	getItems:  function($http){
        		return $http.get('/api/itemlist').then(function (response){
					return response.data;
        			})
        		}
        	}
    });

});

app.controller('itemCreateController', function ($scope, CreateItemFactory, getItems, $state, $stateParams) {

	$scope.item;
	$scope.success;

	$scope.menuItems = [
		{ label: 'all items'},
        { label: 'mens'},
        { label: 'womens'},
        { label: 'kids'},
        { label: 'pets'}
    ];

	$scope.allItems = getItems

	$scope.items = $scope.allItems

	$scope.filterItems = function (category) {
		if (category = 'all items') {
			return $scope.items = $scope.allItems
		}
	}

	console.log($scope.items[0].available)

	$scope.submitItem = function() {
		//$scope.item.categories = $scope.item.categories.split(' ');
		//console.log('process started');
		//console.log($scope.item);
		CreateItemFactory.postItem($scope.item).then(function(item, err){
			if(err) $scope.success= false;
			else{
				console.log(item);
				$scope.success = true;
				
			}
		});
	}
});
app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('join', {
        url: '/join',
        controller: 'joinController',

        templateUrl: 'js/joinnow/joinnow.html' 

    });

});



app.controller('joinController', function($scope, $window, CreateUserFactory, AuthService) {

    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }

    $scope.success;


    $scope.submitUser = function() {
    	console.log("user submit process started");
    	console.log($scope.user);
	    CreateUserFactory.postUser($scope.user).then(function(user, err){
	    	if (err) $scope.success=false;
	    	else{
                AuthService.login(user).then(function(conclusion){
                    console.log(user);
                    $scope.success = true;
                });
	    	}
	    });
	  }

      function validatePassword (email){
        regex = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)([\w-]+\.)+[\w-]{2,4})?$/;
        return regex.test(email);
      }

});


app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('login', {
        url: '/login',
        controller: 'loginController',
        templateUrl: 'js/login/login.html' 
    });

});


app.controller('loginController', function ($scope, $window, AuthService, $state, Session, $rootScope) {
    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }
    $scope.success;
    $scope.submitUser = function() {
        var info = $scope.user;
        console.log("user login process started with: ", info);
        AuthService.login(info).then(function(info){
            console.log("controller", info);
                if (info.admin) {
                    $state.go('admin')
                } else {
                    $state.go('products')
                }
        });
    // this is just testing sessions started
    $scope.isLoggedIn = AuthService.isAuthenticated();
    // end test



        // GetUserFactory.authUser(info).then(function(user, err){
        //     if(err) $scope.success = false;
        //     else {
        //         $rootScope.success = false;
        //         console.log($rootScope.currentUser)
        //         if (user[0].admin) {
        //             $state.go('admin')
        //         } else {
        //             $state.go('home')
        //         }
        //     }
        // })      

    };
});

'use strict';
app.config(function ($stateProvider) {

    // Register our *orders* state.
    $stateProvider.state('orders', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('orderController', function ($scope, GetItemsFactory, OrderFactory, $state, $stateParams, $cookieStore, AuthService) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[]; //expects item {itemId: itemId, price: num, imgUrl:String, }, qty: num
	$scope.pastorders=[];
	$scope.user;
	$scope.sum = 0;
	$scope.totalQty = 0; 
	$scope.tempVal;
	$scope.orderId;
	$scope.userId;
	$scope.auth;

	function firstUpdate (){
	//check if user is authenticated, populate order from db, set order to cookie
		if( AuthService.isAuthenticated() ){
			AuthService.getLoggedInUser().then(function(user){
			$scope.userId = user._id;
			$scope.user = user.first_name;
			$scope.auth = true;
				OrderFactory.getOrders($scope.userId).then(function(items, err){
					console.log('items', items);
					if (err) console.log('Error: ', err);
					else if(!items) { //no items in dB, get cookies, set order
						$scope.activeorders = $cookieStore.get('Order');
						OrderFactory.createOrder({userId: $scope.userId, items: $scope.activeorders}, function(response){
							$scope.activeorders = response.lineitems;
							sum();
							totalQty();
						});
					}
					else { //items in db, make sure cookies are added to db
						$scope.activeorders = items.lineitems.lineItem;
						$scope.orderId = items.orderId;
						sum();
						totalQty();
					}
				});
			});
		}
		else {
			var idAndQty = $cookieStore.get('Order');
			var productList=[];
			GetItemsFactory.getItems().then(function(items, err){ //approach will not scale well but is quicker now
				if(err) console.log(err);
				idAndQty.forEach(function(itemPair){
					for(var a=0, len=items.length; a<7; a++){
						if(itemPair.itemId === items[a]._id){
							productList.push({item: items[a], quantity: itemPair.quantity });
						}
					}
				});
				console.log('prodList', productList);
				$scope.activeorders = productList;
				$scope.user = 'User';
				$scope.auth = false;
				sum();
				totalQty();
			})
		}
	};

	firstUpdate();

	function totalQty (){
		var totalQ = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			totalQ= totalQ + lineItem.quantity;
		})
		$scope.totalQty = totalQ;
	};

	$scope.removeItem = function(item){
		//remove item from db, remove item from cookie, remove item from scope
		//if authenticated, remove item from order
		var myOrderCookie = $cookieStore.get('Order');
		console.log(myOrderCookie, item);
		var location = getLocInCookie(myOrderCookie, item._id);

		var removedItem = myOrderCookie.splice(location, 1);
		$cookieStore.put('Order', myOrderCookie);

		$scope.activeorders.splice(location,1);
		sum();
		totalQty();

		if(AuthService.isAuthenticated()){
			OrderFactory.updateOrder({orderId: $scope.orderId, quantity: 0, itemId: Item._id}).then(function(err, data){
				if(err) console.log(err);

			});
			$scope.auth = true;
		}
	}

	function getLocInCookie (cookies, id){
		var loc;
		cookies.forEach(function(element, index){
			if(element.itemId === id){
				console.log(element.itemId, " is the correct key");
				loc = index;
			}
		});
		return loc;
	}

	$scope.updateOrder = function(item, val){
		//takes in information about the user, 
		if(val == 0){
			$scope.removeItem(item.item);
		}
		else{
			if($scope.userId){
				OrderFactory.updateOrder({orderId: $scope});
			}
			var orderCookie = $cookieStore.get('Order');
			var index = getLocInCookie(orderCookie, item.item._id);
			orderCookie[index].quantity = Number(val);
			$cookieStore.put('Order', orderCookie);

			$scope.activeorders[index].quantity = Number(val);
			sum();
			totalQty();
		}
		
	}; 
	$scope.newNumber = function(item, val){
		console.log('item', item, 'val', val);
	}
	//get user information and send Id

	$scope.showCookie = function(){
		console.log($cookieStore.get('Order'));
		$scope.activeorders = $cookieStore.get('Order');
	}

	$scope.deleteCookie = function(){
		$cookieStore.remove('Order');
		console.log($cookieStore.get('Order'));
	}
	$scope.showOrderFromDb = function(){
		//console.log(AuthService.isAuthenticated());
		if($scope.userId){
			OrderFactory.getOrders($scope.userId).then(function(result, err){
				console.log('results', result,'Error', err);
			})
		}
		else {
			console.log('No user exists');
		}
		
	}

	function sum (){
		var total = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			console.log(lineItem);
			total= total + lineItem.item.price * lineItem.quantity;
		})
		$scope.sum = total;
	};
	
});
'use strict';
app.config(function ($stateProvider) {

    
    $stateProvider.state('admin.orderModify', {
        url: '/orderModify',
        templateUrl: 'js/orderModify/orderModify.html',
        controller: 'orderModifyController',
        resolve: {
        	getOrders:  function($http){
        			// var orderObject = {}
        			return $http.get('/api/admin/order')
        				.then(function(response){
        					return response.data
        					})
        			}
        		}
   	})
});

app.controller('orderModifyController', 
	function ($scope, orderModifyFactory, $state, $stateParams, $rootScope, getOrders) {

	$scope.item = {
		categories: [] };
	$scope.success;

	$scope.allOrders = getOrders

	$scope.orders;

	$scope.menuItems = [
		{ label: 'all orders'},
        { label: 'open'},
        { label: 'placed'},
        { label: 'shipped'},
        { label: 'complete'}
    ];

    $scope.changeStatusMenuItems = [
        { label: 'open'},
        { label: 'placed'},
        { label: 'shipped'},
        { label: 'complete'}
    ];

	$scope.filterOrders = function(status) {
		$scope.orders = orderModifyFactory.filterOrders(status, $scope.allOrders)

		$scope.filtered = false;
	}

    $scope.changeStatus = function (orderId, status, index) {
        var data = [orderId, status]
        $scope.orders[index].status = status
        orderModifyFactory.modifyOrder(data)
    }
});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('admin.productCatCreate', {
        url: '/productCatCreate',
        templateUrl: 'js/productCatCreate/productCatCreate.html'
    });

});
app.config(function ($stateProvider) {

    // Register our *Review Entry* state.
    $stateProvider.state('review-entry', {
        url: ':name/:url/review-entry',
        controller: function($scope, CreateReview, $state, $stateParams) {
            $scope.productname = $stateParams.name;
            $scope.producturl = $stateParams.url;
            console.log("in conroller", $scope);

            $scope.newReview = function () {
            	//console.log("inside newReview", $scope.productname);
            	var info = $scope.productname;
            	CreateReview.submitReview(info).then(function(user, err){
	    					if (err) $scope.success = false;
	    						else{
                    $state.go('home');
              	}
	    				})
	   				};
         },
        templateUrl: 'js/review-entry/review-entry.html'
    })

});

// Inject the auth service into the session
// getloggedinuser
// isauthenticated



app

    .constant('ratingConfig', {
        max: 5,
    })

    .directive('rating', ['ratingConfig', function(ratingConfig) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                value: '=',
            },
            template: '<span ng-mouseleave="reset()"><i ng-repeat="number in range" ng-mouseenter="enter(number)" ng-click="assign(number)" ng-class="{\'glyphicon glyphicon-star icon-gold\': number <= val, \'glyphicon glyphicon-star icon-gray\': number > val}"></i></span>',
            link: function(scope, element, attrs) {
                var maxRange = angular.isDefined(attrs.max) ? scope.$eval(attrs.max) : ratingConfig.max;

                scope.range = [];
                for(var i = 1; i <= maxRange; i++ ) {
                    scope.range.push(i);
                }

                scope.$watch('value', function(value) {
                    scope.val = value;
                });

                scope.assign = function(value) {
                    scope.value = value;
                }

                scope.enter = function(value) {
                    scope.val = value;
                }

                scope.reset = function() {
                    scope.val = angular.copy(scope.value);
                }
                scope.reset();

            }
        };
    }]);

app.controller('StarCtrl', function($scope) {

    $scope.rate1 = 0;

    $scope.rate2 = 6;

});
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('stripe', {
        url: '/stripe',
        controller: 'StripeController',
        templateUrl: 'js/testStripe/stripe.html'
    });

});

app.controller('StripeController', function ($scope) {

});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl',
        resolve: {
            tutorialInfo: function (TutorialFactory) {
                return TutorialFactory.getTutorialVideos();
            }
        }
    });

});

app.factory('TutorialFactory', function ($http) {

    return {
        getTutorialVideos: function () {
            return $http.get('/api/tutorial/videos').then(function (response) {
                return response.data;
            });
        }
    };

});

app.controller('TutorialCtrl', function ($scope, tutorialInfo) {

    $scope.sections = tutorialInfo.sections;
    $scope.videos = _.groupBy(tutorialInfo.videos, 'section');

    $scope.currentSection = { section: null };

    $scope.colors = [
        'rgba(34, 107, 255, 0.10)',
        'rgba(238, 255, 68, 0.11)',
        'rgba(234, 51, 255, 0.11)',
        'rgba(255, 193, 73, 0.11)',
        'rgba(22, 255, 1, 0.11)'
    ];

    $scope.getVideosBySection = function (section, videos) {
        return videos.filter(function (video) {
            return video.section === section;
        });
    };

});
'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('admin.userModify', {
        url: '/userModify',
        controller: 'userModifyController',
        templateUrl: 'js/userModify/userModify.html'
    });
})

app.controller('userModifyController', function ($scope, userModifyFactory, $state, $stateParams, AuthService) {

    
    $scope.submit = {
        password: '',
        email: '',
        makeAdmin: false
    }
    $scope.success;


    $scope.changePW = function() {
        userModifyFactory.postPW($scope.submit).then(function(user, err){
            $scope.submit = {}
            if(err) {
                $scope.success= false;
                console.log('changing state')
            }
            else{
                console.log($scope.submit);
                $scope.success = true;
            }
        });
    }  
});
'use strict';
app.factory('CreateItemFactory', function($http){
	
	return {
		postItem: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/admin/itemCreate', data).then(function(response){
				return response.data;
			})
		}
	}

})
'use strict';
app.factory('CreateReview', function($http){
	
	return {
		submitReview: function(data){
			console.log('into review factory', data);
			return $http.post('/api/reviews/', data).then(function(response){
				return response.data;
			})
		}
	}
})
'use strict';
app.factory('CreateUserFactory', function($http){
	
	return {
		postUser: function(data){
			console.log('into user factory', data);
			return $http.post('api/join', data).then(function(response){
				return response.data;
			})
		}
	}
})

// '/api/login'
'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			console.log(id);
			return $http.get('/api/item/'+id).then(function(response){
				return response.data;
			})
		},

		// getCategoryItems: function () {
		// 	console.log("GetItemFactory: getCategoryItems", category);
		// 	return $http.get('/api/item/'+ category).then(function(response){
		// 		return response.data;
		// 	});
		// },

	}
})
'use strict';
app.factory('GetItemsFactory', function($http){

    return {
        getItems: function(){
            return $http.get('/api/itemlist').then(function(response){
                return response.data;
            })
        }

    }
})
'use strict';
app.factory('GetUserFactory', function($http){
	
	return {
		getUser: function(user){
			console.log('inside factor with: ', email);
			//var options = {email: email};
			return $http.get('/api/login/' + user.email).then(function(response){
				return response.data;
			})
		},
		authUser: function(data){
			return $http.post('/login', data).then(function(response){
				console.log("factory done")
				return response.data;
			})
		}
	}
})

// '/api/login/' + email
'use strict';
app.factory('OrderFactory', function($http){
	
	return {
		createOrder: function(data){// data should be in form {userId: user._id, items: [item: item._id, qty: qty]}
			console.log('sending a request for a new order from factory');
			return $http.post('/api/order', data).then(function(response){
			//console.log('response from createOrder factory request', response);
				return response.data;
			})
		},
		updateOrder: function(data){ //expects orderId, itemId, and quantity (case sensative)
			return $http.post('/api/order/lineitem', data).then(function(response){
				return response.data;
			})
		},
		getOrders: function(userId){
			return $http.get('/api/order/'+userId).then(function(response){
				//console.log('response from getOrders factory request', response);
				return response.data;
			});
		}

}});
'use strict';
app.factory('RandomGreetings', function () {

    var getRandomFromArray = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = [
        'Hello, world!',
        'At long last, I live!',
        'Hello, simple human.',
        'What a beautiful day!',
        'I\'m like any other project, except that I am yours. :)',
        'This empty string is for Lindsay Levine.'
    ];

    return {
        greetings: greetings,
        getRandomGreeting: function () {
            return getRandomFromArray(greetings);
        }
    };

});
'use strict';

app.factory('adminNavbarFactory', function (navbarMenu) {
		var navbarMenuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Create Item', state: 'itemCreate' },
        { label: 'Modify User', state: 'userModify' }
    ];

	return {

	}
})
'use strict'
app.factory('adminPostUser', function ($http) {

	return {
		postInfo: function (inputs) {
			return $http.post('admin', inputs)
		}
	}
}) 
'use strict';
app.factory('orderModifyFactory', function ($http){
	
	return {
		filterOrders: function (status, allOrders) {
			if (status === 'all orders') {
				return allOrders
			}
			var filteredArray = [];
			for (var a=0, len=allOrders.length; a<len; a++) {
				if (allOrders[a].status === status) {
					filteredArray.push(allOrders[a])
				}
			}
			return filteredArray
		},
		modifyOrder: function(data){
			return $http.put('/api/admin/order', data).then(function(response){
				return response.data;
			})
		},
		getAllOrders: function(){
			console.log('into the factory');
			// return $http.post('/api/item', data);

			return $http.get('/api/admin/order').then(function(response){
				return response.data;
			})
		},
		changeOrderStatus: function ( ) {
			return $http.put('/api/admin/order').then(function(response){
				return response.data;
			})	
		}
		// getUserOrdersByEmail: function () {
		// 	return $http.post('/api/admin/order').then(function(response){
		// 		return response.data;
		// 	})
		// }
	}

})
'use strict';
app.factory('userModifyFactory', function($http){
	
	return {
		postPW: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/admin/userModify', data).then(function(response){
				return response.data;
			})
		}
	}

})
'use strict';

app.directive('tutorialSection', function () {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            videos: '=',
            background: '@'
        },
        templateUrl: 'js/tutorial/tutorial-section/tutorial-section.html',
        link: function (scope, element) {
            element.css({ background: scope.background });
        }
    };
});
'use strict';
app.directive('tutorialSectionMenu', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'js/tutorial/tutorial-section-menu/tutorial-section-menu.html',
        scope: {
            sections: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            scope.currentSection = scope.sections[0];
            ngModelCtrl.$setViewValue(scope.currentSection);

            scope.setSection = function (section) {
                scope.currentSection = section;
                ngModelCtrl.$setViewValue(section);
            };

        }
    };
});
'use strict';
app.directive('tutorialVideo', function ($sce) {

    var formYoutubeURL = function (id) {
        return 'https://www.youtube.com/embed/' + id;
    };

    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/tutorial-video/tutorial-video.html',
        scope: {
            video: '='
        },
        link: function (scope) {
            scope.trustedYoutubeURL = $sce.trustAsResourceUrl(formYoutubeURL(scope.video.youtubeID));
        }
    };

});
'use strict';
app.directive('navDropdown', function () {
    return {
        restrict: 'E',
        //scope: {
        //    items: '='
        //},
        templateUrl: 'js/common/directives/navbar/nav-dropdown.html'
        //controller: 'dropdownController'
    };
});

app.directive('navDropdownWomen', function () {
    return {
        restrict: 'E',
        //scope: {
        //    items: '='
        //},
        templateUrl: 'js/common/directives/navbar/nav-dropdown-women.html'
        //controller: 'dropdownController'
    };
});

app.controller('dropdownController', function ($scope, GetItemsFactory, $state, $stateParams, $window) {

    GetItemsFactory.getItems().then(function(items, err){
        if(err) throw err;
        else{
            var allItems = items;
            //console.log(allItems);
            var dropDownSorter = function (gender) {
                var sortedArray = [];
                var selectedNames = [];
                for (var obj in allItems) {
                    if (selectedNames.indexOf(allItems[obj].name) === -1 && allItems[obj].gender == gender) {
                        ////console.log(allItems[obj].name);
                        selectedNames.push(allItems[obj].name);
                        sortedArray.push(allItems[obj]);
                    }
                }
                return sortedArray;
            }
            $scope.menProducts1 = dropDownSorter('men').slice(0,3);
            $scope.menProducts2 = dropDownSorter('men').slice(3,6);

            $scope.womenProducts1 = dropDownSorter('women').slice(0,3);
            $scope.womenProducts2 = dropDownSorter('women').slice(3,6);
            //console.log($scope.menProducts1, $scope.menProducts2);
            //console.log($scope.womenProducts);

            // Dropdown controls
            $scope.menVisible = false;
            $scope.womenVisible = false;

            $scope.toggleMenVisible = function(){
                $scope.menVisible = !$scope.menVisible;
                $scope.womenVisible = false;
            }

            $scope.toggleWomenVisible = function(){
               $scope.womenVisible = !$scope.womenVisible;
                $scope.menVisible = false;
            }



        }
    });

});
'use strict';
app.directive('navbar', function ($document) {
    return {
        restrict: 'E',
        //scope: {
        //  items: '='
        //},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        //link: function(scope, element, attr){
        //    console.log(scope);
        //    console.log(element);
        //    //scope.menVisible = false;
        //    //
        //    //scope.toggleSelect = function(){
        //    //    scope.menVisible = !scope.menVisible;
        //    //}
        //    //
        //    $document.bind('click', function(event){
        //
        //        var isClickedElementChildOfPopup = element
        //                .find(event.target)
        //                .length > 0;
        //        console.log('is clicked', scope.menVisible)
        //        if (isClickedElementChildOfPopup)
        //            return;
        //
        //        scope.menVisible = false;
        //        scope.$apply();
        //    });
        //}

    };
});
'use strict';
app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function (scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };

});
'use strict';
app.directive('specstackularLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/specstackular-logo/specstackular-logo.html'
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWRtaW4vYWRtaW4uanMiLCJhZG1pbi9pbmRleC5qcyIsImFsbEl0ZW1zL2FsbEl0ZW1zLmpzIiwiY2hlY2tvdXQvY2hlY2tvdXQuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImhvbWUvcHJvZHVjdHJldmlld3Njb250cm9sbGVyLmpzIiwiaG9tZS9yZXZpZXdzdGFyLmpzIiwiaXRlbS9pdGVtLmpzIiwiaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmpzIiwiam9pbm5vdy9qb2lubm93LmpzIiwibG9naW4vbG9naW4uanMiLCJvcmRlci9vcmRlci5qcyIsIm9yZGVyTW9kaWZ5L29yZGVyTW9kaWZ5LmpzIiwicHJvZHVjdENhdENyZWF0ZS9wcm9kdWN0Q2F0Q3JlYXRlLmpzIiwicmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5qcyIsInJldmlldy1lbnRyeS9zdGFycy5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJ1c2VyTW9kaWZ5L3VzZXJNb2RpZnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVSZXZpZXcuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZVVzZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRJdGVtRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbXNGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvT3JkZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZmFjdG9yaWVzL1NvY2tldC5qcyIsImNvbW1vbi9mYWN0b3JpZXMvYWRtaW5OYXZiYXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9hZG1pblBvc3RVc2VyLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9vcmRlck1vZGlmeUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL3VzZXJNb2RpZnlGYWN0b3J5LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3NwZWNzdGFja3VsYXItbG9nby9zcGVjc3RhY2t1bGFyLWxvZ28uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9HQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbi8vIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnRnVsbHN0YWNrR2VuZXJhdGVkQXBwJywgWyd1aS5yb3V0ZXInLCAnZnNhUHJlQnVpbHQnXSk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3BlY1N0YWNrdWxhcicsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0JywgJ25nQ29va2llcyddKTtcbmFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnTWVuJywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgeyBsYWJlbDogJ1dvbWVuJywgc3RhdGU6ICd3b21lbicgfSxcbiAgICAgICAgeyBsYWJlbDogJ0pvaW4gdXMnLCBzdGF0ZTogJ2pvaW4nIH0sXG4gICAgICAgIHsgbGFiZWw6ICdMb2cgSW4nLCBzdGF0ZTogJ2xvZ2luJ30sXG4gICAgICAgIHsgbGFiZWw6ICdQcm9kdWN0IGxpc3QnLCBzdGF0ZTogJ3Byb2R1Y3RzJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTXkgT3JkZXJzJywgc3RhdGU6ICdvcmRlcnMnfVxuICAgIF07XG4gICAgJHNjb3BlLmFkbWluSXRlbXM9IFtcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBwcm9kdWN0Jywgc3RhdGU6ICdhZG1pbi5pdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ2FkbWluLnVzZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBPcmRlcicsIHN0YXRlOiAnYWRtaW4ub3JkZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBQcm9kdWN0IENhdCBQZycsIHN0YXRlOiAnYWRtaW4ucHJvZHVjdENhdENyZWF0ZSd9XG4gICAgXVxuXG5cblxuXG5cbn0pO1xuXG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIFxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ0FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBJdGVtJywgc3RhdGU6ICdpdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ3VzZXJNb2RpZnknIH1cbiAgICBdO1xuXG59KTtcblxuYXBwLmRpcmVjdGl2ZSgnYWRtaW5OYXZiYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICBpdGVtczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJ1xuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFwcC5ydW4oZnVuY3Rpb24gKCRjb29raWVzLCAkY29va2llU3RvcmUpIHtcblxuXHR2YXIgaW5pdCA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdGlmKCFpbml0KXtcblx0XHQkY29va2llU3RvcmUucHV0KCdPcmRlcicsIFtdKTtcblx0XHRjb25zb2xlLmxvZygnc3RhcnRpbmcgY29va2llOiAnLCAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpKTtcblx0fVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpwcm9kdWN0cyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RzJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxuICAgICAgICBjb250cm9sbGVyOiAnYWxsSXRlbXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hbGxpdGVtcy9hbGxpdGVtcy5odG1sJ1xuICAgIH0pXG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICptZW4qIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtZW4nLCB7XG4gICAgICAgIHVybDogJy9wcm9kdWN0cy9tZW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnYWxsSXRlbXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hbGxpdGVtcy9hbGxpdGVtcy5odG1sJ1xuICAgIH0pXG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICp3b21lbiogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dvbWVuJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMvd29tZW4nLFxuICAgICAgICAvLyBjb250cm9sbGVyOiAnY2F0ZWdvcnlDb250cm9sbGVyJyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJiZWZvcmVcIiwgJHNjb3BlLml0ZW1zLCAkc3RhdGUuY3VycmVudCk7XG5cdFx0XHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zKXtcdFxuXHRcdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHRcdFx0Y29uc29sZS5sb2coaXRlbXMpO1xuXHRcdFx0fSk7XG5cdFx0fSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hbGxpdGVtcy9hbGxpdGVtcy5odG1sJyxcbiAgICB9KVxufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ2FsbEl0ZW1zQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhTZXJ2aWNlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llU3RvcmUsIE9yZGVyRmFjdG9yeSkge1xuXG5cdEdldEl0ZW1zRmFjdG9yeS5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG5cdFx0aWYoZXJyKSB0aHJvdyBlcnI7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtcyA9IGl0ZW1zO1xuXHRcdH1cblx0fSk7XG5cblxuXHQkc2NvcGUuYWRkVG9PcmRlciA9IGZ1bmN0aW9uKHNwZWNpZmljSXRlbSl7XG5cdFx0Y29uc29sZS5sb2coJ2dvdCBpbnRvIHRoZSBhZGRUb09yZGVyIGZ1bmN0aW9uJyk7IC8vcGFydCBvbmUgYWx3YXlzIGFkZCBpdCB0byB0aGUgY29va2llXG5cdFx0dmFyIG9yZGVyID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHR2YXIgcmVzb2x2ZWQgPSBmYWxzZTtcblx0XHR2YXIgbGluZSA9IHtpdGVtSWQ6IHNwZWNpZmljSXRlbS5faWQsIHF1YW50aXR5OiAxfTtcblx0XHQgY29uc29sZS5sb2coJ29yZGVyJywgb3JkZXIpO1xuXHRcdFx0aWYob3JkZXIpeyAvL2lmIHVzZXIgaGFzIGFuIG9yZGVyIG9uIGEgY29va2llXG4gXG5cdFx0XHRcdG9yZGVyLmZvckVhY2goZnVuY3Rpb24oaXRlbUxpbmUpe1xuXHRcdFx0XHRcdGlmKGl0ZW1MaW5lLml0ZW1JZCA9PT0gc3BlY2lmaWNJdGVtLl9pZCl7XG5cdFx0XHRcdFx0XHRpdGVtTGluZS5xdWFudGl0eSsrO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYoIXJlc29sdmVkKXtcblx0XHRcdFx0XHRvcmRlci5wdXNoKGxpbmUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRvcmRlci5wdXNoKGxpbmUpO1xuXHRcdFx0fVxuXG5cblx0XHQkY29va2llU3RvcmUucHV0KCdPcmRlcicsIG9yZGVyKTtcblxuXHRcdC8vIHZhciB1c2VyID0gQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCk7XG5cdFx0Ly8gaWYodXNlcil7XG5cdFx0Ly8gXHQvL09yZGVyRmFjdG9yeS5nZXRPcmRlcnModXNlci5faWQpLy9cblx0XHQvLyB9XG5cdH1cbn0pO1xuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ2NhdGVnb3J5Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQkc2NvcGUuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpe1xuXHRcdGNvbnNvbGUubG9nKFwibWVuIGNvbnRyb2xsZXJcIiwgY2F0ZWdvcnkpO1xuXHRcdFx0R2V0SXRlbUZhY3RvcnkuZ2V0Q2F0ZWdvcnlJdGVtcygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG5cdFx0XHRcdFx0aWYoZXJyKSB0aHJvdyBlcnI7XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdH07XG59KTtcblxuXG4iLCIiLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG5cbiAgICAgICAgdmFyIHNvY2tldDtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG5cbiAgICB9KTtcblxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIHZhciBvblN1Y2Nlc3NmdWxMb2dpbiA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7IHVzZXI6IFNlc3Npb24udXNlciB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgdGhpcy5kZXN0cm95KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHRoaXMuZGVzdHJveSk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3Byb2R1Y3RyZXZpZXdzY29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgJHNjb3BlLnJhdGUxID0gMDtcblxuICAgICRzY29wZS5yYXRlMiA9IDY7XG5cbiAgICAkc2NvcGUucmV2aWV3c2xpc3QgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdGluZzogNSxcbiAgICAgICAgICAgIHRleHQ6IFwiVGhlc2UgYXJlIHF1aXRlIHNpbXBseSB0aGUgYmVzdCBnbGFzc2VzLCBuYXkgdGhlIGJlc3QgQU5ZVEhJTkcgSSd2ZSBldmVyIG93bmVkISBcIiArXG4gICAgICAgICAgICBcIldoZW4gSSBwdXQgdGhlbSBvbiwgYW4gZW5lcmd5IGJlYW0gc2hvb3RzIG91dCBvZiBteSBleWViYWxscyB0aGF0IG1ha2VzIGV2ZXJ5dGhpbmcgSSBsb29rIGF0IFwiICtcbiAgICAgICAgICAgIFwiYnVyc3QgaW50byBmbGFtZXMhISBNeSBnaXJsZnJpZW5kIGRvZXNuJ3QgYXBwcmVjaWF0ZSBpdCwgdGhvdWdoLlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdGluZzogMSxcbiAgICAgICAgICAgIHRleHQ6IFwiVGhlc2UgZ2xhc3NlcyBhcmUgdGhlIHdvcnN0ISBXaG8gbWFkZSB0aGVzZT8gV2hlbiBJIG9wZW5lZCB0aGUgcGFja2FnZSB0aGV5IHNwcnVuZyBvdXQgYW5kIHN1Y2tlZCBcIiArXG4gICAgICAgICAgICBcIm9udG8gbXkgZmFjZSBsaWtlIHRoZSBtb25zdGVyIGluIEFMSUVOISBJIGhhZCB0byBiZWF0IG15c2VsZiBpbiB0aGUgaGVhZCB3aXRoIGEgc2hvdmVsIHRvIGdldCB0aGVtIG9mZiEgXCIgK1xuICAgICAgICAgICAgXCJXaG8gQVJFIHlvdSBwZW9wbGU/IFdoYXQgaXMgd3Jvbmcgd2l0aCB5b3U/IEhhdmUgeW91IG5vIGRpZ25pdHk/IERvbid0IHlvdSB1bmRlcnN0YW5kIHdoYXQgZXllZ2xhc3NlcyBhcmUgXCIgK1xuICAgICAgICAgICAgXCJGT1I/XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcmF0aW5nOiA0LFxuICAgICAgICAgICAgdGV4dDogXCJUaGUgZ2xhc3NlcyBhcmUganVzdCBPSyDigJQgdG8gc3BpY2UgdGhpbmdzIHVwIEkgY2hvcHBlZCB1cCBzb21lIHNjYWxsaW9ucyBhbmQgYWRkZWQgc29tZSBoZWF2eSBjcmVhbSwgYSBwaW5jaCBvZiB0YXJ0YXIsIFwiICtcbiAgICAgICAgICAgIFwic29tZSBhbmNob3Z5IHBhc3RlLCBiYXNpbCBhbmQgYSBoYWxmIHBpbnQgb2YgbWFwbGUgc3lydXAuIFRoZSBnbGFzcyBpbiB0aGUgZ2xhc3NlcyBzdGlsbCBjYW1lIG91dCBjcnVuY2h5IHRob3VnaC4gXCIgK1xuICAgICAgICAgICAgXCJJJ20gdGhpbmtpbmcgb2YgcnVubmluZyB0aGVtIHRocm91Z2ggYSBtaXhtdWxjaGVyIG5leHQgdGltZSBiZWZvcmUgdGhyb3dpbmcgZXZlcnl0aGluZyBpbiB0aGUgb3Zlbi5cIlxuICAgICAgICB9XG4gICAgXVxufSkiLCJhcHBcblxuICAgIC5jb25zdGFudCgncmF0aW5nQ29uZmlnJywge1xuICAgICAgICBtYXg6IDUsXG4gICAgfSlcblxuICAgIC5kaXJlY3RpdmUoJ3Jldmlld3N0YXInLCBbJ3JhdGluZ0NvbmZpZycsIGZ1bmN0aW9uKHJhdGluZ0NvbmZpZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJwcm9kdWN0cmV2aWV3c2NvbnRyb2xsZXJcIixcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBpZD1cInNob3dtZVwiIG5nLW1vdXNlbGVhdmU9XCJyZXNldCgpXCI+PGkgaWQ9XCJzaG93bWVcIiBuZy1yZXBlYXQ9XCJudW1iZXIgaW4gcmFuZ2VcIiAnICtcbiAgICAgICAgICAgICAgICAnbmctbW91c2VlbnRlcj1cImVudGVyKG51bWJlcilcIiBuZy1jbGljaz1cImFzc2lnbihudW1iZXIpXCIgJyArXG4gICAgICAgICAgICAgICAgJ25nLWNsYXNzPVwie1xcJ2dseXBoaWNvbiBnbHlwaGljb24tc3RhciBpY29uLWdvbGRcXCc6IG51bWJlciA8PSB2YWwsICcgK1xuICAgICAgICAgICAgICAgICdcXCdnbHlwaGljb24gZ2x5cGhpY29uLXN0YXIgaWNvbi1ncmF5XFwnOiBudW1iZXIgPiB2YWx9XCI+PC9pPjwvZGl2PicsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heFJhbmdlID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMubWF4KSA/IHNjb3BlLiRldmFsKGF0dHJzLm1heCkgOiByYXRpbmdDb25maWcubWF4O1xuICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXhSYW5nZTsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yYW5nZS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBzY29wZS52YWwgPSBzY29wZS52YWx1ZTtcblxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG5cbmFwcC5jb250cm9sbGVyKCdwcm9kdWN0c3RhcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLnJhdGUxID0gMDtcblxuICAgICRzY29wZS5yYXRlMiA9IDY7XG5cbiAgICAkc2NvcGUudmFsID0gJHNjb3BlLnJhdGluZztcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKml0ZW0qIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpdGVtJywge1xuICAgICAgICB1cmw6ICcvaXRlbS86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbS9pdGVtLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSwgQXV0aFNlcnZpY2UsIE9yZGVyRmFjdG9yeSApIHtcblxuXHQvL2dldCBpbnB1dCBmcm9tIHVzZXIgYWJvdXQgaXRlbSAoaWQgZnJvbSB1cmwgKVxuXHQvL2NoZWNrIGlkIHZzIGRhdGFiYXNlXG5cdC8vaWYgbm90IGZvdW5kLCByZWRpcmVjdCB0byBzZWFyY2ggcGFnZVxuXHQvL2lmIGZvdW5kIHNlbmQgdGVtcGFsYXRlVXJsXG5cblx0R2V0SXRlbUZhY3RvcnkuZ2V0SXRlbSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdGlmKGVycikgJHN0YXRlLmdvKCdob21lJyk7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVswXTtcblx0XHRcdH1cblx0fSk7XG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpLnRoZW4oZnVuY3Rpb24oYW5zd2VyKXtcblx0XHRcdHZhciBvcmRlciA9ICRjb29raWVzLmdldCgnT3JkZXInKTtcblx0XHRcdHZhciBsaW5lID0ge2l0ZW06ICRzY29wZS5pdGVtLCBxdWFudGl0eTogMX07XG5cdFx0XHRpZighb3JkZXIpe1xuXHRcdFx0XHQkY29va2llcy5wdXQoJ09yZGVyJywgbGluZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRvcmRlci5wdXNoKGxpbmUpO1xuXHRcdFx0XHQkY29va2llcy5wdXQoJ09yZGVyJywgb3JkZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihhbnN3ZXIpe1xuXHRcdFx0XHRPcmRlckZhY3RvcnkuYWRkSXRlbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqaXRlbUNyZWF0ZSogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLml0ZW1DcmVhdGUnLCB7XG4gICAgICAgIHVybDogJy9pdGVtQ3JlYXRlJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2l0ZW1DcmVhdGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9pdGVtQ3JlYXRlL2l0ZW1DcmVhdGUuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgXHRnZXRJdGVtczogIGZ1bmN0aW9uKCRodHRwKXtcbiAgICAgICAgXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbWxpc3QnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIFx0XHRcdH0pXG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0fVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2l0ZW1DcmVhdGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ3JlYXRlSXRlbUZhY3RvcnksIGdldEl0ZW1zLCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuXG5cdCRzY29wZS5pdGVtO1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUubWVudUl0ZW1zID0gW1xuXHRcdHsgbGFiZWw6ICdhbGwgaXRlbXMnfSxcbiAgICAgICAgeyBsYWJlbDogJ21lbnMnfSxcbiAgICAgICAgeyBsYWJlbDogJ3dvbWVucyd9LFxuICAgICAgICB7IGxhYmVsOiAna2lkcyd9LFxuICAgICAgICB7IGxhYmVsOiAncGV0cyd9XG4gICAgXTtcblxuXHQkc2NvcGUuYWxsSXRlbXMgPSBnZXRJdGVtc1xuXG5cdCRzY29wZS5pdGVtcyA9ICRzY29wZS5hbGxJdGVtc1xuXG5cdCRzY29wZS5maWx0ZXJJdGVtcyA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdGlmIChjYXRlZ29yeSA9ICdhbGwgaXRlbXMnKSB7XG5cdFx0XHRyZXR1cm4gJHNjb3BlLml0ZW1zID0gJHNjb3BlLmFsbEl0ZW1zXG5cdFx0fVxuXHR9XG5cblx0Y29uc29sZS5sb2coJHNjb3BlLml0ZW1zWzBdLmF2YWlsYWJsZSlcblxuXHQkc2NvcGUuc3VibWl0SXRlbSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vJHNjb3BlLml0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS5pdGVtLmNhdGVnb3JpZXMuc3BsaXQoJyAnKTtcblx0XHQvL2NvbnNvbGUubG9nKCdwcm9jZXNzIHN0YXJ0ZWQnKTtcblx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5pdGVtKTtcblx0XHRDcmVhdGVJdGVtRmFjdG9yeS5wb3N0SXRlbSgkc2NvcGUuaXRlbSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdFx0aWYoZXJyKSAkc2NvcGUuc3VjY2Vzcz0gZmFsc2U7XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRjb25zb2xlLmxvZyhpdGVtKTtcblx0XHRcdFx0JHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqSm9pbiBOb3cqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdqb2luJywge1xuICAgICAgICB1cmw6ICcvam9pbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdqb2luQ29udHJvbGxlcicsXG5cbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9qb2lubm93L2pvaW5ub3cuaHRtbCcgXG5cbiAgICB9KTtcblxufSk7XG5cblxuXG5hcHAuY29udHJvbGxlcignam9pbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csIENyZWF0ZVVzZXJGYWN0b3J5LCBBdXRoU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICBcdGNvbnNvbGUubG9nKFwidXNlciBzdWJtaXQgcHJvY2VzcyBzdGFydGVkXCIpO1xuICAgIFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXIpO1xuXHQgICAgQ3JlYXRlVXNlckZhY3RvcnkucG9zdFVzZXIoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3M9ZmFsc2U7XG5cdCAgICBcdGVsc2V7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9naW4odXNlcikudGhlbihmdW5jdGlvbihjb25jbHVzaW9uKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblx0ICAgIFx0fVxuXHQgICAgfSk7XG5cdCAgfVxuXG4gICAgICBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkIChlbWFpbCl7XG4gICAgICAgIHJlZ2V4ID0gL14oW1xcdy1cXC5dK0AoPyFnbWFpbC5jb20pKD8heWFob28uY29tKSg/IWhvdG1haWwuY29tKShbXFx3LV0rXFwuKStbXFx3LV17Miw0fSk/JC87XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KGVtYWlsKTtcbiAgICAgIH1cblxufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2xvZ2luL2xvZ2luLmh0bWwnIFxuICAgIH0pO1xuXG59KTtcblxuXG5hcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHdpbmRvdywgQXV0aFNlcnZpY2UsICRzdGF0ZSwgU2Vzc2lvbiwgJHJvb3RTY29wZSkge1xuICAgICRzY29wZS5sb2dpbm9hdXRoID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9ICdhdXRoLycgKyBwcm92aWRlcjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9jYXRpb247XG4gICAgfVxuICAgICRzY29wZS5zdWNjZXNzO1xuICAgICRzY29wZS5zdWJtaXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbmZvID0gJHNjb3BlLnVzZXI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNlciBsb2dpbiBwcm9jZXNzIHN0YXJ0ZWQgd2l0aDogXCIsIGluZm8pO1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihpbmZvKS50aGVuKGZ1bmN0aW9uKGluZm8pe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cm9sbGVyXCIsIGluZm8pO1xuICAgICAgICAgICAgICAgIGlmIChpbmZvLmFkbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRtaW4nKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgLy8gdGhpcyBpcyBqdXN0IHRlc3Rpbmcgc2Vzc2lvbnMgc3RhcnRlZFxuICAgICRzY29wZS5pc0xvZ2dlZEluID0gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgLy8gZW5kIHRlc3RcblxuXG5cbiAgICAgICAgLy8gR2V0VXNlckZhY3RvcnkuYXV0aFVzZXIoaW5mbykudGhlbihmdW5jdGlvbih1c2VyLCBlcnIpe1xuICAgICAgICAvLyAgICAgaWYoZXJyKSAkc2NvcGUuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgJHJvb3RTY29wZS5zdWNjZXNzID0gZmFsc2U7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jdXJyZW50VXNlcilcbiAgICAgICAgLy8gICAgICAgICBpZiAodXNlclswXS5hZG1pbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluJylcbiAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSkgICAgICBcblxuICAgIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKm9yZGVycyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ29yZGVycycsIHtcbiAgICAgICAgdXJsOiAnL29yZGVyLzpuYW1lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ29yZGVyQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvb3JkZXIvb3JkZXIuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdvcmRlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksIE9yZGVyRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSwgQXV0aFNlcnZpY2UpIHtcblxuXHQvL3Byb3ZpZGVzIGdlbmVyYWwgZnVuY3Rpb25hbGl0eSB3aXRoIGFuIG9yZGVyXG5cdC8vdmlld3MgY3VycmVudCB1c2VyIG9yZGVyXG5cdFx0Ly9vcmRlciBpcyBzaG93biBieSBsaW5lIGl0ZW1cblx0XHQvL2hhcyBhYmlsaXR5IHRvIGVkaXQgb3JkZXIsIG9yIHByb2NlZWQgdG8gY2hlY2tvdXRcblx0JHNjb3BlLmFjdGl2ZW9yZGVycz1bXTsgLy9leHBlY3RzIGl0ZW0ge2l0ZW1JZDogaXRlbUlkLCBwcmljZTogbnVtLCBpbWdVcmw6U3RyaW5nLCB9LCBxdHk6IG51bVxuXHQkc2NvcGUucGFzdG9yZGVycz1bXTtcblx0JHNjb3BlLnVzZXI7XG5cdCRzY29wZS5zdW0gPSAwO1xuXHQkc2NvcGUudG90YWxRdHkgPSAwOyBcblx0JHNjb3BlLnRlbXBWYWw7XG5cdCRzY29wZS5vcmRlcklkO1xuXHQkc2NvcGUudXNlcklkO1xuXHQkc2NvcGUuYXV0aDtcblxuXHRmdW5jdGlvbiBmaXJzdFVwZGF0ZSAoKXtcblx0Ly9jaGVjayBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQsIHBvcHVsYXRlIG9yZGVyIGZyb20gZGIsIHNldCBvcmRlciB0byBjb29raWVcblx0XHRpZiggQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgKXtcblx0XHRcdEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG5cdFx0XHQkc2NvcGUudXNlcklkID0gdXNlci5faWQ7XG5cdFx0XHQkc2NvcGUudXNlciA9IHVzZXIuZmlyc3RfbmFtZTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LmdldE9yZGVycygkc2NvcGUudXNlcklkKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdpdGVtcycsIGl0ZW1zKTtcblx0XHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XG5cdFx0XHRcdFx0ZWxzZSBpZighaXRlbXMpIHsgLy9ubyBpdGVtcyBpbiBkQiwgZ2V0IGNvb2tpZXMsIHNldCBvcmRlclxuXHRcdFx0XHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHRcdFx0XHRPcmRlckZhY3RvcnkuY3JlYXRlT3JkZXIoe3VzZXJJZDogJHNjb3BlLnVzZXJJZCwgaXRlbXM6ICRzY29wZS5hY3RpdmVvcmRlcnN9LCBmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSByZXNwb25zZS5saW5laXRlbXM7XG5cdFx0XHRcdFx0XHRcdHN1bSgpO1xuXHRcdFx0XHRcdFx0XHR0b3RhbFF0eSgpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgeyAvL2l0ZW1zIGluIGRiLCBtYWtlIHN1cmUgY29va2llcyBhcmUgYWRkZWQgdG8gZGJcblx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSBpdGVtcy5saW5laXRlbXMubGluZUl0ZW07XG5cdFx0XHRcdFx0XHQkc2NvcGUub3JkZXJJZCA9IGl0ZW1zLm9yZGVySWQ7XG5cdFx0XHRcdFx0XHRzdW0oKTtcblx0XHRcdFx0XHRcdHRvdGFsUXR5KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZhciBpZEFuZFF0eSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHR2YXIgcHJvZHVjdExpc3Q9W107XG5cdFx0XHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpeyAvL2FwcHJvYWNoIHdpbGwgbm90IHNjYWxlIHdlbGwgYnV0IGlzIHF1aWNrZXIgbm93XG5cdFx0XHRcdGlmKGVycikgY29uc29sZS5sb2coZXJyKTtcblx0XHRcdFx0aWRBbmRRdHkuZm9yRWFjaChmdW5jdGlvbihpdGVtUGFpcil7XG5cdFx0XHRcdFx0Zm9yKHZhciBhPTAsIGxlbj1pdGVtcy5sZW5ndGg7IGE8NzsgYSsrKXtcblx0XHRcdFx0XHRcdGlmKGl0ZW1QYWlyLml0ZW1JZCA9PT0gaXRlbXNbYV0uX2lkKXtcblx0XHRcdFx0XHRcdFx0cHJvZHVjdExpc3QucHVzaCh7aXRlbTogaXRlbXNbYV0sIHF1YW50aXR5OiBpdGVtUGFpci5xdWFudGl0eSB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjb25zb2xlLmxvZygncHJvZExpc3QnLCBwcm9kdWN0TGlzdCk7XG5cdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSBwcm9kdWN0TGlzdDtcblx0XHRcdFx0JHNjb3BlLnVzZXIgPSAnVXNlcic7XG5cdFx0XHRcdCRzY29wZS5hdXRoID0gZmFsc2U7XG5cdFx0XHRcdHN1bSgpO1xuXHRcdFx0XHR0b3RhbFF0eSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH07XG5cblx0Zmlyc3RVcGRhdGUoKTtcblxuXHRmdW5jdGlvbiB0b3RhbFF0eSAoKXtcblx0XHR2YXIgdG90YWxRID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHR0b3RhbFE9IHRvdGFsUSArIGxpbmVJdGVtLnF1YW50aXR5O1xuXHRcdH0pXG5cdFx0JHNjb3BlLnRvdGFsUXR5ID0gdG90YWxRO1xuXHR9O1xuXG5cdCRzY29wZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0Ly9yZW1vdmUgaXRlbSBmcm9tIGRiLCByZW1vdmUgaXRlbSBmcm9tIGNvb2tpZSwgcmVtb3ZlIGl0ZW0gZnJvbSBzY29wZVxuXHRcdC8vaWYgYXV0aGVudGljYXRlZCwgcmVtb3ZlIGl0ZW0gZnJvbSBvcmRlclxuXHRcdHZhciBteU9yZGVyQ29va2llID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHRjb25zb2xlLmxvZyhteU9yZGVyQ29va2llLCBpdGVtKTtcblx0XHR2YXIgbG9jYXRpb24gPSBnZXRMb2NJbkNvb2tpZShteU9yZGVyQ29va2llLCBpdGVtLl9pZCk7XG5cblx0XHR2YXIgcmVtb3ZlZEl0ZW0gPSBteU9yZGVyQ29va2llLnNwbGljZShsb2NhdGlvbiwgMSk7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBteU9yZGVyQ29va2llKTtcblxuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuc3BsaWNlKGxvY2F0aW9uLDEpO1xuXHRcdHN1bSgpO1xuXHRcdHRvdGFsUXR5KCk7XG5cblx0XHRpZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoe29yZGVySWQ6ICRzY29wZS5vcmRlcklkLCBxdWFudGl0eTogMCwgaXRlbUlkOiBJdGVtLl9pZH0pLnRoZW4oZnVuY3Rpb24oZXJyLCBkYXRhKXtcblx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xuXG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRMb2NJbkNvb2tpZSAoY29va2llcywgaWQpe1xuXHRcdHZhciBsb2M7XG5cdFx0Y29va2llcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KXtcblx0XHRcdGlmKGVsZW1lbnQuaXRlbUlkID09PSBpZCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQuaXRlbUlkLCBcIiBpcyB0aGUgY29ycmVjdCBrZXlcIik7XG5cdFx0XHRcdGxvYyA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBsb2M7XG5cdH1cblxuXHQkc2NvcGUudXBkYXRlT3JkZXIgPSBmdW5jdGlvbihpdGVtLCB2YWwpe1xuXHRcdC8vdGFrZXMgaW4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIsIFxuXHRcdGlmKHZhbCA9PSAwKXtcblx0XHRcdCRzY29wZS5yZW1vdmVJdGVtKGl0ZW0uaXRlbSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRpZigkc2NvcGUudXNlcklkKXtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LnVwZGF0ZU9yZGVyKHtvcmRlcklkOiAkc2NvcGV9KTtcblx0XHRcdH1cblx0XHRcdHZhciBvcmRlckNvb2tpZSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHR2YXIgaW5kZXggPSBnZXRMb2NJbkNvb2tpZShvcmRlckNvb2tpZSwgaXRlbS5pdGVtLl9pZCk7XG5cdFx0XHRvcmRlckNvb2tpZVtpbmRleF0ucXVhbnRpdHkgPSBOdW1iZXIodmFsKTtcblx0XHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgb3JkZXJDb29raWUpO1xuXG5cdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzW2luZGV4XS5xdWFudGl0eSA9IE51bWJlcih2YWwpO1xuXHRcdFx0c3VtKCk7XG5cdFx0XHR0b3RhbFF0eSgpO1xuXHRcdH1cblx0XHRcblx0fTsgXG5cdCRzY29wZS5uZXdOdW1iZXIgPSBmdW5jdGlvbihpdGVtLCB2YWwpe1xuXHRcdGNvbnNvbGUubG9nKCdpdGVtJywgaXRlbSwgJ3ZhbCcsIHZhbCk7XG5cdH1cblx0Ly9nZXQgdXNlciBpbmZvcm1hdGlvbiBhbmQgc2VuZCBJZFxuXG5cdCRzY29wZS5zaG93Q29va2llID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZygkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpKTtcblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0fVxuXG5cdCRzY29wZS5kZWxldGVDb29raWUgPSBmdW5jdGlvbigpe1xuXHRcdCRjb29raWVTdG9yZS5yZW1vdmUoJ09yZGVyJyk7XG5cdFx0Y29uc29sZS5sb2coJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblx0JHNjb3BlLnNob3dPcmRlckZyb21EYiA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cdFx0aWYoJHNjb3BlLnVzZXJJZCl7XG5cdFx0XHRPcmRlckZhY3RvcnkuZ2V0T3JkZXJzKCRzY29wZS51c2VySWQpLnRoZW4oZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygncmVzdWx0cycsIHJlc3VsdCwnRXJyb3InLCBlcnIpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnTm8gdXNlciBleGlzdHMnKTtcblx0XHR9XG5cdFx0XG5cdH1cblxuXHRmdW5jdGlvbiBzdW0gKCl7XG5cdFx0dmFyIHRvdGFsID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHRjb25zb2xlLmxvZyhsaW5lSXRlbSk7XG5cdFx0XHR0b3RhbD0gdG90YWwgKyBsaW5lSXRlbS5pdGVtLnByaWNlICogbGluZUl0ZW0ucXVhbnRpdHk7XG5cdFx0fSlcblx0XHQkc2NvcGUuc3VtID0gdG90YWw7XG5cdH07XG5cdFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIFxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5vcmRlck1vZGlmeScsIHtcbiAgICAgICAgdXJsOiAnL29yZGVyTW9kaWZ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9vcmRlck1vZGlmeS9vcmRlck1vZGlmeS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ29yZGVyTW9kaWZ5Q29udHJvbGxlcicsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgXHRnZXRPcmRlcnM6ICBmdW5jdGlvbigkaHR0cCl7XG4gICAgICAgIFx0XHRcdC8vIHZhciBvcmRlck9iamVjdCA9IHt9XG4gICAgICAgIFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWRtaW4vb3JkZXInKVxuICAgICAgICBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgXHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhXG4gICAgICAgIFx0XHRcdFx0XHR9KVxuICAgICAgICBcdFx0XHR9XG4gICAgICAgIFx0XHR9XG4gICBcdH0pXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ29yZGVyTW9kaWZ5Q29udHJvbGxlcicsIFxuXHRmdW5jdGlvbiAoJHNjb3BlLCBvcmRlck1vZGlmeUZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlLCBnZXRPcmRlcnMpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUuYWxsT3JkZXJzID0gZ2V0T3JkZXJzXG5cblx0JHNjb3BlLm9yZGVycztcblxuXHQkc2NvcGUubWVudUl0ZW1zID0gW1xuXHRcdHsgbGFiZWw6ICdhbGwgb3JkZXJzJ30sXG4gICAgICAgIHsgbGFiZWw6ICdvcGVuJ30sXG4gICAgICAgIHsgbGFiZWw6ICdwbGFjZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ3NoaXBwZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ2NvbXBsZXRlJ31cbiAgICBdO1xuXG4gICAgJHNjb3BlLmNoYW5nZVN0YXR1c01lbnVJdGVtcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ29wZW4nfSxcbiAgICAgICAgeyBsYWJlbDogJ3BsYWNlZCd9LFxuICAgICAgICB7IGxhYmVsOiAnc2hpcHBlZCd9LFxuICAgICAgICB7IGxhYmVsOiAnY29tcGxldGUnfVxuICAgIF07XG5cblx0JHNjb3BlLmZpbHRlck9yZGVycyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuXHRcdCRzY29wZS5vcmRlcnMgPSBvcmRlck1vZGlmeUZhY3RvcnkuZmlsdGVyT3JkZXJzKHN0YXR1cywgJHNjb3BlLmFsbE9yZGVycylcblxuXHRcdCRzY29wZS5maWx0ZXJlZCA9IGZhbHNlO1xuXHR9XG5cbiAgICAkc2NvcGUuY2hhbmdlU3RhdHVzID0gZnVuY3Rpb24gKG9yZGVySWQsIHN0YXR1cywgaW5kZXgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbb3JkZXJJZCwgc3RhdHVzXVxuICAgICAgICAkc2NvcGUub3JkZXJzW2luZGV4XS5zdGF0dXMgPSBzdGF0dXNcbiAgICAgICAgb3JkZXJNb2RpZnlGYWN0b3J5Lm1vZGlmeU9yZGVyKGRhdGEpXG4gICAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5wcm9kdWN0Q2F0Q3JlYXRlJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdENhdENyZWF0ZScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdENhdENyZWF0ZS9wcm9kdWN0Q2F0Q3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKlJldmlldyBFbnRyeSogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Jldmlldy1lbnRyeScsIHtcbiAgICAgICAgdXJsOiAnOm5hbWUvOnVybC9yZXZpZXctZW50cnknLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsIENyZWF0ZVJldmlldywgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0bmFtZSA9ICRzdGF0ZVBhcmFtcy5uYW1lO1xuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3R1cmwgPSAkc3RhdGVQYXJhbXMudXJsO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBjb25yb2xsZXJcIiwgJHNjb3BlKTtcblxuICAgICAgICAgICAgJHNjb3BlLm5ld1JldmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFx0Ly9jb25zb2xlLmxvZyhcImluc2lkZSBuZXdSZXZpZXdcIiwgJHNjb3BlLnByb2R1Y3RuYW1lKTtcbiAgICAgICAgICAgIFx0dmFyIGluZm8gPSAkc2NvcGUucHJvZHVjdG5hbWU7XG4gICAgICAgICAgICBcdENyZWF0ZVJldmlldy5zdWJtaXRSZXZpZXcoaW5mbykudGhlbihmdW5jdGlvbih1c2VyLCBlcnIpe1xuXHQgICAgXHRcdFx0XHRcdGlmIChlcnIpICRzY29wZS5zdWNjZXNzID0gZmFsc2U7XG5cdCAgICBcdFx0XHRcdFx0XHRlbHNle1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgXHR9XG5cdCAgICBcdFx0XHRcdH0pXG5cdCAgIFx0XHRcdFx0fTtcbiAgICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5odG1sJ1xuICAgIH0pXG5cbn0pO1xuXG4vLyBJbmplY3QgdGhlIGF1dGggc2VydmljZSBpbnRvIHRoZSBzZXNzaW9uXG4vLyBnZXRsb2dnZWRpbnVzZXJcbi8vIGlzYXV0aGVudGljYXRlZFxuXG5cbiIsImFwcFxuXG4gICAgLmNvbnN0YW50KCdyYXRpbmdDb25maWcnLCB7XG4gICAgICAgIG1heDogNSxcbiAgICB9KVxuXG4gICAgLmRpcmVjdGl2ZSgncmF0aW5nJywgWydyYXRpbmdDb25maWcnLCBmdW5jdGlvbihyYXRpbmdDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuIG5nLW1vdXNlbGVhdmU9XCJyZXNldCgpXCI+PGkgbmctcmVwZWF0PVwibnVtYmVyIGluIHJhbmdlXCIgbmctbW91c2VlbnRlcj1cImVudGVyKG51bWJlcilcIiBuZy1jbGljaz1cImFzc2lnbihudW1iZXIpXCIgbmctY2xhc3M9XCJ7XFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ29sZFxcJzogbnVtYmVyIDw9IHZhbCwgXFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ3JheVxcJzogbnVtYmVyID4gdmFsfVwiPjwvaT48L3NwYW4+JyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBtYXhSYW5nZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heCkgPyBzY29wZS4kZXZhbChhdHRycy5tYXgpIDogcmF0aW5nQ29uZmlnLm1heDtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXhSYW5nZTsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yYW5nZS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmFzc2lnbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUuZW50ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSBhbmd1bGFyLmNvcHkoc2NvcGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuXG5hcHAuY29udHJvbGxlcignU3RhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N0cmlwZScsIHtcbiAgICAgICAgdXJsOiAnL3N0cmlwZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTdHJpcGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90ZXN0U3RyaXBlL3N0cmlwZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1N0cmlwZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndHV0b3JpYWwnLCB7XG4gICAgICAgIHVybDogJy90dXRvcmlhbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUdXRvcmlhbEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB0dXRvcmlhbEluZm86IGZ1bmN0aW9uIChUdXRvcmlhbEZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHV0b3JpYWxGYWN0b3J5LmdldFR1dG9yaWFsVmlkZW9zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdUdXRvcmlhbEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFR1dG9yaWFsVmlkZW9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3R1dG9yaWFsL3ZpZGVvcycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVHV0b3JpYWxDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgdHV0b3JpYWxJbmZvKSB7XG5cbiAgICAkc2NvcGUuc2VjdGlvbnMgPSB0dXRvcmlhbEluZm8uc2VjdGlvbnM7XG4gICAgJHNjb3BlLnZpZGVvcyA9IF8uZ3JvdXBCeSh0dXRvcmlhbEluZm8udmlkZW9zLCAnc2VjdGlvbicpO1xuXG4gICAgJHNjb3BlLmN1cnJlbnRTZWN0aW9uID0geyBzZWN0aW9uOiBudWxsIH07XG5cbiAgICAkc2NvcGUuY29sb3JzID0gW1xuICAgICAgICAncmdiYSgzNCwgMTA3LCAyNTUsIDAuMTApJyxcbiAgICAgICAgJ3JnYmEoMjM4LCAyNTUsIDY4LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIzNCwgNTEsIDI1NSwgMC4xMSknLFxuICAgICAgICAncmdiYSgyNTUsIDE5MywgNzMsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjIsIDI1NSwgMSwgMC4xMSknXG4gICAgXTtcblxuICAgICRzY29wZS5nZXRWaWRlb3NCeVNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbiwgdmlkZW9zKSB7XG4gICAgICAgIHJldHVybiB2aWRlb3MuZmlsdGVyKGZ1bmN0aW9uICh2aWRlbykge1xuICAgICAgICAgICAgcmV0dXJuIHZpZGVvLnNlY3Rpb24gPT09IHNlY3Rpb247XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi51c2VyTW9kaWZ5Jywge1xuICAgICAgICB1cmw6ICcvdXNlck1vZGlmeScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICd1c2VyTW9kaWZ5Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdXNlck1vZGlmeS91c2VyTW9kaWZ5Lmh0bWwnXG4gICAgfSk7XG59KVxuXG5hcHAuY29udHJvbGxlcigndXNlck1vZGlmeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyTW9kaWZ5RmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKSB7XG5cbiAgICBcbiAgICAkc2NvcGUuc3VibWl0ID0ge1xuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgbWFrZUFkbWluOiBmYWxzZVxuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLmNoYW5nZVBXID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJNb2RpZnlGYWN0b3J5LnBvc3RQVygkc2NvcGUuc3VibWl0KS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0ge31cbiAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmdpbmcgc3RhdGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuc3VibWl0KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gIFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZUl0ZW1GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0SXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9pdGVtQ3JlYXRlJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlUmV2aWV3JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRzdWJtaXRSZXZpZXc6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gcmV2aWV3IGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Jldmlld3MvJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZVVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0VXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB1c2VyIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvam9pbicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KVxuXG4vLyAnL2FwaS9sb2dpbiciLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0SXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdGNvbnNvbGUubG9nKGlkKTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nK2lkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cblx0XHQvLyBnZXRDYXRlZ29yeUl0ZW1zOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZyhcIkdldEl0ZW1GYWN0b3J5OiBnZXRDYXRlZ29yeUl0ZW1zXCIsIGNhdGVnb3J5KTtcblx0XHQvLyBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nKyBjYXRlZ29yeSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0Ly8gXHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdC8vIFx0fSk7XG5cdFx0Ly8gfSxcblxuXHR9XG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtc0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbWxpc3QnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbih1c2VyKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnNpZGUgZmFjdG9yIHdpdGg6ICcsIGVtYWlsKTtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbG9naW4vJyArIHVzZXIuZW1haWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRhdXRoVXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiZmFjdG9yeSBkb25lXCIpXG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pXG5cbi8vICcvYXBpL2xvZ2luLycgKyBlbWFpbCIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdPcmRlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGNyZWF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXsvLyBkYXRhIHNob3VsZCBiZSBpbiBmb3JtIHt1c2VySWQ6IHVzZXIuX2lkLCBpdGVtczogW2l0ZW06IGl0ZW0uX2lkLCBxdHk6IHF0eV19XG5cdFx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIHJlcXVlc3QgZm9yIGEgbmV3IG9yZGVyIGZyb20gZmFjdG9yeScpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvb3JkZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdC8vY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gY3JlYXRlT3JkZXIgZmFjdG9yeSByZXF1ZXN0JywgcmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHR1cGRhdGVPcmRlcjogZnVuY3Rpb24oZGF0YSl7IC8vZXhwZWN0cyBvcmRlcklkLCBpdGVtSWQsIGFuZCBxdWFudGl0eSAoY2FzZSBzZW5zYXRpdmUpXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9vcmRlci9saW5laXRlbScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRnZXRPcmRlcnM6IGZ1bmN0aW9uKHVzZXJJZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL29yZGVyLycrdXNlcklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBnZXRPcmRlcnMgZmFjdG9yeSByZXF1ZXN0JywgcmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH1cblxufX0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsImFwcC5mYWN0b3J5KCdhZG1pbk5hdmJhckZhY3RvcnknLCBmdW5jdGlvbiAobmF2YmFyTWVudSkge1xuXHRcdHZhciBuYXZiYXJNZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIEl0ZW0nLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgVXNlcicsIHN0YXRlOiAndXNlck1vZGlmeScgfVxuICAgIF07XG5cblx0cmV0dXJuIHtcblxuXHR9XG59KSIsIid1c2Ugc3RyaWN0J1xuYXBwLmZhY3RvcnkoJ2FkbWluUG9zdFVzZXInLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJbmZvOiBmdW5jdGlvbiAoaW5wdXRzKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYWRtaW4nLCBpbnB1dHMpXG5cdFx0fVxuXHR9XG59KSAiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnb3JkZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0ZmlsdGVyT3JkZXJzOiBmdW5jdGlvbiAoc3RhdHVzLCBhbGxPcmRlcnMpIHtcblx0XHRcdGlmIChzdGF0dXMgPT09ICdhbGwgb3JkZXJzJykge1xuXHRcdFx0XHRyZXR1cm4gYWxsT3JkZXJzXG5cdFx0XHR9XG5cdFx0XHR2YXIgZmlsdGVyZWRBcnJheSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgYT0wLCBsZW49YWxsT3JkZXJzLmxlbmd0aDsgYTxsZW47IGErKykge1xuXHRcdFx0XHRpZiAoYWxsT3JkZXJzW2FdLnN0YXR1cyA9PT0gc3RhdHVzKSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRBcnJheS5wdXNoKGFsbE9yZGVyc1thXSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZpbHRlcmVkQXJyYXlcblx0XHR9LFxuXHRcdG1vZGlmeU9yZGVyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvYWRtaW4vb3JkZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Z2V0QWxsT3JkZXJzOiBmdW5jdGlvbigpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknKTtcblx0XHRcdC8vIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKTtcblxuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hZG1pbi9vcmRlcicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRjaGFuZ2VPcmRlclN0YXR1czogZnVuY3Rpb24gKCApIHtcblx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvYWRtaW4vb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVx0XG5cdFx0fVxuXHRcdC8vIGdldFVzZXJPcmRlcnNCeUVtYWlsOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9vcmRlcicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdC8vIFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHQvLyBcdH0pXG5cdFx0Ly8gfVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ3VzZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0UFc6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdC8vIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKTtcblxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vdXNlck1vZGlmeScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgIHZpZGVvczogJz0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgYmFja2dyb3VuZDogc2NvcGUuYmFja2dyb3VuZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb25NZW51JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2VjdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNjb3BlLnNlY3Rpb25zWzBdO1xuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzY29wZS5jdXJyZW50U2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNjb3BlLnNldFNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNlY3Rpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsVmlkZW8nLCBmdW5jdGlvbiAoJHNjZSkge1xuXG4gICAgdmFyIGZvcm1Zb3V0dWJlVVJMID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIGlkO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgdmlkZW86ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnRydXN0ZWRZb3V0dWJlVVJMID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoZm9ybVlvdXR1YmVVUkwoc2NvcGUudmlkZW8ueW91dHViZUlEKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCduYXZEcm9wZG93bicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAvL3Njb3BlOiB7XG4gICAgICAgIC8vICAgIGl0ZW1zOiAnPSdcbiAgICAgICAgLy99LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXYtZHJvcGRvd24uaHRtbCdcbiAgICAgICAgLy9jb250cm9sbGVyOiAnZHJvcGRvd25Db250cm9sbGVyJ1xuICAgIH07XG59KTtcblxuYXBwLmRpcmVjdGl2ZSgnbmF2RHJvcGRvd25Xb21lbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAvL3Njb3BlOiB7XG4gICAgICAgIC8vICAgIGl0ZW1zOiAnPSdcbiAgICAgICAgLy99LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXYtZHJvcGRvd24td29tZW4uaHRtbCdcbiAgICAgICAgLy9jb250cm9sbGVyOiAnZHJvcGRvd25Db250cm9sbGVyJ1xuICAgIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2Ryb3Bkb3duQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICR3aW5kb3cpIHtcblxuICAgIEdldEl0ZW1zRmFjdG9yeS5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG4gICAgICAgIGlmKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGFsbEl0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFsbEl0ZW1zKTtcbiAgICAgICAgICAgIHZhciBkcm9wRG93blNvcnRlciA9IGZ1bmN0aW9uIChnZW5kZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc29ydGVkQXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWROYW1lcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG9iaiBpbiBhbGxJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROYW1lcy5pbmRleE9mKGFsbEl0ZW1zW29ial0ubmFtZSkgPT09IC0xICYmIGFsbEl0ZW1zW29ial0uZ2VuZGVyID09IGdlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8vL2NvbnNvbGUubG9nKGFsbEl0ZW1zW29ial0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZE5hbWVzLnB1c2goYWxsSXRlbXNbb2JqXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZEFycmF5LnB1c2goYWxsSXRlbXNbb2JqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvcnRlZEFycmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLm1lblByb2R1Y3RzMSA9IGRyb3BEb3duU29ydGVyKCdtZW4nKS5zbGljZSgwLDMpO1xuICAgICAgICAgICAgJHNjb3BlLm1lblByb2R1Y3RzMiA9IGRyb3BEb3duU29ydGVyKCdtZW4nKS5zbGljZSgzLDYpO1xuXG4gICAgICAgICAgICAkc2NvcGUud29tZW5Qcm9kdWN0czEgPSBkcm9wRG93blNvcnRlcignd29tZW4nKS5zbGljZSgwLDMpO1xuICAgICAgICAgICAgJHNjb3BlLndvbWVuUHJvZHVjdHMyID0gZHJvcERvd25Tb3J0ZXIoJ3dvbWVuJykuc2xpY2UoMyw2KTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHNjb3BlLm1lblByb2R1Y3RzMSwgJHNjb3BlLm1lblByb2R1Y3RzMik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS53b21lblByb2R1Y3RzKTtcblxuICAgICAgICAgICAgLy8gRHJvcGRvd24gY29udHJvbHNcbiAgICAgICAgICAgICRzY29wZS5tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUud29tZW5WaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICRzY29wZS50b2dnbGVNZW5WaXNpYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubWVuVmlzaWJsZSA9ICEkc2NvcGUubWVuVmlzaWJsZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUud29tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS50b2dnbGVXb21lblZpc2libGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgJHNjb3BlLndvbWVuVmlzaWJsZSA9ICEkc2NvcGUud29tZW5WaXNpYmxlO1xuICAgICAgICAgICAgICAgICRzY29wZS5tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRkb2N1bWVudCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIC8vc2NvcGU6IHtcbiAgICAgICAgLy8gIGl0ZW1zOiAnPSdcbiAgICAgICAgLy99LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgICAgIC8vbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpe1xuICAgICAgICAvLyAgICBjb25zb2xlLmxvZyhzY29wZSk7XG4gICAgICAgIC8vICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAvLyAgICAvL3Njb3BlLm1lblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgLy9cbiAgICAgICAgLy8gICAgLy9zY29wZS50b2dnbGVTZWxlY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAvLyAgICBzY29wZS5tZW5WaXNpYmxlID0gIXNjb3BlLm1lblZpc2libGU7XG4gICAgICAgIC8vICAgIC8vfVxuICAgICAgICAvLyAgICAvL1xuICAgICAgICAvLyAgICAkZG9jdW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICB2YXIgaXNDbGlja2VkRWxlbWVudENoaWxkT2ZQb3B1cCA9IGVsZW1lbnRcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgLmZpbmQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAubGVuZ3RoID4gMDtcbiAgICAgICAgLy8gICAgICAgIGNvbnNvbGUubG9nKCdpcyBjbGlja2VkJywgc2NvcGUubWVuVmlzaWJsZSlcbiAgICAgICAgLy8gICAgICAgIGlmIChpc0NsaWNrZWRFbGVtZW50Q2hpbGRPZlBvcHVwKVxuICAgICAgICAvLyAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHNjb3BlLm1lblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgLy99XG5cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgncmFuZG9HcmVldGluZycsIGZ1bmN0aW9uIChSYW5kb21HcmVldGluZ3MpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlZXRpbmcgPSBSYW5kb21HcmVldGluZ3MuZ2V0UmFuZG9tR3JlZXRpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3NwZWNzdGFja3VsYXJMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvc3BlY3N0YWNrdWxhci1sb2dvL3NwZWNzdGFja3VsYXItbG9nby5odG1sJ1xuICAgIH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=