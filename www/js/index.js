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
 var CANVAS_GLOBAL_URL = "";
  var CANVAS_GLOBAL_LAST_URL = "";
 var androidApplicationLicenseKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyWuTJQClo0zEUXsxqBtAfj1BeUUF6lvpNG6zzzHJcss3YWK6XUuegy/eUvJgDO0L1yY1xhcC/beyGXEW/is7Ua5DMPx+IzqUFFtrx/xp32c5JB27p6XajqsvqkVXBV76UQLnaO5afNVR4gQquuIS72MceH9D5x4nvbZOh1vtEBVhmCoXMXeZ4VvISQ3gxGuNXnMl/p0sWM6gb5qfN5YjLCGTU8BhpazBQnqu4dqGLlLokpMGGkMogh8/LrF7dSZfbeSsZcZkY9h15gsDzlc41lMGgbQ5EkKUbHxCQQKfdfrsFJEFiD0cmRC9jB9bu47M+p8F8lYIiAu3ICeH0WkmMwIDAQAB";
var productIds = "product_easy_export";
var existing_purchases = [];
var product_info = {};
 var publisherKey = "889e674c-6a74-4491-874a-90e8550561ae";
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
		window.iap.setUp(androidApplicationLicenseKey);
		
		//get all products' infos for all productIds 
		window.iap.requestStoreListing(productIds, function (result){
		/*
		[
			{
				"productId": "sword001",
				"title": "Sword of Truths",
				"price": "Formatted price of the item, including its currency sign.",
				"description": "Very pointy sword. Sword knows if you are lying, so don't lie."
			},
			{
				"productId": "shield001",
				"title": "Shield of Peanuts",
				"price": "Formatted price of the item, including its currency sign.",
				"description": "A shield made entirely of peanuts."
			}
		]
		*/
		//alert(JSON.stringify(result)); 
	 
			for (var i = 0 ; i < result.length; ++i){
				var p = result[i];
				
				product_info[p["productId"]] = { title: p["title"], price: p["price"] };			
				
				//alert("productId: "+p["productId"]);
				//alert("title: "+p["title"]);
				//alert("price: "+p["price"]);
			}
		}, function (error){
			//alert("error: "+error);
		});
		
		document.addEventListener("backbutton", onBackKeyDown, true);
        app.receivedEvent('deviceready');
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
		if($(".container").css('display')=='none'){
			swal({
				  title: "Are you sure want to Exit?",
				  text: "Unsaved work will be lost !",
				  type: "warning",
				  width:100,
				  height:100,
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes",
				  cancelButtonText: "No",
				  closeOnConfirm: true
				},
				function(e){
						if(e) navigator.app.exitApp();
			});
		}
		else{
			$(".container").css('display','none');
			$("#myModal").modal('show');
			var index = Math.floor(Math.random() * (qoutes.length));
			var q = `" ${qoutes[index]} "`;
				$('qoute').html(q);
		}
    }
	
	
	var purchaseProduct = function(productId) {
		//alert('PURCHASING PRODUCT FROM PLAY STORE');
		//purchase product id, put purchase product id info into server. 
		window.iap.purchaseProduct(productId, function (result){
			localStorage.setItem('restorable','purchased');
			alert("Product purchased,please do not clear app cache.");
		}, 
		function (error){
			//alert("error: "+error);
		});
	};
	 
	var consumeProduct = function(productId) {
		//consume product id, throw away purchase product id info from server. 
		window.iap.consumeProduct(productId, function (result){
			alert("purchaseProduct");
		}, 
		function (error){
			//alert("error: "+error);
		});	
	};
	 
	var restorePurchases = function() {
		//alert('GETTING PURCHASED INFOS');
		//get user's purchased product ids which purchased before and not cunsumed. 
		var restoreAble = false;
		window.iap.restorePurchases(function (result){
			alert('result length is '+result.length);
			if(result.length >=1){restoreAble = true;}
			/* for (var i = 0 ; i < result.length; ++i){
				var p = result[i];
				
				if (existing_purchases.indexOf(p['productId']) === -1)
					existing_purchases.push(p['productId']);			
	 
				alert("productId: "+p['productId']);
			} */
		}, 
		function (error){
			restoreAble = false;
			//existing_purchases.push('error');
			//alert("error: "+error);
		});
		
		return restoreAble;
	};
	 
	var  hasProduct = function (productId){
		return existing_purchases.indexOf(productId) !== -1;
	};
	var submitBtn = document.getElementById("sig-submitBtn");
	var canvas = document.getElementById("sig-canvas")
	submitBtn.addEventListener("click", function (e) {
		var dataUrl = canvas.toDataURL();
		//sigText.innerHTML = dataUrl;
		//sigImage.setAttribute("src", dataUrl);
		 
		downloadCanvas(canvas);
	
	},false);
	var downloadCanvas = function(canvas) {
					if(null !== localStorage.getItem('restorable')){
							window.canvas2ImagePlugin.saveImageDataToLibrary(
							function(msg){
								swal({
									  title: "Done",
									  text: "Image saved in "+msg,
									  type: "success",
									  showCancelButton: true,
									  confirmButtonColor: "#DD6B55",
									  confirmButtonText: "Open",
									  cancelButtonText: "Cancel",
									  closeOnConfirm: true
									},
									function(){
									  //swal("Deleted!", "Your imaginary file has been deleted.", "success");
									  window.open(canvas.toDataURL(),'_blank', 'location=yes');
									});
							},
							function(err){
								alert("Error "+err);
							},
							canvas
						);
					}
					else{
						swal({
									  title: "Get Pro",
									  text: "This app required an upgrade to download this Image.",
									  type: "success",
									  showCancelButton: true,
									  confirmButtonColor: "#DD6B55",
									  confirmButtonText: "Upgrade",
									  cancelButtonText: "Cancel",
									  closeOnConfirm: true
									},
									function(e){
										if(e && window.hasOwnProperty('purchaseProduct')){
											purchaseProduct("product_easy_export");
										}
									});
				}
		 
	}
