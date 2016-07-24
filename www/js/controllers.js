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

.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope,RESOURCES) {

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
      $http.get(RESOURCES.API_URL+'api/user/' + $scope.loginData.email).success(function(response) {
          // Stringify the retured data
          var user = JSON.stringify(response.user);
          console.log(user);

          // Set the stringified user data into local storage
          localStorage.setItem('user', user);

          // Getting current user data from local storage
          $rootScope.currentUser =response.user;
          //console.log($rootScope.currentUser);
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

.controller('JokesCtrl', function($scope, $auth, $http, $ionicPopup,RESOURCES) {
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

  $scope.init = function() {
    $scope.lastpage = 1;
    $scope.page = 1;
    $scope.limit = 5;
    $http({
      url: RESOURCES.API_URL+'api/cases',
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
      url: RESOURCES.API_URL+'api/cases',
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

    $http.post(RESOURCES.API_URL+'api/cases', {
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
    $http.put(RESOURCES.API_URL+'api/cases/' + joke._id, {
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

    $http.delete(RESOURCES.API_URL+'api/cases/' + jokeId)
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
      $scope.init();
      $scope.$broadcast('scroll.refreshComplete');
    }
  }

  $scope.init(1);

})

.controller('WantedCtrl', function($scope, $auth, $http,RESOURCES) {
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
      url:RESOURCES.API_URL+'api/wanted',
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
      url: RESOURCES.API_URL+'api/wanted',
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

.controller('WantedCtrlSingle', function($scope, $auth, $http, $stateParams,RESOURCES) {
  $scope.wanteds = [];
  $scope.id = $stateParams;

  $scope.error;
  $scope.wanted;
  console.log($stateParams);
  console.log($scope.id);

  $scope.listCanSwipe = true;


  $scope.init = function() {
    $http({
      url: RESOURCES.API_URL+'api/wanted/' + $scope.id.wantedId,
      method: "GET",
    }).success(function(wanteds, status, headers, config) {
      $scope.wanteds = wanteds;
      $scope.datas = wanteds.doc.data;

      console.log($scope.datas);
      $scope.imageb = [];
      $scope.details = [];
      angular.forEach(wanteds.doc, function(doc, index) {
        angular.forEach(doc.details, function(details, index) {
          $scope.details.push(details);
        });
      });

      console.log($scope.imageb);
    });
  };

  $scope.init();

})

///////////////////////////////////////////////////////////////////////////////////////////////////////
.controller('MessagesCtrl', function($scope, $auth, $http,$rootScope,RESOURCES) {

  $scope.messages = [];
  $scope.error;
  $scope.message;
  $scope.listCanSwipe = true;


  $scope.init = function() {
  var obj=localStorage.getItem("user");
  $scope.user=JSON.parse(obj);
    console.log($scope.user._id);
    $http({
      url: RESOURCES.API_URL+'api/messages/received/'+$scope.user._id,
      method: "GET",
    }).success(function(messages, status, headers, config) {

      $scope.messages = messages.messages_received;
    });
  };

  $scope.init();

})

////////////////////////////////////////////////////////////////////////////////////////////////////
/*
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation,RESOURCES) {
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var user_icon='img/person.png';
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: user_icon
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "You Are Here!"
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open($scope.map, marker);
      });

    });

  }, function(error) {
    console.log("Could not get location");
  });

})
*/

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation,Markers,GoogleMaps) {

   GoogleMaps.init();

})

.controller('CasesCtrl', function($scope, $auth, $http,RESOURCES) {
  $scope.cases = [];
  $scope.error;
  $scope.case;
  console.log($scope.cases);
  $scope.listCanSwipe = true;


  $scope.init = function() {
    $scope.lastpage = 1;
    //  $scope.page = page;
    $scope.limit = 40;
    $http({
      url:RESOURCES.API_URL+'api/caseslibry',
      method: "GET",
      params: {
        page: $scope.lastpage,
        limit: $scope.limit
      }
    }).success(function(cases, status, headers, config) {
      $scope.cases = cases.docs;
      console.log($scope.cases);
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
      url: RESOURCES.API_URL+'api/caseslibry',
      method: "GET",
      params: {
        limit: limit,
        page: $scope.lastpage
      }
    }).success(function(cases, status, headers, config) {


      if (cases.page == cases.pages) {
        $scope.noMoreItemsAvailable = true;
      }

      $scope.cases = $scope.cases.concat(cases.docs);


    });
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  $scope.init();

})

.controller('casesCtrlSingle', function($scope, $auth, $http, $stateParams,RESOURCES) {
  $scope.cases = [];
  $scope.id = $stateParams;
  console.log($scope.id.caseid)
  $scope.error;
  $scope.cases;
  console.log($stateParams);

  $scope.listCanSwipe = true;


  $scope.init = function() {
    $http({
      url: RESOURCES.API_URL+'api/caseslibry/' + $scope.id.caseid,
      method: "GET",
    }).success(function(cases, status, headers, config) {
      $scope.cases = cases.doc;
      $scope.timeline = [];
      angular.forEach(cases.doc, function(doc, index) {
        angular.forEach(doc.timeline, function(timeline, index) {
          $scope.timeline.push(timeline);
        });
      });

    });
  };

  $scope.init();

})
