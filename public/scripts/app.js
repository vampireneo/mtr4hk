'use strict';


// Declare app level module which depends on filters, and services
angular.module('mtr4hk', [
    'ngRoute',
    'ngAnimate',
    'jm.i18next',
    'ui.bootstrap'
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
            .when('/capacity', {
                templateUrl: 'templates/capacity.html',
                controller: 'CapacityCtrl'
            })
            .when('/org', {
                templateUrl: 'templates/org.html',
                controller: 'OrgCtrl'
            })
            .when('/api', {
                templateUrl: 'templates/api.html',
                controller: 'ApiCtrl'
            })
            .when('/others', {
                templateUrl: 'templates/others.html',
                controller: 'OthersCtrl'
            })
        $routeProvider.otherwise({
            redirectTo: '/main'
        });
    }
])
    .filter('t', ['$i18next',
        function(i18next) {
            return function(input) {
                return i18next(input);
            }
        }
    ]);


angular.module('jm.i18next')
    .config(['$i18nextProvider',
        function($i18nextProvider) {
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
        }
    ]);

angular.module('mtr4hk')
    .controller('MainCtrl', ['$scope',
        function($scope) {

        }
    ])

.controller('XRailCtrl', ['$scope',
    function($scope) {

    }
])

.controller('FinanceCtrl', ['$scope',
    function($scope) {

    }
])
    .controller('OrgCtrl', ['$scope',
        function($scope) {

        }
    ])

.controller('PriceCtrl', ['$scope',
    function($scope) {

    }
])
    .controller('StabilityCtrl', ['$scope',
        function($scope) {

        }
    ])
    .controller('CapacityCtrl', ['$scope', '$http','$timeout','$location',
        function($scope, $http,$timeout,$location) {
            $scope.initLoadFactorChart = function() {
                $http.get($location.host()+':8020/loadfactor').then(function(data) {
                    $scope.loadfactorData = data.data;

                })
            };
            // $scope.showWarning = (type === 'danger' || type === 'warning');

            // $scope.dynamic = value;
            // $scope.type = type;

            var _init = function() {
                $scope.initLoadFactorChart();
                $scope.mode = '4Mode';


            $timeout(function() {
                console.log('timeout');
                $scope.mode = '6Mode';
            },3000)
            };
            _init();
            $scope.toggleMode = function(mode) {
                $scope.mode = mode;
            };

            

        }
    ])
    .controller('railCapCtrl', ['$scope',
        function($scope) {
            $scope.loadFactor = 0;
            function _init() {
                $scope.railwayClass = _checkRailwayClass($scope.aRail.railway);
            };
            _init();


            function _checkRailwayClass(railway) {

                var railwayMap = {
                    "東鐵綫":"railway-east",
                 "西鐵綫":"railway-west",
                    "馬鞍山綫":"railway-maonshan",
                    "將軍澳綫":"railway-tko",
                    "港島綫":"railway-hki",
                    "觀塘綫":"railway-kwuntong",
                    "荃灣綫":"railway-tw",
                    "迪士尼綫":"railway-disney"
                }
                return railwayMap[railway];

            };
            function _checkType(value) {

                var type;

                if (value < 0.8) {
                    type = 'success';
                } else if (value < 0.9) {
                    type = 'warning';
                } else if (value > 1) {
                    type = 'danger';
                } else {
                    type = 'danger';
                }

                return type;
            };

            $scope.$watch('mode', function(newVal) {
                if (newVal === '4Mode') {
                    $scope.loadFactor = $scope.aRail.currentLoadFactor4;
                    $scope.loadType = _checkType($scope.aRail.currentLoadFactor4);

 // $scope.capType = _checkType($scope.aRail.currentCap/$scope.aRail.maxCap);
                } else {
                    $scope.loadFactor = $scope.aRail.currentLoadFactor6;
                    $scope.loadType = _checkType($scope.aRail.currentLoadFactor6);
                }

            })

            // value = aRail.h * 100; designCap = aRail.designCap; actualCap = aRail.c
        }
    ])

.controller('ApiCtrl', ['$scope',
    function($scope) {}
])
    .controller('OthersCtrl', ['$scope',
        function($scope) {

        }
    ]);