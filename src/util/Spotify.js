const clientId = 'f7d52a3972ea47bd80a7b34446b66b2d';
const redirectURI = 'http://localhost:3000/';
/* const redirectURI = 'http://rtjam.surge.sh'; */

let accessToken;
let expiresIn = 0;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if ( accessTokenMatch && expiresInMatch ) {
      let userAccessToken = accessTokenMatch[1];
      expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => { return accessToken = ''; }, expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    }
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
  },
  search(term) {
    let token = Spotify.getAccessToken();
    console.log(token);
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    {
      headers: { Authorization: "Bearer " + token}
    }).then( response => {
      return response.json();
    }).then ( jsonResponse => {
      return jsonResponse.tracks.items.map( track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      });
    });
  },
  savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      let token = Spotify.getAccessToken();
      let headers = { Authorization: `Bearer ${token}`};
      let userId = ''
      return fetch("https://api.spotify.com/v1/me", {headers: headers}).then( response => {
        return response.json();
      }).then( jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({
            name: playlistName
          })
      }).then( response => {
        return response.json();
      }).then( jsonResponse => {
        let playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({
            uri: trackURIs
            })
          })
        }
      )}
    )}
  }
};

export default Spotify;
