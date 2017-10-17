// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'ScrollCtrl'
      }
    }
  })
  

  .state('tab.cart', {
      url: '/cart',
      views: {
        'cart': {
          templateUrl: 'templates/cart.html'          
        }
      }
    })
    .state('tab.search', {
      url: '/search',
      views: {
        'search': {
          templateUrl: 'templates/search.html',
          controller: 'NavCtrl'
        }
      }
    })
    .state('tab.search_res', {
      url: '/search_res',
      views: {
        'search': {
          templateUrl: 'templates/search_res.html',
          controller: 'NavCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/cart/',
      views: {
        'cart': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.product', {
      url: '/product/',
      views: {
        'home': {
          templateUrl: 'templates/product.html',
          controller: 'NavCtrl'
        }
      }
    })
    
  .state('tab.account', {
    url: '/account',
    views: {
      'account': {
        templateUrl: 'templates/account.html',
        controller: 'NavCtrl'
      }
    }
  })
    .state('tab.account_settings', {
    url: '/account_settings',
    views: {
      'account': {
        templateUrl: 'templates/account_settings.html',
        controller: 'NavCtrl'
      }
    }
  })
  
  .state('tab.sign_in', {
    url: '/sign_in',
    views: {
      'account': {
        templateUrl: 'templates/sign_in.html',
        controller: 'NavCtrl'
      }
    }
  })
  .state('tab.register', {
    url: '/register',
    views: {
      'account': {
        templateUrl: 'templates/register.html',
        controller: 'NavCtrl'
      }
    }
  })
  .state('tab.more', {
    url: '/more',
    views: {
      'more': {
        templateUrl: 'templates/more.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.delivery_to', {
    url: '/delivery_to/',
    views: {
      'more': {
        templateUrl: 'templates/delivery_to.html',
          controller: 'NavCtrl'
      }
    }
  })
  .state('tab.language', {
    url: '/language/',
    views: {
      'more': {
        templateUrl: 'templates/language.html',
          controller: 'NavCtrl'
      }
    }
  })
  .state('tab.about_us', {
    url: '/about_us/',
    views: {
      'more': {
        templateUrl: 'templates/about_us.html',
          controller: 'NavCtrl'
      }
    }
  })
  .state('tab.help_center', {
    url: '/help_center/',
    views: {
      'more': {
        templateUrl: 'templates/help_center.html',
          controller: 'NavCtrl'
      }
    }
  })
  .state('tab.contact_us', {
    url: '/contact_us/',
    views: {
      'more': {
        templateUrl: 'templates/contact_us.html',
          controller: 'NavCtrl'
      }
    }
  })

.state('tab.feedback', {
    url: '/feedback/',
    views: {
      'more': {
        templateUrl: 'templates/feedback.html',
          controller: 'NavCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
