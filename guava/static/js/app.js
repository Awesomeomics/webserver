

angular.module('guavaApp', [
	'guava.controllers',
	'guava.services',
	'guava.directives'
], function($locationProvider){
	$locationProvider.html5Mode(true);
});