var boards = new Array(0);

// GENERIC BOARD /////////////////////////////////////////////

var boardstrN = "10 8 right 10 8 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
	boardstrN += "0 0 0 0 0 0 0 0 0 0 ";
//////////////////////////////////////////////////////////////

var boardstr2 = "17 10 down 1 2 ";
	boardstr2 += "1 1 1 1 1 1 1 1 0 1 1 1 1 1 0 1 1 ";
	boardstr2 += "1 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ";
	boardstr2 += "1 1 1 1 1 1 1 1 1 0 1 1 1 2 1 1 1 ";

boards.push(boardstr2);

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
	
boards.push(boardstr3);

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
	
boards.push(boardstr4);

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
	
boards.push(boardstr5);

var boardstr6 = "10 8 right 10 8 ";
	boardstr6 += "1 1 1 1 1 1 1 1 1 1 ";
	boardstr6 += "1 1 1 0 1 1 1 1 1 1 ";
	boardstr6 += "0 1 1 1 1 1 1 1 1 2 ";
	boardstr6 += "1 1 1 1 1 0 1 1 1 1 ";
	boardstr6 += "0 1 0 1 1 1 1 1 1 1 ";
	boardstr6 += "1 1 1 1 1 1 1 1 1 1 ";
	boardstr6 += "1 1 1 1 0 1 1 1 1 1 ";
	boardstr6 += "0 0 0 1 1 1 0 1 1 1 ";
	
boards.push(boardstr6);

var boardstr7 = "10 8 up 1 1 ";
	boardstr7 += "1 0 1 2 1 1 1 0 1 1 ";
	boardstr7 += "1 0 1 1 1 1 1 0 1 1 ";
	boardstr7 += "1 0 1 1 1 1 0 0 1 1 ";
	boardstr7 += "1 1 1 1 0 1 1 1 1 1 ";
	boardstr7 += "1 1 1 1 1 1 1 1 1 1 ";
	boardstr7 += "0 1 1 1 1 1 1 1 0 1 ";
	boardstr7 += "1 1 1 1 0 1 1 1 1 1 ";
	boardstr7 += "1 1 1 1 1 1 0 1 1 1 ";
	
boards.push(boardstr7);


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
	
boards.push(boardstr8);
