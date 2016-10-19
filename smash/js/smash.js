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
    isDoNothing(event) {
        //don't change the highlighting when clicking on a th
        if (event.target.tagName.toLowerCase() == 'th' ||
            event.target.classList.contains('th')) {
            return true;
        }
    },
    isClearHighlight(event, highlightedPlayer, highlightedMatchup) {
        if (event.target.tagName.toLowerCase() == 'td' ||
            event.target.classList.contains('td')) {
            //only clear if the state is the same
            return this.state.isHighlightSelected &&
                   this.state.highlightedPlayer == highlightedPlayer &&
                   JSON.stringify(this.state.highlightedMatchup) == JSON.stringify(highlightedMatchup);
        }

        //otherwise clear the highlighting
        return true;
    },
    setHighlight(event) {
        if (this.isDoNothing(event)) {
            return;
        }

        let highlightedPlayer = event.target.getAttribute('data-player');
        let highlightedMatchup = [];

        if (!highlightedPlayer && event.target.parentElement) {
            highlightedMatchup = event.target.parentElement.getAttribute('data-players') || [];
        }

        if (this.isClearHighlight(event, highlightedPlayer, highlightedMatchup)) {
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