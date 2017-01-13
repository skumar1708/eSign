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
	var canvas = document.getElementById("sig-canvas");
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#222222";
	ctx.lineWith = 2;

	// Set up the UI
	var sigText = document.getElementById("sig-dataUrl");
	var sigImage = document.getElementById("sig-image");
	var clearBtn = document.getElementById("sig-clearBtn");
	var submitBtn = document.getElementById("sig-submitBtn");
	clearBtn.addEventListener("click", function (e) {
		clearCanvas();
		sigText.innerHTML = "Data URL for your signature will go here!";
		sigImage.setAttribute("src", "");
	}, false);
	submitBtn.addEventListener("click", function (e) {
		var dataUrl = canvas.toDataURL();
		//sigText.innerHTML = dataUrl;
		//sigImage.setAttribute("src", dataUrl);
		/* var sigItem = prompt('Enter name');
		if('' != sigItem && null != sigItem){alert(sigItem)}else if(null == sigItem){return;}else{sigItem = prompt('please enter a name then click OK');}
		 */
		//navigator.notification.confirm("Are you sure you want to exit ?",onConfirm, "Confirmation", "Yes,No");
		/* swal({
			  title: "An input!",
			  text: 'Filename:',
			  type: 'input',
			  showCancelButton: true,
			  closeOnConfirm: true,
			  animation: "slide-from-top"
			}, function(inputValue){
			  //console.log("You wrote", inputValue);
			  // downloadCanvas(submitBtn, 'sig-canvas', inputValue);
			  console.log("linkit  ",submitBtn);
				submitBtn.href = document.getElementById('sig-canvas').toDataURL();
				submitBtn.download = inputValue;
			}); */
		//	downloadCanvas(dataUrl);
	/* 		var url = 'https://cordova.apache.org';
   var target = '_blank';
   var options = "location=yes"
   var ref = cordova.InAppBrowser.open(dataUrl, target, options);
   var codes = "document.write('<a  href="+dataUrl+" download=test.png>";
			ref.executeScript({
            code: codes+"Download</a>');"
        }, function() {
            ;
        }); */
		
		window.canvas2ImagePlugin.saveImageDataToLibrary(
        function(msg){
            alert(msg);
        },
        function(err){
            alert(err);
        },
        canvas
    );
		
	});
	function downloadCanvas(durl) {
		
			var fileTransfer = new FileTransfer();
		    var uri = durl;
			console.log(uri)
			var fileURL =  "///storage/emulated/0/Downloads/myFile";

		   fileTransfer.download(
			  uri, fileURL, function(entry) {
				 console.log("download complete: " + entry.toURL());
			  },
				
			  function(error) {
				 console.log("download error source " + error.source);
				 console.log("download error target " + error.target);
				 console.log("download error code" + error.code);
			  },
				
			  true, {
				 headers: {
					"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
				 }
			  }
		   );
		
	}
	function onConfirm(button) {
		alert('inside confirm');
	}

	// Set up mouse events for drawing
	var drawing = false;
	var mousePos = { x:0, y:0 };
	var lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e) {
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
		if (drawing) {
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	function clearCanvas() {
		canvas.width = canvas.width;
	}

	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

})();
