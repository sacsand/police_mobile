// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'satellizer', 'ionic-material', 'ngCordova', 'permission'])

.run(function($ionicPlatform, $rootScope, $timeout,PermissionStore) {
  $ionicPlatform.ready(function() {
    var Permission;
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    PermissionStore
       .definePermission('anonymous', function(stateParams) {
        if (!$auth.isAuthenticated()) {
          return true; // Is anonymous
        }
        return false;
      })

    .definePermission('isloggedin', function(stateParams) {
      if ($auth.isAuthenticated()) {
        return true; // Is loggedin
      }
      return false;
    });

    $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));

    $rootScope.logout = function() {
      console.log('log out called');

      $auth.logout().then(function() {

        // Remove the authenticated user from local storage
        localStorage.removeItem('user');

        // Remove the current user info from rootscope
        $rootScope.currentUser = null;
        $state.go('app.auth');
      });
    }



  });


})

.constant('RESOURCES', {
   //API_URL: 'http://localhost:3000/',
   API_URL: 'https://sheltered-castle-98865.herokuapp.com/',
})


.factory('Markers', function($http, RESOURCES, $timeout) {

  var markers = [];

  return {
    getMarkers: function() {

      return $http.get(RESOURCES.API_URL + 'api/map').then(function(response) {
        markers = response;

        return markers;
      });

    }
  }
})


.factory('GoogleMaps', function($cordovaGeolocation, Markers) {

  var apiKey = false;
  var map = null;


  function initMap() {

    var options = {
      timeout: 3000,
      enableHighAccuracy: true,

    };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(latLng);
      var mapOptions = {
        center: latLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function() {
        var user_icon = 'img/current_location.png';
        var markerUser = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: user_icon
        });

        loadMarkers(latLng);
      });

    }, function(error) {
      console.log(error);
      //Load the markers
      //loadMarkers(latLng);
    });

  }

  function loadMarkers(latLng) {

    //Get all of the markers from our Markers factory
    Markers.getMarkers().then(function(markers) {

      console.log("Markers: ", markers);

      var records = markers.data;

      for (var i = 0; i < records.length; i++) {

        var record = records[i];
        var markerPos = new google.maps.LatLng(record.lat, record.lng);

        var distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(latLng, markerPos) / 1000;

        if (distanceInKm < 30) {
          var distance = Number((distanceInKm).toFixed(1));
          alert('Alert! ' + distance + ' km Away ' + record.title);
        }
        if (record.incident_type == "accident") {

          var user_icon = 'img/red.png';
          // Add the markerto the map
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: markerPos,
            icon: user_icon
          });

          var infoWindowContent = "<h4>" + record.title + "</h4>";

          addInfoWindow(marker, infoWindowContent, record);
        } else {
          // Add the markerto the map
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: markerPos
          });

          var infoWindowContent = "<h4>" + record.title + "</h4>";

          addInfoWindow(marker, infoWindowContent, record);

        }


      }

    });

  }

  function addInfoWindow(marker, message, record) {

    var infoWindow = new google.maps.InfoWindow({
      content: message
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });

  }

  return {
    init: function() {
      initMap();
    }
  }

})

.config(function($stateProvider, $urlRouterProvider, $authProvider, RESOURCES) {
  $authProvider.loginUrl = RESOURCES.API_URL + 'api/authenticate'; //or whatever your api url is

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('app.auth', {
      url: '/auth',
      data: {
        permissions: {
          except: ['isloggedin'],
          redirectTo: 'app.report'
        }
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'AuthCtrl'
        }
      }
    })

    .state('app.notes', {
      url: '/notes',
      data: {
        permissions: {
          except: ['anonymous'],
          redirectTo: 'app.auth'
        }
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/notes.html',
          controller: 'notesCtrl'
        }
      }
    })

  .state('app.wanted', {
    url: '/wanted',
    data: {
      permissions: {
        except: ['anonymous'],
        redirectTo: 'app.auth'
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/wanted/wanted.html',
        controller: 'WantedCtrl'
      }
    }
  })

  .state('app.wantedSingle', {
    url: '/wanted/:wantedId',
    views: {
      'menuContent': {
        templateUrl: 'templates/wanted/single.html',
        controller: 'WantedCtrlSingle'
      }
    }
  })

  .state('app.messages', {
    url: '/messages',
    cache: false,
    data: {
      permissions: {
        except: ['anonymous'],
        redirectTo: 'app.auth'
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/messages/inbox.html',
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('app.map', {
    url: '/map',
    data: {
      permissions: {
        except: ['anonymous'],
        redirectTo: 'app.auth'
      }
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/map/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.cases', {
    url: '/cases',
    cache: false,
    data: {
      permissions: {
        except: ['anonymous'],
        redirectTo: 'app.auth'
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/cases/cases.html',
        controller: 'CasesCtrl'
      }
    }
  })

  .state('app.casesSingle', {
    url: '/cases/:caseid',
    views: {
      'menuContent': {
        templateUrl: 'templates/cases/single.html',
        controller: 'casesCtrlSingle'
      }
    }
  })

  .state('app.report', {
    url: '/report',
    data: {
      permissions: {
        except: ['anonymous'],
        redirectTo: 'app.auth'
      }
    },
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/report/report.html',
        controller: 'reportCtrl'
      }
    }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/auth');
});
