angular.module('timestampApp', ['ngTouch'])
  .controller('TimestampController', ['$scope', '$interval', function($scope, $interval) {
        $scope.labels = [
                { tag: 'primary', title: 'Video error' },
                { tag: 'danger', title: 'Audio error' }, 
                { tag: 'success', title: 'Captioning' }, 
                { tag: 'info', title: '' }, 
                { tag: 'warning', title: '' }, 
                { tag: 'default', title: '' }, 
        ];
        
        $scope.frameRates = [
            { title: 'None', rate: 0.0 },
            { title: '29.97df', rate: 29.97 },
            { title: '25', rate: 25.0 },
            { title: '24', rate: 24.0 },
            { title: '23.97', rate: 23.97 },
        ];
        
        $scope.selectedFrameRate = $scope.frameRates[0];
              
        $scope.running = false;
        $scope.startTime = Date.now();
        
        $scope.currentTime = 0;
        $scope.timestamps = [];
        $scope.time = '00:00:00';
        $scope.frameNumber = '';
        
        $scope.start = function() {
            $scope.startTime = Date.now();
            $scope.running = true;
        }
        
        $scope.stop = function() {
            $scope.running = false;
        }
        
        $scope.changeTime = function() {
            if ($scope.rawtime) {
                $scope.time = $scope.rawtime;
                $scope.currentTime = textToMs($scope.rawtime);
            }
        };
                
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
        
        $scope.addTimestamp = function (label) {
            var time = $scope.currentTime;
            
            var c = 'label label-' + label['tag'];
            
            this.timestamps.push({ time: time, timeText: msToText(time), class: c, frameNumber : $scope.frameNumber, description: label['title'] });
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
                
                if ($scope.selectedFrameRate.rate > 0) {
                    var seconds = $scope.currentTime / 1000;
                    var frameNumber = seconds * $scope.selectedFrameRate.rate;
                    
                    // Round to 2 decimal places
                    frameNumber = Math.round(frameNumber * 100) / 100;
                    
                    $scope.frameNumber = frameNumber;
                }
            }
        }, 250);
  }]);