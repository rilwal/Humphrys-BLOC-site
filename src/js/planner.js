/*jslint plusplus: true */
$(function () {
    "use strict";
    $("[data-toggle='tooltip']").tooltip();
    $("[data-toggle='popover']").popover({
        container: 'body'
    });
    $(".alert").alert();
});

(function () {
    "use strict";

    var blocApp = angular.module('blocApp', []);

    blocApp.directive('integer', function () {
        return {
            require: 'ngModel',
            link: function (scope, ele, attr, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    return parseInt(viewValue, 10);
                });
            }
        };
    });

    blocApp.controller('plannerCtrl', ['$scope', function ($scope) {
        var i, j;
        
        function getPlayer() {
            var url = "http://api.abscission.net/api/nations/?Count=1";
            if ($scope.nation !== null) {
                url += "&Nation=" + $scope.nation;
            }
            $http({method: 'GET', url: url}).success(function (data, status, headers, config) {
                $scope.apiNation = data[0];
            });
        }
        
        $scope.tempSchedule = {
            "frequency": 1,
            "timesperturn": 1,
            "intervals": 1,
            "startTurn": 1,
            "endTurn": 10
        };
        $scope.Turns = 10;
        $scope.turns = [{
            "turn": 0,
            "GDP": 300,
            "growth": 10,
            "stability": 1,
            "troops": 10,
            "factories": 0,
            "money": 1000,
            "rm": 30,
            "oil": 20,
            "mines": 2,
            "wells": 0,
            "weapons": 50,
            "numActions": 0,
            "actions": []
        }];
        $scope.currentTurn = 0;

        function updateTurns(startTurn) {
            for (i = startTurn; i < $scope.Turns - startTurn + 2; i++) {
                $scope.turns[i] = {};
            }
            for (i = startTurn; i < $scope.Turns - startTurn + 2; i++) {
                var lastTurn = $scope.turns[i - 1];
                
                var actions = $scope.turns[i].actions;
                var numActions = $scope.turns[i].numActions;
                
                $scope.turns[i] = angular.copy(lastTurn);
                $scope.turns[i].turn = i;
                $scope.turns[i].growth += parseInt(Number(lastTurn.stability) + Number(lastTurn.factories) - Math.floor(Number(lastTurn.troops) / 20) - Math.floor(Math.pow(((Number(lastTurn.growth) / 20) - 1), 2)), 10);
                $scope.turns[i].GDP += parseInt(lastTurn.growth, 10);
                $scope.turns[i].money += Math.floor(lastTurn.GDP / 72) * 72;
                $scope.turns[i].oil += lastTurn.wells;
                $scope.turns[i].rm += lastTurn.mines;
                $scope.turns[i].actions = actions === null ? [] : actions;
                $scope.turns[i].numActions = numActions === null ? 0 : numActions;
                
                for (j = 0; j < $scope.turns[i].numActions; j++) {
                    $scope.doAction($scope.turns[i].actions[j]);
                }
            }
            $scope.turns.length = $scope.Turns;
        }

        $scope.showActions = function (n) {
            $scope.currentTurn = n;
            $('#schedule').modal();

        };

        $scope.removeAction = function (n) {
            $scope.turns[$scope.currentTurn].actions.splice(n, 1);
            $scope.turns[$scope.currentTurn].numActions--;
        };

        updateTurns(1);

        $scope.$watch("Turns", function () {
            updateTurns(1);
        });

        ["GDP", "growth", "stability", "troops", "factories", "money", "rm", "oil", "mines", "wells", "weapons"].forEach(function (e, i, a) {
            $scope.$watch("turns[0]." + e, function () {
                updateTurns(1);
            });
        });

        $scope.createAction = function (action) {

            switch (parseInt(action.frequency, 10)) {
                case 1:
                    var a = {
                        "name": "example",
                        "description": "also an example",
                        "type": 1
                    }
                    $scope.turns[parseInt(action.startTurn)].actions.push(a);
                    $scope.turns[parseInt(action.startTurn)].numActions++;
                    break;
                case 2:
                    //Once per turn
                    
                    break;
                case 3:
                    // n times per turn
                    break;
                case 4:
                    //n times every n turns
                    break;
            }
        }

        $scope.doAction = function(action) {
            //Do an action
            switch (action.type) {
                case 1:
                    alert("Processing a test action");
                    break;
            }
        };
    }]);
}());
