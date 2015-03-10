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