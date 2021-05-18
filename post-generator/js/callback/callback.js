(function () {

    // Setup Functions/Helpers/Templates/Constants/Etc

    var stateKey = 'spotify_auth_state';

    const ALBUM_PLAYLIST = 'album-playlist';
    const INTRO_TO_ARTIST_PLAYLIST = 'intro-to-artist-playlist';
    const STANDARD_PLAYLIST = 'standard-playlist';
    const COLLABORATIVE_PLAYLIST = 'collaborative-playlist';
    const SKIP_PLAYLIST = 'skip';

    const PLAYLIST_TYPE_OVERRIDES = {
        '12-06-2019 - First Friday - Choral Music': STANDARD_PLAYLIST,
        'Rolling Stone Top 50 Pop Punk Albums': ALBUM_PLAYLIST,
        '9-17-2018 (Italy)': STANDARD_PLAYLIST,
        '9-17-2018 (Italy 2)': STANDARD_PLAYLIST,
        '6-15-2016 (with Llewyn Davis Soundtrack)': STANDARD_PLAYLIST,
        '10-24-2016 - Luke Cage Soundtrack': STANDARD_PLAYLIST,
        '11-23-2016 - Radio - Walk Away Renee': STANDARD_PLAYLIST,
        'My Top 20 Albums - 5/2016': ALBUM_PLAYLIST,
        'Bury My Body (6-8-2015 Recap)': STANDARD_PLAYLIST,
        'Twinkle, baby... Twinkle (7-9-2015 Recap)': STANDARD_PLAYLIST,
        'Past Life Progress (7-18-2015 Recap)': STANDARD_PLAYLIST,
        '(8-6-2015 Recap)': STANDARD_PLAYLIST,
        'Clips  (8-6-2015 Recap - Part 2)': STANDARD_PLAYLIST,
        'Splish Splash (8-6-1015 Recap - Part 1)': STANDARD_PLAYLIST,
        'Japan - 9/1/2016': ALBUM_PLAYLIST,
        'New Albums': ALBUM_PLAYLIST,
        'Viva Las Vegas! - 2-6-2015': STANDARD_PLAYLIST,
        'Vegas 2 - 7-22-2016': STANDARD_PLAYLIST,
        'A Short Introduction to blink-182': INTRO_TO_ARTIST_PLAYLIST,
        'A Short Introduction to blink-182 - Part 2': INTRO_TO_ARTIST_PLAYLIST,
        'Danny Elfman': ALBUM_PLAYLIST,
        'Disney & Other Childhood Soundtracks': ALBUM_PLAYLIST,
        'Albums That Are Cool': ALBUM_PLAYLIST,
        'Ten Albums With A Profound Impact On Me': ALBUM_PLAYLIST,
        'Rolling Stone - Top 40 Punk Albums (Pub. 2016)': ALBUM_PLAYLIST,
        "Andrew E's Top 20 Albums - 5/2016": ALBUM_PLAYLIST,
        'From Rey': ALBUM_PLAYLIST,
        'Next': SKIP_PLAYLIST,
        'Starred': SKIP_PLAYLIST,
        'My Shazam Tracks': SKIP_PLAYLIST,
    };

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

    function delayPromise({ ms, wrappedPromise }) {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          return resolve(wrappedPromise());
        }, ms);
      });
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

    function formatTitleForUrl({ playlistName }) {
        return playlistName
            .toLowerCase()
            .replaceAll('...', 'ellipsis')
            .replaceAll('—', '')
            .replaceAll('.', "")
            .replaceAll('\'', "")
            .replaceAll('!', "")
            .replaceAll(',',"")
            .replaceAll('&','and')
            .replaceAll('/', "-")
            .replaceAll(':', "")
            .replaceAll(')', '\\)')
            .replaceAll('(', '\\(')
            .replaceAll(' - ', '-')
            .replaceAll(' ', '-');
    }

    /**
     * @param {String} - playlistName
     * @return ('album-playlist'|'intro-to-artist-playlist'|null)
     */
    function getPlaylistType({ playlistName = "", collaborative }) {
        return (
            PLAYLIST_TYPE_OVERRIDES[playlistName] ? PLAYLIST_TYPE_OVERRIDES[playlistName] :
            collaborative ? COLLABORATIVE_PLAYLIST :
            playlistName.match(/[0-9]*-[0-9]*-[0-9]*.*/) ? ALBUM_PLAYLIST :
            playlistName.startsWith('An Introduction') ? INTRO_TO_ARTIST_PLAYLIST :
            STANDARD_PLAYLIST
        );
    }

    function isSkipPlaylist({ playlistType, selectedPlaylistType, isPublic, owner}) {
        let skipPlaylist = false;

        if (!isPublic) { skipPlaylist = true } // skip private playlists
        else if (owner.id !== "1213507414" && playlistType !== COLLABORATIVE_PLAYLIST) { skipPlaylist = true } // skip playlists that aren't created by me, unless they are collaborative
        else if (playlistType === SKIP_PLAYLIST) { skipPlaylist = true } // skip playlists specified in PLAYLIST_TYPE_OVERRIDES
        else if (
            selectedPlaylistType
            && selectedPlaylistType !== 'all'
            && playlistType !== selectedPlaylistType
        ) { skipPlaylist = true } // skip playlist if it is not in the "selected type"

        return skipPlaylist;
    }

    function getTracksApiCallback_standardPlaylist({ playlistFromApi }) {
        return function(responses) {
            const tracksFromApi = JSON.parse(responses[0]);
            for (let i = 1; i < responses.length; i++) {
                // append subsequent pages of tracks to the first page of tracks
                const arrayOfTracks = JSON.parse(responses[i]).items;
                tracksFromApi.items.push(...arrayOfTracks);
            }

            var playlist = {};

            tracksFromApi.images = playlist.images = playlistFromApi.images;
            tracksFromApi.playlistName = playlist.playlistName = playlistFromApi.name;
            tracksFromApi.playlistNameUrlFormatted = playlist.playlistNameUrlFormatted = formatTitleForUrl({ playlistName: playlistFromApi.name });

            playlist.id = playlistFromApi.id;

            if (!tracksFromApi.items[0]) {
                console.log(`Skipping playlist (${tracksFromApi.playlistName}) because it has no tracks`);
                return;
            }

            playlist.tracks = tracksFromApi.items.reduce(function(tracks, track) {
                var albumName = track.track.album.name;

                var artists = track.track.artists.reduce(function(artists, artist, index) {
                    artists += (index > 0 ? ", " + artist.name : artist.name);
                    return artists;
                }, "");

                tracks.push({
                    title: track.track.name.replaceAll('"', '\\\\\\"'),
                    album: albumName.replaceAll('"', '\\\\\\"'),
                    artists: artists.replaceAll('"', '\\\\\\"')
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
short-title: \\"${playlist.playlistName}\\"
title: \\"${playlist.playlistName}\\"
category: [blog, playlists]
tags: [\\"playlists\\",\\"${playlist.blogPostTags.join('\\",\\"')}\\"]
tracks: [${playlist.tracks.map(track => `{\\"title\\":\\"${track.title}\\",\\"album\\":\\"${track.album}\\",\\"artists\\":\\"${track.artists}\\"}`).join(',')}]
playlist-id: ${playlist.id}
playlist-img: ${playlist.images[0].url}
summary: \\"A playlist I created on ${playlist.prettyDate}\\"
---" > _posts/${playlist.date}-${playlist.playlistNameUrlFormatted}.md
</pre></div>`;

            $('#waiting-message').hide();
        }
    }

    function getTracksApiCallback_introToArtistPlaylist({ playlistFromApi }) {
        return function(responses) {
            const tracksFromApi = JSON.parse(responses[0]);
            for (let i = 1; i < responses.length; i++) {
                // append subsequent pages of tracks to the first page of tracks
                const arrayOfTracks = JSON.parse(responses[i]).items;
                tracksFromApi.items.push(...arrayOfTracks);
            }

            var playlist = {};

            tracksFromApi.images = playlist.images = playlistFromApi.images;
            tracksFromApi.playlistName = playlist.playlistName = playlistFromApi.name;
            tracksFromApi.playlistNameLowercase = playlist.playlistNameLowercase = formatTitleForUrl({ playlistName: playlistFromApi.name });
            playlist.id = playlistFromApi.id;

            if (!tracksFromApi.items[0]) {
                console.log(`Skipping playlist (${tracksFromApi.playlistName}) because it has no tracks`);
                return;
            }

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
        return function(responses) {
            const tracks = JSON.parse(responses[0]);
            for (let i = 1; i < responses.length; i++) {
                // append subsequent pages of tracks to the first page of tracks
                const arrayOfTracks = JSON.parse(responses[i]).items;
                tracks.items.push(...arrayOfTracks);
            }

            var albums = {};

            tracks.images = albums.images = playlist.images;
            tracks.playlistName = albums.playlistName = playlist.name;
            tracks.playlistNameUrlFormatted = albums.playlistNameUrlFormatted = formatTitleForUrl({ playlistName: playlist.name });

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
                    const playlistType = getPlaylistType({ playlistName: playlist.name, collaborative: playlist.collaborative });

                    if (isSkipPlaylist({
                        playlistType,
                        selectedPlaylistType,
                        isPublic: playlist.public,
                        owner: playlist.owner,
                    })) {
                          continue; //skip this playlist
                    }

                    const numPagesOfTracks = Math.floor(playlist.tracks.total / 100) + 1;
                    const maxPagesToRequestPerPlaylist = 11; // that will get us 1100 songs

                    const apiObjs = [];
                    for (let j = 1; j <= numPagesOfTracks && j <= maxPagesToRequestPerPlaylist; j++) {
                      apiObjs.push(BRG.SPOTIFY.API.tracks(access_token, accountId, playlist.id, j))
                    }

                    if (apiObjs.length > 1) {
                        console.log(`${playlist.name} has over ${((apiObjs.length - 1) * 100)} tracks`)
                    }

                    const tracksApiCallback = getTracksApiCallback({ playlistType, playlist });

                    if (playlist.id) { //need this check for Starred playlists, which doesn't have an id

                        const promises = apiObjs.map((apiObj, index) => {
                            return delayPromise({
                                ms: (i * 250) + ((index + 1) * 250),
                                wrappedPromise: () => BRG.PROMISES.get(apiObj.url, apiObj.headers)
                            });
                        });

                        Promise.all(promises).then(tracksApiCallback, function(error) {
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
