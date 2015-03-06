'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);
var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt', 'ng-cookies']);
app.controller('MainController',  function ($scope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Product list', state: 'products' },
        { label: 'Register', state: 'join' },
        { label: 'Log In', state: 'login'},
        { label: 'Create a product', state: 'itemCreate' },
        { label: 'About', state: 'about' },
        { label: 'My Orders', state: 'orders'}
    ];

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

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    });

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});
});
// app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    // $stateProvider.state('create-account', {
    //     url: '/create-account',
        //controller: 'joinController',
//         templateUrl: 'js/create-account/create-account.html'
//     });

// });
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
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams, $cookiestore) {

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
		var order = $cookiestore.get('Order');
		var line = {item: $scope.item, qty: 1};
			if(!order){
				$cookiestore.put('Order', line);
			}
			else{
				order.push(line);
				$cookiestore.put('Order', order);
			}
	}
});
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('itemCreate', {
        url: '/create/item',
        controller: 'itemCreateController',
        templateUrl: 'js/itemCreate/itemCreate.html'
    });

});

app.controller('itemCreateController', function ($scope, CreateItemFactory, $state, $stateParams) {

	$scope.item = {
		categories: [] };
	$scope.success;

	$scope.submitItem = function() {
		//$scope.item.categories = $scope.item.categories.split(' ');
		console.log('process started');
		console.log($scope.item);
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



app.controller('joinController', function($scope, $window, CreateUserFactory) {

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
	    		console.log(user);
	    		$scope.success = true;
	    	}
	    });
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


app.controller('loginController', function($scope, $window, GetUserFactory) {
    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }
    $scope.success;
    $scope.submitUser = function() {
        var info = $scope.user.email;
        console.log("user login process started with: ", info);
	    GetUserFactory.getUser(info).then(function(user, err){
	    	if (err) $scope.success = false;
	    	else{
	    		console.log(user);
	    		$scope.user.email = user[0].email;
	    	}
	    });
	}
});

'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('orders', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('orderController', function ($scope, OrderFactory, $state, $stateParams) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[];
	$scope.pastorders=[];
	$scope.summary;
	$scope.sum = function(){

	}

	$scope.updateOrder = function(){
		//takes in information about the user, 
		OrderFactory.updateOrder()

	} 
	//get user information and send Id
	OrderFactory.getOrders().then(function(items, err){
		if (err) console.log('Error: ', err);

		else if(!items) {
			console.log('No current order'); //not sure what else needs to be declared.
		}
		else {
			$scope.summary = items.info;
			item.lineItems.forEach(function(thing){
				if(thing.info.status == 'open'){
					$scope.activeorders.push(thing);
				}
				else {
					$scope.pastorders.push(thing);
				}
			});	
		}
	})
	
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
app.factory('CreateItemFactory', function($http){
	
	return {
		postItem: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/item', data).then(function(response){
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
			return $http.post('/api/user', data).then(function(response){
				return response.data;
			})
		}
	}
})
'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			return $http.get('/api/item/'+id).then(function(response){
				return response.data;
			})
		}
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
		getUser: function(email){
			console.log('inside factor with: ', email);
			//var options = {email: email};
			return $http.get('/api/user/' + email).then(function(response){
				return response.data;
			})
		}
	}

})
'use strict';
app.factory('OrderFactory', function($http){
	
	return {
		addItem: function(data){
			console.log('into the factory', data);
			// data should be in form {item: itemId, quantity: quantity, }

			return $http.post('/api/item/addToOrder', data).then(function(response){
				return response.data;
			})
		},
		updateOrder: function(data){
			return $http.post('/api/order/lineitem', data).then(function(response){
				return response.data;
			})
		},
		getOrders: function(){
			//if user is authenticated, check the server
			//if(req.session.user)
			if( 1 >= 6 ){
				return $http.get('/api/order').then(function(response){
					return response.data;
				})
			}
			else{
				return false; //get data from session
			}
		}



	};

})
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
app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
    };
});
'use strict';
app.directive('navbar', function () {
    return {
        restrict: 'E',
        scope: {
          items: '='
        },
        templateUrl: 'js/common/directives/navbar/navbar.html'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWxsSXRlbXMvYWxsSXRlbXMuanMiLCJjcmVhdGUtYWNjb3VudC9jcmVhdGUtYWNjb3VudC5qcyIsImZzYS9mc2EtcHJlLWJ1aWx0LmpzIiwiaG9tZS9ob21lLmpzIiwiaXRlbS9pdGVtLmpzIiwiaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmpzIiwiam9pbm5vdy9qb2lubm93LmpzIiwibG9naW4vbG9naW4uanMiLCJvcmRlci9vcmRlci5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldEl0ZW1zRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0VXNlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL09yZGVyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9Tb2NrZXQuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLy8gdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCddKTtcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3BlY1N0YWNrdWxhcicsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0JywgJ25nLWNvb2tpZXMnXSk7XG5hcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCAgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICAgLy8gR2l2ZW4gdG8gdGhlIDxuYXZiYXI+IGRpcmVjdGl2ZSB0byBzaG93IHRoZSBtZW51LlxuICAgICRzY29wZS5tZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnUHJvZHVjdCBsaXN0Jywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgeyBsYWJlbDogJ1JlZ2lzdGVyJywgc3RhdGU6ICdqb2luJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTG9nIEluJywgc3RhdGU6ICdsb2dpbid9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIGEgcHJvZHVjdCcsIHN0YXRlOiAnaXRlbUNyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgeyBsYWJlbDogJ015IE9yZGVycycsIHN0YXRlOiAnb3JkZXJzJ31cbiAgICBdO1xuXG59KTtcblxuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hYm91dC9hYm91dC5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEltYWdlcyBvZiBiZWF1dGlmdWwgRnVsbHN0YWNrIHBlb3BsZS5cbiAgICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZSdcbiAgICBdO1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RzJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxuICAgICAgICBjb250cm9sbGVyOiAnYWxsSXRlbXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hbGxpdGVtcy9hbGxpdGVtcy5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2FsbEl0ZW1zQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHR9XG5cdH0pO1xufSk7IiwiLy8gYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqSm9pbiBOb3cqIHN0YXRlLlxuICAgIC8vICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjcmVhdGUtYWNjb3VudCcsIHtcbiAgICAvLyAgICAgdXJsOiAnL2NyZWF0ZS1hY2NvdW50JyxcbiAgICAgICAgLy9jb250cm9sbGVyOiAnam9pbkNvbnRyb2xsZXInLFxuLy8gICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NyZWF0ZS1hY2NvdW50L2NyZWF0ZS1hY2NvdW50Lmh0bWwnXG4vLyAgICAgfSk7XG5cbi8vIH0pOyIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICAgIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgaWYgKCF3aW5kb3cuaW8pIHRocm93IG5ldyBFcnJvcignc29ja2V0LmlvIG5vdCBmb3VuZCEnKTtcblxuICAgICAgICB2YXIgc29ja2V0O1xuXG4gICAgICAgIGlmICgkbG9jYXRpb24uJCRwb3J0KSB7XG4gICAgICAgICAgICBzb2NrZXQgPSBpbygnaHR0cDovL2xvY2FsaG9zdDoxMzM3Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb2NrZXQgPSBpbygnLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNvY2tldDtcblxuICAgIH0pO1xuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsIEFVVEhfRVZFTlRTKSB7XG4gICAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLFxuICAgICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgU2Vzc2lvbiwgJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsICRxKSB7XG5cbiAgICAgICAgdmFyIG9uU3VjY2Vzc2Z1bExvZ2luID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLmlkLCBkYXRhLnVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHsgdXNlcjogU2Vzc2lvbi51c2VyIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIVNlc3Npb24udXNlcjtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCB0aGlzLmRlc3Ryb3kpO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgdGhpcy5kZXN0cm95KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBzZXNzaW9uSWQ7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2l0ZW0nLCB7XG4gICAgICAgIHVybDogJy9pdGVtLzpuYW1lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2l0ZW1Db250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9pdGVtL2l0ZW0uaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdpdGVtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1GYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZXN0b3JlKSB7XG5cblx0Ly9nZXQgaW5wdXQgZnJvbSB1c2VyIGFib3V0IGl0ZW0gKGlkIGZyb20gdXJsIClcblx0Ly9jaGVjayBpZCB2cyBkYXRhYmFzZVxuXHQvL2lmIG5vdCBmb3VuZCwgcmVkaXJlY3QgdG8gc2VhcmNoIHBhZ2Vcblx0Ly9pZiBmb3VuZCBzZW5kIHRlbXBhbGF0ZVVybFxuXG5cdEdldEl0ZW1GYWN0b3J5LmdldEl0ZW0oJHN0YXRlUGFyYW1zLm5hbWUpLnRoZW4oZnVuY3Rpb24oaXRlbSwgZXJyKXtcblx0XHRpZihlcnIpICRzdGF0ZS5nbygnaG9tZScpO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbSA9IGl0ZW1bMF07XG5cdFx0XHR9XG5cdH0pO1xuXG5cdCRzY29wZS5hZGRUb09yZGVyID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgb3JkZXIgPSAkY29va2llc3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdHZhciBsaW5lID0ge2l0ZW06ICRzY29wZS5pdGVtLCBxdHk6IDF9O1xuXHRcdFx0aWYoIW9yZGVyKXtcblx0XHRcdFx0JGNvb2tpZXN0b3JlLnB1dCgnT3JkZXInLCBsaW5lKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdG9yZGVyLnB1c2gobGluZSk7XG5cdFx0XHRcdCRjb29raWVzdG9yZS5wdXQoJ09yZGVyJywgb3JkZXIpO1xuXHRcdFx0fVxuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2l0ZW1DcmVhdGUnLCB7XG4gICAgICAgIHVybDogJy9jcmVhdGUvaXRlbScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ3JlYXRlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDcmVhdGVJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUuc3VibWl0SXRlbSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vJHNjb3BlLml0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS5pdGVtLmNhdGVnb3JpZXMuc3BsaXQoJyAnKTtcblx0XHRjb25zb2xlLmxvZygncHJvY2VzcyBzdGFydGVkJyk7XG5cdFx0Y29uc29sZS5sb2coJHNjb3BlLml0ZW0pO1xuXHRcdENyZWF0ZUl0ZW1GYWN0b3J5LnBvc3RJdGVtKCRzY29wZS5pdGVtKS50aGVuKGZ1bmN0aW9uKGl0ZW0sIGVycil7XG5cdFx0XHRpZihlcnIpICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcblx0XHRcdGVsc2V7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHQkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnam9pbicsIHtcbiAgICAgICAgdXJsOiAnL2pvaW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnam9pbkNvbnRyb2xsZXInLFxuXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvam9pbm5vdy9qb2lubm93Lmh0bWwnIFxuXG4gICAgfSk7XG5cbn0pO1xuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ2pvaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93LCBDcmVhdGVVc2VyRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICBcdGNvbnNvbGUubG9nKFwidXNlciBzdWJtaXQgcHJvY2VzcyBzdGFydGVkXCIpO1xuICAgIFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXIpO1xuXHQgICAgQ3JlYXRlVXNlckZhY3RvcnkucG9zdFVzZXIoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3M9ZmFsc2U7XG5cdCAgICBcdGVsc2V7XG5cdCAgICBcdFx0Y29uc29sZS5sb2codXNlcik7XG5cdCAgICBcdFx0JHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXHQgICAgXHR9XG5cdCAgICB9KTtcblx0ICB9XG59KTtcblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqSm9pbiBOb3cqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcgXG4gICAgfSk7XG5cbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csIEdldFVzZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluZm8gPSAkc2NvcGUudXNlci5lbWFpbDtcbiAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIGxvZ2luIHByb2Nlc3Mgc3RhcnRlZCB3aXRoOiBcIiwgaW5mbyk7XG5cdCAgICBHZXRVc2VyRmFjdG9yeS5nZXRVc2VyKGluZm8pLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgIFx0ZWxzZXtcblx0ICAgIFx0XHRjb25zb2xlLmxvZyh1c2VyKTtcblx0ICAgIFx0XHQkc2NvcGUudXNlci5lbWFpbCA9IHVzZXJbMF0uZW1haWw7XG5cdCAgICBcdH1cblx0ICAgIH0pO1xuXHR9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnb3JkZXJzJywge1xuICAgICAgICB1cmw6ICcvb3JkZXIvOm5hbWUnLFxuICAgICAgICBjb250cm9sbGVyOiAnb3JkZXJDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9vcmRlci9vcmRlci5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ29yZGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIE9yZGVyRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQvL3Byb3ZpZGVzIGdlbmVyYWwgZnVuY3Rpb25hbGl0eSB3aXRoIGFuIG9yZGVyXG5cdC8vdmlld3MgY3VycmVudCB1c2VyIG9yZGVyXG5cdFx0Ly9vcmRlciBpcyBzaG93biBieSBsaW5lIGl0ZW1cblx0XHQvL2hhcyBhYmlsaXR5IHRvIGVkaXQgb3JkZXIsIG9yIHByb2NlZWQgdG8gY2hlY2tvdXRcblx0JHNjb3BlLmFjdGl2ZW9yZGVycz1bXTtcblx0JHNjb3BlLnBhc3RvcmRlcnM9W107XG5cdCRzY29wZS5zdW1tYXJ5O1xuXHQkc2NvcGUuc3VtID0gZnVuY3Rpb24oKXtcblxuXHR9XG5cblx0JHNjb3BlLnVwZGF0ZU9yZGVyID0gZnVuY3Rpb24oKXtcblx0XHQvL3Rha2VzIGluIGluZm9ybWF0aW9uIGFib3V0IHRoZSB1c2VyLCBcblx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoKVxuXG5cdH0gXG5cdC8vZ2V0IHVzZXIgaW5mb3JtYXRpb24gYW5kIHNlbmQgSWRcblx0T3JkZXJGYWN0b3J5LmdldE9yZGVycygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG5cdFx0aWYgKGVycikgY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpO1xuXG5cdFx0ZWxzZSBpZighaXRlbXMpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdObyBjdXJyZW50IG9yZGVyJyk7IC8vbm90IHN1cmUgd2hhdCBlbHNlIG5lZWRzIHRvIGJlIGRlY2xhcmVkLlxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdCRzY29wZS5zdW1tYXJ5ID0gaXRlbXMuaW5mbztcblx0XHRcdGl0ZW0ubGluZUl0ZW1zLmZvckVhY2goZnVuY3Rpb24odGhpbmcpe1xuXHRcdFx0XHRpZih0aGluZy5pbmZvLnN0YXR1cyA9PSAnb3Blbicpe1xuXHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMucHVzaCh0aGluZyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0JHNjb3BlLnBhc3RvcmRlcnMucHVzaCh0aGluZyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1x0XG5cdFx0fVxuXHR9KVxuXHRcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3RyaXBlJywge1xuICAgICAgICB1cmw6ICcvc3RyaXBlJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1N0cmlwZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Rlc3RTdHJpcGUvc3RyaXBlLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignU3RyaXBlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0dXRvcmlhbCcsIHtcbiAgICAgICAgdXJsOiAnL3R1dG9yaWFsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1R1dG9yaWFsQ3RybCcsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHR1dG9yaWFsSW5mbzogZnVuY3Rpb24gKFR1dG9yaWFsRmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBUdXRvcmlhbEZhY3RvcnkuZ2V0VHV0b3JpYWxWaWRlb3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1R1dG9yaWFsRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VHV0b3JpYWxWaWRlb3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHV0b3JpYWwvdmlkZW9zJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdUdXRvcmlhbEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCB0dXRvcmlhbEluZm8pIHtcblxuICAgICRzY29wZS5zZWN0aW9ucyA9IHR1dG9yaWFsSW5mby5zZWN0aW9ucztcbiAgICAkc2NvcGUudmlkZW9zID0gXy5ncm91cEJ5KHR1dG9yaWFsSW5mby52aWRlb3MsICdzZWN0aW9uJyk7XG5cbiAgICAkc2NvcGUuY3VycmVudFNlY3Rpb24gPSB7IHNlY3Rpb246IG51bGwgfTtcblxuICAgICRzY29wZS5jb2xvcnMgPSBbXG4gICAgICAgICdyZ2JhKDM0LCAxMDcsIDI1NSwgMC4xMCknLFxuICAgICAgICAncmdiYSgyMzgsIDI1NSwgNjgsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjM0LCA1MSwgMjU1LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDI1NSwgMTkzLCA3MywgMC4xMSknLFxuICAgICAgICAncmdiYSgyMiwgMjU1LCAxLCAwLjExKSdcbiAgICBdO1xuXG4gICAgJHNjb3BlLmdldFZpZGVvc0J5U2VjdGlvbiA9IGZ1bmN0aW9uIChzZWN0aW9uLCB2aWRlb3MpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvcy5maWx0ZXIoZnVuY3Rpb24gKHZpZGVvKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlkZW8uc2VjdGlvbiA9PT0gc2VjdGlvbjtcbiAgICAgICAgfSk7XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZUl0ZW1GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0SXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlVXNlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RVc2VyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHVzZXIgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0Ly92YXIgb3B0aW9ucyA9IHtlbWFpbDogZW1haWx9O1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldEl0ZW1zRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2l0ZW1saXN0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbihlbWFpbCl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW5zaWRlIGZhY3RvciB3aXRoOiAnLCBlbWFpbCk7XG5cdFx0XHQvL3ZhciBvcHRpb25zID0ge2VtYWlsOiBlbWFpbH07XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGVtYWlsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdPcmRlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGFkZEl0ZW06IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdC8vIGRhdGEgc2hvdWxkIGJlIGluIGZvcm0ge2l0ZW06IGl0ZW1JZCwgcXVhbnRpdHk6IHF1YW50aXR5LCB9XG5cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0vYWRkVG9PcmRlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHR1cGRhdGVPcmRlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9vcmRlci9saW5laXRlbScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRnZXRPcmRlcnM6IGZ1bmN0aW9uKCl7XG5cdFx0XHQvL2lmIHVzZXIgaXMgYXV0aGVudGljYXRlZCwgY2hlY2sgdGhlIHNlcnZlclxuXHRcdFx0Ly9pZihyZXEuc2Vzc2lvbi51c2VyKVxuXHRcdFx0aWYoIDEgPj0gNiApe1xuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL29yZGVyJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vZ2V0IGRhdGEgZnJvbSBzZXNzaW9uXG5cdFx0XHR9XG5cdFx0fVxuXG5cblxuXHR9O1xuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBuYW1lOiAnQCcsXG4gICAgICAgICAgICB2aWRlb3M6ICc9JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdAJ1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24vdHV0b3JpYWwtc2VjdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7IGJhY2tncm91bmQ6IHNjb3BlLmJhY2tncm91bmQgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uTWVudScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNlY3Rpb25zOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcblxuICAgICAgICAgICAgc2NvcGUuY3VycmVudFNlY3Rpb24gPSBzY29wZS5zZWN0aW9uc1swXTtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoc2NvcGUuY3VycmVudFNlY3Rpb24pO1xuXG4gICAgICAgICAgICBzY29wZS5zZXRTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzZWN0aW9uKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFZpZGVvJywgZnVuY3Rpb24gKCRzY2UpIHtcblxuICAgIHZhciBmb3JtWW91dHViZVVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyBpZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC12aWRlby90dXRvcmlhbC12aWRlby5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHZpZGVvOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS50cnVzdGVkWW91dHViZVVSTCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGZvcm1Zb3V0dWJlVVJMKHNjb3BlLnZpZGVvLnlvdXR1YmVJRCkpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnZnVsbHN0YWNrTG9nbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ25hdmJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgIGl0ZW1zOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnXG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3JhbmRvR3JlZXRpbmcnLCBmdW5jdGlvbiAoUmFuZG9tR3JlZXRpbmdzKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLmdyZWV0aW5nID0gUmFuZG9tR3JlZXRpbmdzLmdldFJhbmRvbUdyZWV0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=