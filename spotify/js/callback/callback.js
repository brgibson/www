var BRG = BRG || {};
BRG.PROMISES = BRG.PROMISES || {};

(function() {
    var PROMISES = BRG.PROMISES;

    PROMISES.get = function get(url, headersObj) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);

            //add any headers
            if (headersObj) {
                for (var key in headersObj) {
                    if (headersObj.hasOwnProperty(key)) {
                        req.setRequestHeader(key, headersObj[key]);
                    }
                }
            }

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    }
})();


(function () {

    var stateKey = 'spotify_auth_state';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    var playlistsForUserSource = document.getElementById('playlists-for-user-template').innerHTML,
        playlistsForUserTemplate = Handlebars.compile(playlistsForUserSource),
        playlistsForUserPlaceholder = document.getElementById('playlist-names-container');

    var tracksForPlaylistSource = document.getElementById('tracks-for-playlist-template').innerHTML,
        tracksForPlaylistTemplate = Handlebars.compile(tracksForPlaylistSource),
        tracksForPlaylistPlaceholder = document.getElementById('playlists-container');

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    if (access_token && (state == null || state !== storedState)) {
        alert('There was an error during the authentication\n\nYou will be redirected to the beginning of the flow.');
        window.location = "/spotify/";
    } else {
        if (access_token) {
            var apiObj = BRG.SPOTIFY.API.playlists(access_token, 1213507414, 1);

            BRG.PROMISES.get(apiObj.url, apiObj.headers).then(function(response) {
                var playlists = JSON.parse(response);

                playlistsForUserPlaceholder.innerHTML += playlistsForUserTemplate(playlists);

                $('#waiting-message').show();

                return playlists;
            }, function(error) {
                console.error("Playlists Failed.", error);
            }).then(function(playlists) {
                for (var i = 0; i < playlists.items.length; i++) {
                    apiObj = BRG.SPOTIFY.API.tracks(access_token, 1213507414, playlists.items[i].id, 1);

                    var tracksCallback = (function(playlistIndex) {
                        return function(response) {
                            var tracks = JSON.parse(response);

                            tracks.images = playlists.items[playlistIndex].images;
                            tracks.playlistName = playlists.items[playlistIndex].name;
                            tracksForPlaylistPlaceholder.innerHTML += tracksForPlaylistTemplate(tracks);

                            $('#waiting-message').hide();
                    }})(i);

                    if (playlists.items[i].id) { //need this check for Starred playlists, which doesn't have an id
                        BRG.PROMISES.get(apiObj.url, apiObj.headers).then(tracksCallback ,function(error) {
                            console.error("Tracks failed.", error);
                        });
                    }

                }}, function(error) {
                console.error("Playlists JSON conversion failed.", error);
            });
        } else {
            $('#waiting-message').show();
        }
    }
})();
