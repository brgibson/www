#!/usr/bin/env bash
source ./variables.sh

curl -X GET "https://api.spotify.com/v1/users/$spotify_user_id/playlists?fields=items(name,tracks(total),id,uri)&limit=50&offset=0" -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"
curl -X GET "https://api.spotify.com/v1/users/$spotify_user_id/playlists?fields=items(name,tracks(total),id,uri)&limit=50&offset=50" -H "Accept: application/json" -H "Authorization: Bearer $spotify_auth_token"