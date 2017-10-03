const clientId = 'f7d52a3972ea47bd80a7b34446b66b2d';
const redirectURI = 'http://localhost:3000/';
// const redirectURI = 'https://rtjam.surge.sh';

let accessToken;
// let expiresIn = 0;

const Spotify = {
  getAccessToken() {
      if (accessToken) return accessToken;
      var accessTokenMatch = window.location.href.match(/access_token=([^&]*)/),
          expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
          accessToken = accessTokenMatch[1];
          var n = Number(expiresInMatch[1]);
          window.setTimeout(() => { return accessToken = ""}, 1e3 * n);
          window.history.pushState("Access Token", null, "/");
          return accessToken;
      }
      window.location = "https://accounts.spotify.com/authorize?client_id=" + clientId + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectURI;
  },
  search(term) {
    let token = Spotify.getAccessToken();
    console.log(token);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    {
      headers: { Authorization: "Bearer " + token}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map( track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        });
      }
    });
  },
  savePlaylist(playlistName, trackURIs) {
    console.log(trackURIs)
    if (playlistName && trackURIs) {
      let token = Spotify.getAccessToken();
      let headers = { Authorization: `Bearer ${token}`};
      let userId = ''
      return fetch("https://api.spotify.com/v1/me", {headers: headers}).then( response => {
        return response.json();
      }).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({
            name: playlistName
          })
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          let playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
              uris: trackURIs
              })
          })
        })
      })
    }
  }
}

export default Spotify;
