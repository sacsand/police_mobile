angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

.controller('homeCtrl', function($scope, $rootScope) {


})




.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope, RESOURCES) {

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
      $http.get(RESOURCES.API_URL + 'api/user/' + $scope.loginData.email).success(function(response) {
          // Stringify the retured data
          var user = JSON.stringify(response.user);
          console.log(user);

          // Set the stringified user data into local storage
          localStorage.setItem('user', user);

          // Getting current user data from local storage
          $rootScope.currentUser = response.user;

          $ionicHistory.nextViewOptions({
            disableBack: true
          });

          $state.go('app.home');
        })
        .error(function() {
          $scope.loginError = true;
          $scope.loginErrorText = error.data.error;
          console.log($scope.loginErrorText);
        })
    });
  }

})

.controller('notesCtrl', function($scope, $auth, $http, $ionicPopup, RESOURCES) {
  $scope.notes = [];
  $scope.error;
  $scope.note;

  $scope.listCanSwipe = true;
  var obj = localStorage.getItem("user");
  $scope.user = JSON.parse(obj);


  $scope.updatePopup = function(note, label) {
    console.log(note, label);
    $scope.data = note;

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.name">',
      title: 'Update note',

      scope: $scope,
      buttons: [

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
      $scope.updatenote(res);
      console.log(res);
    });
  };

  $scope.init = function() {
    $scope.lastpage = 1;
    $scope.page = 1;
    $scope.limit = 5;
    $http({
      url: RESOURCES.API_URL + 'api/notes',
      method: "GET",
      params: {
        page: $scope.lastpage,
        limit: $scope.limit
      }
    }).success(function(notes, status, headers, config) {
      $scope.notes = notes.docs;
      $scope.currentpage = notes.page;
      $scope.totalRecord = notes.total;
      $scope.totalPages = notes.pages;
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
      url: RESOURCES.API_URL + 'api/notes',
      method: "GET",
      params: {
        limit: limit,
        page: $scope.lastpage
      }
    }).success(function(notes, status, headers, config) {
      console.log(notes);

      if (notes.page == notes.pages) {
        $scope.noMoreItemsAvailable = true;
      }

      $scope.notes = $scope.notes.concat(notes.docs);


    });
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };


  $scope.addnote = function(note) {

    console.log("add note: ", note);

    $http.post(RESOURCES.API_URL + 'api/notes', {
      //  console.log($rootScope.currentUser.name);
      userid: $scope.user._id,
      name: note

    }).success(function(response) {
      $scope.notes.unshift(response);
      console.log($scope.notes);
      $scope.note = '';
      console.log("note Created Successfully");
    }).error(function() {
      console.log("error");
    });
  };


  $scope.updatenote = function(note) {
    console.log(note);
    $http.put(RESOURCES.API_URL + 'api/n/' + note._id, {
      name: note.name
        //user_id: $rootScope.currentUser.id
    }).success(function(response) {
      console.log("note Updated Successfully");
    }).error(function() {
      console.log("error");
    });
  };

  $scope.deletenote = function(index, noteId) {
    console.log(index, noteId);

    $http.delete(RESOURCES.API_URL + 'api/cases/' + noteId)
      .success(function() {
        $scope.notes.splice(index, 1);
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

.controller('WantedCtrl', function($scope, $auth, $http, RESOURCES) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.init();
  });
  $scope.wanteds = [];
  $scope.error;
  $scope.wanted;
  console.log($scope.wanteds);
  $scope.listCanSwipe = true;


  $scope.init = function() {
    $scope.lastpage = 1;
    $scope.limit = 40;
    $http({
      url: RESOURCES.API_URL + 'api/wanted',
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
      url: RESOURCES.API_URL + 'api/wanted',
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

.controller('WantedCtrlSingle', function($scope, $auth, $http, $stateParams, RESOURCES) {
  $scope.wanteds = [];
  $scope.id = $stateParams;

  $scope.error;
  $scope.wanted;
  console.log($stateParams);
  console.log($scope.id);

  $scope.listCanSwipe = true;


  $scope.init = function() {
    $http({
      url: RESOURCES.API_URL + 'api/wanted/' + $scope.id.wantedId,
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
.controller('MessagesCtrl', function($scope, $auth, $http, $rootScope, RESOURCES) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.init();
  });

  $scope.messages = [];
  $scope.error;
  $scope.message;
  $scope.listCanSwipe = true;


  $scope.init = function() {
    var obj = localStorage.getItem("user");
    $scope.user = JSON.parse(obj);
    console.log($scope.user._id);
    $http({
      url: RESOURCES.API_URL + 'api/messages/received/' + $scope.user._id,
      method: "GET",
    }).success(function(messages, status, headers, config) {

      $scope.messages = messages.messages_received;
    });
  };

  $scope.init();

})


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, Markers, GoogleMaps) {
  $scope.$on('$ionicView.beforeEnter', function() {
    GoogleMaps.init();
  });
  $scope.refreshMap = function() {
    $state.reload();;

  };

})

.controller('CasesCtrl', function($scope, $auth, $http, RESOURCES) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.init();

  });

  $scope.cases = [];
  $scope.error;
  $scope.case;

  $scope.listCanSwipe = true;


  $scope.init = function() {
    $scope.lastpage = 1;
    $scope.limit = 10;
    $http({
      url: RESOURCES.API_URL + 'api/caseslibry',
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
    console.log("Load More ");
    if (!limit) {
      limit = 10;
    }

    $scope.lastpage += 1;
    $http({
      url: RESOURCES.API_URL + 'api/caseslibry',
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

.controller('casesCtrlSingle', function($scope, $auth, $http, $stateParams, RESOURCES) {
  $scope.casess = [];
  $scope.id = $stateParams;
  console.log($scope.id);
  $scope.error;

  console.log($stateParams);

  $scope.listCanSwipe = true;

  $scope.init = function() {
    $http({
      url: RESOURCES.API_URL + 'api/caseslibry/' + $stateParams.caseid,
      method: "GET",
    }).success(function(cases, status, headers, config) {
      $scope.casess = cases.doc;
      console.log($scope.casess);

    });
  };

  $scope.init();

})

.controller('reportCtrl', function($scope, $auth, $http, $cordovaGeolocation, RESOURCES) {
  $scope.data = {};
  $scope.latLng = 0;
  $scope.error = null;
  $scope.lat;
  $scope.lng;
  var options = {
    timeout: 10000,
    enableHighAccuracy: true
  };
  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

    $scope.lat = position.coords.latitude;
    $scope.lng = position.coords.longitude;


  }, function(error) {
    console.log("cant get location");
    $scope.error = "Cant Get The Location";
    $scope.lat = 6.899946;
    $scope.lng = 79.98427;

  });

  $scope.submit = function() {


    $http.post(RESOURCES.API_URL + 'api/map/add', {
      title: $scope.data.title,
      type: $scope.data.type,
      lat: $scope.lat,
      lng: $scope.lng
    }).then(function(res) {
      $scope.response = res.data;
      console.log(res.data);
    });



  }


})

.controller('notifiCtrl', function($scope, $auth, $http, $pusher, RESOURCES) {

  var pusher = new Pusher('985ac896cda360ab3d06', {
    encrypted: true
  });
  var channel = pusher.subscribe('my_chanel');
  channel.bind('marker_added', function(data) {
    alert(data.post);
  });

})
