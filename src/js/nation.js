(function () {
    "use strict";

    var apiApp = angular.module("apiApp", []);
    apiApp.controller("apiCtrl", ['$scope', '$http',
        function ($scope, $http) {

            function getPlayer() {
                var url = "http://api.abscission.net/api/nations/?Count=1&Order=1&Sort=_id";
                if ($scope.Name !== undefined) {
                    url += "&Name=" + $scope.Name;
                }
                $http({
                    method: 'GET',
                    url: url
                }).success(function (data, status, headers, config) {
                    $scope.nation = data[0];
                });
            }
            $scope.$watch("Name", function () {
                getPlayer();
            });
            getPlayer();
        }]);
}());