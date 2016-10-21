var SmashMatches;



(function() {
/** ------------------------------------------------------------------------ */

const smashMatches = (function() {

    const smashData = {{site.data.smash | jsonify}};

    //set num wins/losses/played
    let getScore = (match, player) => () => match.games.reduce(
        (wins, game) => (player == game.winner ? wins + 1 : wins),
        0);


    smashData.forEach(function(match) {
        let playerOne = match.playerIds[0];
        let playerTwo = match.playerIds[1];

        match.score = {};
        match.score[playerOne] = getScore(match, playerOne)();
        match.score[playerTwo] = getScore(match, playerTwo)();
    });

    return smashData;
})();

/** ------------------------------------------------------------------------ */

const comparators = (function() {

    //needed for ios sorting
    function forComparator(value) {
        return value ? 1 : -1;
    }

    let reverseDate = true;
    const comparatorDate = (a,b) => {
        return forComparator(reverseDate ? a.date < b.date : a.date > b.date);
    }

    let reversePlayer1 = true;
    const comparatorPlayer1 = (a,b) => {
        return forComparator(reversePlayer1 ? a.playerIds[0] < b.playerIds[0] : a.playerIds[0] > b.playerIds[0]);
    }

    let reversePlayer2 = true;
    const comparatorPlayer2 = (a,b) => {
        return forComparator(reversePlayer2 ? a.playerIds[1] < b.playerIds[1] : a.playerIds[1] > b.playerIds[1]);
    }

    let reverseScore = true;
    const comparatorScore = (a,b) => {
        return forComparator(reverseScore ?
            a.score[a.playerIds[0]] + '-' + a.score[a.playerIds[1]]  > b.score[b.playerIds[0]] + '-' + b.score[b.playerIds[1]]:
            a.score[a.playerIds[0]] + '-' + a.score[a.playerIds[1]]  < b.score[b.playerIds[0]] + '-' + b.score[b.playerIds[1]]);
    }


    return new Map([
        ['date', {
            comparator: comparatorDate,
            reverseSortOrder: () => {reverseDate = !reverseDate},
            resetSortOrder: () => {reverseDate = true}
        }],
        ['player1', {
            comparator: comparatorPlayer1,
            reverseSortOrder: () => {reversePlayer1 = !reversePlayer1},
            resetSortOrder: () => {reversePlayer1 = true}
        }],
        ['player2', {
            comparator: comparatorPlayer2,
            reverseSortOrder: () => {reversePlayer2 = !reversePlayer2},
            resetSortOrder: () => {reversePlayer2 = true}
        }],
        ['score', {
            comparator: comparatorScore,
            reverseSortOrder: () => {reverseScore = !reverseScore},
            resetSortOrder: () => {reverseScore = true}
        }]
    ]);
})();

/** ------------------------------------------------------------------------ */

SmashMatches = React.createClass({
    getInitialState() {
        let initialSortKey = 'date';
        comparators.get(initialSortKey).reverseSortOrder();
        return {
            sortFunction: comparators.get(initialSortKey).comparator
        }
    },
    sortBy(key) {
        this.setState({sortFunction:comparators.get(key).comparator});
        comparators.get(key).reverseSortOrder();
        this.resetOtherSorts(key);
    },
    resetOtherSorts(key) {
        comparators.forEach(function(comparator, comparatorKey) {
            if (comparatorKey != key) {
                comparator.resetSortOrder();
            }
        });
    },
    render(){
        return (
            <div className="table">
                <div className="thead">
                    <div className="tr">
                        <div className="th date" onClick={() => this.sortBy('date')}>Date</div>
                        <div className="th player" onClick={() => this.sortBy('player1')}>Player 1</div>
                        <div className="th player" onClick={() => this.sortBy('player2')}>Player 2</div>
                        <div className="th score" onClick={() => this.sortBy('score')}>Score</div>
                    </div>
                </div>
                <TableBody smashMatches={smashMatches}
                           sortFunction={this.state.sortFunction}
                           isHighlightSelected={this.props.isHighlightSelected}
                           highlightedPlayers={this.props.highlightedPlayers}/>
            </div>
            )
    }
});

/** ------------------------------------------------------------------------ */

const TableBody = React.createClass({

    render() {
        let _self = this;

        function computeIsLose(playerOne, playerTwo, score) {
            if (!_self.props.isHighlightSelected) {
                return false;
            }

            let firstSelectedPlayer = _self.props.highlightedPlayers[0];
            let scoreDiff = score[playerOne] - score[playerTwo];

            if (firstSelectedPlayer == playerOne) {
                return scoreDiff < 0;
            }
            if (firstSelectedPlayer == playerTwo) {
                return scoreDiff > 0;
            }
            return false;
        }

        function computeIsWin(playerOne, playerTwo, score) {
            if (!_self.props.isHighlightSelected) {
                return false;
            }

            let firstSelectedPlayer = _self.props.highlightedPlayers[0];
            let scoreDiff = score[playerOne] - score[playerTwo];

            if (firstSelectedPlayer == playerOne) {
                return scoreDiff > 0;
            }
            if (firstSelectedPlayer == playerTwo) {
                return scoreDiff < 0;
            }
            return false;
        }

        function computeIsOutOfFocus(playerOne, playerTwo) {
            if (!_self.props.isHighlightSelected) {
                return false; //short circuit so nothing is out of focus
            }

            if (_self.props.highlightedPlayers.length == 1) {
                return !(_self.props.highlightedPlayers.indexOf(playerOne) == 0 ||
                         _self.props.highlightedPlayers.indexOf(playerTwo) == 0);
            } else if (_self.props.highlightedPlayers.length > 1) {
                return !(
                    (_self.props.highlightedPlayers.indexOf(playerOne) == 0 ||
                     _self.props.highlightedPlayers.indexOf(playerTwo) == 0) &&
                    [playerOne, playerTwo].every((player) => (_self.props.highlightedPlayers.indexOf(player) >= 0)));
            }

            return false;
        };

        function isHideRow(isOutOfFocus) {
            //hide row if it is out of focus
            return isOutOfFocus;
        }

        var tableRows = [];
        _self.props.smashMatches
            .sort(_self.props.sortFunction)
            .forEach(function(match) {
                var playerOne = match.playerIds[0];
                var playerTwo = match.playerIds[1];
                var isOutOfFocus = computeIsOutOfFocus(playerOne, playerTwo);
                var isLose = computeIsLose(playerOne, playerTwo, match.score);
                var isWin = computeIsWin(playerOne, playerTwo, match.score);;

                if (!isHideRow(isOutOfFocus)) {
                    tableRows.push(<TableRow date={match.date}
                                             player1={playerOne}
                                             player2={playerTwo}
                                             score={match.score}
                                             isWin={isWin}
                                             isLose={isLose}
                                             isOutOfFocus={isOutOfFocus}
                                             highlightedPlayers={_self.props.highlightedPlayers}
                                             isHighlightSelected={_self.props.isHighlightSelected}/>);

                    tableRows.push(<AdditionalMatchInfo isWin={isWin}
                                                        isLose={isLose}
                                                        games={match.games} />);
                }
        });
        return (<div className="tbody">{tableRows}</div>);
    }
});

/** ------------------------------------------------------------------------ */

const TableRow = React.createClass({
    isEmphasized(player) {
        return this.props.highlightedPlayers.some((highlightedPlayer) => (player == highlightedPlayer))
    },
    render() {
        return (
                <div className={'tr'
                                 + (this.props.isOutOfFocus  ? ' oof' : '')
                                 + (this.props.isWin  ? ' win' : '')
                                 + (this.props.isLose ? ' lose' : '')}
                    data-players={[this.props.player1,this.props.player2]}
                    data-expand={this.props.isHighlightSelected && !this.props.isOutOfFocus ? 'expand' : '' }>
                    <div className="td date">{this.props.date}</div>
                    <div className={'td player' + ' ' + (this.isEmphasized(this.props.player1) ? 'em' : '')}>
                        {this.props.player1}
                    </div>
                    <div className={'td player' + ' ' + (this.isEmphasized(this.props.player2) ? 'em' : '')}>
                        {this.props.player2}
                    </div>
                    <div className="td score">{this.props.score[this.props.player1]}-{this.props.score[this.props.player2]}</div>
                </div>
        )
    }
});

/** ------------------------------------------------------------------------ */

const AdditionalMatchInfo = React.createClass({

    formatGame(game) {
        return Object.keys(game).reduce(function(arr, key) {
            arr.push(<p className="detail">{key + ": " + game[key]}</p>);
            return arr;
        }, []);
    },

    formatGames() {
        let _self = this;
        return this.props.games.reduce(function(arrTop, game) {
            arrTop.push(<div className="game">{_self.formatGame(game)}</div>)
            return arrTop;
        }, []);
    },
    render() {
        return (
            <div className={"additional-info"
                + (this.props.isLose  ? ' lose' : '')
                + (this.props.isWin  ? ' win' : '')}>
                {this.formatGames()}
            </div>
        )
    }
});

})();