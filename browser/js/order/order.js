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

	$scope.goToCheckout = function () {
		$state.go('checkout')
	}

	function firstUpdate (){
	//check if user is authenticated, populate order from db, set order to cookie
	AuthService.getLoggedInUser().then(function(user){
		if( AuthService.isAuthenticated() ){
			console.log('Authenticated from Authservice');
			console.log('user', user);
			if(user.user){
					user = user.user;
			}
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
							console.log($scope.activeorders);
							sum();
							totalQty();
						});
					}
					else { //items in db, make sure cookies are added to db
						$scope.activeorders = items.lineitems.lineItem;
						$scope.orderId = items.orderId;
						console.log($scope.activeorders);
						sum();
						totalQty();
					}
				});
			}
		else {
			console.log('not authenticated');
			var idAndQty = $cookieStore.get('Order');
			var productList=[];
			GetItemsFactory.getItems().then(function(items, err){ //approach will not scale well but is quicker now
				if(err) console.log(err);
				idAndQty.forEach(function(itemPair){ //get all items, see which items are in the cart, 'populate' order items
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
	});
	}

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
			OrderFactory.updateOrder({orderId: $scope.orderId, quantity: 0, itemId: item._id}).then(function(err, data){
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
		if(AuthService.isAuthenticated()){
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