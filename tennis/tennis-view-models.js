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
		this.players;
		this.setPlayers = function(players) {
			this.players = players;
			return this;
		}
};