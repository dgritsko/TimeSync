angular.module('timestampApp', ['ngTouch'])
  .controller('TimestampController', ['$scope', '$interval', function($scope, $interval) {
        var typeInfo = {
            've' : { 'class' : 'label label-primary', 'title' : 'Video error' },
            'ae' : { 'class' : 'label label-danger', 'title' : 'Audio error' },
            'c' : { 'class' : 'label label-success', 'title' : 'Captioning' }
        }

        $scope.running = false;
        $scope.startTime = Date.now();
        
        $scope.currentTime = 0;
        $scope.timestamps = [];
        $scope.time = '00:00:00';
        
        $scope.start = function() {
            $scope.startTime = Date.now();
            $scope.running = true;
        }
        
        $scope.stop = function() {
            $scope.running = false;
        }
        
        $scope.setTime = function() {
            var rawTime = prompt("Enter the desired time in HH:MM:SS format:");
            if (rawTime) {
                $scope.currentTime = textToMs(rawTime);
                $scope.time = msToText($scope.currentTime);
            }
        }
        
        $scope.reset = function() {
            if (confirm('Are you sure?')) {
                $scope.timestamps = [];
                $scope.running = false;
                $scope.currentTime = 0;
                $scope.time = '00:00:00';
            }
        }
        
        $scope.removeTimestamp = function(timestamp) {
            var index = $scope.timestamps.indexOf(timestamp);
            if (index > -1) {
                $scope.timestamps.splice(index, 1);
            }
        };
        
        $scope.addTimestamp = function (type) {
            var time = $scope.currentTime;
            
            this.timestamps.push({ type: type, time: time, text: msToText(time), class: typeInfo[type]['class'] });
        }

        var padLeft = function(input, totalLength) {
          var curr = '' + input;
          return Array(totalLength + 1 - curr.length).join('0') + curr;
        };

        var msToText = function(ms) {
            var milliseconds = ms % 1000;    
            var seconds = ms / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            
            return padLeft(Math.floor(hours), 2) + ':' + padLeft(Math.floor(minutes % 60), 2) + ':' + padLeft(Math.floor(seconds % 60), 2);
        };

        var textToMs = function(text) {
            var parts = text.split(':');
            if (parts.length === 3) {
                var hours = parseInt(parts[0], 10) * 3600000;
                var minutes = parseInt(parts[1], 10) * 60000;
                var seconds = parseInt(parts[2], 10) * 1000;
                
                return hours + minutes + seconds;
            }
            
            return $scope.currentTime;
        };

        $interval(function() {
            if ($scope.running) {
                var now = Date.now()
                var elapsed = now - $scope.startTime;
                $scope.startTime = now;
                $scope.currentTime += elapsed;
                
                $scope.time = msToText($scope.currentTime);
            }
        }, 250);
  }]);