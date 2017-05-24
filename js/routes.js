angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      .state('menu.home', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menu.payment', {
      url: '/page2',
      views: {
          'side-menu21': {
              templateUrl: 'templates/payment.html',
              controller: 'paymentCtrl'
          }
      }
  })

  .state('menu.trips', {
    url: '/page3',
    views: {
      'side-menu21': {
        templateUrl: 'templates/trips.html',
        controller: 'tripsCtrl'
      }
    }
  })

  .state('menu.history', {
    url: '/page4',
    views: {
    'side-menu21': {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
        }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});