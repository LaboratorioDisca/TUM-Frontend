$(document).ready(function() {
	// for sequence.js
	$status = $(".status");
	
	// for scrollTo
	$(window)._scrollable();
	
	$('.home-trigger').bind('click', function() {
		$(window).scrollTo($('#home'), 1000, { onAfter: function() {
			homeSelect();
		}});
	});

	$('.about-trigger').bind('click', function() {
		$(window).scrollTo($('#about'), 1000, { onAfter: function() {
			aboutSelect();
		}});
	});

	$('.team-trigger').bind('click', function() {
		$(window).scrollTo($('#team'), 1000, { onAfter: function() {
			teamSelect();
		}});
	});
	
	$('.details-trigger').bind('click', function() {
		$(window).scrollTo($('#details'), 1000, { onAfter: function() {
			detailsSelect();
		}});
	});

	$('.contribute-trigger').bind('click', function() {
		$(window).scrollTo($('#contribute'), 1000, { onAfter: function() {
			contributeSelect();
		}});		
	});
	
	 var homeTop = $('#home').offset().top;
	 var aboutTop = $('#about').offset().top;
	 var teamTop = $('#team').offset().top;
	 var detailsTop = $('#details').offset().top;
	 var contributeTop = $('#contribute').offset().top;
	
	$(document).scroll(function() {

     var top = $(document).scrollTop();
		
     if (top > homeTop && top < homeTop+$('#home').height()) {
         homeSelect();
     }
     else if (top > aboutTop && top < aboutTop+$('#about').height()) {
         aboutSelect();
     } 
		 else if (top > teamTop && top < teamTop+$('#team').height()) {
         teamSelect();
     }
		 else if (top > detailsTop && top < detailsTop+$('#details').height()) {
         detailsSelect();
     }
     else if (top > contributeTop && top < contributeTop+$('#contribute').height()) {
         contributeSelect();
     }
	});
	

	
	var contributeSelect = function() {
		$('.menu-link').removeClass('active');
		$('.contribute-trigger').addClass('active');
	}
	
	var detailsSelect = function() {
		$('.menu-link').removeClass('active');
		$('.details-trigger').addClass('active');
	}
	
	var aboutSelect = function() {
		$('.menu-link').removeClass('active');
		$('.about-trigger').addClass('active');
	}
	
	var teamSelect = function() {
		$('.menu-link').removeClass('active');
		$('.team-trigger').addClass('active');
	}
	
	var homeSelect = function() {
		$('.menu-link').removeClass('active');
		$('.home-trigger').addClass('active');
	}
	
	var toogleSequence = function(toogle) {
		if(toogle) {
			$('#sequence').css({ opacity: 1 });
		} else {
			$('#sequence').css({ opacity: 0 });
		}
	}
	
	var options = {	
		autoPlayDelay: 4000,
		hidePreloaderDelay: 500,
		nextButton: true,
		prevButton: true,
		pauseButton: true,
		hidePreloaderusingCSS: false,	
		animateStartingFrameIn: true,
		transitionThreshold: 500,
		pauseOnHover: false,
		customKeyEvents: {
			80: "pause"
		},
		afterNextFrameAnimatesIn: function(){
			if(sequence.settings.autoPlay){
				$status.addClass("active").css("opacity", 1);
			}
			$(".prev, .next").css("cursor", "pointer").animate({"opacity": 1}, 500);
		},
		beforeCurrentFrameAnimatesOut: function(){
			$status.animate({"opacity": 0}, 500, function(){
				$status.removeClass("active");
			});
			$(".prev, .next").css("cursor", "auto").animate({"opacity": .7}, 500);
		},
		paused: function(){
			$status.animate({"opacity": 0}, 500, function(){
				$status.removeClass("active").addClass("paused");
			});
		},
		unpaused: function(){
			$status.removeClass("active paused");
		}
	};

	var sequence = $("#sequence").sequence(options).data("sequence");

	$("#nav li").click(function(){
		if(!sequence.active){
			$(this).children("img").removeClass("active").children("img").addClass("active");
			sequence.nextFrameID = $(this).index()+1;
			sequence.goTo(sequence.nextFrameID);
		}
	});
	
	$('.controls').delay(1000).fadeIn(3000);
	
	
	// details context
	
	$('.grid li').bind('mouseenter', function() {
		$('.grid li').removeClass('active');
		var type = $(this).attr('class').split(' ')[0];
		$(this).addClass('active');
		
		$('#screen-container').children().hide();
		
		var elementToShow = "#"+type+"_ios";
		$($('#screen-container').children(elementToShow)[0]).show();
	});
});
