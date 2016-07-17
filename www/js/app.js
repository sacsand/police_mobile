// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','satellizer','ionic-material','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('RESOURCES',
    {
        API_URL: 'http://localhost:3000/',
    })



.factory('Markers', function($http,RESOURCES) {

  var markers = [];

  return {
    getMarkers: function(){

      return $http.get(RESOURCES.API_URL+'map').then(function(response){
          markers = response;
          return markers;
      });

    },
    getMarker: function(id){

    }
  }
})

.config(function($stateProvider, $urlRouterProvider,$authProvider,RESOURCES) {
  $authProvider.loginUrl = RESOURCES.API_URL+'api/authenticate'; //or whatever your api url is
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

    .state('app.cases', {
      url: '/cases',
      views: {
        'menuContent': {
          templateUrl: 'templates/cases/cases.html',
          controller: 'CasesCtrl'
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
    views: {
      'menuContent': {
        templateUrl: 'templates/map/map.html',
        controller: 'MapCtrl'
      }
    }
  })







  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
