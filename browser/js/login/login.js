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
            console.log('authenticated', AuthService.isAuthenticated())
                if (info.admin) {
                    $state.go('admin')
                } else {
                    $state.go('products')
                }
        $rootScope.user = info

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
