var SmashStandings;

(function() {
/** ------------------------------------------------------------------------ */

const playerStandings = (function() {
    const smashData = {{site.data.smash | jsonify}};

    function playerStanding(id) {
        return {
            "id": id,
            "played": 0,
            "losses": 0,
            "wins": 0,
            "ranking": 0
        }
    };

    function buildPlayerStandingData(smashData) {
        let playerStandings = {};

        //setup playerStanding objs
        smashData.forEach(function(obj) {
            playerStandings[obj.playerIds[0]] = playerStanding(obj.playerIds[0]);
            playerStandings[obj.playerIds[1]] = playerStanding(obj.playerIds[1]);
        });

        //set num wins/losses/played
        let getScore = (match, player) => () => match.games.reduce((wins, game) => {
            if (player == game.winner) {
                return wins + 1;
            } else {
                return wins;
            }
        }, 0);


        smashData.forEach(function(match) {
            let playerOne = match.playerIds[0];
            let playerTwo = match.playerIds[1];
            let playerOneScore = getScore(match, playerOne)();
            let playerTwoScore = getScore(match, playerTwo)();

            playerStandings[playerOne].played++;
            playerStandings[playerTwo].played++;

            if (playerOneScore > playerTwoScore) {
                playerStandings[playerOne].wins++;
                playerStandings[playerTwo].losses++;
            } else {
                playerStandings[playerOne].losses++;
                playerStandings[playerTwo].wins++;
            }
        });

        //set win ratio
        Object.keys(playerStandings).forEach(function(key) {
            playerStandings[key].winRatio = playerStandings[key].wins/playerStandings[key].played * 100;
        });
        return Array.from(Object.keys(playerStandings), key => playerStandings[key]);
    }

    return buildPlayerStandingData(smashData);
})();

/** ------------------------------------------------------------------------ */

const comparators = (function() {

    //needed for ios sorting
    function forComparator(value) {
        return value ? 1 : -1;
    }

    let reversePlayerName = true;
    const comparatorPlayerName = (a,b) => {
        return forComparator(reversePlayerName ? a.id < b.id : a.id > b.id);
    }

    let reverseNumPlayed = true;
    const comparatorNumPlayed = (a,b) => {
        return forComparator(reverseNumPlayed ? a.played > b.played : a.played < b.played);
    }

    let reverseNumWins = true;
    const comparatorNumWins = (a,b) => {
        return forComparator(reverseNumWins ? a.wins > b.wins : a.wins < b.wins);
    }

    let reverseNumLosses = true;
    const comparatorNumLosses = (a,b) => {
        return forComparator(reverseNumLosses ? a.losses < b.losses : a.losses > b.losses);
    }


    let reverseWinRatio = true;
    const comparatorWinRatio = (a,b) => {
        return forComparator(reverseWinRatio ? a.winRatio > b.winRatio : a.winRatio < b.winRatio);
    }

    return new Map([
        ['playerName', {
            comparator: comparatorPlayerName,
            reverseSortOrder: () => {reversePlayerName = !reversePlayerName},
            resetSortOrder: () => {reversePlayerName = true}
        }],
        ['numPlayed', {
            comparator: comparatorNumPlayed,
            reverseSortOrder: () => {reverseNumPlayed = !reverseNumPlayed},
            resetSortOrder: () => {reverseNumPlayed = true}
        }],
        ['numWins', {
            comparator: comparatorNumWins,
            reverseSortOrder: () => {reverseNumWins = !reverseNumWins},
            resetSortOrder: () => {reverseNumWins = true}
        }],
        ['numLosses', {
            comparator: comparatorNumLosses,
            reverseSortOrder: () => {reverseNumLosses = !reverseNumLosses},
            resetSortOrder: () => {reverseNumLosses = true}
        }],
        ['winRatio', {
            comparator: comparatorWinRatio,
            reverseSortOrder: () => {reverseWinRatio = !reverseWinRatio},
            resetSortOrder: () => {reverseWinRatio = true}
        }]
    ]);
})();

/** ------------------------------------------------------------------------ */

SmashStandings = React.createClass({
    getInitialState() {
        let initialSortKey = 'winRatio';
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
            <table>
                <thead>
                    <tr>
                        <th className="player-header" onClick={() => this.sortBy('playerName')}>Player</th>
                        <th onClick={() => this.sortBy('numWins')}>Wins</th>
                        <th onClick={() => this.sortBy('numLosses')}>Losses</th>
                        <th onClick={() => this.sortBy('numPlayed')}>Played</th>
                        <th onClick={() => this.sortBy('winRatio')}>Win Ratio</th>
                    </tr>
                </thead>
                <TableBody playerStandings={playerStandings}
                           sortFunction={this.state.sortFunction}
                           isHighlightSelected={this.props.isHighlightSelected}
                           highlightedPlayers={this.props.highlightedPlayers}/>
            </table>
            )
    }
});

/** ------------------------------------------------------------------------ */

const TableBody = React.createClass({
    render() {
        var _self = this;
        var tableRows = [];
        this.props.playerStandings
            .sort(this.props.sortFunction)
            .forEach(function(playerStanding) {
                tableRows.push(<TableRow name={playerStanding.id}
                                            played={playerStanding.played}
                                            wins={playerStanding.wins}
                                            losses={playerStanding.losses}
                                            winRatio={playerStanding.winRatio}
                                            isHighlightSelected={_self.props.isHighlightSelected}
                                            highlightedPlayers={_self.props.highlightedPlayers}/>);
        });
        return (<tbody>{tableRows}</tbody>);
    }
});

/** ------------------------------------------------------------------------ */

const TableRow = React.createClass({
    isOutOfFocus() {
        if (!this.props.isHighlightSelected) {
            return false; //short circuit so nothing is out of focus
        }

        return !(this.props.highlightedPlayers.indexOf(this.props.name) >= 0);
    },
    isEmphasized() {
        return (this.props.highlightedPlayers.indexOf(this.props.name) >= 0);
    },
    render() {
        return (
            <tr className={this.isOutOfFocus()  ? 'oof' : ''}>
                <td className={this.isEmphasized() ? 'em' : ''} data-player={this.props.name}>{this.props.name}</td>
                <td data-player={this.props.name}>{this.props.wins}</td>
                <td data-player={this.props.name}>{this.props.losses}</td>
                <td data-player={this.props.name}>{this.props.played}</td>
                <td data-player={this.props.name}>{Math.round(this.props.winRatio)}%</td>
            </tr>
        )
    }
});

})();