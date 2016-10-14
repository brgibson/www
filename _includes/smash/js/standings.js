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
        smashData.forEach(function(obj) {
            let playerOne = obj.playerIds[0];
            let playerTwo = obj.playerIds[1];
            let playerOneScore = obj.score[playerOne];
            let playerTwoScore = obj.score[playerTwo];

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
        let initialSortKey = 'numWins';
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
                        <th onClick={() => this.sortBy('playerName')}>Player</th>
                        <th onClick={() => this.sortBy('numPlayed')}>Played</th>
                        <th onClick={() => this.sortBy('numWins')}>Wins</th>
                        <th onClick={() => this.sortBy('numLosses')}>Losses</th>
                        <th onClick={() => this.sortBy('winRatio')}>Win Ratio</th>
                    </tr>
                </thead>
                <TableBody playerStandings={playerStandings}
                           sortFunction={this.state.sortFunction}
                           isHighlightSelected={this.props.isHighlightSelected}
                           highlightedMatchup={this.props.highlightedMatchup}
                           highlightedPlayer={this.props.highlightedPlayer}/>
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
                                            highlightedMatchup={_self.props.highlightedMatchup}
                                            highlightedPlayer={_self.props.highlightedPlayer}/>);
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

        let isHighlightedMatchup = this.props.highlightedMatchup.indexOf(this.props.name) >= 0;

        return !(isHighlightedMatchup || this.props.highlightedPlayer == this.props.name);
    },
    isEmphasized() {
        return this.props.isHighlightSelected &&
            (this.props.name == this.props.highlightedPlayer || (!this.isOutOfFocus() && !this.props.highlightedPlayer));
    },
    render() {
        return (
            <tr className={this.isOutOfFocus()  ? 'oof' : ''}>
                <td className={this.isEmphasized() ? 'em' : ''} data-player={this.props.name}>{this.props.name}</td>
                <td data-player={this.props.name}>{this.props.played}</td>
                <td data-player={this.props.name}>{this.props.wins}</td>
                <td data-player={this.props.name}>{this.props.losses}</td>
                <td data-player={this.props.name}>{Math.round(this.props.winRatio)}%</td>
            </tr>
        )
    }
});

})();