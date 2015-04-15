(function() {
  'use strict';

  var angular = require('angular');
  var angularAnimate = require('angular-animate');
  var angularTouch = require('angular-touch');

  var config = {
    unit: {
     question: 'Will you buy the Apple Watch?',
     choices: {
       a: 'Yes',
       b: 'No',
       c: 'Maybe'
     }
    }
  };

  angular.module('qriouslyApp', ['ngTouch', 'ngAnimate'])
  .controller('UnitController', ['$scope', '$http', function($scope, $http){

    $scope.unit = config.unit;

    $scope.engageQuestion = function() {
      $scope.hideQuestion = true;
      $scope.showMultipleChoice = true
    };

    $scope.castVote = function(vote) {
      $http.get('js/data/results.json').success(function(data, status, headers, config) {
        $scope.results = data;

        var totalVotes = 0;
        for(var key in $scope.results) {
          totalVotes += $scope.results[key];
        }
        totalVotes++;
        data[vote]++;

        $scope.totalVotes = totalVotes;
        $scope.showResults = true;
        $scope.showMultipleChoice = false;
      }).error(function(data, status, headers, config) {
        console.log("Error loading results.json!");
      });
    };
  }])
  .directive('adUnit', function(){
    return {
      restrict: 'E',
      templateUrl: 'unit.html',
      controller: 'UnitController',
      controllerAs: 'unit'
    }
  });
})();
