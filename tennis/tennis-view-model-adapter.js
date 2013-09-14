var matchViewModelAdapter = function(match, playerNames) {
	var matchViewModel = new MatchViewModel()
		.setScore(match.scores)
		.setOpponent(playerNames[match.opponent - 1].playerName)
		.setPoints(match.points);
		
	if (match.scores != "0-0,0-0,0-0") {
		matchViewModel.setCssClass(match.points <= 8 ? "lose" : "win");
	} else {
		matchViewModel.setCssClass("");
	}
		
	return matchViewModel;
}

var playerViewModelAdapter = function(playerStat, playerNames) {
	var matches = [];
	
	for (var i = 0; i < playerStat.matches.length; i++) {
		matches.push(matchViewModelAdapter(playerStat.matches[i], playerNames));
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
		players.push(playerViewModelAdapter(playerStats[i], playerStats));
	}
	
	return new TennisViewModel().setPlayers(players);
}
