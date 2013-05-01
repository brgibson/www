function numberChooser(	grid,
												animationsDiv,
												numberChooserDiv,
												numberChooserWrapper) {

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
					numberChooserWrapper.className = "numberChooser hidden";
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
					numberChooserWrapper.className = "numberChooser";
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