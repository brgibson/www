function Square() {};

Square.prototype.row;
Square.prototype.column;

/**
 * The amount of numbers in the sudoku puzzle.  9 == [1-9]
 */
Square.prototype.numbers = 9;

/**
 * An array containing <numbers> booleans.  The boolean at the 
 * index represents if the numberical value of the index is 
 * a possible solution for the puzzle.
 */
//Square.prototype.possible = new Array(Square.numbers);

/**
 * The subGrid that contains this Square.
 */
Square.prototype.subGrid = -1;

/**
 * Initializes the possibe array.
 */
Square.prototype.initialize = 
	function() {
		this.possible = new Array(Square.numbers);

		for (var i = 0; i < this.numbers ; i++) {
			this.possible[i] = true;
		}
	};

/**
 * Takes a number in question and returns a boolean
 * representing if that number is a possible solution
 * for this square.
 */
Square.prototype.isPossible =
	function(numberInQuestion) {
		return this.possibile[numberInQuestion - 1];
	};
	
/**
 * The solution for this square;
 */
Square.prototype.solution = null;

Square.prototype.isSolved = 
	function() {
		return this.solution != null;
	};
	
Square.prototype.setSolution = 
	function(n) {
		this.solution = n;
	};

Square.prototype.toString =
	function() {
		if (this.isSolved()) {
			if (this.original) {
				return "<b>" + this.solution + "</b>";
			} else {
				return "<span>" + this.solution + "</span>";
			}
		} else {
			return "<span></span>";
			/*return "<select>" +
					"<option></option>" +
					"<option>1</option>" +
					"<option>2</option>" +
					"<option>3</option>" +
					"<option>4</option>" +
					"<option>5</option>" +
					"<option>6</option>" +
					"<option>7</option>" +
					"<option>8</option>" +
					"<option>9</option>" +
				"</select>";*/			
		}
	};
	

Square.prototype.solve = 
	function() {	

		var numbersLeft = 0;	
		var solution = null;	

		for (var i = 0; i < this.numbers; i++) {
			if(this.possible[i]) {
				numbersLeft++;
				solution = i + 1;
			}
		}

		if (numbersLeft == 1) {
			this.setSolution(solution);
			return true;
		} else {
			return false;
		}
	};