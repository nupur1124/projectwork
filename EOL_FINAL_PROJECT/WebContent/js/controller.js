var myApp=angular.module('app',['ui.bootstrap','ngTouch','ui.grid.pagination','ui.grid.edit','ui.grid', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.bootstrap', 'ui.grid.autoResize']);
  

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
    	$scope.myData = data.Trade;   //set view model
			console.log("status"+status);
    }).
    error(function(data, status, headers, config) {
			$scope.myData= data || "Request failed";
			console.log("Error with status:"+status);
    })
    ;
	$scope.t1=0;
	$scope.t2=0;
	$scope.IsHiddentab1 =false;
	$scope.IsHiddenGrid1 =true;
      
	$scope.ShowHide1 = function () {
    	          //If DIV is hidden it will be visible and vice versa.
          $scope.IsHiddentab1 = $scope.IsHiddentab1 ? false : true;  
          $scope.IsHiddenGrid1 =false;
          $scope.IsHiddenGrid2 =true;
    	  $scope.IsHiddentab2 = true;
          console.log(  $scope.IsHiddenGrid1);
      }
      
      $scope.ShowGrid1 = function () {
    	  $scope.IsHiddentab1 = true;  
    	  $scope.IsHiddentab2 = true;
    	  if( $scope.IsHiddenGrid1==false)
    	  $scope.IsHiddenGrid1 =true;
    	  $scope.IsHiddenGrid1 = $scope.IsHiddenGrid1 ? false : true; 
    	  console.log( "shdfj" +$scope.IsHiddenGrid1);
      }
      
      
      $scope.IsHiddentab2 =true;
  	$scope.IsHiddenGrid2 =true;
  	
      $scope.ShowHide2 = function () {
    	
          $scope.IsHiddentab2 = $scope.IsHiddentab2 ? false : true;
          $scope.IsHiddentab1 =true;
          $scope.IsHiddenGrid2 =false;
    	$scope.IsHiddenGrid1 =true;
          console.log( "dnfjkna"+ $scope.IsHiddenSubmit);
      }
      
      $scope.ShowGrid2 = function () {
    	  $scope.IsHiddentab1 = true;  
    	   $scope.IsHiddentab2 =true;
    	   if( $scope.IsHiddenGrid2==false)
    	    	  $scope.IsHiddenGrid2 =true;
    	  $scope.IsHiddenGrid2 = $scope.IsHiddenGrid2 ? false : true; 
      }
      
      
	 $scope.gridOptions = {}; 
	 $scope.count=0;	
	 $scope.count1=0;
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
				$scope.count++; 
				 //to load grid on click
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
			    
		   
			$scope.activateFilter1 = function() 
			  {
				
				$scope.count1++; //to load grid on click
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
				  $scope.count1=1;
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


myApp.controller('maintencecontroller', ['$scope', function($scope) {
	$scope.msg = {};
	$scope.d=[{ Rule_ID:1000302,TraxAcronym:"TULLTLON",ClientHugo:"SIEG",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"ALL",Book:"ALL",B_S:"B",SettlementCurrency:"ALL",SettlementCountry:"ESP",RepoType:"ALL",Reportable:"Y",EnteredBy:"traxbatch", EntryDate: "06/05/2016",UpdatedBy:"traxbatch",UpdatedDate:"07/09/2017"},
	          { Rule_ID:1000301,TraxAcronym:"GFIGPLON",ClientHugo:"BLVR",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"EUR",Book:"ALL",B_S:"S",SettlementCurrency:"EUR",SettlementCountry:"ALL",RepoType:"ALL",Reportable:"N",EnteredBy:"idavey2", EntryDate: "06/06/2016",UpdatedBy:"idavey2",UpdatedDate:"07/010/2017"},
	          { Rule_ID:1000289,TraxAcronym:"MSLON",ClientHugo:"SALL",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"JPN",Book:"ALL",B_S:"B",SettlementCurrency:"ALL",SettlementCountry:"ESP",RepoType:"R",Reportable:"Y",EnteredBy:"ksmith8", EntryDate: "06/07/2016",UpdatedBy:"ksmith8",UpdatedDate:"07/11/2017"},
	          { Rule_ID:1000288,TraxAcronym:"JPSMLLON",ClientHugo:"DB02",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"ITL",Book:"ALL",B_S:"S",SettlementCurrency:"USD",SettlementCountry:"JPN",RepoType:"ALL",Reportable:"N",EnteredBy:"ksmith8", EntryDate: "06/08/2016",UpdatedBy:"ksmith8",UpdatedDate:"07/12/2017"},
	          { Rule_ID:1000087,TraxAcronym:"CAB0TMIL",ClientHugo:"BAML",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"USD",Book:"ALL",B_S:"B",SettlementCurrency:"ITL",SettlementCountry:"ALL",RepoType:"RR",Reportable:"Y",EnteredBy:"idavey2", EntryDate: "06/09/2016",UpdatedBy:"idavey2",UpdatedDate:"07/13/2017"},
	          { Rule_ID:1000284,TraxAcronym:"VDMBLON",ClientHugo:"BOAI",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"ALL",Book:"ALL",B_S:"S",SettlementCurrency:"YEN",SettlementCountry:"JPN",RepoType:"R",Reportable:"Y",EnteredBy:"ksmith8", EntryDate: "06/10/2016",UpdatedBy:"ksmith8",UpdatedDate:"07/14/2017"},
	          { Rule_ID:500348,TraxAcronym:"SALUKLON",ClientHugo:"DEKI",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"EUR",Book:"ALL",B_S:"B",SettlementCurrency:"EUR",SettlementCountry:"ESP",RepoType:"ALL",Reportable:"N",EnteredBy:"ksmith8", EntryDate: "06/11/2016",UpdatedBy:"ksmith8",UpdatedDate:"07/15/2017"},
	          { Rule_ID:500315,TraxAcronym:"GFIGPLON",ClientHugo:"SALL",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"YEN",Book:"ALL",B_S:"S",SettlementCurrency:"USD",SettlementCountry:"ALL",RepoType:"ALL",Reportable:"Y",EnteredBy:"idavey2", EntryDate: "06/12/2016",UpdatedBy:"idavey2",UpdatedDate:"07/16/2017"},
	          { Rule_ID:500314,TraxAcronym:"JPSMLLON",ClientHugo:"BLVR",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"ITL",Book:"ALL",B_S:"B",SettlementCurrency:"ALL",SettlementCountry:"ALL",RepoType:"ALL",Reportable:"N",EnteredBy:"traxbatch", EntryDate: "06/13/2016",UpdatedBy:"traxbatch",UpdatedDate:"07/17/2017"},
	          { Rule_ID:500310,TraxAcronym:"CAB0TMIL",ClientHugo:"SIEG",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"USD",Book:"ALL",B_S:"S",SettlementCurrency:"JPN",SettlementCountry:"ALL",RepoType:"ALL",Reportable:"Y",EnteredBy:"ksmith8", EntryDate: "06/14/2016",UpdatedBy:"ksmith8",UpdatedDate:"07/18/2017"},
	          { Rule_ID:500321,TraxAcronym:"VDMBLON",ClientHugo:"DB02",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"ALL",Book:"ALL",B_S:"B",SettlementCurrency:"JPN",SettlementCountry:"ALL",RepoType:"RR",Reportable:"N",EnteredBy:"idavey2", EntryDate: "06/15/2016",UpdatedBy:"idavey2",UpdatedDate:"07/19/2017"},]
	
	  $scope.filterOptions = {
		    filterText: '',
		    useExternalFilter: true
		  };
   
   $scope.pagingOptions = {
		   pageSizes: [2, 4, 6],
		  pageSize: 10,
	        totalServerItems: 0,
	        currentPage: 1
	    };
	
	
	$scope.gridOptions = { 
			paginationPageSizes:[5, 10, 15],
			   paginationPageSize: 10,
			   paginationOptions: $scope.pagingOptions,
			   filterOptions: $scope.filteroptions ,
			   enablePaging: true,
			   enableFiltering: true,
			   columnDefs:[{name: 'Rule_ID',displayName:'Rule ID',enableCellEdit: true,type: 'number'},
			               {name: 'TraxAcronym',displayName:'Trax Acronym',enableCellEdit: true},
			               {name: 'ClientHugo',displayName:'Client Hugo',enableCellEdit: true },
			               {name: 'ProductType',displayName:'Product Type',enableCellEdit: true},
			               {name: 'ProductHugo',displayName:'Product Hugo',enableCellEdit: true},
			               {name: 'IssueCurrency',displayName:'Issue Ccy',enableCellEdit: true },
			               {name: 'Book',displayName:'Book' ,enableCellEdit: true},
			               {name: 'B_S',displayName:'B/S',enableCellEdit: true},
			               {name: 'SettlementCurrency',displayName:'Settmt Ccy',enableCellEdit: true},
			               {name: 'SettlementCountry',displayName:'Settmt Country',enableCellEdit: true},
			               {name: 'RepoType',displayName:'Repo Type',enableCellEdit: true},
			               {name: 'Reportable',displayName:'Reportable?',enableCellEdit: true ,type: 'boolean'},
			               {name: 'EnteredBy',displayName:'Entered By',enableCellEdit: true },
			               {name: 'EntryDate',displayName:'Entry Date' ,enableCellEdit: true},
			               {name: 'UpdatedBy',displayName:'Updated By',enableCellEdit: true},
			               {name: 'UpdatedDate',displayName:'Updated Date',enableCellEdit: true ,type: 'date'},
			               ],
			               onRegisterApi: function(gridApi){
			            	   $scope.gridApi = gridApi;
			            	   $scope.gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
							            $scope.msg.lastCellEdited = 'Edited Row_Id:' + rowEntity.Rule_ID + ' Modified_Column:' + colDef.name + ' NewValue:' + newValue + ' OldValue:' + oldValue ;
							            $scope.$apply();
							            });
							          
							    },
							    
			               data:'d',
			         
			            
			               
			
			 
		       
		};
	$scope.count=0;
	
	$scope.OnLoad=function(){
		
		$scope.count++;
	}
    
}]);