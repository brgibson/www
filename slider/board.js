function Board()
{	
	
	
//Instance Variables---------------------------------------------------------------	
	///////////////////////////////////////////////////////////////////////////////////////
	// This sets the default board and the default board Settings.
	
	this.board = new Array(10); 
	
	
	this.board[0] = new Array(1, 1, 1, 0, 1, 1, 1, 1, 1, 1); 
	this.board[1] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1); 
	this.board[2] = new Array(1, 1, 1, 1, 1, 1, 0, 1, 1, 1); 
	this.board[3] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 0); 
	this.board[4] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1); 
	this.board[5] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 2); 
	this.board[6] = new Array(1, 1, 0, 1, 1, 1, 1, 1, 1, 1); 
	this.board[7] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1); 
	this.board[8] = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1); 
	this.board[9] = new Array(1, 1, 1, 1, 1, 1, 1, 0, 1, 1);  
	
	this.numRows = 10;
	this.numCols = 10;
	
	this.moveHappeningFlag = false;
	this.exitDir = 'right';
	this.hasWon = false;
	this.boardCellWidth = 3;
	this.boardCellHeight = 2;
	this.boardFactor = 1;
	this.moveSpeedX = this.boardCellWidth / 5;
	this.moveSpeedY = this.boardCellHeight / 4;
	this.currRow = 0;
	this.currCol = 0;
	this.t;
	
	this.getNumCols = 
		function getNumCols() {
			return this.numCols;	
		}
		
	this.getNumRows = 
		function getNumRows() {
			return this.numRows;	
		}
	
	this.getExitDir =
		function getExitDir() {
			return this.exitDir;	
		}
		
	
	////////////////////////////////////////////////////////////////////////////////////
	
	this.blocked;
	
	this.setBlocked =
		function setBlocked()
		{
			this.blocked = new Array(this.getNumRows());
			
			for(var i = 0; i < this.getNumRows(); i++)
			{
				this.blocked[i] = new Array(0);
				
				for(var x = 0; x < this.getNumCols(); x++){
					if(!this.board[i][x])
					{
						this.blocked[i].push(x * (this.boardCellWidth * this.boardFactor));
					}
				}
			}
		}
		
	this.setBlocked();
	
	////////////////////////////////////////////////////////////////////////////////////

	
//----------------------------------------------------------------------------------

//Functions-------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////
	

	this.resetBoard =
		function resetBoard(left, top) {
			this.hasWon = false;
			this.moveHappeningFlag = false;
			document.getElementById('moveMe').style.left = left + "em";
			document.getElementById('moveMe').style.top = top + "em";	
		}
	/*
	 * Reads a string and sets the board.  The first integer of the string is the number of rows.  The next integer must be the number of columns.  
	 * The third integer must be the direction that the exit is in (up, down, left, or right). The rest are the corresponding integers in row order 
	 * from right to left.  The integer 1 represents a empty space.  The integer 0 represents a blocked space. The integer 2 represents the exit. 
	 */
	this.read =
		function read(str) {
						
			var ans = new Array(0);
			var strArr = str.split(" ");
			var i = 0;
					
			this.numCols = parseInt(strArr[i]); i++;
			this.numRows = parseInt(strArr[i]); i++;
			this.exitDir = strArr[i]; i++;
			var startCol = parseInt(strArr[i]); i++;
			var startRow = parseInt(strArr[i]); i++;
			
			this.currCol = startCol - 1;
			this.currRow = startRow - 1;
						
			startCol = ((startCol - 1) * this.boardCellWidth) * this.boardFactor;
			startRow = ((startRow - 1) * this.boardCellHeight) * this.boardFactor;	
					
			for(var y = 0; y < this.numRows; y++)
			{
				var rowArr = new Array(0);
				
				for(var x = 0; x < this.numCols; x++)
				{
					rowArr.push(parseInt(strArr[i])); i++;
				}
				
				ans.push(rowArr);
			}
			
			this.board = ans;
			this.setBlocked();
			this.resetBoard(startCol, startRow);
		}
	
	this.addRow =
		function addRow(rowArray) {
			this.board.push(rowArray);
		}
	
	this.toString = 
		function toString()
		{
			
			var boardStr = "<table>";
			
			for(var y = 0; y < this.getNumRows(); y++)
			{
				boardStr += "<tr>";
				
				for(var x = 0; x < this.getNumCols(); x++)
				{					
					if(!this.board[y][x])
					{								
						boardStr += "<td class='brick'><span>Brick</span></td>";
					}
					else if(this.board[y][x] == 2)
					{
						boardStr += "<td class='exit'><span>EXIT</span><i class='icon-arrow-" + this.exitDir + "'></i></td>";
					} 
					else 
					{
						boardStr += "<td></td>";
					}
					 
				}
				
				boardStr += "</tr>";
			}
			
			boardStr += "</table>";
			return boardStr;
		}
		
	this.writeBoard =
		function writeBoard()
		{
			document.getElementById("board").innerHTML= this.toString();
		}
		
	this.checkWin =
		function checkWin(direction)
		{
			
			if(this.exitDir == direction)
			{
				if(this.board[this.currRow][this.currCol] == 2)
				{
					this.hasWon = true;
					return true;
				}
			}	
			
			return false;
		}
	
	this.determineEndPoint = 
		function(direction) {
			switch (direction) {
				
				case 'up':

					for (var i = this.currRow; i >= 0; i--) {
						if (this.board[i][this.currCol] == 0) {
							break;
						}
					}
					return {"r":i+1, "c":this.currCol};

				case 'down':

					for (var i = this.currRow; i < this.board.length; i++) {
						if (this.board[i][this.currCol] == 0) {
							break;
						}
					}
					return {"r":i-1, "c":this.currCol};

				case 'left':

					for (var i = this.currCol; i >= 0; i--) {
						if (this.board[this.currRow][i] == 0) {
							break;
						}
					}
					return {"r":this.currRow, "c":i+1};
				
				case 'right':
					for (var i = this.currCol; i < this.board[0].length; i++) {
						if (this.board[this.currRow][i] == 0) {
							break;
						}
					}
					return {"r":this.currRow, "c":i-1};
				
				default:
					break;
			}
			
			return;
		}

	this.move = 
		function(direction) {

			//dermine end point
			var endPoint = this.determineEndPoint(direction);
			
			var moveMe = document.getElementById('moveMe');
			this.currCol = endPoint.c;
			this.currRow = endPoint.r;
			
			if (this.checkWin(direction)) {
				this.youWin(direction, endPoint);
			} else {				
				this.changePosition(endPoint.r, endPoint.c);
			}
		}

	this.changePosition = 
		function(r, c) {
			this.boardFactor = document.getElementById('fontSize').value;;

			document.getElementById('moveMe').style.top = (r * this.boardCellHeight) * this.boardFactor + "em";
			document.getElementById('moveMe').style.left = (c * this.boardCellWidth) * this.boardFactor + "em";
			
			//document.getElementsByTagName('td')[(this.numCols * r) + c].className = "player";
			
			document.getElementById('currCol').value="curr col => " + this.currCol;		
			document.getElementById('currRow').value="curr row => " + this.currRow;		
			document.getElementById('xcoordinate').value="xcoord => " + document.getElementsByTagName("body")[0].style.size;
			document.getElementById('ycoordinate').value="ycoord => " + document.getElementById('moveMe').style.left;
		}
	
	this.checkKey =	
		function(e) 
		{
			if(!this.moveHappeningFlag)
			{
				this.moveHappeningFlag = true;
				
				var keynum;
				
				if(window.event) // IE
				{
					keynum = e.keyCode;
				}
				else if(e.which) // Netscape/Firefox/Opera
				{
					keynum = e.which;
				}
					
				//document.getElementById('keyvalue').innerHTML = keynum;				
				switch(keynum){
					case 37: this.move('left'); break
					case 38: this.move('up'); break;
					case 39: this.move('right'); break;
					case 40: this.move('down'); break;
					default: return false;
				}
			}
			
		}
		
		this.stopCount =
			function stopCount()
			{
				clearTimeout(this.t);
				this.moveHappeningFlag = false;
			}
			
		this.youWin = 
			function(direction, endPoint)
				{
					//add cases for moving character outside of the board on exit
					switch (direction) {
						
						case 'up':
							this.changePosition(endPoint.r - 1, endPoint.c);
							break;
						
						case 'down':
							this.changePosition(endPoint.r + 1, endPoint.c);
							break;
							
						case 'left':
							this.changePosition(endPoint.r, endPoint.c - 1);
							break;
							
						case 'right':
							this.changePosition(endPoint.r, endPoint.c + 1);
							break;
					}
					
					
					document.getElementById('keyvalue').innerHTML = 'You Win!';
					document.getElementById('win').style.visibility = "visible";
				}
	
//----------------------------------------------------------------------------------

}
