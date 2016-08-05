// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'satellizer', 'ionic-material', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      GoogleMaps.init();
    }


  });
})

.constant('RESOURCES', {
//   API_URL: 'http://localhost:3000/',
  API_URL: 'https://sheltered-castle-98865.herokuapp.com/',
})

.factory('Markers', function($http, RESOURCES) {

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
      timeout: 10000,
      enableHighAccuracy: true
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
          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          loadMarkers(latLng);
      });

    }, function(error) {
      console.log("Could not get location");
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

        if (distanceInKm < 2) {
          console.log("distance" + distanceInKm)
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

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.auth', {
    url: '/auth',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('app.jokes', {
    url: '/jokes',
    views: {
      'menuContent': {
        templateUrl: 'templates/jokes.html',
        controller: 'JokesCtrl'
      }
    }
  })

  .state('app.wanted', {
    url: '/wanted',
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
    views: {
      'menuContent': {
        templateUrl: 'templates/messages/inbox.html',
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('app.map', {
    url: '/map',
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

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
