(function () {
    "use strict";
    var apiApp = angular.module("apiApp", ['datatables']);
    apiApp.directive('integer', function () {
        return {
            require: 'ngModel',
            link: function (scope, ele, attr, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    return parseInt(viewValue, 10);
                });
            }
        };
    });
    apiApp.controller("apiCtrl", ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder',
        function ($scope, $http, DTOptionsBuilder, DTColumnBuilder) {
            var url = 'http://api.abscission.net/api/alliances';
            $scope.dtOptions = DTOptionsBuilder.fromSource(url).withPaginationType('full_numbers')
                .withBootstrap()
                .withBootstrapOptions({ColVis:{classes:{masterButton:'btn btn-primary'}}})
                .withColReorder()
                .withColVis();
            
            var nc = function (name, alias) {return DTColumnBuilder.newColumn(name).withTitle((alias !== undefined) ? alias : name).withOption('defaultContent', ''); };
            
            $scope.dtColumns = [
                nc('Name'),
                nc('TotalGDP', 'Total GDP'),
                nc('AverageGDP', 'Average GDP'),
                nc('TotalTroops', 'Total Troops'),
                nc('AverageTroops', 'Average Troops'),
                nc('TotalUranium', 'Uranium')
            ];
        }
        ]);
}());