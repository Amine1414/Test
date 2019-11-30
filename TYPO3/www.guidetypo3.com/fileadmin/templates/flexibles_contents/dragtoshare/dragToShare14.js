$(function() {
	
	//cache selector
	var images = $(".dragtoshare img"),
	  //title = $("title").text() || document.title;
	  title = images.attr("alt");
	  //lienart = images.attr("longdesc");
	  lienart = window.location.href;
	
	//make images draggable
	images.draggable({
	  //create draggable helper
	  helper: function() {
		return $("<div>").attr("id", "helper").html("<span>" + $(this).attr("alt") + "</span><img id='thumb' src='" + $(this).attr("src") + "' alt='thumb' /></div>").appendTo("body");
	  },
	  cursor: "pointer",
	  cursorAt: { left: -10, top: 20 },
	  zIndex: 99999,
	  //show overlay and targets
	  start: function() {
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		if (self.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth; 
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		
		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
		
		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){	
			pageWidth = xScroll;		
		} else {
			pageWidth = windowWidth;
		}
		
		$("<div>").attr("id", "overlay").css({
			"opacity":	0.7,
			"width":	pageWidth,
			"height":	pageHeight
		}).appendTo("body");
		$("#tip").remove();
		$(this).unbind("mouseenter");
		$("#targets").css("left", ($("body").width() / 2) - $("#targets").width() / 2).slideDown();
	  },
	  //remove targets and overlay
	  stop: function() {
		$("#targets").slideUp();
		$(".share", "#targets").remove();
		$("#overlay").remove();
		$(this).bind("mouseenter", createTip);
	  }
	});
	
	//make targets droppable
	$("#targets li").droppable({
	  tolerance: "pointer",
	  //show info when over target
	  over: function() {
		$(".share", "#targets").remove();
		$("<span>").addClass("share").text("Share on " + $(this).attr("id")).addClass("active").appendTo($(this)).fadeIn();
	  },
	  drop: function() {
		var id = $(this).attr("id"),
		  currentUrl = window.location.href,
		  baseUrl = $(this).find("a").attr("href");

		if (id.indexOf("twitter") != -1) {
		  window.location.href = baseUrl + "/home?status=" + title + ": " + lienart;
		} else if (id.indexOf("delicious") != -1) {
		  window.location.href = baseUrl + "/save?url=" + lienart + "&amp;title=" + title;
		} else if (id.indexOf("facebook") != -1) {
		  window.location.href = baseUrl + "/sharer.php?u=" + lienart + "&amp;t=" + title;
		}
	  }		  
	});
  
	var createTip = function(e) {
	  //create tool tip if it doesn't exist
	  ($("#tip").length === 0) ? $("<div>").html("<span>Déplacer pour partager l'article</span><span class='arrow'></span></div>").attr("id", "tip").css({ left:e.pageX + 30, top:e.pageY - 16 }).appendTo("body").fadeIn(2000) : null;
	};
	
	images.bind("mouseenter", createTip);
	
	images.mousemove(function(e) {
	
	  //move tooltip
	  $("#tip").css({ left:e.pageX + 30, top:e.pageY - 16 });
	});
  
	images.mouseleave(function() {
	
	  //remove tooltip
	  $("#tip").remove();
	});
});