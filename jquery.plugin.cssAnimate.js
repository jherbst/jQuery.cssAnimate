; (function ($, window, document, undefined) {
	//====================================================================================================
	//	Adds a cssAnimate function to jquery
	//		-	Works the same as the jquery.animate function and recieves the same parameters
	//		-	The parameters aside from transforms(the styles and values to be animated ) are optional
	//		-	Fallback to jquery.animate if css transitions are not supported
	//
	//====================================================================================================

    jQuery.fn.cssAnimate = function (transforms, time, easing, onAnimateComplete) {
    	var hasTransitions;

    	//Test for css transitions
		//Use Modernizr if available
    	if (typeof Modernizr != 'undefined' && typeof Modernizr.csstransitions != 'undefined') {
    		hasTransitions = Modernizr.csstransitions;
    	}
		//Else test the style for transitions
    	else {
    		
    		var s = document.createElement('p').style;

			hasTransitions = 'transition' in s ||
                          'WebkitTransition' in s ||
                          'MozTransition' in s ||
                          'msTransition' in s ||
                          'OTransition' in s;
    	}
		//Adjust for optional inputs
    	if (typeof time != 'number') {
    		onAnimateComplete = easing;
    		easing = time;
    		time = 400;
    	}
    	if (typeof easing == 'function') {
    		onAnimateComplete = easing;
    		easing = '';
    	}

		//return this for jquery chaining
        return this.each(function () {

			//if it has css transitions set up the transitions and change the css
        	if (hasTransitions) {
        		var transitionEnd = "transitionend",
					transitions = '',
                    i = 0;

        		// get the transition end event for the css animation
                if ($.browser.webkit) { transitionEnd = "webkitTransitionEnd"; }
                else if ($.browser.opera) { transitionEnd = "oTransitionEnd"; }

                if (typeof onAnimateComplete === 'function') {
                    this.addEventListener(transitionEnd, function (event) {
                        // remove this event listener
                        this.removeEventListener(transitionEnd, arguments.callee, false);
                    	// callback method here...
                        $(this).css({
                        	'-webkit-transition': '',
                        	'-moz-transition': '',
                        	'-o-transition': '',
                        	'-ms-transition': '',
                        	'transition': ''
                        });
                        onAnimateComplete();
                    }, false);
                }

                if (easing == 'swing') {
                	easing = 'ease';
                }
                //set a transition for all transforms
                for (var index in transforms) {
                	if (transitions != ''){
                		transitions += ', ';
                	}
                	transitions += index + ' ' + time + 'ms ' + easing
                }
                $(this).css({
                    '-webkit-transition': transitions,
                    '-moz-transition': transitions,
                    '-o-transition': transitions,
                    '-ms-transition': transitions,
                    'transition': transitions
                });
                
                
                // apply the new style
                $(this).css(transforms);
            }

			//If there is no CSS Transitions passthrough to the jquery.animate function
            else {
            	
            	if (easing != 'linear') {
            		easing = 'swing';
            	}
            	if (typeof onAnimateComplete != 'function') {
            		onAnimationComplete = function () { };
            	}

                $(this).animate(transforms, time, easing, onAnimateComplete);

            }
        });
    };

})(jQuery, window, document);
