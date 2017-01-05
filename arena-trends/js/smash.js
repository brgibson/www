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
            highlightedPlayers: []
        }
    },
    isDoNothing(event) {
        //don't change the highlighting when clicking on a th
        if (event.target.tagName.toLowerCase() == 'th' ||
            event.target.classList.contains('th')) {
            return true;
        }
    },
    isClearHighlight(event, highlightedPlayers) {
        if (event.target.tagName.toLowerCase() == 'td' ||
            event.target.classList.contains('td')) {
            //only clear if the state is the same
            return this.state.highlightedPlayers.length == 0;
        }

        //otherwise clear the highlighting
        return true;
    },
    setExpanded(event) {
        let isNonPlayerTdElement =
             (event.target.tagName.toLowerCase() == 'td' || event.target.classList.contains('td'))
             && !event.target.hasAttribute('data-player');

        if (isNonPlayerTdElement && event.target.parentElement.getAttribute('data-expand') == 'expand') {
            event.target.parentElement.setAttribute('data-expand', '');
        } else if (isNonPlayerTdElement) {
            event.target.parentElement.setAttribute('data-expand', 'expand');
        }
    },
    setHighlight(event) {
        this.setExpanded(event);

        if (this.isDoNothing(event)) {
            return;
        }

        let playerToHighlight = event.target.getAttribute('data-player');

        if (playerToHighlight && this.state.highlightedPlayers.indexOf(playerToHighlight) < 0) {
            this.state.highlightedPlayers.push(playerToHighlight);
        } else if (playerToHighlight && this.state.highlightedPlayers.indexOf(playerToHighlight) >= 0) {
            this.state.highlightedPlayers.splice(this.state.highlightedPlayers.indexOf(playerToHighlight), 1);
        }

        if (this.isClearHighlight(event, this.state.highlightedPlayers)) {
            this.setState({isHighlightSelected: false});
        } else {
            this.setState({
                isHighlightSelected: true,
                highlightedPlayers: this.state.highlightedPlayers
            })
        }
    },
    render() {
        return(
        <div onClick={this.setHighlight}>
            <div className="smash-standings">
                <h2>Standings</h2>
                <SmashStandings isHighlightSelected={this.state.isHighlightSelected}
                                highlightedPlayers={this.state.highlightedPlayers}/>
            </div>

            <div className="smash-matches">
                <h2>Individual Matches</h2>
                <SmashMatches isHighlightSelected={this.state.isHighlightSelected}
                              highlightedPlayers={this.state.highlightedPlayers}/>
            </div>
        </div>
        )
    }
});

/** ------------------------------------------------------------------------ */

ReactDOM.render(<SmashApp/>, document.getElementById('smash-container'));

/** ------------------------------------------------------------------------ */

})();