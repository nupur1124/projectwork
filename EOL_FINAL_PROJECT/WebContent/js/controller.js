var myApp=angular.module('app',['ui.bootstrap','ngTouch','ui.grid.pagination','ui.grid', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.bootstrap', 'ui.grid.autoResize']);
  

//for controlling tabs
myApp.controller("TabController",function(){
	    this.tab=0;
	    this.setTab=function(tabId)
	    {
	    	
	        this.tab=tabId;
	    };
	    this.isSet=function(tabId)
	    {
	        return this.tab==tabId;
	    };

	});

//for date picker directive
myApp.directive('datepicker1', function() {
  return {
    link: function(scope, el, attr) {
      $(el).datepicker({
        onSelect: function(dateText) {
          console.log(dateText);
          var expression = attr.ngModel + " = " + "'" + dateText + "'";
          scope.$apply(expression);
          }
      });
    }
  };
});

//for submenus
myApp.directive('submenu', function() {
  return {
    restrict: 'AEC', /*attaches directive to class called submenu*/
    link: function(scope, elem) {
      elem.parent().bind('mouseover', function() {
        /*Displays the submenu*/
        elem.css('display', 'block');
        /*add class highlight to the class linkName.  We have to use this chain of methods because angular doesn't support .siblings()*/
        elem.parent().children().eq(0).addClass("highlight");
      });
      elem.parent().bind('mouseleave', function() {
        elem.css('display', 'none');
        elem.parent().children().eq(0).removeClass("highlight");
      });
    }
  };
});
//Filter for drop down menu
myApp.filter('unique', function() {
    return function(input, key) {
    	if (input == undefined)
    		input = [];
        var unique = {};
        var uniqueList = [];
        for(var i = 0; i < input.length; i++){
            if(typeof unique[input[i][key]] == "undefined"){
                unique[input[i][key]] = "";
                uniqueList.push(input[i]);
            }
        }
        return uniqueList;
    };
});

//controller for grid
myApp.controller("CompanyCtrl", ['$scope', '$http', '$interval', '$modal', '$log',function($scope, $http, $interval, $modal, $log,$templateCache) {
	
	
	//Rest service calling
	$http({method: 'get', url:'http://10.155.44.200:8090/TRAXUIService-1.0/action/login',cache: $templateCache}).
    success(function(data, status, headers, config) {
    	
    	console.log(status);	
    	$scope.myData = data;   //set view model
			console.log("adjs"+status);
    }).
    error(function(data, status, headers, config) {
			$scope.myData= data || "Request failed";
			console.log("Error with status:"+status);
    })
    ;
	
	
	 $scope.gridOptions = {}; 
	 $scope.count=0;	
	//for selecting row in grid
	$scope.myAppScopeProvider = {

			      showInfo : function(row) {
			           var modalInstance = $modal.open({
			                controller: 'InfoController',
			                templateUrl: 'modal.html',
			                resolve: {
			                  selectedRow: function () {                    
			                      return row.entity;
									                  }
								          
								                }
								    });
								           
   modalInstance.result.then(function (selectedItem) {
		             $log.log('modal selected Row: ' + selectedItem);
		           }, function () {
		             $log.info('Modal dismissed at: ' + new Date());
		           });
		      },
	rowFormatter :function( row ) {
		     return row.entity.status === 'ERR'; 
		  }
		  }
	
	  function rowTemplate() {
	           return '<div ng-class="{ \'grey\':grid.appScope.rowFormatter( row ) }">'+'<div ng-dblclick="grid.appScope.showInfo(row)" >' +
	                 '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"   ui-grid-cell></div>' +
	                 '</div>';
	  }
	
		   
	   
	  
	    $scope.startDate='';
	    $scope.EndDate='';
	    $scope.selectedsubscriber='';
	    $scope.var1='';
	      
		   $scope.filterOptions = {
				    filterText: '',
				    useExternalFilter: true
				  };
		 
		   
			$scope.activateFilter = function() 
			  {
				$scope.count++; //to load grid on click
			    var subscriber = $scope.filterSubscriber || null;
			    var todate = ($scope.filtertodate) ? $scope.filtertodate.toString() : null;
			    var fromDate = ($scope.filterfromDate) ? $scope.filterfromDate.toString() : null;
			    var repoflag=$scope.filterRepo || null;
			    var status=$scope.filterError || null;
			  // var ISMAref=$scope.filterISMAref ||null;
			    var fOReference=$scope.RadioValue ||null;
			    var Referenceno=$scope.FilterRadioValue ||null;
			    
			  
			   // var fOReferenceno=$scope.filterfOReferenceno ||null;
			  //  if (!subscriber && !todate) subscriber='';
			   // console.log("shubham"+Referenceno);
			    //console.log(+repoflag);
			    $scope.filterData = angular.copy($scope.myData, []);
			    $scope.filterData = $scope.filterData.filter( function(item) {
			    	
			    	
			    	 if(Referenceno=="FOReference"){
					    	
					    return (item.fOReference.toString().indexOf(fOReference) > -1 );
					    	
					     }
			    	 else if(Referenceno=="ISMAref"){
			    		 return (item.ismaref.toString().indexOf(ismaref) > -1 );
			    		 
			    	 }
			   
		    		    	
			   else if(fromDate!=null )
	    		{
		    		if(todate==null && subscriber==null)
		    			return (item.fromDate.toString().indexOf(fromDate) > -1 );
		    		else if(todate!=null && subscriber==null)
		    			return (item.fromDate.toString().indexOf(fromDate) > -1 && item.todate.toString().indexOf(todate) > -1);
		    		else if(todate==null && subscriber!=null)
		    			return (item.fromDate.toString().indexOf(fromDate) > -1 && item.subscriber.indexOf(subscriber)>-1);
		    		else if(repoflag=="YES")
		    			return (item.fromDate.toString().indexOf(fromDate) > -1 && item.repoflag.indexOf(repoflag)>-1);
		    		else if(status=="ERR")
		    			return (item.fromDate.toString().indexOf(fromDate) > -1 && item.status.indexOf(status)>-1);
		    		else
		    			return (item.subscriber.indexOf(subscriber)>-1 && item.todate.toString().indexOf(todate) > -1 &&  item.fromDate.toString().indexOf(fromDate) > -1);
	    		
	    		}
					    	
			    	 else  if(todate!=null)
	    		{
		    		if(fromDate==null && subscriber==null)
		    			return (item.todate.toString().indexOf(todate) > -1 );
		    		else if(fromDate!=null && subscriber==null)
		    			return (item.fromDate.toString().indexOf(fromDate) > -1 && item.todate.toString().indexOf(todate) > -1);
		    		else if(fromDate==null && subscriber!=null)
		    			return (item.todate.toString().indexOf(todate) > -1 && item.subscriber.indexOf(subscriber)>-1);
		    		else if(repoflag=="YES")
		    			return (item.todate.toString().indexOf(todate) > -1 && item.repoflag.indexOf(repoflag)>-1);
		    		else if(status=="ERR")
		    			return (item.todate.toString().indexOf(todate) > -1 && item.status.indexOf(status)>-1);
		    		
		    		else
		    			return (item.subscriber.indexOf(subscriber)>-1 && item.todate.toString().indexOf(todate) > -1 &&  item.todate.toString().indexOf(fromDate) > -1);
	    		
	    		}
					    	
			    	 else if((todate==null || fromDate==null)&& subscriber!=null)
	    		{
			    		 console.log("dhfjsh");
				  if(repoflag=="YES" && status=="ERR")
					 return(item.repoflag.toString().indexOf(repoflag) > -1 && item.status.toString().indexOf(status) > -1 && item.subscriber.indexOf(subscriber)>-1)				 
		    			
				 else if(repoflag=="YES")
		    			return (item.subscriber.toString().indexOf(subscriber) > -1 && item.repoflag.indexOf(repoflag)>-1);
				 else if(status=="ERR")
					 return (item.subscriber.toString().indexOf(subscriber) > -1 && item.status.indexOf(status)>-1);
				 else
				 return (item.subscriber.indexOf(subscriber)>-1);
	    		}
			 
			 
			    	 else if(repoflag=="YES" && status=="ERR")
	    		{
	    	
	    		return (item.repoflag.toString().indexOf(repoflag) > -1 && item.status.toString().indexOf(status) > -1 );
	    		}
	    	
			    	 else if(repoflag=="YES")
		    	{
		    	return (item.repoflag.toString().indexOf(repoflag) > -1 );
		    	}
		    	
			    	 else if(status=="ERR")
	    	{
	    	return (item.status.toString().indexOf(status) > -1 );
	    	}
		    	 else
		    		{
		    		return (item.subscriber.indexOf(subscriber)>-1 && item.todate.toString().indexOf(todate) > -1 &&  item.fromDate.toString().indexOf(fromDate) > -1 && item.repoflag.indexOf(repoflag)>-1 && item.status.indexOf(status)>-1);
		    		}
		    	 // return (item.subscriber.indexOf(subscriber)>-1 && item.todate.toString().indexOf(todate) > -1 ||  item.fromDate.toString().indexOf(fromDate) > -1);
			    });
			  };
			    
			  
			  

			  $scope.filterData = angular.copy($scope.myData, []);
			    
			  $scope.gridOptions = {
					  paginationPageSizes:[5, 10, 15],
					   paginationPageSize: 10,
					   paginationOptions: $scope.pagingOptions,
					   filterOptions: $scope.filteroptions ,
					   enablePaging: true,
					   enableFiltering: true,
				        showFooter: true,
				        enableSorting: true,
					    multiSelect: false,
					        
					    enableRowSelection: true, 
					    enableSelectAll: false,
					    enableRowHeaderSelection: false,
					    selectionRowHeaderWidth: 35,  
					    noUnselect: true,
					    enableGridMenu: true,
				        appScopeProvider: $scope.myAppScopeProvider,
				         onRegisterApi: function(gridApi){
				      grid = gridApi;
				    },
				    data:'filterData',
				    columnDefs: [
				                 {field:'sourceSystem', displayName:'Source'},    
				                 {field:'fOReference',displayName:'FO Reference'},
				                 {field:'ismaref',displayName:'ISMA Ref.'},
				                 {field:'security',displayName:'Security'},
				                 {field:'cParty',displayName:'CParty'},
				                 {field:'quantity',displayName:'Quantity'},
				                 {field:'price',displayName:'Price'},
				                 {field:'currency',displayName:'CCy'},
				                 {field:'purchaseSell',displayName:'P/S'},
				                 {field:'type',displayName:'Type'},
				                 {field:'status',displayName:'Status'},
				                 {field:'fromDate',displayName:'Trade Date/Time',cellFilter: 'date:"MM-dd-yyyy"'},
				                 {field:'late',displayName:'Late'}
				                 
				                 ],
				  
				    rowTemplate: rowTemplate()
				       
				}

			  $scope.reloadRoute = function() {
				  $scope.count=0;
				  $scope.RadioValue=""; 
				  $scope.FilterRadioValue="";
				  $scope.filterSubscriber="";
				  $scope.filterError="";
				  $scope.filterRepo="";
				  $scope.filterTodate="";
				  $scope.filterFromDate="";
				  console.log( $scope.count);
				}
	//   $scope.filterData = angular.copy($scope.myData, []);
	  //binding data to grid 
	// 	$scope.gridOptions = { data: 'filterData',filterOptions: $scope.filteroptions };
	  
		 
	   
}]);



myApp.controller('InfoController', 
	    ['$scope', '$modal', '$modalInstance', '$filter', '$interval', 'selectedRow',
	    function ($scope, $modal, $modalInstance, $filter, $interval, selectedRow) {

	        $scope.selectedRow = selectedRow;

	       $scope.ok = function () {
	            $scope.selectedRow = null;
	            $modalInstance.close();
	        };

	        $scope.cancel = function () {
	            $scope.selectedRow = null;
	            $modalInstance.dismiss('cancel');
	        };
	    }
	]);


myApp.controller('modalController', ['$scope', function($scope) {
    
}]);