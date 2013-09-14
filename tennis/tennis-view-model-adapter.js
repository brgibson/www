var matchViewModelAdapter = function(match) {
	var matchViewModel = new MatchViewModel()
		.setScore(match.scores)
		.setOpponent(match.opponent) //might want to get the actual name here instead of the number
		.setPoints(match.points);
		
	if (match.scores != "0-0,0-0,0-0") {
		matchViewModel.setCssClass(match.points <= 8 ? "lose" : "win");
	} else {
	    matchViewModel.setCssClass("");
	}
		
	return matchViewModel;
}

var playerViewModelAdapter = function(playerStat) {
	var matches = [];
	
	for (var i = 0; i < playerStat.matches.length; i++) {
		matches.push(matchViewModelAdapter(playerStat.matches[i]));
	}

	return new PlayerViewModel()
		.setPlayerId(playerStat.playerId)
		.setPlayerName(playerStat.playerName)
		.setPoints(playerStat.totalPoints)
		.setRating(playerStat.rating)
		.setMatches(matches);
}

var tennisViewModelAdapter = function(playerStats) {
	var players = [];
	
	for (var i = 0; i < playerStats.length; i++) {
		players.push(playerViewModelAdapter(playerStats[i]));
	}
	
	return new TennisViewModel().setPlayers(players);
}
