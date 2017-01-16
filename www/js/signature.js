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
	var dataURL = '';
	var ctx = canvas.getContext("2d");
	ctx.lineJoin = ctx.lineCap = 'round';
	  /*  ctx.shadowBlur = 1;
	  ctx.shadowColor = '#222222';*/
	ctx.strokeStyle = '#000';
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,canvas.width,canvas.height);
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
				window.canvas2ImagePlugin.saveImageDataToLibrary(
					function(msg){
						swal("Done","Image saved in "+msg,"success");
						
						
						swal({
							  title: "Done",
							  text: "Image saved in "+msg,
							  type: "success",
							  showCancelButton: true,
							  confirmButtonColor: "#DD6B55",
							  confirmButtonText: "OPEN",
							  cancelButtonText: "OPEN",
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
				ctx.lineJoin = ctx.lineCap = 'round';
				if(!isDirty){
					ctx.strokeStyle = $('#penButton').css('background-color');
				}
				ctx.fillStyle = $('#tButton').css('background-color');
				ctx.moveTo(lastPos.x, lastPos.y);
				ctx.lineTo(mousePos.x, mousePos.y);
				ctx.stroke();
				lastPos = mousePos;
				ctx.closePath();
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
		if($('#tButton').css('background-color')=='rgb(255, 255, 255)'){
			ctx.strokeStyle = '#000';
		}else{ctx.strokeStyle = $('#penButton').css('background-color');}
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = $('#tButton').css('background-color');
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
	
	//document.getElementById('valueInput').addEventListener('onchange',function(){alert('value changed');});
	
	var $element = $('input[type="range"]');
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
		  lineWidth = val;
		  ctx.lineWidth = lineWidth;
		}
	
	$("#tButton").change(function(){
			updateCanvasColor($(this).css('background-color'));
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
			console.log('changing init');
			updatePenColor($(this).css('background-color'));
		});
		$("#penButton").on('click',function(){
			tool = 'pencil';
		});
	function updatePenColor(pencolor) {
		ctx.strokeStyle = pencolor;
		ctx.lineWidth = lineWidth;
		 ctx.shadowColor = pencolor;
	}
	
	$('#erase').on('click',function(){
		tool = 'eraser';
		/* canvas.removeEventListener('mousemove', null, false);
		canvas.addEventListener('mousemove',function(e){
		if(tool=='eraser'){
				
				
				
		}
		}); */
		
	});
	$('#share').on('click',function(){
		 var data = canvas.toDataURL("image/png");
		  //var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
		 // var decodedPng = Base64Binary.decode(encodedPng);
		window.plugins.socialsharing.share(
			  "Share this app",
			  "Share via",
			  canvas.toDataURL("image/png")
		  );
	});
	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();
	(function(){
		$('canvas').attr('width',$(window).width()-($(window).width()/15));
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.strokeStyle = STROKESTYLE;
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = FILLSTYLE
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.stroke();
		})();
})();
