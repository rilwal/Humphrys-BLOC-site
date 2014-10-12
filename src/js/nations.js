(function () {
    "use strict";
    var apiApp = angular.module("apiApp", ['datatables', 'angular-loadidata-ng-bar']);
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
            var url = 'http://api.abscission.net/api/nations?Count=9999';
            $scope.dtOptions = DTOptionsBuilder.fromSource(url).withPaginationType('full_numbers')
                .withBootstrap()
                .withBootstrapOptions({ColVis:{classes:{masterButton:'btn btn-primary'}}})
                .withColReorder()
                .withColVis();
            
            var nc = function (name, alias) {return DTColumnBuilder.newColumn(name).withTitle((alias !== undefined) ? alias : name).withOption('defaultContent', ''); };
            $scope.dtColumns = [
                nc('_id', 'ID'),
                nc('Nation'),
                nc('Leader'),
                nc('Gross Domestic Product', 'GDP'),
                nc('Industry'),
                nc('Uranium'),
                nc('Reactor', 'Reactor Progress'),
                nc('Growth'),
                nc('Army Size'),
                nc('Equipment'),
                nc('Manpower'),
                nc('Training'),
                nc('Airforce'),
                nc('Economic System'),
                nc('Foreign Investment'),
                nc('Political System'),
                nc('Raw Material Production'),
                nc('Discovered Oil Reserves'),
                nc('Oil Production'),
                nc('Alliance'),
                nc('Official Alignment'),
                nc('Region'),
                nc('Reputation'),
                nc('Territory'),
                nc('Stability'),
                nc('Rebel Threat'),
                nc('Donator'),
                nc('Last Online')
            ];
        }
        ]);
}());