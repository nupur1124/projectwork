var myApp=angular.module('app',['ui.bootstrap','ngTouch','ui.grid.pagination','ui.grid.edit','ui.grid','ui.grid.rowEdit', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.bootstrap', 'ui.grid.autoResize']);

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
				
				var dataObj = {
						//subscriber :$scope.filterSubscriber,
						//todate : $scope.filterTodate,
						fromDate : $scope.filterFromDate,
						//showErrorsOnly :$scope.filterError,
					//	repoFlag:$scope.filterRepo,
					//	referenceNo:$scope.RadioValue,
						//referenceSelected:$scope.FilterRadioValue
				}
				
				
				
 $http({method:'post',url:'http://10.155.44.200:8090/TRAXUIServiceJAX-1.0/rest/Search/ByDate',data:dataObj,headers:{'Content-Type':'application/json'}}).
	    success(function(data, status, headers, config)
	    		{				    	
	    	console.log(status);	
	    	$scope.PostDataResponse = data.Trade;   //set view model

			 $scope.filterData = angular.copy($scope.PostDataResponse, []);
		
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
		$scope.gridOptions.data=$scope.filterData;
				console.log("status"+status);
	    }).
	    error(function(data, status, headers, config) {
				$scope.my= data || "Request failed";
				console.log("Error with status:"+status);
	    })  ;
				// $scope.filterData = angular.copy($scope.PostDataResponse, []);
			  
			 
			  
			  };
			    
			  
			  

			  /*$scope.filterData = angular.copy($scope.myData, []);
			    
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
				       
				}*/

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


myApp.controller('maintence_ficontroller', ['$scope','$q','$interval','$log','uiGridConstants', function($scope,$q,$interval,$log,uiGridConstants) {
	$scope.msg = {};
	
	$scope.gridOptions = { 
			paginationPageSizes:[5, 10, 15],
			   paginationPageSize: 10,
			   paginationOptions: $scope.pagingOptions,
			   filterOptions: $scope.filteroptions ,
			   enableCellEditOnFocus: true,
			   enablePaging: true,
			   enableFiltering: true,
			   enableRowSelection: true,
			   rowEditWaitInterval: 1,
			   
	
			   columnDefs:[{name: 'Rule_ID',displayName:'Rule ID',enableCellEdit: true,type: 'number'},
			               {name: 'TraxAcronym',displayName:'Trax Acronym',enableCellEdit: true},
			               {name: 'ClientHugo',displayName:'Client Hugo',enableCellEdit: true },
			               {name: 'ProductType',displayName:'Product Type',enableCellEdit: true},
			               {name: 'ProductHugo',displayName:'Product Hugo',enableCellEdit: true},
			               {name: 'IssueCurrency', displayName: 'Issue Currency',
			            	      editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	      editDropdownValueLabel: 'IssueCurrency', 
			            	      editDropdownOptionsArray: [
			            	      { id:'EUR', IssueCurrency: 'EUR' },
			            	      { id: 'USD', IssueCurrency: 'USD' },
			            	      { id: 'YEN', IssueCurrency: 'YEN' },
			            	      { id: 'JPN', IssueCurrency: 'JPN' },
			            	      { id: 'ITL', IssueCurrency: 'ITL' },
			            	      { id: 'ALL', IssueCurrency: 'ALL' }] },
			                
			               {name: 'Book',displayName:'Book' ,enableCellEdit: true},
			               {name: 'B_S',displayName:'B/S',enableCellEdit: true,
			            	      editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	      editDropdownValueLabel: 'B_S',
			            	      editDropdownOptionsArray: [
			            	                                { id:'B', B_S: 'B' },
			            	                                { id: 'S', B_S: 'S' } ]},
			            	                                
			               {name: 'SettlementCurrency',displayName:'Settmt Ccy',enableCellEdit: true,
			            	      editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	      editDropdownValueLabel: 'SettlementCurrency',
			            	      editDropdownOptionsArray: [
			            	                                 { id:'EUR', SettlementCurrency: 'EUR' },
			            	                                 { id: 'USD', SettlementCurrency: 'USD' },
			            	                                 { id: 'YEN', SettlementCurrency: 'YEN' },
			            	                                 { id: 'JPN', SettlementCurrency: 'JPN' },
			            	                                 { id: 'ITL', SettlementCurrency: 'ITL' },
			            	                                 { id: 'ALL', SettlementCurrency: 'ALL' }] },
			               {name: 'SettlementCountry',displayName:'Settmt Country',enableCellEdit: true,
			            	   			            	   editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	   			            	   editDropdownValueLabel: 'SettlementCountry',
			            	   			            	   editDropdownOptionsArray: [
			            	   			            	                              { id:'ALL', SettlementCountry: 'ALL' },
			            	   			            	                              { id: 'JPN', SettlementCountry: 'JPN' },
			            	   			            	                              { id: 'ESP', SettlementCountry: 'ESP' }
			            	   			            	                            ] },
			               {name: 'RepoType',displayName:'Repo Type',enableCellEdit: true},
			               {name: 'Reportable',displayName:'Reportable?',enableCellEdit: true },
			               {name: 'EnteredBy',displayName:'Entered By',enableCellEdit: true },
			               {name: 'EntryDate',displayName:'Entry Date' ,enableCellEdit: true,type: 'date',cellFilter: 'date:"MM/dd/yyyy"'},
			               {name: 'UpdatedBy',displayName:'Updated By',enableCellEdit: true},
			               {name: 'UpdatedDate',displayName:'Updated Date',enableCellEdit: true ,type: 'date',cellFilter: 'date:"MM/dd/yyyy"'},
			               ]
			               };
	
    $scope.gridOptions.multiSelect = true;
	$scope.ficontrol = [];


	$scope.ficontrol=[{ Rule_ID:1000302,TraxAcronym:"TULLTLON",ClientHugo:"SIEG",ProductType:"All Product",ProductHugo:"ALL",IssueCurrency:"ALL",Book:"ALL",B_S:"B",SettlementCurrency:"ALL",SettlementCountry:"ESP",RepoType:"ALL",Reportable:"Y",EnteredBy:"traxbatch", EntryDate: '05/06/2016',UpdatedBy:"traxbatch",UpdatedDate:"07/09/2017"},
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

	 $scope.gridOptions.data = $scope.ficontrol;

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
   $scope.onAddRow = function(){
	   //console.log("dgjgjdgdg");
	   var newobj = {"Rule_ID": "","TraxAcronym":"","ProductType": "","IssueCurrency":"","Book": "", "B_S": "","SettlementCurrency": "", "SettlementCountry": "","RepoType": "", "Reportable": "", "EnteredBy": "", "EntryDate": "","UpdatedBy": "", "UpdatedDate": ""}; 
	    $scope.gridOptions.data.unshift(newobj);
	    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ROW); 
	    
	    //set focus to the new row 
	    $scope.gridApi.cellNav.scrollToFocus( $scope.termGridOptions.data[0], $scope.termGridOptions.columnDefs[0]);
	  }; //adding the row
	  
	  $scope.save = function() {
		 
		    $scope.gridApi.rowEdit.flushDirtyRows( $scope.gridApi.grid );
		    console.log("6735783453");
		  };

         $scope.deleteSelected = function(){
             angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data1, index) {
               $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data1), 1);
             });
           } 
			             $scope.saveRow = function (rowEntity) {
			                       var promise = $q.defer();
			                       $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
			                       console.log("Added ID"+rowEntity.Rule_ID);
			                       promise.resolve();
			                   };
			     $scope.gridOptions.onRegisterApi = function(gridApi){
	      //set gridApi on scope
	      $scope.gridApi = gridApi;
	      gridApi.selection.on.rowSelectionChanged($scope,function(row){
	        var msg = 'row selected ' + row.isSelected +"||"+row.entity.Rule_ID;/// selecting the row
	        $log.log(msg);
	      })

	      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
	        var msg = 'rows changed ' + rows.length;
	        $log.log(msg);
	      })
	  	 $scope.gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
	  		 //console.log("test");
							            $scope.msg.lastCellEdited = 'Edited Row_Id:' + rowEntity.Rule_ID + ' Modified_Column:' + colDef.name + ' NewValue:' + newValue + ' OldValue:' + oldValue ;
							            $scope.$apply();
							            console.log("lastCellEdited"+$scope.msg.lastCellEdited)
							            } );  //editable row feature
	      
	     gridApi.rowEdit.on.saveRow($scope, $scope.saveRow); ///saving the row

			             };

	$scope.count=0;
	
	$scope.OnLoad=function(){
		
		$scope.count++;
	};

/*		$scope.gridOptions1 = { 
			paginationPageSizes:[5, 10, 15],
			   paginationPageSize: 10,
			   paginationOptions: $scope.pagingOptions,
			   filterOptions: $scope.filteroptions ,
			   enableCellEditOnFocus: true,
			   enablePaging: true,
			   showSelectionCheckbox: true,
		        selectWithCheckboxOnly: true,
		        selectedItems: $scope.Selections,
			   enableFiltering: true,
			   columnDefs:[{name: 'Rule_ID',displayName:'Rule ID',enableCellEdit: true,type: 'number'},
			               {name: 'TraxAcronym',displayName:'Trax Acronym',enableCellEdit: true},
			               {name: 'ClientHugo',displayName:'Client Hugo',enableCellEdit: true },
			               {name: 'ProductType',displayName:'Product Type',enableCellEdit: true},
			               {name: 'ProductHugo',displayName:'Product Hugo',enableCellEdit: true},
			               {name: 'IssueCurrency', displayName: 'Issue Currency',
			            	      editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	      editDropdownValueLabel: 'IssueCurrency', 
			            	      editDropdownOptionsArray: [
			            	      { id:'EUR', IssueCurrency: 'EUR' },
			            	      { id: 'USD', IssueCurrency: 'USD' },
			            	      { id: 'YEN', IssueCurrency: 'YEN' },
			            	      { id: 'JPN', IssueCurrency: 'JPN' },
			            	      { id: 'ITL', IssueCurrency: 'ITL' },
			            	      { id: 'ALL', IssueCurrency: 'ALL' }] },
			                
			               {name: 'Book',displayName:'Book' ,enableCellEdit: true},
			               {name: 'B_S',displayName:'B/S',enableCellEdit: true,
			            	      editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	      editDropdownValueLabel: 'B_S',
			            	      editDropdownOptionsArray: [
			            	                                { id:'B', B_S: 'B' },
			            	                                { id: 'S', B_S: 'S' } ]},
			            	                                
			               {name: 'SettlementCurrency',displayName:'Settmt Ccy',enableCellEdit: true,
			            	      editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	      editDropdownValueLabel: 'SettlementCurrency',
			            	      editDropdownOptionsArray: [
			            	                                 { id:'EUR', SettlementCurrency: 'EUR' },
			            	                                 { id: 'USD', SettlementCurrency: 'USD' },
			            	                                 { id: 'YEN', SettlementCurrency: 'YEN' },
			            	                                 { id: 'JPN', SettlementCurrency: 'JPN' },
			            	                                 { id: 'ITL', SettlementCurrency: 'ITL' },
			            	                                 { id: 'ALL', SettlementCurrency: 'ALL' }] },
			               {name: 'SettlementCountry',displayName:'Settmt Country',enableCellEdit: true,
			            	   			            	   editableCellTemplate: 'ui-grid/dropdownEditor', 
			            	   			            	   editDropdownValueLabel: 'SettlementCountry',
			            	   			            	   editDropdownOptionsArray: [
			            	   			            	                              { id:'ALL', SettlementCountry: 'ALL' },
			            	   			            	                              { id: 'JPN', SettlementCountry: 'JPN' },
			            	   			            	                              { id: 'ESP', SettlementCountry: 'ESP' }
			            	   			            	                            ] },
			               {name: 'RepoType',displayName:'Repo Type',enableCellEdit: true},
			               {name: 'Reportable',displayName:'Reportable?',enableCellEdit: true },
			               {name: 'EnteredBy',displayName:'Entered By',enableCellEdit: true },
			               {name: 'EntryDate',displayName:'Entry Date' ,enableCellEdit: true,type: 'date',cellFilter: 'date:"MM/dd/yyyy"'},
			               {name: 'UpdatedBy',displayName:'Updated By',enableCellEdit: true},
			               {name: 'UpdatedDate',displayName:'Updated Date',enableCellEdit: true ,type: 'date',cellFilter: 'date:"MM/dd/yyyy"'},
			               ],
			              
			            
			               onRegisterApi: function(gridApi){
			            	   $scope.gridApi = gridApi;
			            	   $scope.gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
							            $scope.msg.lastCellEdited = 'Edited Row_Id:' + rowEntity.Rule_ID + ' Modified_Column:' + colDef.name + ' NewValue:' + newValue + ' OldValue:' + oldValue ;
							            $scope.$apply();
							            });
			            	  
							    
			               }};
					               $scope.gridOptions1.data=$scope.ficontrol1; */

    }]);

myApp.controller('maintence_settlcontroller', ['$scope','$q','$interval',function($scope,$interval){
	
	$scope.settl=[{CSFBType:"CC",CpartyClearer:"CL",CSFBClearer:"CL",Added:"03/16/2017",By:"traxbatch"},
	              {CSFBType:"CY",CpartyClearer:"OM",CSFBClearer:"OT",Added:"03/18/2017",By:"traxbatc"},
	              {CSFBType:"DD",CpartyClearer:"ER",CSFBClearer:"OM",Added:"03/23/2017",By:"dbo"},
	              {CSFBType:"EC",CpartyClearer:"OT",CSFBClearer:"CL",Added:"03/25/2017",By:"traxbatch"},
	              {CSFBType:"ED",CpartyClearer:"CL",CSFBClearer:"ER",Added:"03/27/2017",By:"dbo"},
	              {CSFBType:"CC",CpartyClearer:"CL",CSFBClearer:"CL",Added:"04/16/2017",By:"traxbatch"},
	              {CSFBType:"CY",CpartyClearer:"OM",CSFBClearer:"OT",Added:"04/18/2017",By:"traxbatc"},
	              {CSFBType:"DD",CpartyClearer:"ER",CSFBClearer:"OM",Added:"04/23/2017",By:"dbo"},
	              {CSFBType:"EC",CpartyClearer:"OT",CSFBClearer:"CL",Added:"04/25/2017",By:"traxbatch"},
	              {CSFBType:"ED",CpartyClearer:"CL",CSFBClearer:"ER",Added:"04/27/2017",By:"dbo"},
	              {CSFBType:"CC",CpartyClearer:"CL",CSFBClearer:"CL",Added:"05/16/2017",By:"traxbatch"},
	              {CSFBType:"CY",CpartyClearer:"OM",CSFBClearer:"OT",Added:"05/18/2017",By:"traxbatc"},
	              {CSFBType:"DD",CpartyClearer:"ER",CSFBClearer:"OM",Added:"05/23/2017",By:"dbo"},
	              {CSFBType:"EC",CpartyClearer:"OT",CSFBClearer:"CL",Added:"05/25/2017",By:"traxbatch"},
	              {CSFBType:"ED",CpartyClearer:"CL",CSFBClearer:"ER",Added:"05/27/2017",By:"dbo"},
	              {CSFBType:"CC",CpartyClearer:"CL",CSFBClearer:"CL",Added:"06/16/2017",By:"traxbatch"},
	              {CSFBType:"CY",CpartyClearer:"OM",CSFBClearer:"OT",Added:"06/18/2017",By:"traxbatc"},
	              {CSFBType:"DD",CpartyClearer:"ER",CSFBClearer:"OM",Added:"06/23/2017",By:"dbo"},
	              {CSFBType:"EC",CpartyClearer:"OT",CSFBClearer:"CL",Added:"06/25/2017",By:"traxbatch"},
	              {CSFBType:"ED",CpartyClearer:"CL",CSFBClearer:"ER",Added:"06/27/2017",By:"dbo"}
	];

	 $scope.filterOptions = {
			    filterText: '',
			    useExternalFilter: true
			  };
	   
	   $scope.pagingOptions = {
			   pageSizes: [5, 10, 15],
			  pageSize: 10,
		        totalServerItems: 0,
		        currentPage: 1
		    };

	$scope.gridOptions=
	{ paginationPageSizes:[5, 10, 15],
			   paginationPageSize: 10,
			   paginationOptions: $scope.pagingOptions,
			   filterOptions: $scope.filteroptions,
			   enableCellEditOnFocus: true,
			   enablePaging: true,
			   enableFiltering: true,
		        showFooter: true,
		        enableSorting: true
		       ,
		       columnDefs:[{name:'CSFBType',displayName:'CSFB Type', enableCellEdit: true,
		        	editableCellTemplate: 'ui-grid/dropdownEditor', 
	            	   editDropdownValueLabel: 'CSFBType',
		            	   editDropdownOptionsArray: [
		            	                              { id:'CC', CSFBType: 'CC' },
		            	                              { id: 'ED', CSFBType: 'ED' },
		            	                              { id: 'CY', CSFBType: 'CY' },
		            	                              { id: 'EC', CSFBType: 'EC' }
		            	                            ]},
		                    {name:'CpartyClearer',displayName:'Cparty Clearer',enableCellEdit: true ,
		            	           editableCellTemplate: 'ui-grid/dropdownEditor', 
	   			            	   editDropdownValueLabel: 'CpartyClearer',
	   			            	   editDropdownOptionsArray: [
	   			            	                              { id:'CL', CpartyClearer: 'CL' },
	   			            	                              { id: 'OM', CpartyClearer: 'OM' },
	   			            	                              { id: 'ER', CpartyClearer: 'ER' },
	   			            	                              { id: 'OT', CpartyClearer: 'OT' }
	   			            	                            ]},
		                    {name:'CSFBClearer',displayName:'CSFB Clearer', enableCellEdit: true,
	   			            	   editableCellTemplate: 'ui-grid/dropdownEditor', 
	   			            	   editDropdownValueLabel: 'CSFBClearer',
	   			            	   editDropdownOptionsArray: [
				            	   			            	  { id:'CL', CSFBClearer: 'CL' },
	   			            	                              { id: 'OM', CSFBClearer: 'OM' },
	   			            	                              { id: 'ER', CSFBClearer: 'ER' },
	   			            	                              { id: 'OT', CSFBClearer: 'OT' }
				            	   			            	                            ]},
		                    {name:'Added',displayName:'Added',type:'date',enableCellEdit: true},
		                    {name:'By',displayName:'By',enableCellEdit: true}],
		                    data:'settl',
			onRegisterApi: function(gridApi){
         	   $scope.gridApi = gridApi;}}

}]);

myApp.controller('maintence_repocontroller', ['$scope',function($scope){
	
	$scope.repo=[{Type:"BS",Trax:"True",BargainCond:"RB",Added:"03/16/2017",By:"dbo"},
	             {Type:"BVC",Trax:"False",BargainCond:"",Added:"03/17/2017",By:"dbo"},
	             {Type:"FBB",Trax:"False",BargainCond:"",Added:"03/18/2017",By:"dbo"},
	             {Type:"FBL",Trax:"False",BargainCond:"",Added:"03/19/2017",By:"dbo"},
	             {Type:"FF",Trax:"True",BargainCond:"",Added:"03/20/2017",By:"dbo"},
	             {Type:"FV",Trax:"True",BargainCond:"",Added:"03/21/2017",By:"dbo"},
	             {Type:"GR",Trax:"True",BargainCond:"RC",Added:"03/22/2017",By:"dbo"},
	             {Type:"GRR",Trax:"True",BargainCond:"RC",Added:"03/23/2017",By:"dbo"},
	             {Type:"LR",Trax:"False",BargainCond:"",Added:"03/24/2017",By:"dbo"},
	             {Type:"LVC",Trax:"False",BargainCond:"",Added:"04/16/2017",By:"dbo"},
	             {Type:"PG",Trax:"False",BargainCond:"",Added:"04/16/2017",By:"dbo"},
	             {Type:"PL",Trax:"True",BargainCond:"RP",Added:"04/16/2017",By:"dbo"},
	             {Type:"PR",Trax:"False",BargainCond:"",Added:"04/16/2017",By:"dbo"},
	             {Type:"PV",Trax:"True",BargainCond:"RP",Added:"05/16/2017",By:"dbo"},
	             {Type:"RR",Trax:"True",BargainCond:"RC",Added:"06/16/2017",By:"dbo"},
	             {Type:"SB",Trax:"True",BargainCond:"RB",Added:"07/16/2017",By:"dbo"},
	             {Type:"TP",Trax:"False",BargainCond:"RC",Added:"08/16/2017",By:"dbo"},
	       
	];

	 $scope.filterOptions = {
			    filterText: '',
			    useExternalFilter: true
			  };
	   
	   $scope.pagingOptions = {
			   pageSizes: [5, 10, 15],
			  pageSize: 10,
		        totalServerItems: 0,
		        currentPage: 1
		    };
	
	$scope.gridOptions=
	{ paginationPageSizes:[5, 10, 15],
			   paginationPageSize: 10,
			   paginationOptions: $scope.pagingOptions,
			   filterOptions: $scope.filteroptions,
			   enableCellEditOnFocus: true,
			   enablePaging: true,
			   enableFiltering: true,
		        showFooter: true,
		        enableSorting: true
		       ,
		       columnDefs:[{name:'Type',displayName:'Type', enableCellEdit: true},
		        	
		                    {name:'Trax',displayName:'Trax',enableCellEdit: true ,type:'boolean'},
		            	          
		                    {name:'BargainCond',displayName:'Bargain Cond.', enableCellEdit: true},
	   			            	
		                    {name:'Added',displayName:'Added',type:'date',enableCellEdit: true},
		                    {name:'By',displayName:'By',enableCellEdit: true}],
		                    data:'repo',
			onRegisterApi: function(gridApi){
         	   $scope.gridApi = gridApi;}}

}]);
