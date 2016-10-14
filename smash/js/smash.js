---
#we need this yaml block to get the jekyll templating
---
(function() {

/** ------------------------------------------------------------------------ */

/* Dependencies */
{% include smash/js/standings.js %}
{% include smash/js/matches.js %}

/** ------------------------------------------------------------------------ */

const SmashApp = React.createClass({
    getInitialState() {
        return {
            isHighlightSelected: false,
            highlightedMatchup: [],
            highlightedPlayer: null
        }
    },
    isClearHighlight(highlightedPlayer, highlightedMatchup) {
        // not a th
        // not a


        return this.state.isHighlightSelected &&
            this.state.highlightedPlayer == highlightedPlayer &&
            JSON.stringify(this.state.highlightedMatchup) == JSON.stringify(highlightedMatchup);

    },
    setHighlight(event) {
        let highlightedPlayer = event.target.getAttribute('data-player');
        let highlightedMatchup = null;

        if (!highlightedPlayer && event.target.parentElement) {
            highlightedMatchup = event.target.parentElement.getAttribute('data-players') || [];
        }

        if (!highlightedPlayer && !highlightedMatchup) {
            return; //short circuit - we don't want to update the highlighting
        }

        if (this.isClearHighlight(highlightedPlayer, highlightedMatchup)) {
            this.setState({isHighlightSelected: false});
        } else {
            this.setState({
                isHighlightSelected: true,
                highlightedPlayer: highlightedPlayer,
                highlightedMatchup: highlightedMatchup || []
            })
        }
    },
    render() {
        return(
        <div onClick={this.setHighlight}>
            <div className="smash-standings">
                <h2>Standings</h2>
                <SmashStandings isHighlightSelected={this.state.isHighlightSelected}
                                highlightedMatchup={this.state.highlightedMatchup}
                                highlightedPlayer={this.state.highlightedPlayer}/>
            </div>

            <div className="smash-matches">
                <h2>Individual Matches</h2>
                <SmashMatches isHighlightSelected={this.state.isHighlightSelected}
                              highlightedMatchup={this.state.highlightedMatchup}
                              highlightedPlayer={this.state.highlightedPlayer}/>
            </div>
        </div>
        )
    }
});

/** ------------------------------------------------------------------------ */

ReactDOM.render(<SmashApp/>, document.getElementById('smash-container'));

/** ------------------------------------------------------------------------ */

})();