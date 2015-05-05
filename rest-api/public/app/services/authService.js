
angular.module('authService', [])

//Auth factory to login and get information
.factory('Auth', function($http, $q, AuthToken) {
	
	var authFactory = {};
	
	return authFactory;
})

//Factory for handling tokens
.factory('AuthToken', function($window) {
	
	var authTokenFactory = {};
	
	//get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};
	
	//function to set token or clear token
	//if token is passed, set the token
	//else, clear it from local storage
	
	return authTokenFactory;
})

//application configuration to integrate token into requests
.factory('AuthInterceptor', function($q, AuthToken) {
	
	var interceptorFactory = {};
	
	return interceptorFactory;
});
