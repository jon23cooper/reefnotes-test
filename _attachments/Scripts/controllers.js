// JavaScript Document
function ParameterListCtrl($scope, $http, $log, ParameterModel){
//paths
	//$scope.model=ParameterModel.query();
	$scope.form={
		type : "parameter",
	}
	
	$scope.url={
		host:window.location.host,
		webapp:"../../",
		views:"../../_design/parameters/_view/",
	};
	/*
	//parameter document object
	$scope.parameter_doc={
		type:"parameter",
	*/
	$scope.show=function(){
		$scope.model=ParameterModel.query();
		/*$http.get($scope.url.views + "all")
			.success(function(myparameters){
				$scope.parameter_rows=myparameters.rows;
			})
			.error(function(data, status, headers, config){
				$log.info(data, status, headers, config);
			});*/
	}
	
	//save form data as new document of type: parameter
  $scope.save=function(){
 	 //create a json object to hold the new parameter document data
 	 //must be of type parameter so set that.
 	 //name is supplied by the name text input on the form
	 /*
 	 $scope.parameter_doc.name=$scope.name;
	 $scope.parameter_doc.units=$scope.units;
	 $scope.parameter_doc.lowoceanlevel=$scope.lowoceanlevel;
	 $scope.parameter_doc.normaloceanlevel=$scope.normaloceanlevel;
	 $scope.parameter_doc.highoceanlevel=$scope.highoceanlevel;
	 $scope.parameter_doc.minimumtanklevel=$scope.minimumtanklevel;
	 $scope.parameter_doc.optimumtanklevel=$scope.optimumtanklevel;
	 $scope.parameter_doc.maximumtanklevel=$scope.maximumtanklevel;
	 $scope.parameter_doc.Notes=$scope.notes;
	 */
 	 //post the data to CouchDB
 	 $http.post($scope.url.webapp, $scope.form)
	 	.success(function(data, status, headers, config){
 		 // tell the user we've saved the data
		 $log.info("Parameter " + $scope.form.name + " added");
 		 $scope.message="Parameter " + $scope.form.name + " added";
		 $scope.model=ParameterModel.query()
 		 //$scope.show();
		$scope.clear();
 	 }).error(function(data, status, headers, config){
 		 $log.info(data, status, headers, config);
 	 });         
  };
	$scope.show();
	$scope.clear=function(){
		$scope.form={
			type : "parameter",
		};
		$scope.show();
		/*
		$scope.form.name="";
		$scope.form.units="";
		$scope.form.lowoceanlevel="";
		$scope.form.normaloceanlevel="";
		$scope.form.highoceanlevel="";
		$scope.form.minimumtanklevel="";
		$scope.form.optimumtanklevel="";
		$scope.form.maximumtanklevel="";
		$scope.form.notes="";
		*/
	}
}

function ParameterDetailCtrl($scope, $routeParams, $http, $location, $log) {
	var $parameter;
	
	$scope.parameterId = $routeParams.parameterId;
	$scope.form={};
//paths
	$scope.url={
		host:window.location.host,
		webapp:"../../",
		views:"../../_design/parameters/_view/",
	};
	//parameter document object
	$scope.parameter_doc={
		type:"parameter",
	};
	$scope.show=function(){
		//show sidebar contents
		$http.get($scope.url.views + "all").success(function(myparameters){
			$scope.parameter_rows=myparameters.rows;
		});
		//show selected parameter
		$http.get($scope.url.views + 'all?key="' + $scope.parameterId + '"')
		.success(function(data){
			$parameter=data.rows[0].value;
			$scope.form=angular.copy($parameter);			
		})
  		.error(function(data, status, headers, config){
			//path no longer exists
    		$log.info(data, status, headers, config);
			
  		});
	};
	$scope.show();
	
	
  $scope.cancel=function(){
	  $scope.form=angular.copy($parameter);
  }
  $scope.update=function(){
		 //PUT the amended parameter to the database
		 
		 $http.put($scope.url.webapp + $scope.form._id, $scope.form).success(function(data,status, headers, config){
			 //update sidebar list of elements and 
			 //create deep copy of new details to go back to if further changes are made and then cancel is pressed
			 $scope.show();
		 }).error(function(data, status, headers, config){
			 //failed so log it and inform user
			 $log.info(data);
			 $log.info($scope.parameter_doc);
			 $scope.message=data;
		 });
	 
  }
  $scope.delete=function(){
	  $http.delete($scope.url.webapp + $scope.form._id + "?rev=" + $scope.form._rev)
	  .success(function(data, status, headers, config){
			 //update the list
			 $location.path('parameters');
			 $scope.show();
		 }).error(function(data, status, headers, config){
			 $log.info(data, status, headers, config);
		 });
  };

}

function LogListCtrl($scope, $routeParams, $http, $location, $log, $resource){
	$scope.url={
		host:window.location.host,
		webapp:"../../",
		views:"../../_design/logs/_view/",
	};
	//parameter document object
	$scope.parameter_doc={
		type:"log",
	};
	$scope.show=function(){
		$http.get($scope.url.views + "all").success(function(mylogs){
			$scope.log_rows=mylogs.rows;
		})
		.error(function(data, status, headers, config){
			$log.info(data, status, headers, config);
		});
	}
	$scope.delete=function(row){
		$log.info(row);	
		 $http.delete($scope.url.webapp + row.key + "?rev=" + row.value._rev)
		 .success(function(){$scope.show();})
		 .error(function(data, status, headers, config){
			 $log.info(data, status, headers, config);
		});
	}
	$scope.edit=function(row){
		$log.info();
		$location.path('logs/' + row.value._id);
	}
	$scope.show();
  
}

function LogAddCtrl($scope, $routeParams, $http, $location, $log){
	var d=new Date();
	var year=d.getFullYear();
	var month=d.getMonth()+1;
	if (month<10){
		month="0" + month;
	};
	var day=d.getDate();
	$scope.url={
		host:window.location.host,
		webapp:"../../",		
	};
	$scope.form={
		date:year + "-" + month + "-" + day,
		time:d.getHours() + ":" + d.getMinutes(),
	};
	$scope.save=function(){
		$scope.form.type="log";
		
		$http.post($scope.url.webapp, $scope.form).success(function(data, status, headers, config){	
		$location.path('logs');
 	 }).error(function(data, status, headers, config){
 		 $log.info(data, status, headers, config);
 	 });
	}
}

function LogDetailCtrl($scope, $routeParams, $http, $location, $log){

	$log.info($routeParams.logId);
	$scope.view="../../_design/logs/_view/" + 'all?key="' + $routeParams.logId + '"';
	$http.get($scope.view)
	.success(function(data){
		$scope.form=data.rows[0].value;
		$scope.formcopy=angular.copy(data.rows[0].value);
	})
	.error(function(data, status, headers, config){
		$log.info(data, status, headers, config);}
	);
	$scope.cancel=function(){
		$scope.form=angular.copy($scope.formcopy);
	}
}