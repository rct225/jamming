const clientId = 'f7d52a3972ea47bd80a7b34446b66b2d';
const redirectURI = 'http://localhost:3000/'

let accessToken = '';
let expiresIn = 0;

const Spotify = {
  getAccessToken() {
    if (accessToken !== '') {
      return accessToken;
    }
    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if ( accessTokenMatch && expiresInMatch ) {
      accessToken = accessTokenMatch;
      expiresIn = expiresInMatch;
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
  }
}

export default Spotify;
