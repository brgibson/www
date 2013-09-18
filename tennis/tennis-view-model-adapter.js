var TennisViewModelAdapter = function(playerStats) {
	
	/**
	 * Uses the given JSON object representing the players' stats and
	 * converts it into a TennisViewModel.
	 */	
	this.adapt = function() {
		var players = [];
	
		for (var i = 0; i < playerStats.length; i++) {
			players.push(playerViewModelAdapter(playerStats[i], playerStats));
		}
		
		return new TennisViewModel().setPlayers(players).ratingSort();
	}

	/**
	 * Takes a JSON object representing a player's stats
	 * and builds a PlayerViewModel.
	 */
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
	
	/**
	 * Takes a JSON object representing a player's stats and an array
	 * containing a player names and builds a PlayerViewModel.
	 */
	var matchViewModelAdapter = function(match) {
		var matchViewModel = new MatchViewModel()
			.setScore(match.scores)
			.setOpponent(playerStats[match.opponent - 1].playerName) //notice this comes from the TennisViewModelAdapter constructor argument
			.setPoints(match.points);
			
		if (match.scores != "0-0,0-0,0-0") {
			matchViewModel.setCssClass(match.points <= 8 ? "lose" : "win");
		} else {
			matchViewModel.setCssClass("");
		}
			
		return matchViewModel;
	}
}	
