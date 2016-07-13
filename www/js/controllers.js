angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [{
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];
})


.controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope) {

  $scope.loginData = {}
  $scope.loginError = false;
  $scope.loginErrorText;

  $scope.login = function() {

    var credentials = {
      email: $scope.loginData.email,
      password: $scope.loginData.password
    }

    console.log(credentials);

    $auth.login(credentials).then(function() {
      // Return an $http request for the authenticated user
      $http.get('http://localhost:3000/api/user/' + $scope.loginData.email).success(function(response) {
          // Stringify the retured data
          var user = JSON.stringify(response.user);

          // Set the stringified user data into local storage
          localStorage.setItem('user', user);

          // Getting current user data from local storage
          $rootScope.currentUser = response.user;
          // $rootScope.currentUser = localStorage.setItem('user');

          $ionicHistory.nextViewOptions({
            disableBack: true
          });

          $state.go('app.jokes');
        })
        .error(function() {
          $scope.loginError = true;
          $scope.loginErrorText = error.data.error;
          console.log($scope.loginErrorText);
        })
    });
  }

})

.controller('JokesCtrl', function($scope, $auth, $http, $ionicPopup) {
  $scope.jokes = [];
  $scope.error;
  $scope.joke;

  $scope.listCanSwipe = true;

  // Update Popup
  $scope.updatePopup = function(joke, label) {
    console.log(joke, label);
    $scope.data = joke;

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.name">',
      title: 'Update Joke',
      // subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        // { text: 'Cancel' },
        {
          text: '<b>' + label + '</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.name) {
              e.preventDefault();
            } else {
              return $scope.data;
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      $scope.updateJoke(res);
      console.log(res);
    });
  };

  $scope.init = function(page) {
    $scope.lastpage = 1;
    $scope.page = page;
    $scope.limit = 5;
    $http({
      url: 'http://localhost:3000/api/cases',
      method: "GET",
      params: {
        page: $scope.lastpage,
        limit: $scope.limit
      }
    }).success(function(jokes, status, headers, config) {
      $scope.jokes = jokes.docs;
      $scope.currentpage = jokes.page;
      $scope.totalRecord = jokes.total;
      $scope.totalPages = jokes.pages;
    });
  };
  $scope.noMoreItemsAvailable = false;
  $scope.loadMore = function(limit) {
    console.log("Load More Called");
    if (!limit) {
      limit = 5;
    }

    $scope.lastpage += 1;
    $http({
      url: 'http://localhost:3000/api/cases',
      method: "GET",
      params: {
        limit: limit,
        page: $scope.lastpage
      }
    }).success(function(jokes, status, headers, config) {
      console.log(jokes);

      if (jokes.page == jokes.pages) {
        $scope.noMoreItemsAvailable = true;
      }

      $scope.jokes = $scope.jokes.concat(jokes.docs);


    });
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };


  $scope.addJoke = function(joke) {

    console.log("add joke: ", joke);

    $http.post('http://localhost:3000/api/cases', {
      //  console.log($rootScope.currentUser.name);
      name: joke
        //_id: $rootScope.currentUser.name
    }).success(function(response) {
      $scope.jokes.unshift(response);
      console.log($scope.jokes);
      $scope.joke = '';
      console.log("Joke Created Successfully");
    }).error(function() {
      console.log("error");
    });
  };


  $scope.updateJoke = function(joke) {
    console.log(joke);
    $http.put('http://localhost:3000/api/cases/' + joke._id, {
      name: joke.name
        //user_id: $rootScope.currentUser.id
    }).success(function(response) {
      console.log("Joke Updated Successfully");
    }).error(function() {
      console.log("error");
    });
  };

  $scope.deleteJoke = function(index, jokeId) {
    console.log(index, jokeId);

    $http.delete('http://localhost:3000/api/cases/' + jokeId)
      .success(function() {
        $scope.jokes.splice(index, 1);
      });
  };


  $scope.doRefresh = function(currentP, totalP) {
    console.log(totalP);
    if (currentP != totalP + 1) {
      $scope.init(currentP);
      $scope.$broadcast('scroll.refreshComplete');
    } else {
      $scope.init(1);
      $scope.$broadcast('scroll.refreshComplete');
    }
  }

  $scope.init(1);

})

.controller('WantedCtrl', function($scope, $auth, $http) {
  $scope.wanteds = [];
  $scope.error;
  $scope.wanted;
  console.log($scope.wanteds);
  $scope.listCanSwipe = true;


  $scope.init = function() {
    $scope.lastpage = 1;
    //  $scope.page = page;
    $scope.limit = 40;
    $http({
      url: 'http://localhost:3000/api/wanted',
      method: "GET",
      params: {
        page: $scope.lastpage,
        limit: $scope.limit
      }
    }).success(function(wanteds, status, headers, config) {
      $scope.wanteds = wanteds.docs;
      console.log($scope.wanteds);
      $scope.currentpage = wanteds.page;
      $scope.totalRecord = wanteds.total;
      $scope.totalPages = wanteds.pages;
    });
  };


  $scope.noMoreItemsAvailable = false;
  $scope.loadMore = function(limit) {
    console.log("Load More Called");
    if (!limit) {
      limit = 10;
    }

    $scope.lastpage += 1;
    $http({
      url: 'http://localhost:3000/api/wanted',
      method: "GET",
      params: {
        limit: limit,
        page: $scope.lastpage
      }
    }).success(function(wanteds, status, headers, config) {


      if (wanteds.page == wanteds.pages) {
        $scope.noMoreItemsAvailable = true;
      }

      $scope.wanteds = $scope.wanteds.concat(wanteds.docs);


    });
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };



  $scope.init();

})

.controller('WantedCtrlSingle', function($scope, $auth, $http, $stateParams) {
  $scope.wanteds = [];
  $scope.id = $stateParams;

  $scope.error;
  $scope.wanted;
  console.log($stateParams);
  console.log($scope.id);

  $scope.listCanSwipe = true;


  $scope.init = function() {
    $http({
      url: 'http://localhost:3000/api/wanted/' + $scope.id.wantedId,
      method: "GET",
    }).success(function(wanteds, status, headers, config) {
      $scope.wanteds = wanteds;
      $scope.datas = wanteds.doc.data;

      console.log($scope.datas);
      //$scope.doc.img=Wanteds.doc.img;
      //console.log(wanteds.doc._id);
      //console.log($scope.wanteds);
      //console.log("warf"+ $scope.wanteds);
      $scope.imageb = [];
      $scope.details = [];
      angular.forEach(wanteds.doc, function(doc, index) {
        angular.forEach(doc.details, function(details, index) {
          $scope.details.push(details);
        });
      });
      /*angular.forEach(wanteds.doc, function(doc, index) {
        angular.forEach(doc.img, function(img, index) {
          $scope.imageb.push(img);
        });
      });*/

      console.log($scope.imageb);
    });
  };

  $scope.init();

})

;
