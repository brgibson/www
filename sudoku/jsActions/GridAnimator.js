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

/* we might want to move this out into it's own class */
function gridSolutionDisplayer(	grid,
																animationsDiv) {

	//these methods exist in two places, might want to consolidate
	var elements = animationsDiv.getElementsByTagName('td');																
	var getSquare = function(i) {

		/*
			[0-8] -> 1
			[9-17] -> 2
			[72-80] -> 9
		*/
		var row = Math.floor(i / 9) + 1;
		
		/*
			[0,9,27...] -> 1
			[1,10,28...] -> 2
			[8,17,35...] -> 9
		*/
		var col = (i % 9) + 1;
		return grid.get(row, col);

	};

	for (var i = 0; i < elements.length; i++) {
		elements[i].onclick = function(square) {
 			if (!square.original) {
	 			return function() {
 					if (this.isDisplayed) {
 						this.innerHTML = "";
 					} else {
						this.innerHTML = square;
 					}
 					this.isDisplayed = !this.isDisplayed;
	 			};
	 		} 
		}(getSquare(i));
 	}
}



/* we might want to move this out into it's own class */
function numberChooser(	grid,
												animationsDiv,
												numberChooserDiv) {

	//these methods exist in two places, might want to consolidate
	var elements = animationsDiv.getElementsByTagName('td');																
	var getSquare = function(i) {
		var row = Math.floor(i / 9) + 1;
		var col = (i % 9) + 1;
		return grid.get(row, col);
	};

	var numberChooserElements = numberChooserDiv.getElementsByTagName('td');

	//add the reference to the selected square in the grid
	numberChooserDiv.selectedGridElem = null;
	numberChooserDiv.selectedSolution = null; 

	//add the event handler to each square in the numberChooserDiv that
	//returns the chosen number.
	for (var i = 1; i <= 9; i ++) {
		numberChooserElements[i - 1].onclick = function(value) {
			
			return function() {

				if (animationsDiv.discardMode) {			
					if (numberChooserDiv.selectedGridElem.discarded[value]) {
						this.className = "";
						numberChooserDiv.selectedGridElem.discarded[value] = false;
					} else {
						this.className = "discarded";						
						numberChooserDiv.selectedGridElem.discarded[value] = true;
					}
				} else if (this.className != "discarded") { //only let the user select the number if they haven't discarded it
				
					//update the grid element with the chosen value
					numberChooserDiv.selectedGridElem.innerHTML = value;
					
					//add the correctness styling
					if (numberChooserDiv.selectedSolution == value) {
						numberChooserDiv.selectedGridElem.className = "";
					} else {
						numberChooserDiv.selectedGridElem.className = "incorrect";
					}
					
					//deselect the previously selected grid element
		 			var prevGridElemParent = numberChooserDiv.selectedGridElemParent;
		 			if (prevGridElemParent && prevGridElemParent.className && prevGridElemParent.className.length >= 7) {
		 				prevGridElemParent.className = prevGridElemParent.className.substr(0, prevGridElemParent.className.length - 7);
		 			}

					//set meta info
					numberChooserDiv.selectedGridElem = null;				
					numberChooserDiv.selectedGridElemParent = null;				
					numberChooserDiv.selectedSolution = null;
					
					//hide the number chooser
					numberChooserDiv.className = "hidden";
				}
			 };
			 
		}(i);
	}	
  
  //add the event handler to each square in the grid that updates
  //the number chooser
	for (var i = 0; i < elements.length; i++) {
		elements[i].onclick = function(square, gridElem, gridElemParent) {
 			if (!square.original) {
		 	
		 		//initialize discarded solutions for this square
		 		gridElem.discarded = [];
		 		for (var j = 0; j <= 9; j++) { gridElem.discarded[j] = false; };
			 		
		 		return function() {
							 		
		 			//deselect the previously selected grid element
		 			var prevGridElemParent = numberChooserDiv.selectedGridElemParent;
		 			if (prevGridElemParent && prevGridElemParent.className && prevGridElemParent.className.length >= 7) {
		 				prevGridElemParent.className = prevGridElemParent.className.substr(0, prevGridElemParent.className.length - 7);
		 			}
		 		
		 			//color the elements in the number chooser
					var discarded = gridElem.discarded;
		 			var curr = gridElem.innerHTML;
		 			for (var j = 1; j <= 9; j++) {
			 			if (curr == j) {
			 				numberChooserElements[j - 1].className = "chosen";
			 			} else if (discarded[j]) {
			 				numberChooserElements[j - 1].className = "discarded";
			 			} else {
			 				numberChooserElements[j - 1].className = "";
			 			}
			 		}
			 		
			 		//set meta info
		 			numberChooserDiv.selectedGridElem = gridElem;
					numberChooserDiv.selectedGridElemParent = gridElemParent;
		 			numberChooserDiv.selectedSolution = square.solution;

					//mark your grid element as selected
					gridElemParent.className += " chosen";
				
					
					//show the number chooser
					if (animationsDiv.discardMode) {
						numberChooserDiv.className = "discardMode";
					} else {
						numberChooserDiv.className = "";
					}
		 		};
	 		
	 		} 
		}(getSquare(i), elements[i].getElementsByTagName("span")[0], elements[i]);
 	}
}