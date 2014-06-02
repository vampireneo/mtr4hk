'use strict';
// Declare app level module which depends on filters, and services
angular.module('mtr4hk', [
    'ngRoute',
    'ngAnimate',
    'jm.i18next',
    'ui.bootstrap',
    'ui.bootstrap.tooltip',
    'leaflet-directive',
    'vr.directives.slider',
    'nvd3ChartDirectives',
    'angular-intro',
    'cgBusy'
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
    .factory('_', function() {
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

.controller('XRailProgressCtrl', ['$scope', '$timeout', '$http', '_', '$interpolate', '$sce',
    function($scope, $timeout, $http, _, $interpolate, $sce) {
        console.log('XRailProgressCtrl');

        //perhaps show only when intro.js done
        $scope.loadingConfig = {
            message: 'Loading...',
            backdrop: false,
            promise: null,
            delay: 300,
            minDuration: 700
        };
        $scope.IntroOptions = {
            steps: [{
                element: '#title-container',
                intro: "高鐵延誤事件，你了解多少？",
                position: 'top'
            }, {
                element: '#title-container',
                intro: "廣深港高速鐵路 花費超過六百億的高鐵工程是香港歷來最昂貴、最龐大的鐵路工程。<br />原定2015年完工，現在估計通車將延至2017年，市民更可能需要額外承擔延誤帶來的支出。到底超支多少、延誤責任誰屬，本網站搜羅各方資料拼成互動時序，以促進理性討論。<br />",
                position: 'top'
            }, {
                element: '#slider-container',
                intro: "移動時間軸",
                position: 'top'
            }, {
                element: '.date-container',
                intro: "顥示時間相關資料",
                position: 'top'
            }, {
                element: '#map',
                intro: "地圖顥示當時各工程進度",
                position: 'bottom'
            }, {
                element: '.charts',
                intro: "圖表顯示當時工程進度及支出",
                position: 'left'
            }, {
                element: '.general-info',
                intro: "顯示當時工程總進度",
                position: 'left'
            }],
            showStepNumbers: false,
            exitOnOverlayClick: true,
            showBullets: false,
            exitOnEsc: true,
            nextLabel: '<strong>NEXT</strong>',
            prevLabel: '<span style="color:green">Previous</span>',
            skipLabel: 'OK',
            doneLabel: 'OK'
        };


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


        var timeWindows = {
            "0": { //others
                start: -1,
                end: -1
            },
            "1": {
                start: 20100101,
                end: 20100630
            },
            "2": {
                start: 20100701,
                end: 20101231
            },
            "3": {
                start: 20110101,
                end: 20110630
            },
            "4": {
                start: 20110701,
                end: 20111231
            },
            "5": {
                start: 20120101,
                end: 20120630
            },
            "6": {
                start: 20120701,
                end: 20121231
            },
            "7": {
                start: 20130101,
                end: 20130630
            },
            "8": {
                start: 20130701,
                end: 20131231
            },
            "9": {
                start: 20140101,
                end: 20140701
            }
        };

        /**
         *  Input time is MM/DD/YYYY
         **/
        $scope.determineTimeWindow = function(timestamp) {

            _.each(timeWindows, function(timeWindow, key) {
                timeWindow.key = key;
                return timeWindow;
            });



            var windowFound = _.find(timeWindows, function(timeWindow) {
                var windowStartTs = moment(timeWindow.start, "YYYYMMDD").format("X");
                var windowEndTs = moment(timeWindow.end, "YYYYMMDD").format("X");
                return timestamp >= windowStartTs && timestamp <= windowEndTs;
            })
            return windowFound;
        }

        $scope.railWayGeoJSON = {};

        $scope.railWayGeoJSON.style = {
            // fillColor: getColor($scope.countries[feature.id]),
            weight: 8,
            opacity: 1,
            color: '#f86767',
            // dashArray: '3',
            fillOpacity: 0.7
        };

        $scope.railWayGeoJSON.data = {
            "features": [
                // {"geometry":{"coordinates":[114.056533,22.538392],"type":"Point"},"properties":{"description":"https://zh.wikipedia.org/zh-hk/%E7%A6%8F%E7%94%B0%E7%AB%99","id":"marker-hvkxcpyl0","marker-color":"#1087bf","marker-size":"medium","marker-symbol":"","title":"福田站"},"type":"Feature"}
                // ,{"geometry":{"coordinates":[114.07213769999998,22.4282899],"type":"Point"},"properties":{"description":"","id":"marker-hvkxfuuw1","marker-color":"#1087bf","marker-size":"medium","marker-symbol":"","title":"石崗"},"type":"Feature"},
                {
                    "geometry": {
                        "coordinates": [
                            [114.05645370483398, 22.537768878943577],
                            [114.0574836730957, 22.50510349164863],
                            [114.07190322875977, 22.426103847270774],
                            [114.11833763122559, 22.37928564733928],
                            [114.12357330322266, 22.36484024166245],
                            [114.16434288024902, 22.31601638597883],
                            [114.16468620300293, 22.30474080695656]
                        ],
                        "type": "LineString"
                    },
                    "properties": {
                        "description": "",
                        "id": "marker-hvkxhh3h3",
                        "stroke": "#f86767",
                        "stroke-opacity": 1,
                        "stroke-width": 8,
                        "title": "Railway"
                    },
                    "type": "Feature"
                }
                // {"geometry":{"coordinates":[114.16425704956055,22.304026126900116],"type":"Point"},"properties":{"description":"","id":"marker-hvkxptch7","marker-color":"#1087bf","marker-size":"medium","marker-symbol":"","title":"西九龍總站"},"type":"Feature"}
            ],
            "id": "vincentlaucy.ib05kcn9",
            "type": "FeatureCollection"
        };

        promise.then(function(entries) {
            console.log(entries);
            var events = entries.map(function(entry) {
                console.log(entry);

                var time = entry.gsx$datadatemmddyyyy.$t;
                var timestamp = moment(time, "MM/DD/YYYY").format('X');
                var windowFound = $scope.determineTimeWindow(timestamp);

                var contract = null;
                if (entry.gsx$modulecontract.$t !== '#N/A') {
                    contract = entry.gsx$modulecontract.$t;
                }
                var contractName = null;
                if (entry.gsx$modulename.$t !== '#N/A') {
                    contractName = entry.gsx$modulename.$t;
                }

                return {
                    id: entry.id.$t,
                    contract: contract,
                    contractName: contractName,
                    location: entry.gsx$location.$t,
                    lat: entry.gsx$lat.$t,
                    lng: entry.gsx$lng.$t,
                    message: entry.gsx$event.$t,
                    time: time,
                    timeWindow: windowFound ? windowFound.key : 0,
                    source: entry.gsx$source.$t,
                    sourceLink: entry.gsx$sourcelink.$t,
                    isDelay: entry.gsx$delay.$t === 'Y'
                }
            })
            console.log(events);
            updateDisplayedStuff($scope.chosenTimeWindow);
            $scope.events = events;
            return events;
        }).fail(function(err) {
            console.log(err);
        });
        $scope.value = 1288323623;

        $scope.$watch('value', function(newVal) {
            var timeWindow = $scope.determineTimeWindow(newVal);
            $scope.chosenTimeWindow = timeWindow ? timeWindow.key : 0;
        })

        //pre sort into buckets by time window

        $scope.markerBuckets = {};
        $scope.overallEventBuckets = {};
        _.each(timeWindows, function(timeWindow, key) {
            $scope.markerBuckets[key] = {};
            $scope.overallEventBuckets[key] = [];
        })
        $scope.$watch('events', function(newVal) {

            var sourceTagWithLinkTemplate = '<small><a target="_blank" href="{{sourceLink}}">資料：{{source}}</a></small>';
            var sourceTagTemplate = '<small>資料：{{source}}</small>';
            var markerMessageTemplate = '<h6><b>{{contract}} {{contractName}}</b><span class="pull-right">{{date}}</span></h6><div>{{message}} <div> {{sourceTag}}</div></div>';

            function _getMessage(event) {
                var sourceTag = $sce.trustAsHtml(_getSource(event));
                return $interpolate(markerMessageTemplate)({
                    date: event.time,
                    contract: event.contract,
                    contractName: event.contractName,
                    message: event.message,
                    sourceTag: sourceTag
                });
            }

            function _getSource(event) {
                var sourceTag = '';
                if (event.source) {
                    if (event.sourceLink) {
                        sourceTag = $interpolate(sourceTagWithLinkTemplate)({
                            source: event.source,
                            sourceLink: event.sourceLink
                        });
                    } else {
                        sourceTag = $interpolate(sourceTagTemplate)({
                            source: event.source
                        });
                    }
                }
                return sourceTag;
            }

            _.each($scope.events, function(event) {

                var checkIfShowMarker = function(marker) {
                    if (!marker.lat || !marker.lng) {
                        return false;
                    }
                    if (Math.abs(marker.lat) - 22 > 10 || Math.abs(marker.lng) - 114 > 10) {
                        return false; //too far away, sth wrong
                    }
                    return true;
                };

                if (event.location !== '#N/A' && event.location !== '' && event.message !== '') {


                    var marker = {
                        lat: event.lat !== "" ? parseFloat(event.lat) : 0,
                        lng: event.lng !== "" ? parseFloat(event.lng) : 0,
                        message: _getMessage(event),
                        focus: true,
                        draggable: false,
                        // fa-road,legal,gear
                        icon: {
                            type: 'awesomeMarker',
                            icon: 'road',
                            prefix: 'fa',
                            markerColor: event.isDelay ? 'red' : 'darkblue'
                        }
                    };
                    //TODO use eng location name as key
                    var eventKey = event.id.substring(event.id.lastIndexOf('/') + 1);
                    if (checkIfShowMarker(marker)) {
                        $scope.markerBuckets[event.timeWindow][eventKey] = marker;
                    }

                } else {
                    if (event.contract && event.message !== '') {
                        event.sourceTag = $sce.trustAsHtml(_getSource(event));
                        console.log('missed event');
                        console.log(event);
                        $scope.overallEventBuckets[event.timeWindow].push(event);
                    }
                    //visualize in info bucket
                }


                console.log($scope.markerBuckets);

            });

        });

        $scope.displayedMarkers = {};

        $scope.expenseChartData = {};
        $scope.emergencyData = {};
        $scope.claimData = {};
        $scope.claimCountData = {};

        $scope.expenseDataBuckets = {};
                $scope.claimDataBuckets = {};

        function updateDisplayedStuff(newTimeWindow) {
            $scope.displayedMarkers = $scope.markerBuckets[newTimeWindow];
            $scope.displayedOverall = $scope.overallEventBuckets[newTimeWindow];
            $scope.displayExpenseData = $scope.expenseDataBuckets[newTimeWindow];

            if (!$scope.displayedMarkers || !$scope.displayedOverall || !$scope.displayExpenseData) {
                return;
            }

            function getExpenseTotal(newTimeWindow) {
                return $scope.expenseDataBuckets[newTimeWindow - 1] ? $scope.expenseDataBuckets[newTimeWindow - 1].expenseTotal : 0;
            }

            $scope.expenseChartData = {
                "title": "累計開支",
                "subtitle": "(億)",
                "ranges": [0, getExpenseTotal(newTimeWindow), $scope.displayExpenseData.awardedTotal],
                "measures": [$scope.displayExpenseData.expenseTotal],
                "markers": [$scope.displayExpenseData.expenseTotal]
            };

            $scope.emergencyData = {
                "title": "應急餘額",
                "subtitle": "(百萬)",
                "ranges": [0, 891, 3194],
                "measures": [220],
                "markers": [180]
            };
            console.log($scope.claimDataBuckets[newTimeWindow]);
            $scope.claimData = {
                "title": "申索金額",
                "subtitle": "(待解決,百萬)",
                "ranges": [0, $scope.claimDataBuckets[newTimeWindow].expectedClaimSpending, $scope.claimDataBuckets[newTimeWindow].unresolvedClaimAmountTotal],
                "measures": [$scope.claimDataBuckets[newTimeWindow].expectedClaimSpending],
                "markers": [$scope.claimDataBuckets[newTimeWindow].expectedClaimSpending]
            };
            $scope.claimCountData = {
                "title": "申索數目",
                "subtitle": "",
                "ranges": [0, 891, 3194],
                "measures": [220],
                "markers": [180]
            };
        }


        $scope.$watch('chosenTimeWindow', function(newTimeWindow) {
            console.log('update displayed markers to ' + newTimeWindow);
            console.log($scope.displayedMarkers);
            updateDisplayedStuff(newTimeWindow);
        });


        var expensePromise = Q($http.get('https://spreadsheets.google.com/feeds/list/1qocahq0eRV-agNYccdofO2Sh35fx3ccKEYI5XniM7-s/203286289/public/values?alt=json')).then(function(data) {
            return data.data.feed.entry;
        });

        $scope.loadingConfig.promise = expensePromise;


        expensePromise.then(function(entries) {
            entries.splice(0, 12);
            console.log(entries);

            entries.map(function(entry) {
                var timestamp = moment(entry.gsx$_cn6ca.$t, "YYYYMMDD").format('X');
                var windowFound = $scope.determineTimeWindow(timestamp);
                console.log(windowFound);

                var HUNDRED_MILLION = 100000000;
                var MILLION = 1000000;

                $scope.expenseDataBuckets[windowFound.key] = {
                    timeWindow: windowFound,
                    awardedTotal: parseInt(entry.gsx$awardedtotal.$t) / HUNDRED_MILLION,
                    expenseTotal: parseInt(entry.gsx$aggexpensetotal.$t) / HUNDRED_MILLION
                };

                var unresolvedClaimAmountTotal  = parseInt(entry.gsx$unresolvedclaimamounttotal.$t) ;
                var resolvingClaimRate = 0.5287;
                $scope.claimDataBuckets[windowFound.key] = {
                    timeWindow: windowFound,
                    unresolvedClaimAmountTotal: unresolvedClaimAmountTotal? unresolvedClaimAmountTotal / MILLION : 0 ,
                    // unresolvedClaimBudget: parseInt(entry.gsx$awardedtotal.$t) / MILLION, 
                    expectedClaimSpending: unresolvedClaimAmountTotal? (unresolvedClaimAmountTotal * resolvingClaimRate  / MILLION ):0
                };


            });



            updateDisplayedStuff($scope.chosenTimeWindow);

            console.log($scope.expenseDataBuckets);
        })



        // 

        var expenseDataTooltipKey = {
            'Minimum': '累計開支',
            'Current': '累計開支',
            'Previous':'累計開支', //marker actually
            'Mean': '半年前',
            'Maximum': '批出合約總值'
        };

        var emergencyDataTooltipKey = {
            'Minimum': '',
            'Mean': '半年前',
            'Maximum': '批出合約總值'
        };
        var claimDataTooltipKey = {
            'Minimum': '',
            'Mean': '半年前',
            'Current': '申索發放預算',
            'Previous':'估計申索發放金額', //marker actually
            'Maximum': '待解決申索總值'
        };

        function _toolTipContentFunction(values) {
            //TODO last time period give exact date
            console.log(values);
            return function(key, x, y, e, graph) {
                return '<h6>' + values[x] + '</h6>' +
                    '<p>' + y + '</p>'
            }
        }

        $scope.emergencyDataTooltipContentFx = _toolTipContentFunction.bind(null, emergencyDataTooltipKey);
        $scope.expenseDataTooltipContentFx = _toolTipContentFunction.bind(null, expenseDataTooltipKey);
        $scope.claimDataTooltipContentFx = _toolTipContentFunction.bind(null, claimDataTooltipKey);


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


        // $scope.startIntro();


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