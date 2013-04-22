// Parameter Javascript
function ListParameters($scope, $http){
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
		$http.get($scope.url.views + "all_names").success(function(myparameters){
			$scope.parameter_rows=myparameters.rows;
		});
	};
	$scope.show();
}

function FetchParameters($scope, $http, $log) {
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
 // get results from all_names view and store in variable
 $scope.show= function(){
   $http.get($scope.url.views + "all_names").success(function(myparameters){
	 $scope.parameter_rows=myparameters.rows;
   });
 };
 //call the function to get the view results
 ListParameters($scope,$http);
 $scope.show();
 //save form data as new document of type: parameter
 $scope.save=function(){
	 //create a json object to hold the new parameter document data
	 //must be of type parameter so set that.
	 //name is supplied by the name text input on the form
	 $scope.parameter_doc.name=$scope.name;
	 //post the data to CouchDB
	 $http.post($scope.url.webapp, $scope.parameter_doc).success(function(data, status, headers, config){
		 // tell the user we've saved the data
		 $scope.message="Parameter " + $scope.parameter_doc.name + " added";
		 $scope.show();
		 $scope.name="";
	 }).error(function(data, status, headers, config){
		 $log.info(data, status, headers, config);
	 });         
 };
 //delete documents from CouchDB
 $scope.delete=function(){
	 //check something has been selected and so there is something to delete
	 //$scope.selected_parameter will hold the id(_id), key(name) and value(_rev) of the document selecte din the dropdown
	 if ($scope.selected_parameter){
		 //delete selected parameter
		 $http.delete($scope.url.webapp + $scope.selected_parameter.id + "?rev=" + $scope.selected_parameter.value).success(function(data, status, headers, config){
			 //tell the user what we've done
			 $scope.message="Parameter " + $scope.selected_parameter.key + " deleted."
			 $scope.selected_parameter="";
			 //update the list
			 $scope.show();
		 }).error(function(data, status, headers, config){
			 $log.info(data, status, headers, config);
		 });
	 };
 };
 //update documents in CouchDB
 $scope.update=function(){
	 //update requires all fields to be provided
	 $log.info("updating")
	 $scope.parameter_doc._rev=$scope.selected_parameter.value;
	 $scope.parameter_doc.name=$scope.selected_parameter.key;
	 $log.info($scope.parameter_doc);
	 //check we have a parameter to change
	 if ($scope.selected_parameter.key){
		 //PUT the amended parameter to the database
		 
		 $http.put($scope.url.webapp + $scope.selected_parameter.id, $scope.parameter_doc).success(function(data,status, headers, config){
			 //successful, so tell user we made changes
			 $scope.message="Parameter " + $scope.selected_parameter.key + " updated";
			 //clear input textbox
			 $scope.selected_parameter.key="";
			 //update list of elements
			 $scope.show();
		 }).error(function(data, status, headers, config){
			 //failed so log it and inform user
			 $log.info(data);
			 $log.info($scope.parameter_doc);
			 $scope.message=data;
		 });
	 };
 };
} 
