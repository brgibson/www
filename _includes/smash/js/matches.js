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
            <table>
                <thead>
                    <tr>
                        <th onClick={() => this.sortBy('date')}>Date</th>
                        <th onClick={() => this.sortBy('player1')}>Player 1</th>
                        <th onClick={() => this.sortBy('player2')}>Player 2</th>
                        <th onClick={() => this.sortBy('score')}>Score</th>
                    </tr>
                </thead>
                <TableBody smashMatches={smashMatches}
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
        let _self = this;

        var tableRows = [];
        this.props.smashMatches
            .sort(_self.props.sortFunction)
            .forEach(function(match) {
                tableRows.push(<TableRow date={match.date}
                                         player1={match.playerIds[0]}
                                         player2={match.playerIds[1]}
                                         score={match.score}
                                         highlightedMatchup={_self.props.highlightedMatchup}
                                         highlightedPlayer={_self.props.highlightedPlayer}
                                         isHighlightSelected={_self.props.isHighlightSelected}/>);
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

        let isHighlightedMatchup = this.props.highlightedMatchup.indexOf(this.props.player1) >= 0 &&
                                   this.props.highlightedMatchup.indexOf(this.props.player2) >= 0;

        return !(isHighlightedMatchup ||
               this.props.highlightedPlayer == this.props.player1 ||
               this.props.highlightedPlayer == this.props.player2);
    },
    isEmphasized(player) {
        return this.props.isHighlightSelected &&
            (player == this.props.highlightedPlayer || (!this.isOutOfFocus() && !this.props.highlightedPlayer));
    },
    render() {
        return (
            <tr className={this.isOutOfFocus()  ? 'oof' : ''}
                data-players={[this.props.player1,this.props.player2]}>
                <td>{this.props.date}</td>
                <td className={this.isEmphasized(this.props.player1) ? 'em' : ''} data-player={this.props.player1}>
                    {this.props.player1}
                </td>
                <td className={this.isEmphasized(this.props.player2) ? 'em' : ''} data-player={this.props.player2}>
                    {this.props.player2}
                </td>
                <td>{this.props.score[this.props.player1]}-{this.props.score[this.props.player2]}</td>
            </tr>
        )
    }
});

})();