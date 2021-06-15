let accessToken;
const clientID = '3b600700a21e485392693d64c0d971d3';
const redirectURI = 'http://localhost:3000/callback';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // check for an access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      
      accessToken = accessTokenMatch[1];
      
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      
      window.history.pushState('Access Token', null, '/');

      return accessToken;

    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q="${term}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }) 
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        let trackInfo =  jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));

        return trackInfo;
      
      });
  },

  savePlaylist(playlistName, trackURIs) {
    if (! playlistName || !trackURIs) {
     return 
    }
    
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userID;

    return fetch('https://api.spotify.com/v1/me', {
      headers: headers
    })
      .then(response => response.json())
      .then(responseJSON => {
        userID = responseJSON.id;
        return fetch('https://api.spotify.com/v1/me/playlists', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: playlistName })
        }).then(response => response.json())
          .then(jsonResponse => {
            const playlistID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: trackURIs })
            });
          })
      })

  }
}

export default Spotify;