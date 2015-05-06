
//start our angular module and inject userService
angular.module('userCtrl', ['userService'])

// user controller for the main page
// inject the User factory
.controller('userController', function(User) {
	
	var vm = this;
	
	// set a processing variable to show loading things
	vm.processing = true;
	
	//grab all the users at page load
	User.all()
		.success(function(incomingUsers) {
			
			//when all users come back, remove the processing variable
			vm.processing = false;
			
			//bing the users that come back to vm.users
			vm.users = incomingUsers;
		});
	
	vm.deleteUser = function(id) {
		vm.processing = true;
		
		//accepts the user id as a parameter
		User.delete(id)
			.successs(function(data) {
				
				//get all users to update the table
				//you can also set up your api
				//to return the list of users with the delete call
				User.all()
					.success(function(incomingUsers) {
						vm.processing = false;
						vm.users = incomingUsers;
					});
			});
	};
	
})

//controller applied to user creation page
.controller('userCreateController', function(User) {
	
	var vm = this;
	
	//variable to hide/show elements of the view
	//differentiates between create or edit pages
	vm.type = 'create';
	
	vm.saveUser = function() {
		vm.processing = true;
		
		vm.message = '';
		
		//use the  create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				
				//clear the form
				vm.userData = {};
				vm.message = data.message;
			});
	};
	
})

//controller applied to user edit page
.controller('userEditController', function($routeParams, User) {
	
	var vm = this;
	
	vm.type = 'edit';
	
	//get the user data for the user you want to edit
	//$routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});
		
	//function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';
		
		//call the userService function to update
		User.update($routeParams.user_id, vm.userData)
			.success(function(data) {
				vm.processing = false;
				
				//clear the form
				vm.userData = {};
				
				//bind the message from our API to vm.message
				vm.message = data.message;
			});	
	};
	
});