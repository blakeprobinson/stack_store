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