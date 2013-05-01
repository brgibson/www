function gridAnimator(	grid,
												animationsDiv,
												nextButton,
												previousButton,
												animateButton,
												animateBackwardsButton,												
												animationDelayInput,
												animationDelayElement,												
												stopAnimationButton) {
	
	//these methods exist in two places, might want to consolidate
	var elements = animationsDiv.getElementsByTagName('td');		
	var getSquare = function(row, col) {
		return elements[grid.columns * (row - 1) + (col - 1)];
	};
	
	var next = function() {
		if (grid.solution.hasNext()) {
			var solvedSquare = grid.solution.next();
			var gridElement = getSquare(solvedSquare.row, solvedSquare.column).getElementsByTagName('span')[0];
		
			gridElement.innerHTML = solvedSquare.solution;
			gridElement.className = ""; //in case this square was previously marked as incorrect	
		
			return true;	
		} else {
			return false;
		}
	}
			
	var previous = function() {
		if (grid.solution.hasPrevious()) {
			var solvedSquare = grid.solution.previous();
			getSquare(solvedSquare.row, solvedSquare.column).getElementsByTagName('span')[0].innerHTML = "";
			
			return true;	
		} else {
			return false;
		}
	}
	
	var animationEvent = null;
	var animationDelay = animationDelayInput.value;
	var animate = function() {
		window.clearTimeout(animationEvent);
		animateBackwardsButton.onclick = animateBackwards;
		animateButton.onclick = null;
		animateRecur();
	}
	var animateBackwards = function() {
		window.clearTimeout(animationEvent);
		animateButton.onclick = animate;
		animateBackwardsButton.onclick = null;
		animateBackwardsRecur();
	}
	var animateRecur = function() { 
		if (next()) {
			animationEvent = window.setTimeout(animateRecur, animationDelay);
		}
	}
	var animateBackwardsRecur = function() { 
		if (previous()) {
			animationEvent = window.setTimeout(animateBackwardsRecur, animationDelay);
		}
	}

	var stopAnimation = function() {
		//stop the current animation
		window.clearTimeout(animationEvent);
				
		//add the event listener back onto the animation button element
		animateButton.onclick = animate;
		animateBackwardsButton.onclick = animateBackwards;
	}
	
	nextButton.onclick = next;
	previousButton.onclick = previous;
	animateButton.onclick = animate;
	animateBackwardsButton.onclick = animateBackwards;
	stopAnimationButton.onclick = stopAnimation;													
	animationDelayInput.onchange = function() {
		var maxValue = 1007;
		animationDelayElement.innerHTML = (maxValue - animationDelayInput.value) / 1000;
		animationDelay = maxValue - animationDelayInput.value;
	};
}