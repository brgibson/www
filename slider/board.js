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
	this.boardOriginX = 0; //remove these variables
	this.boardOriginY = 0; //remove these variables
	this.xcoord = 0;
	this.boardCellHeight = 40;
	this.boardCellWidth = 50;
	this.moveSpeedX = this.boardCellWidth / 5;
	this.moveSpeedY = this.boardCellHeight / 4;
	this.currRow = 0;
	this.currCol = 0;
	this.t;
	this.animationDelay = 10;
//	this.animationDelay = 500;
	
	
	
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
						this.blocked[i].push(x * this.boardCellWidth + this.boardOriginX);
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
			document.getElementById('moveMe').style.left= left;
			document.getElementById('moveMe').style.top= top;	
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
			
			document.getElementById('currCol').value="curr col => " + this.currCol;		
			document.getElementById('currRow').value="curr row => " + this.currRow;		
						
			startCol = ((startCol - 1) * this.boardCellWidth) + this.boardOriginX;
			startRow = ((startRow - 1) * this.boardCellHeight) + this.boardOriginY;	
					
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
			this.resetBoard(startCol + "px", startRow + "px");
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
					boardStr += "<td>";
										
					if(!this.board[y][x])
					{								
						boardStr += "<img src='brick.gif' />";
					}
					else if(this.board[y][x] == 2)
					{
						boardStr += "<span id='exit'>EXIT</span>";
					} 
			
					boardStr += "</td>";
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
	
	this.isBlocked =	
		function isBlocked(direction)
		{
			
			switch(direction)
				{
					case 'up': 
		
						if (this.board[this.currRow - 1][this.currCol] == 0) {
							return true;
						}				
								
						return false;
						break;
						
					case 'down': 
						
						if (this.board[this.currRow + 1][this.currCol] == 0) {
							return true;
						}

						return false;
						break;
					
					case 'left': 
						if (this.board[this.currRow][this.currCol - 1] == 0) {
							return true;
						}

						return false;
						break;
						
					case 'right': 
			
						if (this.board[this.currRow][this.currCol + 1] == 0) {
							return true;
						}
						
						return false;
						break;
					
					default		: return false;
				}
				
			
			return false;
		}
	
	this.moveCheck = 
		function moveCheck(direction, coordinate)
		{
			switch(direction)
				{
					case 'up' 	: 
						if(this.checkWin(direction)) {return false;}
					
						return (coordinate > this.boardOriginY && !this.isBlocked(direction)); break;
						
					case 'down'	: 
						if(this.checkWin(direction)) {return false;}
					
						return (coordinate < this.boardCellHeight * (this.getNumRows() - 1) + this.boardOriginY && !this.isBlocked(direction)); break;				
						
					case 'left'	: 
						if(this.checkWin(direction)) {return false;}
					
						return (coordinate > this.boardOriginX && !this.isBlocked(direction)); break;		
					
					case 'right': 
						if(this.checkWin(direction)) {return false;}
						
						return (coordinate < this.boardCellWidth * (this.getNumCols() - 1) + this.boardOriginX && !this.isBlocked(direction)); break;
					
					default		: return false;
				}
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

	this.move2 = 
		function(direction) {

			//dermine end point
			var endPoint = this.determineEndPoint(direction);
			
			var moveMe = document.getElementById('moveMe');
			this.currCol = endPoint.c;
			this.currRow = endPoint.r;
			
			if (this.checkWin(direction)) {
				this.youWin();
			}
			
			
			moveMe.style.top = (endPoint.r * this.boardCellHeight) + this.boardOriginY;
			moveMe.style.left = (endPoint.c * this.boardCellWidth) + this.boardOriginX;;
			
			document.getElementById('currCol').value="curr col => " + this.currCol;		
			document.getElementById('currRow').value="curr row => " + this.currRow;		
			document.getElementById('xcoordinate').value="xcoord => " + this.xcoord;	
			document.getElementById('ycoordinate').value="ycoord => " + this.ycoord;	
			
			return;
				
			if(direction == 'stop')
			{
				if(this.hasWon)
				{
					this.youWin();
				}
				else{
					this.stopCount();
				}
			}
			else
			{
				switch(direction)
				{
					case 'up' : 
						var bool = this.moveCheck('up', ycoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.top = (ycoord - this.moveSpeedY) + 'px';
							this.t=setTimeout("this.board.move('up')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						break; 	
						
					case 'down'	: 
						var bool = this.moveCheck('down', ycoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.top = (ycoord + this.moveSpeedY) + 'px';
							this.t=setTimeout("this.board.move('down')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						break; 	
						
					case 'left'	:
						var bool = this.moveCheck('left', this.xcoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.left = (this.xcoord - this.moveSpeedX) + 'px';
							this.t=setTimeout("this.board.move('left')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						break; 	
					
					case 'right' :
						var bool = this.moveCheck('right', this.xcoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.left = (this.xcoord + this.moveSpeedX)  + 'px';
							this.t=setTimeout("this.board.move('right')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						
						break; 	
					
					default	:
						this.stopCount(); break;
				}
				
				if(direction == 'stop')
				{
					this.t=setTimeout("this.board.move('stop')", 10);
				}
				
				// THIS DOES NOT WORK BECUASE JAVASCRIPT IS REDICULOUS this.t=setTimeout("this.board.move('" + direction "')", 10);
			}
		}
			
		
	
	this.move =
		function move(direction)
		{	
		
			this.xcoord = parseInt(document.getElementById('moveMe').style.left);
			var ycoord = parseInt(document.getElementById('moveMe').style.top);
						
			var n = (ycoord - this.boardOriginY) / this.boardCellHeight;
			if(n == Math.round(n)){
				this.currRow = n;
			}
			var m = (this.xcoord - this.boardOriginX) / this.boardCellWidth;
			if(m == Math.round(m)){
				this.currCol = m;
			}
			
			document.getElementById('currCol').value="curr col => " + this.currCol;		
			document.getElementById('currRow').value="curr row => " + this.currRow;		
			document.getElementById('xcoordinate').value="xcoord => " + this.xcoord;	
			document.getElementById('ycoordinate').value="ycoord => " + this.ycoord;	
			
			if(direction == 'stop')
			{
				if(this.hasWon)
				{
					this.youWin();
				}
				else{
					this.stopCount();
				}
			}
			else
			{
				switch(direction)
				{
					case 'up' : 
						var bool = this.moveCheck('up', ycoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.top = (ycoord - this.moveSpeedY) + 'px';
							this.t=setTimeout("this.board.move('up')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						break; 	
						
					case 'down'	: 
						var bool = this.moveCheck('down', ycoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.top = (ycoord + this.moveSpeedY) + 'px';
							this.t=setTimeout("this.board.move('down')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						break; 	
						
					case 'left'	:
						var bool = this.moveCheck('left', this.xcoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.left = (this.xcoord - this.moveSpeedX) + 'px';
							this.t=setTimeout("this.board.move('left')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						break; 	
					
					case 'right' :
						var bool = this.moveCheck('right', this.xcoord);
						
						if(bool) 
						{
							document.getElementById('moveMe').style.left = (this.xcoord + this.moveSpeedX)  + 'px';
							this.t=setTimeout("this.board.move('right')", this.animationDelay);
						}
						else {direction = 'stop';}
						
						
						break; 	
					
					default	:
						this.stopCount(); break;
				}
				
				if(direction == 'stop')
				{
					this.t=setTimeout("this.board.move('stop')", 10);
				}
				
				// THIS DOES NOT WORK BECUASE JAVASCRIPT IS REDICULOUS this.t=setTimeout("this.board.move('" + direction "')", 10);
			}
		}
	this.recur =
		function recur() {
			document.getElementById('xcoordinate').value = "hello";	
		}
	
	this.checkKey =	
		function checkKey(e) 
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
			function youWin()
				{
					document.getElementById('keyvalue').innerHTML = 'You Win!';
					document.getElementById('win').style.visibility = "visible";
				}
		
	
	
//----------------------------------------------------------------------------------

}
