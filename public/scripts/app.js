'use strict';


// Declare app level module which depends on filters, and services
angular.module('mtr4hk', [
    'ngRoute',
    'ngAnimate',
    'jm.i18next',
    'ui.bootstrap',
    'leaflet-directive'
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
            .when('/xrail-progress', {
                templateUrl: 'templates/xrail-progress.html',
                controller: 'XRailProgressCtrl'
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
.factory('_',function() {
    return window._;
})
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

.controller('XRailProgressCtrl', ['$scope', '$timeout', '$http','_',
    function($scope, $timeout, $http,_) {
        console.log('XRailProgressCtrl');
        // var app = angular.module("demoapp", ['leaflet-directive']);
        //      app.controller("DemoController", [ "$scope", function($scope) {
        //          // Nothing here!
        //      }]);

        $scope.westKowloon = {
            lat: 22.3534757,
            lng: 114.25028460,
            zoom: 12
        };

        var promise = Q($http.get('https://spreadsheets.google.com/feeds/list/1qocahq0eRV-agNYccdofO2Sh35fx3ccKEYI5XniM7-s/0/public/values?alt=json')).then(function(data) {
            return data.data.feed.entry;
        });


        function _determinTimeWindow(time) {
            var timeWindows = {
                "1": {
                    start: 20100101,
                    end: 20100630
                },
                "2": {
                    start: 20100701,
                    end: 20101230
                },
                "3": {
                    start: 20110101,
                    end: 20110630
                },
                "4": {
                    start: 20110701,
                    end: 20111230
                },
                "5": {
                    start: 20110631,
                    end: 20120130
                },
                "6": {
                    start: 20110101,
                    end: 20110630
                },
                "7": {
                    start: 20110101,
                    end: 20110630
                },
                "8": {
                    start: 20110101,
                    end: 20110630
                }
            }
            var windowFound = _.find(timeWindows, function(timeWindow) {
                return time > timeWindow.start && time < timeWindow.end;
            })
            return windowFound;
        }


        promise.then(function(entries) {
            console.log(entries);
            var events = entries.map(function(entry) {
                console.log(entry);

            var time = 2000000;
                var windowFound = _determinTimeWindow(time)


                return {
                    contract: entry.gsx$modulecontract.$t,
                    location: entry.gsx$locaiton.$t,
                    lat: entry.gsx$lat.$t,
                    lng: entry.gsx$lng.$t,
                    time:time,
                    timeWindow:windowFound
                }
            })
            console.log(events);
            return events;
        }).fail(function(err) {
            console.log(err);
        });

        $scope.markerBuckets = {
            "201306to201312": {
                nanChang: {
                    lat: 22.326734,
                    lng: 114.153599,
                    message: "I want to travel here!",
                    focus: true,
                    draggable: false
                },
                terminus: {
                    lat: 22.304983,
                    lng: 114.161912,
                    message: "Terminus",
                    focus: true,
                    draggable: false
                }
            },
            "201301to201306": {
                nanChang: {
                    lat: 22.336734,
                    lng: 114.253599,
                    message: "I want to travel here!",
                    focus: true,
                    draggable: false
                },
                terminus: {
                    lat: 22.314983,
                    lng: 114.261912,
                    message: "Terminus",
                    focus: true,
                    draggable: false
                }
            }

        };

        $scope.markers2nd = {

        }


        $scope.markers = $scope.markers1st;

        $timeout(function() {
            $scope.markers = $scope.markers2nd;
        }, 2000)


        $scope.layers = {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    type: 'xyz',
                    url: 'http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png',
                    layerOptions: {
                        subdomains: ['a', 'b', 'c'],
                        attribution: '© OpenStreetMap contributors',
                        continuousWorld: true
                    }
                }
            }
        }
        //lazy this module?   



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
    .controller('CapacityCtrl', ['$scope', '$http', '$timeout', '$location',
        function($scope, $http, $timeout, $location) {
            $scope.initLoadFactorChart = function() {
                $http.get('http://mtr-api.dev.code4.hk/loadfactor').then(function(data) {
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
                }, 3000)
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
                    "東鐵綫": "railway-east",
                    "西鐵綫": "railway-west",
                    "馬鞍山綫": "railway-maonshan",
                    "將軍澳綫": "railway-tko",
                    "港島綫": "railway-hki",
                    "觀塘綫": "railway-kwuntong",
                    "荃灣綫": "railway-tw",
                    "迪士尼綫": "railway-disney"
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