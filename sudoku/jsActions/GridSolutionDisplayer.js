/**
  logic for selecting row in getSquare method:
 
			[0-8] -> 1
			[9-17] -> 2
			[72-80] -> 9

	logic for selection col in getSquare method:
	
			[0,9,27...] -> 1
			[1,10,28...] -> 2
			[8,17,35...] -> 9
 */			

function gridSolutionDisplayer(	grid,
																animationsDiv) {

	//these methods exist in two places, might want to consolidate
	var elements = animationsDiv.getElementsByTagName('td');																
	var getSquare = function(i) {
		var row = Math.floor(i / 9) + 1;
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