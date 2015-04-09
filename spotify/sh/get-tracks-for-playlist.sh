#!/usr/bin/env bash
source variables.sh

#local variables
spotify_playlist_key=6mk3tv619vatWP4Qb6HRRV

curl -X GET "https://api.spotify.com/v1/users/$spotify_user_id/playlists/$spotify_playlist_key/tracks?fields=items(track(name,album(name),artists(name)))&limit=100&offset=0" -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"
curl -X GET "https://api.spotify.com/v1/users/$spotify_user_id/playlists/$spotify_playlist_key/tracks?fields=items(track(name,album(name),artists(name)))&limit=100&offset=100" -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"
curl -X GET "https://api.spotify.com/v1/users/$spotify_user_id/playlists/$spotify_playlist_key/tracks?fields=items(track(name,album(name),artists(name)))&limit=100&offset=200" -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"

