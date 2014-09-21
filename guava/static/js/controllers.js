

angular.module('guava.controllers', [])
	.controller('AppCtrl', ['$scope', 'GuavaAPI', function($scope, GuavaAPI) {

		$scope.patients = []

		$scope.init = function(accessToken){
			$scope.accessToken = accessToken;

			GuavaAPI.getPatients(accessToken).then(function(resp){
				$scope.patients = resp.data.data
			}, function(resp){ console.log(resp)});
		}


		$scope.currentPatient = null;
		$scope.table = null;
		$scope.page = 1;

		$scope.setCurrentPatient = function(patient){
			$scope.currentPatient = patient;
			$scope.page = 1;
			GuavaAPI.loadTable($scope.accessToken, patient._id, $scope.page).then(function(res){
				$scope.table = res.data.results;
			})
		}

		$scope.pageLeft = function(){
			if ($scope.page > 1){
				$scope.page -= 1;
				GuavaAPI.loadTable($scope.accessToken, $scope.currentPatient._id, $scope.page).then(function(res){
					$scope.table = res.data.results;
				})
			}
		}

		$scope.pageRight = function(){
			$scope.page += 1;
			GuavaAPI.loadTable($scope.accessToken, $scope.currentPatient._id, $scope.page).then(function(res){
				$scope.table = res.data.results;
			})
			
		}

		

	}])
	.controller('VCFCtrl', ['$scope', '$http', function($scope, $http) {

		$scope.upload = function(){
			console.log('UPLOADING');
			var fd = new FormData();
			fd.append('file', $scope.vcfFile);
			fd.append('sampleId', $scope.sampleId);
			$http.post('http://localhost:5000/patient?access_token=' + $scope.accessToken,
				fd, {
					transform: angular.identity,
					headers: {'Content-Type': undefined}
				})
				.success(function(res){
					console.log('success');
					console.log(res);
				}).error(function(res){
					console.log('success');
					console.log(res);
				});
		}
	}])