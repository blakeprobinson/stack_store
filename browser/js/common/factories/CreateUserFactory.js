'use strict';
app.factory('CreateUserFactory', function($http){
	
	return {
		postUser: function(data){
			console.log('into user factory', data);
			return $http.post('api/login', data).then(function(response){
				return response.data;
			})
		}
	}
})

// '/api/login'