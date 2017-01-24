(function() {
	
	// Get a regular interval for drawing to the screen
	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimaitonFrame ||
					function (callback) {
					 	window.setTimeout(callback, 1000/60);
					};
	})();

	
	// Set up the canvas
	var isDirty = false;
	var tool = 'pencil';
	var FILLSTYLE = "#ffffff";
	var STROKESTYLE = "#222222";
	var canvas = document.getElementById("sig-canvas");
	var lineWidth =  2;
	var opacity = 100;
	var dataURL = '';
	var ctx = canvas.getContext("2d");
	ctx.lineCap ='round';
	ctx.strokeStyle = '#000';
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	//ctx.translate(0.5, 0.5);
	ctx.stroke();

	// Set up the UI
	var sigText = document.getElementById("sig-dataUrl");
	var sigImage = document.getElementById("sig-image");
	var clearBtn = document.getElementById("sig-clearBtn");
	var submitBtn = document.getElementById("sig-submitBtn");
	
	clearBtn.addEventListener("click", function (e) {
		clearCanvas();
		/* sigText.innerHTML = "Data URL for your signature will go here!";
		sigImage.setAttribute("src", ""); */
	}, false);
	submitBtn.addEventListener("click", function (e) {
		var dataUrl = canvas.toDataURL();
		//sigText.innerHTML = dataUrl;
		//sigImage.setAttribute("src", dataUrl);
		 
		downloadCanvas(canvas);
	
	});
	function downloadCanvas(canvas) {
		
		if(hasProduct()){
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
							function(e){
							  //swal("Deleted!", "Your imaginary file has been deleted.", "success");
							  if(e)window.open(canvas.toDataURL(),'_blank', 'location=yes');
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
					  title: "GET PRO !",
					  text: "You need to upgrade the app to utiliize export feature.",
					  type: "warning",
					  showCancelButton: true,
					  confirmButtonColor: "#DD6B55",
					  confirmButtonText: "Upgrade",
					  cancelButtonText: "Later",
					  closeOnConfirm: true
					},
					function(e){
					  if(e)purchaseProduct('product_easy_export";');
					});
		}
		
	}
	// Set up mouse events for drawing
	var drawing = false;
	var mousePos = { x:0, y:0 };
	var lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e) {
		isDirty = true;
		drawing = true;
		lastPos = getMousePos(canvas, e);
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		drawing = false;
	}, false);
	canvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(canvas, e);
	}, false);

	// Set up touch events for mobile, etc
	canvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchend", function (e) {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchmove", function (e) {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Prevent scrolling when touching the canvas
	document.body.addEventListener("touchstart", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchend", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);

	// Get the position of the mouse relative to the canvas
	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

	// Draw to the canvas
	function renderCanvas() {
		//console.log('drawing is ', drawing);
		if (drawing) {
			if(tool=='pencil'){
				//console.log('drawing');
				ctx.beginPath();

				ctx.lineCap =  'round';
				if(!isDirty){
					ctx.strokeStyle = $('#penButton').css('background-color').replace('rgb','rgba').replace(')',','+opacity/100+')');
				}
				ctx.fillStyle = $('#tButton').css('background-color');
				ctx.moveTo(lastPos.x, lastPos.y);
				
				var c = (lastPos.x+mousePos.x)/2;
				var d = (lastPos.y+mousePos.y)/2;
				//ctx.quadraticCurveTo(mousePos.x, mousePos.y, c, d)
				ctx.lineTo(mousePos.x, mousePos.y);
				ctx.stroke();
				lastPos = mousePos;
				//ctx.closePath();
			}
			else{
				var mouseX = mousePos.x;
				var	mouseY = mousePos.y;
				
				//console.log('mouseX '+mouseX,'mouseY '+mouseY);
				
				ctx.beginPath();
				ctx.moveTo(mouseX, mouseY);
				ctx.fillRect(mouseX,mouseY,20,20);
				ctx.strokeStyle = $('#tButton').css('background-color');
				ctx.fillStyle = $('#tButton').css('background-color');
				ctx.closePath();
			}
		}
		
	}

	function clearCanvas() {
		canvas.width = canvas.width;
		ctx = canvas.getContext("2d");
		ctx.strokeStyle = $('#penButton').css('background-color').replace('rgb','rgba').replace(')',','+opacity/100+')');;
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = $('#tButton').css('background-color');
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
	
	var $elementO = $('input[name="opacityRange"]');
		$elementO
		  .rangeslider({
			polyfill: false,
			onInit: function() {
			  updateOpacity(this.value);
			}
		  })
		  .on('input', function() {
			updateOpacity(this.value);
		  });
	function updateOpacity(val) {
		  console.log('*****',val);
		  opacity = val;
		  updatePenColor($('#penButton').css('background-color').replace('rgb','rgba').replace(')',','+opacity/100+')'));
		}
	var $element = $('input[name="strokeRange"]');
		$element
		  .rangeslider({
			polyfill: false,
			onInit: function() {
			  updateOutput(this.value);
			}
		  })
		  .on('input', function() {
			updateOutput(this.value);
		  });
	function updateOutput(val) {
		  console.log('*****',val);
		  lineWidth = val*2;
		  ctx.lineWidth = lineWidth;
		}
	
	$("#tButton").change(function(){
		var tButton = this;
			swal({
			  title: "Changing background !",
			  text: "Have you saved your canvas ?",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Yes",
			  cancelButtonText: "No",
			  closeOnConfirm: true
			},
			function(e){
					if(e)updateCanvasColor($(tButton).css('background-color'));
				});
		});
	function updateCanvasColor(jscolor) {
		console.log(jscolor);
		ctx = canvas.getContext("2d");
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = jscolor;
		ctx.strokeStyle = $('#penButton').css('background-color');
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.stroke();
		$('#tButton').css('background-color',jscolor);
	}
		$("#penButton").change(function(){
			updatePenColor($(this).css('background-color').replace('rgb','rgba').replace(')',','+opacity/100+')'));
		});
		$("#penButton").on('click',function(){
			console.log('set pencil');
			tool = 'pencil';
			updatePenColor($(this).css('background-color').replace('rgb','rgba').replace(')',','+opacity/100+')'));
		});
	function updatePenColor(pencolor) {
		console.log('changing pen ',pencolor);
		ctx.strokeStyle = pencolor;
		ctx.lineWidth = lineWidth;
		 ctx.shadowColor = pencolor;
		 ctx.stroke();
	}
	
	$('#erase').on('click',function(){
		tool = 'eraser';
	});
	$(document).on('click','.listcan a.editA',function(){
		var thisItem = this;
		//toggle_sidebar.call(null);
		
		swal({
		  title: "Are you sure?",
		  text: "Your unsaved canvas will be lost!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "OK",
		  closeOnConfirm: true
		},
		function(){
				var can = $(thisItem).find('.canImg');
				console.log($(can).attr('src'));
				
				var canvas = document.getElementById('sig-canvas');
				var context = canvas.getContext('2d');
				// load image from data url
				var imageObj = new Image();
				imageObj.onload = function() {
				  context.drawImage(this, 0, 0);
				};

				imageObj.src = $(can).attr('src'); 
				
				toggle_sidebar.call(null);
			});
      
	});
	$(document).on('click','.listcan a.deleteA',function(){
		var thisItem = this;
		//toggle_sidebar.call(null);
		console.log($(this).attr('id'));
		swal({
		  title: "Are you sure?",
		  text: "This Canvas will be deleted permanently",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "OK",
		  closeOnConfirm: true
		},
		function(e){
				console.log('delete cancel',e);
				localStorage.removeItem($(thisItem).attr('id'));
				$(thisItem).closest('li').remove();
				toggle_sidebar.call(null);
			});
      
	});
	$('#save').on('click',function(){
		var date = new Date();
		localStorage.setItem("EasyCan|"+date,canvas.toDataURL());
		var id = "EasyCan|"+date;
		swal({
		  title: "EasyCanvas Saved!",
		  text: "Would you mind in ratin us on Google Play ?",
		  type: "success",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "No",
		  closeOnConfirm: true
		},
		function(e){
				if(e)window.open('https://play.google.com/store/apps/details?id=air.HealthApp&hl=en');
				else{
					 adbuddiz.rewardedVideo.show();
				}
			});
		
		var src = canvas.toDataURL();
		console.log('images is ',localStorage.key(i));
		//if(localStorage.key(i).indexOf('data:image')>-1){localStorage.removeItem(localStorage.key(i));}
		$('#savedItems').append('<li class="active listcan"><a href="#" class="editA" style="float:left;"><img class="canImg" style="width:80px;height:40px;" src="'+src+'"><img src="img/edit.png" class="imgEdit pull-right"></a><a href="#" class="deleteA" id="'+id+'"style="float:right;"><img src="img/delete.png" class="imgDelete pull-right"></a></li>');
	});
	$('#share').on('click',function(){
		console.log(canvas.toDataURL("image/png"));
		ctx.font = "17px 'Indie Flower', cursive";
		// Create gradient
		var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop("0", "magenta");
		gradient.addColorStop("0.5", "blue");
		gradient.addColorStop("1.0", "red");
		// Fill with gradient
		ctx.fillStyle = gradient;
		ctx.fillText("created by EasyCanvas", 10, 20);
		//window.open('https://play.google.com/store/apps/details?id=air.HealthApp&hl=en')
		//window.plugins.toast.show('Hello there!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
		 var data = canvas.toDataURL("image/png");
		  		  
		 var options = {
			  message: 'share this', // not supported on some apps (Facebook, Instagram)
			  subject: 'the subject', // fi. for email
			  files: [canvas.toDataURL("image/png")], // an array of filenames either locally or remotely
			  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
			}

		var onSuccess = function(result) {
			 var canColor = $('#tButton').css('background-color');
			  ctx.fillStyle = canColor;
			  ctx.fillRect(8,8,150,20);
		}

		var onError = function(msg) {
		 options = {};
		}
		window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
		delete options.files;
		ctx.stroke();
		  
	});
	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();
	(function(){
		$('canvas').attr('width',$(window).width()-40);
		if($(window).width()<500){
			$('canvas').attr('height',$(window).height()-90);
		}else{
			$('canvas').attr('height',$(window).height()-65);
		}
		
		ctx.lineCap =  'round';
		ctx.strokeStyle = STROKESTYLE;
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = FILLSTYLE
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.stroke();
		})();
})();
