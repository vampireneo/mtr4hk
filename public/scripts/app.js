'use strict';


// Declare app level module which depends on filters, and services
angular.module('mtr4hk', [
    'ngRoute',
    'ngAnimate',
    'jm.i18next'
]).
config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
        });
        $routeProvider.when('/xrail', {
            templateUrl: 'templates/xrail.html',
            controller: 'XRailCtrl'
        })
        .when('/finance', {
            templateUrl: 'templates/finance.html',
            controller: 'FinanceCtrl'
        })
        .when('/price', {
            templateUrl: 'templates/price.html',
            controller: 'PriceCtrl'
        })
        .when('/stability', {
            templateUrl: 'templates/stability.html',
            controller: 'StabilityCtrl'
        })
                .when('/org', {
            templateUrl: 'templates/org.html',
            controller: 'OrgCtrl'
        })
                .when('/api', {
            templateUrl: 'templates/api.html',
            controller: 'ApiCtrl'
        })
        $routeProvider.otherwise({
            redirectTo: '/main'
        });
    }
])
.filter('t',['$i18next',function(i18next){
    return function(input){
        return i18next(input);
    }
}]);


angular.module('jm.i18next')
.config(['$i18nextProvider',function ($i18nextProvider) {
    $i18nextProvider.options = {
        useCookie: false,
        useLocalStorage: false,
        load: 'current',
        fallbackLng: 'zh-TW',
        resGetPath: '../locales/__lng__/__ns__.json',
        ns: {
            namespaces: ['site_main'],
            defaultNs: 'site_main'
      }
    };

    // http://localhost:8005/?setLng=en/
}]);

angular.module('mtr4hk')
.controller('MainCtrl', ['$scope',
    function($scope) {

    }
])

.controller('XRailCtrl',['$scope',
    function($scope) {

    }
])

.controller('FinanceCtrl',['$scope',
    function($scope) {

    }
])
.controller('OrgCtrl',['$scope',
    function($scope) {

    }
])

.controller('PriceCtrl',['$scope',
    function($scope) {

    }
])
.controller('StabilityCtrl',['$scope',
    function($scope) {

    }
])
.controller('ApiCtrl',['$scope',
    function($scope) {

    }
]);