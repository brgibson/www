function PuzzleGenerator() {};

PuzzleGenerator.prototype.generate = function() {
	
	/**
	 * Builds a basic 2d array representing the puzzle.
	 */
	var puzzle = function() {
		var baseRow = [1,2,3,4,5,6,7,8,9];
	
		var puzzle = [];
		var miniOffset = 0;
		var offset = 0;

		for (var k = 0; k < 3; k++) {
			for (var j = 0; j < 3; j++) {
				var row = [];
				for (var i = 0; i < 9; i++) {
					row.push(baseRow[(i + offset + miniOffset) % 9]);
				}	
			
				puzzle.push(row);
				miniOffset = (miniOffset + 3) % 9;
			}
			offset++;	
		}

		return puzzle;
	}();
	
	var coordinates = [];
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			
			var rand = Math.random();
			if (rand < .5) {
				coordinates.push({
					"Row": i + 1,
					"Column": j + 1,
					"Number": puzzle[i][j]
				});
			}
		}
	}
	
	return coordinates;
};

