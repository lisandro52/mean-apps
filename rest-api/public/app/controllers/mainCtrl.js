angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {
	
	var vm = this;
	
	//get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();
	
	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		
		//get user information on route change
		Auth.getUser()
		.then(function(data) {
			vm.user = data;
		}, function(response) {
			//All is failing, guacho
		});
	});
	
	//function to handle login form
	vm.doLogin = function() {
		vm.processing = true;
		
		//clear any errors
		vm.error = '';
		
		//call the Auth.login() function
		Auth.login(vm.loginData.username, vm.loginData.password)
		.success(function(data) {
			vm.processing = false;
			//if it's logged in, redirect to users page
			if(data.success)
				$location.path('/users');
			else
				vm.error = data.message;
		});
	};
	
	vm.doLogout = function() {
		Auth.logout();
		//reset all user info
		vm.user = {};
		$location.path('/login');
	};
	
});