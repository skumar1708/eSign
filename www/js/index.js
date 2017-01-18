/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var db = null;
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		swal('device is ready','Hurre','success');
		db = window.sqlitePlugin.openDatabase({name: 'easycan.db', location: 'default'});
		setTimeout(function(){
			
			db.transaction(function(transaction) {
				transaction.executeSql('CREATE TABLE IF NOT EXISTS EasyCans (id integer primary key, src blob, eid text)', [],
				function(tx, result) {
					alert("Table created successfully");
						db.transaction(function(tx) {
							tx.executeSql('SELECT src,id FROM EasyCans', [], function(tx, rs) {
								
								var len = rs.rows.length, i;
								
								for (i = 0; i < len; i++){
									var src =  rs.rows.item(i).src;
									var id = rs.rows.item(i).eid;
									alert(rs.rows.item(i).src);
									$('#savedItems').append('<li class="active listcan"><a href="#" class="editA" style="float:left;"><img class="canImg" style="width:80px;height:40px;" src="'+rs.rows.item(0).src+'"><img src="img/edit.png" class="imgEdit pull-right"></a><a href="#" class="deleteA" id="'+id+'"style="float:right;"><img src="img/delete.png" class="imgDelete pull-right"></a></li>');
								} 
								window.open(rs.rows.item(0).src,'_blank');
							  //swal('Count:'+len,'Record count (expected to be 2): ' + rs.rows.item(0).src,'success');
							}, function(tx, error) {
							  alert('SELECT error: ' + error.message);
							});
						  });
				},
				function(error) {
					alert("Error occurred while creating the table.");
				});
			});
			
		},2000);
		/* navigator.Backbutton.goHome(function() {
		 swal("Great","Exititing","Success");
		}, function() {
		  console.log('fail')
		}); */
		document.addEventListener("backbutton", onBackKeyDown, true);
        app.receivedEvent('deviceready');
		 //screen.lockOrientation('landscape'); //this is the new line
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
    function onBackKeyDown(e) {
		//e.preventDefault();
		alert("back key presses!!");
		 navigator.app.exitApp();
    }
