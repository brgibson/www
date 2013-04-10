function Grid() {};

Grid.prototype.subGridRows = 3;
Grid.prototype.subGridColumns = 3;

Grid.prototype.rows = 9;
Grid.prototype.columns = 9;

/**
	A wrapper for ann array that keeps track of a curr index

	Ex: 
	{
		"index": 0,
		"solutions':[
			{"r":1, "c":1, "n":9},
			{"r":1, "c":2: "n":8}
		]
	}
 */
Grid.prototype.solution = 
	{
		"index":0, // might be interesting to wrap these in a closure instead of being part of this json object?
		"solutions": [],
		"hasNext": function() {
			return this.index < this.solutions.length;
		},
		"next": function () {
			return this.hasNext() ? this.solutions[this.index++] : null;
		},
		"hasPrevious": function() {
			return this.index - 1 >= 0;
		},
		"previous": function () {
			return this.hasPrevious() ? this.solutions[--this.index] : null;
		},
		"addSolution": function(square) {
			this.solutions[this.solutions.length] = square;
		}
	};


Grid.prototype.initialize = 
	function() {
		this.grid = new Array();

		for (var r = 0; r < this.rows; r++) {

			var row = new Array(this.columns);			

			for (var c = 0; c < this.columns; c++) {
				var square = new Square();

				square.initialize();
				square.row = r + 1;
				square.column = c + 1;				

				square.subGrid = Math.floor(c / this.subGridColumns) + (Math.floor(r / this.subGridRows) * this.subGridColumns);

				row[c] = square;
			}

			this.grid.push(row);
		}
	};

Grid.prototype.get = 
	function(row, column) {
		return this.grid[row -1][column -1];
	}

Grid.prototype.toString =
	function() {
		var gridStr = "<table>";
		
		//TODO - make the cols work for non 9x9 puzzles
		gridStr += "<col span='2'/>";
		gridStr += "<col class='rightSubCol'/>";
		gridStr += "<col span='2'/>";
		gridStr += "<col class='rightSubCol'/>";
		gridStr += "<col span='3'/>";
		
		var square;
		
		for (var r = 0; r < this.rows; r++) {
			
			var rowClass = this.getRowClass(r);
			gridStr += "<tr" + rowClass + ">";			
				
			for (var c = 0; c < this.columns; c++) {
				square = this.grid[r][c];				
				var id = ' id="' + (r+1) + "," + (c+1) + '" ';

				var colClass = 'class="';

				if (square.original) {
					colClass += " original ";
				}

				if (colClass == 'class="') {
					colClass = "";
				} else {
					colClass += '"';
				}

				gridStr += "<td " + colClass + id + ">";
				gridStr += square.toString(); 
				gridStr += "</td>"
			}
			gridStr += "</tr>";
		}
		gridStr += "</table>";
		return gridStr;
	};

Grid.prototype.getRowClass = 
	function(rowNumber) {			
		if ((rowNumber % this.subGridRows) == (this.subGridRows - 1)) {
			return ' class="bottomSubRow"';
		} else {
			return "";
		}
	};

/**
 Takes the following array of json objects:

	var coordinates = [
		{"Row": "1", "Column": "3", "Number": "1"},
		{"Row": "2", "Column": "3", "Number": "2"}
	];

*/
Grid.prototype.addNumbersToGrid = 
	function(coordinates) {
		var row;
		var col;
		var num;		

		for(var i = 0; i < coordinates.length; i++) {
			row = coordinates[i].Row;
			col = coordinates[i].Column;
			num = coordinates[i].Number;

			var square = this.get(row, col);
			square.setSolution(num);
			square.original = true;
			this.updateSubGridPossWhenSolutionFound(square.subGrid, num);
			this.updateRowColPossibleSolution(row, col, num);
		}
	};

Grid.prototype.updatePossibilities = 
	function(row, column) {
		var square = this.get(row, column);
		var alreadySolved = square.isSolved();
		var foundSolution = square.solve();		
		
		if (foundSolution && !alreadySolved) {
			this.solution.addSolution(square);
		}

		if (foundSolution) {
			this.updateSubGridPossWhenSolutionFound(square.subGrid);
			this.updateRowColPossibleSolution(square.row, square.column, square.solution);
		}

		if(!square.isSolved()) {	
	
			var rowPossibilities = this.getPossibilitiesForRow(row);
						
			for (var i = 0; i < this.rows; i++) {
				if(!rowPossibilities[i]) {
					square.possible[i] = false;
				}
			}
	
			var colPossibilities = this.getPossibilitiesForCol(column);	
		
			for (var i = 0; i < this.columns; i++) {
				if(!colPossibilities[i]) {
					square.possible[i] = false;
				}
			}
	
			var groupPossibilities = this.getPossibilitiesForGroup(square.subGrid);
			
			for (var i = 0; i < this.columns; i++) {
				if(!groupPossibilities[i]) {
					square.possible[i] = false;
				}
			}
		}
	};

Grid.prototype.getPossibilitiesForRow =
	function(row) {
		
		var possibilities = new Array(this.rows);

		for (var i = 0; i < this.rows; i++) {
			possibilities[i] = true;
		}		


		var square;
		for (var i = 1; i <= this.rows; i++) {
			square = this.get(row, i);
			
			if (square.isSolved()) {
				possibilities[square.solution - 1] = false;
			}

		}
		
		return possibilities;
	};

Grid.prototype.getPossibilitiesForCol =
	function(col) {
		
		var possibilities = new Array(this.rows);

		for (var i = 0; i < this.columns; i++) {
			possibilities[i] = true;
		}		


		var square;
		for (var i = 1; i <= this.columns; i++) {
			square = this.get(i, col);
			
			if (square.isSolved()) {
				possibilities[square.solution - 1] = false;
			}

		}
		
		return possibilities;
	};


Grid.prototype.getPossibilitiesForGroup =
	function(subGrid) {
		
		var possibilities = new Array(this.rows);

		for (var i = 0; i < this.columns; i++) {
			possibilities[i] = true;
		}		


		var square;
		var squares = this.getGroup(subGrid);

		for (var i = 0; i < squares.length; i++) {
			square = squares[i];
			
			if (square.isSolved()) {
				possibilities[square.solution - 1] = false;
			}

		}
		
		return possibilities;
	};

Grid.prototype.getGroup =
	function(subGrid) {
		
		var squares = new Array();	

		for (var r = 0; r < this.rows; r++) {
			for (var c = 0; c < this.columns; c++) {
				var square = this.grid[r][c];

				if (square.subGrid == subGrid) {
					squares.push(square);	
				}
			}
		}
		
		return squares
	};

/*Grid.prototype.checkAndUpdateForOnlyOptionInSubGrid =
	function(subGrid, n) {
		var squares = this.getGroup(subGrid);

		var count = 0;
		var square;
		var squareToUpdate;

		for (var i = 0; i < squares.length; i++) {
			square = squares[i];

			if (!square.isSolved()) {
				if (square.possible[n - 1]) {
					count++;
					squareToUpdate = square;
				}
			}
		}

		if (count == 1) {
			squareToUpdate.setSolution(n);
			//document.getElementById(squareToUpdate.row + "," + squareToUpdate.column).innerHTML = squareToUpdate.toString();
			this.updateSubGridPossWhenSolutionFound(squareToUpdate.subGrid, n);
			this.updateRowColPossibleSolution(squareToUpdate.row, squareToUpdate.column, n);
		}
		
//		return possibilities;
	};

*/

Grid.prototype.checkAndUpdateForOnlyOptionInSubGridHelper =
	function(squares, n) {

		var count = 0;
		var square;
		var squareToUpdate;

		for (var i = 0; i < squares.length; i++) {
			square = squares[i];

			if (!square.isSolved()) {
				if (square.possible[n - 1]) {
					count++;
					squareToUpdate = square;
				}
			}
		}

		if (count == 1) {
			squareToUpdate.setSolution(n);

			//these three methods should be wrapped
			this.solution.addSolution(squareToUpdate);
			this.updateSubGridPossWhenSolutionFound(squareToUpdate.subGrid, n);
			this.updateRowColPossibleSolution(squareToUpdate.row, squareToUpdate.column, n);

			return true;
		} else {
			return false;
		}
	};


Grid.prototype.checkAndUpdateForOnlyOptionInSubGrid =
	function(subGrid, n) {
		var squares = this.getGroup(subGrid);
		for (var i = 1; i <= (this.subGridRows * this.subGridColumns); i++) {
			this.checkAndUpdateForOnlyOptionInSubGridHelper(squares, i);
		}
	};


//recursive for timeout
Grid.prototype.checkAndUpdateForOnlyOptionInSubGrid =
	function(subGrid, n) {
		var squares = this.getGroup(subGrid);
		this.checkAndUpdateForOnlyOptionInSubGridRecur(squares, 1);
	};

Grid.prototype.checkAndUpdateForOnlyOptionInSubGridRecur =
	function(squares, i) {
		if (i <= this.rows) {
			this.checkAndUpdateForOnlyOptionInSubGridHelper(squares, i);
			this.checkAndUpdateForOnlyOptionInSubGridRecur(squares, i + 1);
		}
		
	};

Grid.prototype.solvePuzzle = 
	function() {

		for (var r = 1; r <= this.rows; r++) {
			for (var c = 1; c <= this.columns; c++) {
				this.updatePossibilities(r, c);	
			}
		}

		for (var subGrid = 0; subGrid < (this.subGridRows * this.subGridColumns); subGrid++) {
	
			var squares = this.getGroup(subGrid);
			for (var i = 1; i <= (this.subGridRows * this.subGridColumns); i++) {
				this.checkAndUpdateForOnlyOptionInSubGridHelper(squares, i);
			}	
		}

		for (var r = 1; r <= this.rows; r++) {
			for (var c = 1; c <= this.columns; c++) {
				this.updatePossibilities(r, c);	
			}
		}
	};



Grid.prototype.updateSubGridPossWhenSolutionFound = 
	function(subGrid, solution) {
		var squares = this.getGroup(subGrid);

		for (var i = 0; i < squares.length; i++) {
			square = squares[i];

			if (square.solution != solution) {
				square.possible[solution - 1] = false;
			}
		}
		
	}

Grid.prototype.updateRowColPossibleSolution = 
	function(row, col, solution) {
		
		//update column mates possible solutions
		for (var c = 1; c <= this.columns; c++) {
			square = this.get(row, c);

			if (square.solution != solution) {
				square.possible[solution - 1] = false;
			}
		}

		//update row mates possible solutions
		for (var r = 1; r <= this.rows; r++) {
			square = this.get(r, col);

			if (square.solution != solution) {
				square.possible[solution - 1] = false;
			}
		}
	}
