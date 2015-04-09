var BRG = BRG || {};
BRG.SPOTIFY = BRG.SPOTIFY || {};
BRG.SPOTIFY.API = BRG.SPOTIFY.API || {};

(function() {
    var API = BRG.SPOTIFY.API;

    /**
     * https://api.spotify.com/v1/me
     *
     * @param accessToken
     * @returns {{url: string, headers: {Authorization: string}}}
     */
    API.myAccount = function(accessToken) {
        return {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };
    };

    /**
     * "https://api.spotify.com/v1/users/<spotify_user_id>/playlists?fields=items(name,tracks(total),id,uri)&limit=50&offset=0"
     *   -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"
     *
     * @param accessToken
     * @param spotifyUserId
     * @param pageNumber - we only get 50 playlists at a time
     *
     * @returns {{url: string, headers: {Authorization: string}}}
     */
    API.playlists = function(accessToken, spotifyUserId, pageNumber) {
        var playlistLimit = 50;
        return {
            url: 'https://api.spotify.com/v1/users/'
               + spotifyUserId
               + '/playlists?fields=limit,next,items(added_at,name,tracks(total),id,uri,images)'
               + '&limit=' + playlistLimit
               + '&offset=' + (playlistLimit * (pageNumber - 1)),
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };
    };

    /**
     * "https://api.spotify.com/v1/users/<spotify_user_id>/playlists/<playlist_id>/tracks?fields=items(track(name,album(name),artists(name)))&limit=100&offset=0"
     *   -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"
     *
     * @param accessToken
     * @param spotifyUserId
     * @param pageNumber - we only get 100 tracks at a time
     *
     * @returns {{url: string, headers: {Authorization: string}}}
     */
    API.tracks = function(accessToken, spotifyUserId, playlistId, pageNumber) {
        var playlistLimit = 100;
        return {
            url: 'https://api.spotify.com/v1/users/'
               + spotifyUserId
               + '/playlists/'
               + playlistId
               + '/tracks?fields=limit,next,items(track(name,album(name),artists(name)))'
               + '&limit=' + playlistLimit
               + '&offset=' + (playlistLimit * (pageNumber - 1)),
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };
    };
})();

