(function () {

    // Setup Functions/Helpers/Templates/Constants/Etc

    var stateKey = 'spotify_auth_state';
    const ALBUM_PLAYLIST = 'album-playlist';
    const INTRO_TO_ARTIST_PLAYLIST = 'intro-to-artist-playlist';
    const STANDARD_PLAYLIST = 'standard';

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

    var introToArtistPlaylistSource = document.getElementById('intro-to-artist-playlist-template').innerHTML,
        introToArtistPlaylistTemplate = Handlebars.compile(introToArtistPlaylistSource);

    var albumsForPlaylistSource = document.getElementById('albums-for-playlist-template').innerHTML,
        albumsForPlaylistTemplate = Handlebars.compile(albumsForPlaylistSource);

    /**
     * @param {String} - playlistName
     * @return ('album-playlist'|'intro-to-artist-playlist'|null)
     */
    function getPlaylistType({ playlistName = "" }) {
        return (
            playlistName.match(/[0-9]*-[0-9]*-[0-9]*.*/) ? ALBUM_PLAYLIST :
            playlistName.startsWith('An Introduction') ? INTRO_TO_ARTIST_PLAYLIST :
            STANDARD_PLAYLIST
        );
    }

    function isSkipPlaylist({ playlistType, selectedPlaylistType }) {
        if (!selectedPlaylistType || selectedPlaylistType === 'all') {
            return false;
        }

        if (playlistType !== selectedPlaylistType) {
            return true;
        }
    }

    function getTracksApiCallback_standardPlaylist({ playlistFromApi }) {
        return function(response) {
            var tracksFromApi = JSON.parse(response);
            var playlist = {};

            tracksFromApi.images = playlist.images = playlistFromApi.images;
            tracksFromApi.playlistName = playlist.playlistName = playlistFromApi.name;
            tracksFromApi.playlistNameUrlFormatted = playlist.playlistNameUrlFormatted = playlistFromApi.name.toLowerCase()
                .replace(' ', '-')
                .replace(' - ', '-')
                .replace('(', '\(')
                .replace(')', '\)')
                .replace(':', "");

            playlist.id = playlistFromApi.id;

            playlist.tracks = tracksFromApi.items.reduce(function(tracks, track) {
                var albumName = track.track.album.name;

                var artists = track.track.artists.reduce(function(artists, artist, index) {
                    artists += (index > 0 ? ", " + artist.name : artist.name);
                    return artists;
                }, "");

                tracks.push({
                    title: track.track.name,
                    album: albumName,
                    artists: artists.replace(/"/g, '\\\\\\"')
                });

                playlist.artist = playlist.artist || artists; // easier access for the overall playlist artist

                return tracks;
            }, []);

            playlist.blogPostTags = playlist.tracks.reduce(function(tags, album) {
                  if (tags.indexOf(album.artists) < 0) {
                      tags.push(album.artists.toLowerCase().replace(/ /g, '-'));
                  }
                  return tags;
            }, []);

            playlist.date = tracksFromApi.items[0].added_at.split('T')[0];

            var splitDate = playlist.date.split('-');
            playlist.prettyDate = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;

            playlistPlaceholder.innerHTML += `<div class="playlist-container"><pre>
echo "---
layout: post-standard-playlist
short-title: ${playlist.playlistName}
title: ${playlist.playlistName}
category: [blog, playlist]
tags: [\"playlist\",\"${playlist.blogPostTags.join('\\",\\"')}\"]
tracks: [${playlist.tracks.map(track => JSON.stringify(track)).join(',')}]
playlist-id: ${playlist.id}
playlist-img: ${playlist.images[0].url}
summary: \"A playlist I created on ${playlist.prettyDate}\"
---" > _posts/{{date}}-${playlist.playlistNameUrlFormatted}.md
</pre></div>`;

            $('#waiting-message').hide();
        }
    }

    function getTracksApiCallback_introToArtistPlaylist({ playlistFromApi }) {
        return function(response) {
            var tracksFromApi = JSON.parse(response);
            var playlist = {};

            tracksFromApi.images = playlist.images = playlistFromApi.images;
            tracksFromApi.playlistName = playlist.playlistName = playlistFromApi.name;
            tracksFromApi.playlistNameLowercase = playlist.playlistNameLowercase = playlistFromApi.name.toLowerCase();
            playlist.id = playlistFromApi.id;

            playlist.tracks = tracksFromApi.items.reduce(function(tracks, track) {
                var albumName = track.track.album.name;

                var artists = track.track.artists.reduce(function(artists, artist, index) {
                    artists += (index > 0 ? ", " + artist.name : artist.name);
                    return artists;
                }, "");

                tracks.push({
                    title: track.track.name,
                    album: albumName,
                    artists: artists.replace(/"/g, '\\\\\\"')
                });

                playlist.artist = playlist.artist || artists; // easier access for the overall playlist artist

                return tracks;
            }, []);

            playlist.blogPostTags = playlist.tracks.reduce(function(tags, album) {
                  if (tags.indexOf(album.artists) < 0) {
                      tags.push(album.artists.toLowerCase().replace(/ /g, '-'));
                  }
                  return tags;
            }, []);

            playlist.date = tracksFromApi.items[0].added_at.split('T')[0];

            var splitDate = playlist.date.split('-');
            playlist.prettyDate = `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`;

            playlistPlaceholder.innerHTML += introToArtistPlaylistTemplate(playlist);

            $('#waiting-message').hide();
        }
    }

    function getTracksApiCallback_albumPlaylist({ playlist }) {
        return function(response) {
            var tracks = JSON.parse(response);
            var albums = {};

            tracks.images = albums.images = playlist.images;
            tracks.playlistName = albums.playlistName = playlist.name;
            albums.id = playlist.id;

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
        }
    }

    function getTracksApiCallback({ playlistType, playlist }) {
        return (
            playlistType === ALBUM_PLAYLIST ? getTracksApiCallback_albumPlaylist({ playlist }) :
            playlistType === INTRO_TO_ARTIST_PLAYLIST ? getTracksApiCallback_introToArtistPlaylist({ playlistFromApi: playlist }) :
            getTracksApiCallback_standardPlaylist({ playlistFromApi: playlist })
        );
    }

    // Begin Main Work

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    var pageNumber = 1;
    var selectedPlaylistType = null;

    try {
        let [stateWithoutPlaylistType, playlistTypeFromState] = state.split("playlistType=");
        selectedPlaylistType = playlistTypeFromState;

        pageNumber = stateWithoutPlaylistType.split("pageNumber=")[1] || pageNumber;


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
                for (var i = 0; i < playlists.items.length; i++) {
                    const playlist = playlists.items[i];
                    const playlistType = getPlaylistType({ playlistName: playlist.name });

                    if (isSkipPlaylist({ playlistType, selectedPlaylistType })) {
                          continue; //skip this playlist
                    }

                    apiObj = BRG.SPOTIFY.API.tracks(access_token, accountId, playlist.id, 1);

                    const tracksApiCallback = getTracksApiCallback({ playlistType, playlist });

                    if (playlist.id) { //need this check for Starred playlists, which doesn't have an id
                        BRG.PROMISES.get(apiObj.url, apiObj.headers).then(tracksApiCallback ,function(error) {
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
