'use strict';

angular.module('guava.services', [])
.factory('Requests', ['$http', function($http){

	var request = function(req){
		return $http(req);
	};

	var getRequest = function(url, params){
		return request({method:'GET', url:url, params:params});
	};

	var postRequest = function(url, data, params){
		return request({method:'POST', url:url, data:data, params:params});
	};

	var deleteRequest = function(url, params){
		return request({method:'DELETE', url:url, params:params});
	};

	var patchRequest = function(url, data, params){
		return request({method:'PATCH', url:url, data:data, params:params});
	};

	return {
		get: getRequest,
		post: postRequest,
		del: deleteRequest,
		patch: patchRequest
	};
}])
.factory('GuavaAPI', ['$http', 'Requests', function($http, Requests) {

	// Url that points to the api server

	var baseUrl = 'http://localhost:5000';

	// Helper methods for communicating with the api server
	// Makes use of general http requests via the Requests service 
	// located in js/services.js:factory('Requests')    

	// TODO: If a user is logged in, every reqeust function should 
	// send at least one url param: access_token 

	var get = function(url, params){
		return Requests.get(baseUrl + url, params);
	};
	var post = function(url, data, params){
		return Requests.post(baseUrl + url, data, params);
	};
	var del = function(url, params){
		return Requests.del(baseUrl + url, params);
	};
	var patch = function(url, data, params){
		return Requests.patch(baseUrl + url, data, params);
	};


	// Methods for login/logout and creating new users

    var login = function(email, password) {
        return post('/auth/email', {
            'email': email,
            'password': password
        });
    };

    var getPatients = function(accessToken) {
    	return get('/patients', {access_token: accessToken})
    }

    var loadTable = function(accessToken, pid, page) {
    	return post('/patient/' + pid, {}, {access_token: accessToken, page: page})
    }

	return {
		login: login,
		getPatients: getPatients,
		loadTable: loadTable
	};

}])