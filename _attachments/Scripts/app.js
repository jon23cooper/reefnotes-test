// app module
'use strict';
angular.module('reefcat',['ngResource']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/logs',{templateUrl:'partials/log-list.html', controller:LogListCtrl}).
			when('/logs/add',{templateUrl:'partials/log-add.html',controller:LogAddCtrl}).
			when('/logs/:logId', {templateUrl: 'partials/log-edit.html', controller:LogDetailCtrl}).
			when('/parameters',{templateUrl:'partials/parameter-list.html', controller: ParameterListCtrl}).
			when('/parameters/:parameterId', {templateUrl: 'partials/parameter-detail.html', controller: ParameterDetailCtrl}).
			otherwise({redirectTo:'/parameters'});
	}]);
	