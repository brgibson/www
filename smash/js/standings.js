---
#we need this yaml block to get the jekyll templating
---

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

    let reversePlayerName = true;
    const comparatorPlayerName = (a,b) => {
        return reversePlayerName ? a.id < b.id : a.id > b.id;
    }

    let reverseNumPlayed = true;
    const comparatorNumPlayed = (a,b) => {
        return reverseNumPlayed ? a.played > b.played : a.played < b.played;
    }

    let reverseNumWins = true;
    const comparatorNumWins = (a,b) => {
        return reverseNumWins ? a.wins > b.wins : a.wins < b.wins;
    }

    let reverseNumLosses = true;
    const comparatorNumLosses = (a,b) => {
        return reverseNumLosses ? a.losses < b.losses : a.losses > b.losses;
    }


    let reverseWinRatio = true;
    const comparatorWinRatio = (a,b) => {
        return reverseWinRatio ? a.winRatio > b.winRatio : a.winRatio < b.winRatio;
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

const App = React.createClass({
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
    sortByWinRatio() {
        ;
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
                           sortFunction={this.state.sortFunction} />
            </table>
            )
    }
});

/** ------------------------------------------------------------------------ */

const TableBody = React.createClass({
    render() {
        var tableRows = [];
        this.props.playerStandings
            .sort(this.props.sortFunction)
            .forEach(function(playerStanding) {
                tableRows.push(<TableRow name={playerStanding.id}
                                            played={playerStanding.played}
                                            wins={playerStanding.wins}
                                            losses={playerStanding.losses}
                                            winRatio={playerStanding.winRatio}/>);
        });
        return (<tbody>{tableRows}</tbody>);
    }
});

/** ------------------------------------------------------------------------ */

const TableRow = React.createClass({
    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.played}</td>
                <td>{this.props.wins}</td>
                <td>{this.props.losses}</td>
                <td>{Math.round(this.props.winRatio)}%</td>
            </tr>
        )
    }
});

/** ------------------------------------------------------------------------ */

ReactDOM.render(<App/>, document.getElementById('smash-standings-container'));
