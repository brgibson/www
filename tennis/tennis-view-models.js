var MatchViewModel = function() {
	this.score;
	this.setScore = function(score) {
		this.score = score;
		return this;
	}
	
	this.points;
	this.setPoints = function(points) {
		this.points = points;
		return this;
	}
	
	this.cssClass;
	this.setCssClass = function(cssClass) {
		this.cssClass = cssClass;
		return this;
	}
	
	this.opponent;
	this.setOpponent = function(opponent) {
		this.opponent = opponent;
		return this;
	}
}

var PlayerViewModel = function() {
    this.playerName;
    this.setPlayerName = function(playerName) {
    	this.playerName = playerName;
    	return this;
    }
    
    this.playerId;
    this.setPlayerId = function(playerId) {
    	this.playerId = playerId;
    	return this;
    }
    
    this.points;
    this.setPoints = function(points) {
    	this.points = points;
    	return this;
    }
    
    this.rating;
    this.setRating = function(rating) {
    	this.rating = rating;
    	return this;
    }
    
    this.matches;
    this.setMatches = function(matches) {
    	this.matches = matches;
    	return this;
    }
}

var TennisViewModel = function() {

	this.players = ko.observableArray();
	this.setPlayers = function(players) {
			this.players(players);
			return this;
	}
		
	/**
	 * Functions for sorting the Arrays of players on the TennisViewModel.
	 */
	var sortByRatingDesc	= function(a, b) {
		return b.rating - a.rating;
	};
	
	var sortByRatingAsc = function(a, b) {
		return a.rating - b.rating;
	};
	
	var sortByPointsDesc	= function(a, b) {
		return b.points - a.points;
	};
	
	var sortByPointsAsc = function(a, b) {
		return a.points - b.points;
	};
	
	var sortByPlayerNameDesc	= function(a, b) {
		if (a.playerName > b.playerName) return -1;
		if (b.playerName > a.playerName) return 1;
		else return 0;
	};
	
	var sortByPlayerNameAsc	= function(a, b) {
		if (a.playerName < b.playerName) return -1;
		if (b.playerName < a.playerName) return 1;
		else return 0;
	};
	
	var sortByPointsInMatchDesc = function(matchNumber) {
		return function(a, b) {
				return b.matches[matchNumber].points - a.matches[matchNumber].points;
			};
	}
	
	var sortByPointsInMatchAsc = function(matchNumber) {
		return function(a, b) {
				return a.matches[matchNumber].points - b.matches[matchNumber].points;
			};
	}
	
	/**
	 * Event handlers which sort the players array.
	 */
	this.playerNameSort = function(viewModel) { 
		var toggle = true;
		return function() {

			if (toggle) {
				viewModel.players.sort(sortByPlayerNameDesc);
			} else {
				viewModel.players.sort(sortByPlayerNameAsc);
			}
			toggle = !toggle;
			return viewModel;
			
		};
	}(this);
	
	this.pointsSort = function(viewModel) { 
		var toggle = true;
		return function() {

			if (toggle) {
				viewModel.players.sort(sortByPointsDesc);
			} else {
				viewModel.players.sort(sortByPointsAsc);
			}
			toggle = !toggle;
			return viewModel;
			
		};
	}(this);
	
	this.ratingSort = function(viewModel) { 
		var toggle = true;
		return function() {

			if (toggle) {
				viewModel.players.sort(sortByRatingDesc);
			} else {
				viewModel.players.sort(sortByRatingAsc);
			}
			toggle = !toggle;
			return viewModel;
			
		};
	}(this);
	
	this.pointsInMatchSort = function(viewModel) { 
		var toggle = true;
		return function(index) {

			if (toggle) {
				viewModel.players.sort(sortByPointsInMatchDesc(index));
			} else {
				viewModel.players.sort(sortByPointsInMatchAsc(index));
			}
			toggle = !toggle;
			return viewModel;
			
		};
	}(this);
}
