(function () {
    "use strict";
    var apiApp = angular.module("apiApp", ['angular-loading-bar']);
    apiApp.controller("apiCtrl", ['$scope', '$http', function ($scope, $http) {
        function getTargets() {
            var url = "http://api.abscission.net/api/nations/?Count=100&Neighbouring=" + $scope.nation["Region"] + "&GDP Bracket=" + $scope.nation["Gross Domestic Product"] + '&';
            if ($scope.ar === true) {
                url += "SLUT&";
            }
            if ($scope.hasOwnProperty("Alliance")) {
                url += "Alliance=" + $scope.Alliance + '&';
            }
            $http({method: 'GET', url: url}).success(function (data, status, headers, config) {
                $scope.nations = data;
            });
        }
        function getPlayer() {
            var url = "http://api.abscission.net/api/nations/?Count=1";
            if ($scope.Name !== null) {
                url += "&Name=" + $scope.Name;
            }
            $http({method: 'GET', url: url}).success(function (data, status, headers, config) {
                if (data.length > 0) {
                    $scope.nation = data[0];
                    getTargets();
                }
            });
        }
        $scope.$watch("Name", getPlayer);
        $scope.$watch("alliancerules", getPlayer);
        $scope.$watch("Alliance", getPlayer);
    }]);
}());