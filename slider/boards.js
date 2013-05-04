var boards = 
	function () {		
		var toReturn = new Array(0);

		var boardstr1 = "10 10 right 1 1 ";
			boardstr1 += "1 1 1 0 1 1 1 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 1 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 0 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 1 1 1 0 "; 
			boardstr1 += "1 1 1 1 1 1 1 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 1 1 1 2 "; 
			boardstr1 += "1 1 0 1 1 1 1 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 1 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 1 1 1 1 "; 
			boardstr1 += "1 1 1 1 1 1 1 0 1 1 ";
		
		toReturn.push(boardstr1);
		
		var boardstr2 = "15 10 down 1 2 ";
			boardstr2 += "1 1 1 1 1 1 0 1 1 1 1 1 0 1 1 ";
			boardstr2 += "1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr2 += "1 1 1 1 1 1 1 0 1 1 1 2 1 1 1 ";
		
		toReturn.push(boardstr2);
		
		var boardstr3 = "10 10 left 1 3 ";
			boardstr3 += "1 1 1 0 1 1 1 1 1 1 ";
			boardstr3 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr3 += "1 1 1 1 1 1 0 1 1 1 ";
			boardstr3 += "0 1 1 1 1 1 1 1 1 1 ";
			boardstr3 += "2 1 1 1 1 1 1 1 1 1 ";
			boardstr3 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr3 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr3 += "1 1 1 0 1 1 1 1 1 1 ";
			boardstr3 += "1 1 1 1 0 1 1 1 1 1 ";
			boardstr3 += "1 1 1 1 1 0 1 1 1 1 ";
			
		toReturn.push(boardstr3);
		
		var boardstr4 = "12 10 up 1 1 ";
			boardstr4 += "1 1 1 1 0 1 1 2 1 1 1 1 ";
			boardstr4 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr4 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr4 += "0 1 1 1 1 1 1 1 1 0 1 1 ";
			boardstr4 += "1 1 1 0 1 1 1 1 1 1 1 1 ";
			boardstr4 += "1 1 1 1 1 1 0 1 1 1 1 1 ";
			boardstr4 += "1 0 1 1 1 1 1 1 1 1 1 1 ";
			boardstr4 += "1 1 1 1 1 1 1 1 0 1 1 1 ";
			boardstr4 += "1 1 0 1 0 1 1 1 1 1 1 1 ";
			boardstr4 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			
		toReturn.push(boardstr4);
		
		var boardstr5 = "12 10 up 1 1 ";
			boardstr5 += "1 1 1 1 0 1 1 2 1 1 1 1 ";
			boardstr5 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr5 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr5 += "0 1 1 1 1 1 1 1 1 0 1 1 ";
			boardstr5 += "1 1 1 0 1 1 1 1 1 1 1 1 ";
			boardstr5 += "1 1 1 1 1 1 0 1 1 1 1 1 ";
			boardstr5 += "1 0 1 1 1 1 1 1 1 1 1 0 ";
			boardstr5 += "1 1 1 1 1 1 1 1 0 1 1 1 ";
			boardstr5 += "1 1 1 1 0 1 1 1 1 1 1 1 ";
			boardstr5 += "1 1 0 1 1 1 1 1 1 1 1 1 ";
			
		toReturn.push(boardstr5);
		
		var boardstr6 = "10 10 right 10 10 ";
			boardstr6 += "1 1 1 1 1 1 1 1 1 1 ";	
			boardstr6 += "1 1 1 0 1 1 1 1 1 1 ";
			boardstr6 += "0 1 1 1 1 1 1 1 1 2 ";
			boardstr6 += "1 1 1 1 1 0 1 1 1 1 ";
			boardstr6 += "0 1 0 1 1 1 1 1 1 1 ";
			boardstr6 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr6 += "1 1 1 1 1 1 1 1 1 1 ";	
			boardstr6 += "1 1 1 1 0 1 1 1 1 1 ";
			boardstr6 += "0 0 0 1 1 1 0 1 1 1 ";
			boardstr6 += "1 1 1 1 1 1 1 1 1 1 ";	
			
		toReturn.push(boardstr6);
		
		var boardstr7 = "10 10 up 1 1 ";
			boardstr7 += "1 0 1 2 1 1 1 0 1 1 ";
			boardstr7 += "1 0 1 1 1 1 1 0 1 1 ";
			boardstr7 += "1 0 1 1 1 1 0 0 1 1 ";
			boardstr7 += "1 1 1 1 0 1 1 1 1 1 ";
			boardstr7 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr7 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr7 += "1 1 1 1 1 1 1 1 1 1 ";
			boardstr7 += "0 1 1 1 1 1 1 1 0 1 ";
			boardstr7 += "1 1 1 1 0 1 1 1 1 1 ";
			boardstr7 += "1 1 1 1 1 1 0 1 1 1 ";
			
		toReturn.push(boardstr7);
		
		var boardstr8 = "12 10 down 1 10 ";
			boardstr8 += "1 1 1 0 1 1 1 1 0 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 1 0 1 1 ";
			boardstr8 += "1 1 1 1 1 0 1 1 1 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 1 1 0 1 ";
			boardstr8 += "1 1 1 1 0 1 1 1 1 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 1 1 1 1 ";
			boardstr8 += "1 1 1 1 1 1 1 1 0 0 1 2 ";
			
		toReturn.push(boardstr8);
		
		return toReturn;
	}();
