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

    /**
     * Add some logical helpers to Handlebars
     */
    Handlebars.registerHelper({
        replace: function (find, replace, options) {
            var string = options.fn(this);
            return string.replace(new RegExp(find,"g"), replace);
        },
        eq: (v1, v2) => v1 === v2,
        ne: (v1, v2) => v1 !== v2,
        lt: (v1, v2) => v1 < v2,
        gt: (v1, v2) => v1 > v2,
        lte: (v1, v2) => v1 <= v2,
        gte: (v1, v2) => v1 >= v2,
        and() {
            return Array.prototype.every.call(arguments, Boolean);
        },
        or() {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        },
        nor() {
            return !Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    });

    var playlistsForUserSource = document.getElementById('playlists-for-user-template').innerHTML,
        playlistsForUserTemplate = Handlebars.compile(playlistsForUserSource),
        playlistsForUserPlaceholder = document.getElementById('playlist-names-container');

    var tracksForPlaylistSource = document.getElementById('tracks-for-playlist-template').innerHTML,
        tracksForPlaylistTemplate = Handlebars.compile(tracksForPlaylistSource),
        playlistPlaceholder = document.getElementById('playlists-container');

    var albumsForPlaylistSource = document.getElementById('albums-for-playlist-template').innerHTML,
        albumsForPlaylistTemplate = Handlebars.compile(albumsForPlaylistSource);

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    var pageNumber = 1;
    try {
        pageNumber = state.split("pageNumber=")[1] || pageNumber;
    } catch (e) {
        // just use pageNumber = 1;
    }

    if (access_token && (state == null || state !== storedState)) {
        alert('There was an error during the authentication\n\nYou will be redirected to the beginning of the flow.');
        window.location = "/post-generator/";
    } else {
        if (access_token) {
            var accountId;
            var apiObj = BRG.SPOTIFY.API.myAccount(access_token);

            BRG.PROMISES.get(apiObj.url, apiObj.headers).then(function(response) {

                var accountInfo = JSON.parse(response);
                accountId = accountInfo.id;

            }).then(function() {

                apiObj = BRG.SPOTIFY.API.playlists(access_token, accountId, pageNumber);
                return BRG.PROMISES.get(apiObj.url, apiObj.headers);

            }).then(function(response) {

                var playlists = JSON.parse(response);
                // playlistsForUserPlaceholder.innerHTML += playlistsForUserTemplate(playlists);
                $('#waiting-message').show();
                return playlists;

            }, function(error) {

                console.error("Playlists Failed.", error);

            }).then(function(playlists) {

                var isSkipPlaylist = function(playlistName) {
                    return !playlistName.match(/[0-9]*-[0-9]*-[0-9]*.*/);
                };

                for (var i = 0; i < playlists.items.length; i++) {

                    if (isSkipPlaylist(playlists.items[i].name)) {
                          continue; //skip this playlist
                    }

                    apiObj = BRG.SPOTIFY.API.tracks(access_token, accountId, playlists.items[i].id, 1);

                    var tracksCallback = (function(playlistIndex) {
                        return function(response) {
                            var tracks = JSON.parse(response);
                            var albums = {};

                            tracks.images = albums.images = playlists.items[playlistIndex].images;
                            tracks.playlistName = albums.playlistName = playlists.items[playlistIndex].name;
                            albums.id = playlists.items[playlistIndex].id;

                            albums.items = tracks.items.reduce(function(albums, track) {
                                var albumName = track.track.album.name;

                                var artists = track.track.artists.reduce(function(artists, artist, index) {
                                    artists += (index > 0 ? ", " + artist.name : artist.name);
                                    return artists;
                                }, "");

                                if (albums.length < 1 || albums[albums.length - 1].name != albumName) {
                                    albums.push({
                                        name: albumName,
                                        artists: artists.replace(/"/g, '\\\\\\"')
                                    });
                                } else if (albums[albums.length - 1].artists != artists) {
                                    albums[albums.length - 1].artists = "Various Artists";
                                }

                                return albums;
                            }, []);

                            albums.blogPostTags = albums.items.reduce(function(tags, album) {
                                  if (tags.indexOf(album.artists) < 0) {
                                      tags.push(album.artists.toLowerCase().replace(/ /g, '-'));
                                  }
                                  return tags;
                            }, []);


                            var date;

                            try {
                                // works when the playlist name is a parsable "date"
                                date = new Date(albums.playlistName);
                                albums.date = date.toISOString().split('T')[0];
                            } catch (dateError) {
                                // use the "date added" if the playlist name is not parsable
                                albums.date = tracks.items[0].added_at.split('T')[0];
                            }

                            var splitDate = albums.date.split('-');
                            albums.prettyDate = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;

                            // playlistPlaceholder.innerHTML += tracksForPlaylistTemplate(tracks);
                            playlistPlaceholder.innerHTML += albumsForPlaylistTemplate(albums);

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
