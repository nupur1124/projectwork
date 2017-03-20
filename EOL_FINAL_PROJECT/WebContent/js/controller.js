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



//controller for grid
myApp.controller("CompanyCtrl", ['$scope', '$http', '$interval', '$modal', '$log',function($scope, $http, $interval, $modal, $log) {
	$scope.criteria = ["Equals", "Less than Equals to",  "Greater than equals to", "Less that","Greater than"];

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
		     return row.entity.Status === 'ERR'; 
		  }
		  }
	
	  function rowTemplate() {
	           return '<div ng-class="{ \'grey\':grid.appScope.rowFormatter( row ) }">'+'<div ng-dblclick="grid.appScope.showInfo(row)" >' +
	                 '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"   ui-grid-cell></div>' +
	                 '</div>';
	  }
	
	 $scope.gridOptions = {}; 
	
	$scope.myData = [{Source: "VIS",FOReference:"10Z8GC", ISMAref:"57122154",TradeId: 101, FromDate: "06/05/2016",Todate:"07/04/2017",Subscriber:"Subscriber1",Status:"ERR",Repoflag:"YES",Security:"DE0001141547",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                 {Source: "FIT",FOReference:"10Z87Y",ISMAref:"526822154", TradeId: 102, FromDate: "06/05/2016",Todate:"07/04/2017",Subscriber:"Subscriber2",Status:"NEW",Repoflag:"YES",Security:"US458182CP58",CParty:"USBP",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                 {Source: "FTS",FOReference:"50097600/01",ISMAref:"58522113", TradeId: 103, FromDate: "06/07/2016",Todate:"07/06/2017",Subscriber:"Subscriber3",Status:"NMT",Repoflag:"YES",Security:"DE0001141547",CParty:"BBGB",Quantity:14000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                 {Source: "VIS",FOReference:"0644816510001",ISMAref:"51122113",TradeId: 104, FromDate: "06/07/2016",Todate:"07/07/2017",Subscriber:"Subscriber4",Status:"CAN",Repoflag:"YES",Security:"US458182CP58",CParty:"BBLL",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                 {Source: "FIT", FOReference:"76546123/01",ISMAref:"588221139",TradeId: 105, FromDate: "06/08/2016",Todate:"07/08/2017",Subscriber:"Subscriber5",Status:"ERR",Repoflag:"NO",Security:"DE0001141547",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"10Z8GC", ISMAref:"",TradeId: 106, FromDate: "06/09/2016",Todate:"07/09/2017",Subscriber:"Subscriber6",Status:"NEW",Repoflag:"YES",Security:"XS0230228933",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"10Z8GC", ISMAref:"",TradeId: 107, FromDate: "06/10/2016",Todate:"07/10/2017",Subscriber:"Subscriber7",Status:"NMT",Repoflag:"NO",Security:"DE0001141547",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT",FOReference:"50097600/01", ISMAref:"51122113",TradeId: 108, FromDate: "06/11/2016",Todate:"07/11/2017",Subscriber:"Subscriber8",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"USBP",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FTS",FOReference:"0644816510001", ISMAref:"57122154",TradeId: 109, FromDate: "06/12/2016",Todate:"07/12/2017",Subscriber:"Subscriber9",Status:"ERR",Repoflag:"NO",Security:"DE0001141547",CParty:"BBLL",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"10Z87Y", ISMAref:"",TradeId: 110, FromDate: "06/13/2016",Todate:"07/13/2017",Subscriber:"Subscriber10",Status:"NEW",Repoflag:"YES",Security:"XS0230228933",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT",FOReference:"50097600/01", ISMAref:"",TradeId: 111, FromDate: "06/14/2016",Todate:"07/14/2017",Subscriber:"Subscriber11",Status:"NMT",Repoflag:"YES",Security:"DE0001141547",CParty:"BBGB",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FTS",FOReference:"10ZGGM", ISMAref:"51122113",TradeId: 112, FromDate: "06/15/2016",Todate:"07/15/2017",Subscriber:"Subscriber12",Status:"CAN",Repoflag:"NO",Security:"DE0001141547",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"76546123/01",ISMAref:"58522113", TradeId: 101, FromDate: "06/05/2016",Todate:"07/04/2017",Subscriber:"Subscriber1",Status:"ERR",Repoflag:"YES",Security:"XS0230228933",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                     {Source: "FTS", FOReference:"1651000",ISMAref:"",TradeId: 102, FromDate: "06/05/2016",Todate:"07/04/2017",Subscriber:"Subscriber2",Status:"NEW",Repoflag:"YES",Security:"DE0001141547",CParty:"BBLL",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                     {Source: "FTS", FOReference:"50097600/01",ISMAref:"526822154",TradeId: 103, FromDate: "06/07/2016",Todate:"07/06/2017",Subscriber:"Subscriber3",Status:"NMT",Repoflag:"NO",Security:"XS0230228933",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                     {Source: "VIS", FOReference:"1651000",ISMAref:"",TradeId: 104, FromDate: "06/07/2016",Todate:"07/07/2017",Subscriber:"Subscriber4",Status:"CAN",Repoflag:"YES",Security:"US458182CP58",CParty:"BBGB",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                     {Source: "FTS",FOReference:"10Z8GC", ISMAref:"526822154",TradeId: 105, FromDate: "06/08/2016",Todate:"07/08/2017",Subscriber:"Subscriber5",Status:"ERR",Repoflag:"NO",Security:"DE0001141547",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"10Z87Y",ISMAref:"58522113",TradeId: 106, FromDate: "06/09/2016",Todate:"07/09/2017",Subscriber:"Subscriber6",Status:"NEW",Repoflag:"YES",Security:"DE0001141547",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"10Z8GC", ISMAref:"51122113",TradeId: 107, FromDate: "06/10/2016",Todate:"07/10/2017",Subscriber:"Subscriber7",Status:"NMT",Repoflag:"NO",Security:"XS0230228933",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FTS", FOReference:"76546123/01",ISMAref:"526822154",TradeId: 108, FromDate: "06/11/2016",Todate:"07/11/2017",Subscriber:"Subscriber8",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"10Z87Y",ISMAref:"58522113",TradeId: 109, FromDate: "06/12/2016",Todate:"07/12/2017",Subscriber:"Subscriber9",Status:"ERR",Repoflag:"NO",Security:"DE0001141547",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"50097600/01", ISMAref:"526822154",TradeId: 110, FromDate: "06/13/2016",Todate:"07/13/2017",Subscriber:"Subscriber10",Status:"NEW",Repoflag:"YES",Security:"XS0230228933",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"10Z87Y", ISMAref:"51122113",TradeId: 111, FromDate: "06/14/2016",Todate:"07/14/2017",Subscriber:"Subscriber11",Status:"NMT",Repoflag:"YES",Security:"DE0001141547",CParty:"BBLL",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT",FOReference:"10Z8GC", ISMAref:"",TradeId: 112, FromDate: "06/15/2016",Todate:"07/15/2017",Subscriber:"Subscriber12",Status:"CAN",Repoflag:"NO",Security:"DE0001141547",CParty:"USBP",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS",FOReference:"76546123/01",ISMAref:"",TradeId: 101, FromDate: "06/05/2016",Todate:"07/04/2017",Subscriber:"Subscriber1",Status:"ERR",Repoflag:"NO",Security:"DE0001141547",CParty:"BBGB",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                         {Source: "VIS",FOReference:"10Z8GC", ISMAref:"",TradeId: 102, FromDate: "06/05/2016",Todate:"07/04/2017",Subscriber:"Subscriber2",Status:"NEW",Repoflag:"YES",Security:"XS0230228933",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                         {Source: "VIS",FOReference:"1651000", ISMAref:"526822154",TradeId: 103, FromDate: "06/07/2016",Todate:"07/06/2017",Subscriber:"Subscriber3",Status:"NMT",Repoflag:"YES",Security:"DE0001141547",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                         {Source: "FTS", FOReference:"10Z87Y",ISMAref:"51122113",TradeId: 104, FromDate: "06/07/2016",Todate:"07/07/2017",Subscriber:"Subscriber4",Status:"NMT",Repoflag:"NO",Security:"US458182CP58",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	                         {Source: "FIT", FOReference:"76546123/01",ISMAref:"",TradeId: 105, FromDate: "06/08/2016",Todate:"07/08/2017",Subscriber:"Subscriber5",Status:"ERR",Repoflag:"YES",Security:"XS0230228933",CParty:"BBGB",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"10Z87Y",ISMAref:"",TradeId: 106, FromDate: "06/09/2016",Todate:"07/09/2017",Subscriber:"Subscriber6",Status:"NEW",Repoflag:"YES",Security:"DE0001141547",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"1651000",ISMAref:"526822154",TradeId: 107, FromDate: "06/10/2016",Todate:"07/10/2017",Subscriber:"Subscriber7",Status:"CAN",Repoflag:"NO",Security:"XS0230228933",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"50097600/01",ISMAref:"588221139",TradeId: 108, FromDate: "06/11/2016",Todate:"07/11/2017",Subscriber:"Subscriber8",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"BBLL",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"10Z87Y",ISMAref:"",TradeId: 109, FromDate: "06/12/2016",Todate:"07/12/2017",Subscriber:"Subscriber9",Status:"ERR",Repoflag:"NO",Security:"XS0230228933",CParty:"BBGB",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FTS", FOReference:"10Z8GC",ISMAref:"51122113",TradeId: 110, FromDate: "06/13/2016",Todate:"07/13/2017",Subscriber:"Subscriber10",Status:"NEW",Repoflag:"YES",Security:"DE0001141547",CParty:"USBP",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"76546123/01",ISMAref:"",TradeId: 111, FromDate: "06/14/2016",Todate:"07/14/2017",Subscriber:"Subscriber11",Status:"NMT",Repoflag:"NO",Security:"XS0230228933",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"50097600/01",ISMAref:"526822154",TradeId: 112, FromDate: "06/15/2016",Todate:"07/15/2017",Subscriber:"Subscriber12",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"BBGB",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "39", FOReference:"1651000",ISMAref:"588221139",TradeId: 103, FromDate: "06/07/2016",Todate:"07/06/2017",Subscriber:"Subscriber3",Status:"NMT",Repoflag:"NO",Security:"DE0001141547",CParty:"BBLL",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"1651000",ISMAref:"",TradeId: 104, FromDate: "06/07/2016",Todate:"07/07/2017",Subscriber:"Subscriber4",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FTS", FOReference:"10Z87Y",ISMAref:"526822154",TradeId: 105, FromDate: "06/08/2016",Todate:"07/08/2017",Subscriber:"Subscriber5",Status:"ERR",Repoflag:"NO",Security:"XS0230228933",CParty:"BBGB",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"76546123/01",ISMAref:"",TradeId: 106, FromDate: "06/09/2016",Todate:"07/09/2017",Subscriber:"Subscriber6",Status:"NEW",Repoflag:"YES",Security:"DE0001141547",CParty:"C820",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"50097600/01",ISMAref:"51122113",TradeId: 107, FromDate: "06/10/2016",Todate:"07/10/2017",Subscriber:"Subscriber7",Status:"NMT",Repoflag:"NO",Security:"US458182CP58",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"10Z8GC",ISMAref:"",TradeId: 108, FromDate: "06/11/2016",Todate:"07/11/2017",Subscriber:"Subscriber8",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"76546123/01",ISMAref:"",TradeId: 109, FromDate: "06/12/2016",Todate:"07/12/2017",Subscriber:"Subscriber9",Status:"ERR",Repoflag:"YES",Security:"DE0001141547",CParty:"BBLL",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"1651000",ISMAref:"526822154",TradeId: 110, FromDate: "06/13/2016",Todate:"07/13/2017",Subscriber:"Subscriber10",Status:"NEW",Repoflag:"NO",Security:"US458182CP58",CParty:"USBP",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"10Z87Y",ISMAref:"",TradeId: 111, FromDate: "06/14/2016",Todate:"07/14/2017",Subscriber:"Subscriber11",Status:"NMT",Repoflag:"YES",Security:"XS0230228933",CParty:"BBGB",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FIT", FOReference:"76546123/01",ISMAref:"51122113",TradeId: 112, FromDate: "06/15/2016",Todate:"07/15/2017",Subscriber:"Subscriber12",Status:"CAN",Repoflag:"YES",Security:"DE0001141547",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "FTS", FOReference:"10Z8GC",ISMAref:"526822154",TradeId: 101, FromDate: "06/14/2016",Todate:"07/14/2017",Subscriber:"Subscriber11",Status:"NMT",Repoflag:"NO",Security:"DE0001141547",CParty:"USBP",Quantity:50000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"},
	         {Source: "VIS", FOReference:"50097600/01",ISMAref:"588221139",TradeId: 102, FromDate: "06/15/2016",Todate:"07/15/2017",Subscriber:"Subscriber12",Status:"ERR",Repoflag:"True",Security:"XS0230228933",CParty:"C820",Quantity:40000000.00,Price:99.7600,Ccy:"EUR",PS:"P",Type:"NTRD"}];

	   $scope.Subscriber = ["Subscriber1", "Subscriber2", "Subscriber3","Subscriber4","Subscriber5","Subscriber6","Subscriber7","Subscriber8","Subscriber9","Subscriber10","Subscriber11","Subscriber12"];
	    $scope.startDate='';
	    $scope.EndDate='';
	    $scope.selectedSubscriber='';
	    $scope.var1='';
	      
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
		   
		   $scope.setPagingData = function(data, page, pageSize){	
		        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		        $scope.myData1 = pagedData;
		        $scope.pagingOptions.totalServerItems = data.length;
		        if (!$scope.$$phase) {
		            $scope.$apply();
		        }
		    };
		    
		    
		    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
		        setTimeout(function () {
		        	var data1;

		            if (searchText) {
		                var ft = searchText.toLowerCase();
		                $http.get('http://jsonplaceholder.typicode.com/posts/').success(function (largeLoad) {		
		                    data1 = largeLoad.filter(function(item) {
		                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
		                    });
		                    $scope.setPagingData(data1,page,pageSize);
		                });            
		            } else {
		                $http.get('http://jsonplaceholder.typicode.com/posts/').success(function (largeLoad) {
		                    $scope.setPagingData(largeLoad,page,pageSize);
		                });
		            }
		        }, 100);
		    };
			
		    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
			
		    $scope.$watch('pagingOptions', function () {
		    //	console.log("claasssic"+data1);
		        console.log( "watch changed pagingOptions" );
		        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
		    }, true);
		   $scope.$watch('filterOptions', function () {
		        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
		    }, true);   
		   
		   
		 
		   
			$scope.activateFilter = function() 
			  {
			    var Subscriber = $scope.filterSubscriber || null;
			    var Todate = ($scope.filterTodate) ? $scope.filterTodate.toString() : null;
			    var FromDate = ($scope.filterFromDate) ? $scope.filterFromDate.toString() : null;
			    var Repoflag=$scope.filterRepo || null;
			    var Status=$scope.filterError || null;
			  //  if (!Subscriber && !Todate) Subscriber='';
			    console.log(Repoflag);
			    $scope.filterData = angular.copy($scope.myData, []);
			    $scope.filterData = $scope.filterData.filter( function(item) {
			
			   
			    	
			    	
			 if(FromDate!=null )
	    		{
		    		if(Todate==null && Subscriber==null)
		    			return (item.FromDate.toString().indexOf(FromDate) > -1 );
		    		else if(Todate!=null && Subscriber==null)
		    			return (item.FromDate.toString().indexOf(FromDate) > -1 && item.Todate.toString().indexOf(Todate) > -1);
		    		else if(Todate==null && Subscriber!=null)
		    			return (item.FromDate.toString().indexOf(FromDate) > -1 && item.Subscriber.indexOf(Subscriber)>-1);
		    		else if(Repoflag=="YES")
		    			return (item.FromDate.toString().indexOf(FromDate) > -1 && item.Repoflag.indexOf(Repoflag)>-1);
		    		else if(Status=="ERR")
		    			return (item.FromDate.toString().indexOf(FromDate) > -1 && item.Status.indexOf(Status)>-1);
		    		else
		    			return (item.Subscriber.indexOf(Subscriber)>-1 && item.Todate.toString().indexOf(Todate) > -1 &&  item.FromDate.toString().indexOf(FromDate) > -1);
	    		
	    		}
					    	
			 if(Todate!=null)
	    		{
		    		if(FromDate==null && Subscriber==null)
		    			return (item.Todate.toString().indexOf(Todate) > -1 );
		    		else if(FromDate!=null && Subscriber==null)
		    			return (item.FromDate.toString().indexOf(FromDate) > -1 && item.Todate.toString().indexOf(Todate) > -1);
		    		else if(FromDate==null && Subscriber!=null)
		    			return (item.Todate.toString().indexOf(Todate) > -1 && item.Subscriber.indexOf(Subscriber)>-1);
		    		else if(Repoflag=="YES")
		    			return (item.Todate.toString().indexOf(Todate) > -1 && item.Repoflag.indexOf(Repoflag)>-1);
		    		else if(Status=="ERR")
		    			return (item.Todate.toString().indexOf(Todate) > -1 && item.Status.indexOf(Status)>-1);
		    		
		    		else
		    			return (item.Subscriber.indexOf(Subscriber)>-1 && item.Todate.toString().indexOf(Todate) > -1 &&  item.Todate.toString().indexOf(FromDate) > -1);
	    		
	    		}
					    	
			 if((Todate==null || FromDate==null)&& Subscriber!=null)
	    		{
				  if(Repoflag=="YES" && Status=="ERR")
					 return(item.Repoflag.toString().indexOf(Repoflag) > -1 && item.Status.toString().indexOf(Status) > -1 && item.Subscriber.indexOf(Subscriber)>-1)				 
		    			
				 else if(Repoflag=="YES")
		    			return (item.Subscriber.toString().indexOf(Subscriber) > -1 && item.Repoflag.indexOf(Repoflag)>-1);
				 else if(Status=="ERR")
					 return (item.Subscriber.toString().indexOf(Subscriber) > -1 && item.Status.indexOf(Status)>-1);
				 else
				 return (item.Subscriber.indexOf(Subscriber)>-1);
	    		}
			 
			 
			 if(Repoflag=="YES" && Status=="ERR")
	    		{
	    	
	    		return (item.Repoflag.toString().indexOf(Repoflag) > -1 && item.Status.toString().indexOf(Status) > -1 );
	    		}
	    	
	    	 if(Repoflag=="YES")
		    	{
		    	return (item.Repoflag.toString().indexOf(Repoflag) > -1 );
		    	}
		    	
		    	 if(Status=="ERR")
	    	{
	    	return (item.Status.toString().indexOf(Status) > -1 );
	    	}
		    	 else
		    		{
		    		return (item.Subscriber.indexOf(Subscriber)>-1 && item.Todate.toString().indexOf(Todate) > -1 &&  item.FromDate.toString().indexOf(FromDate) > -1 && item.Repoflag.indexOf(Repoflag)>-1 && item.Status.indexOf(Status)>-1);
		    		}
		    	 // return (item.Subscriber.indexOf(Subscriber)>-1 && item.Todate.toString().indexOf(Todate) > -1 ||  item.FromDate.toString().indexOf(FromDate) > -1);
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
				    rowTemplate: rowTemplate()
				       
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