import React from 'react';
import Spotify from '../../util/Spotify';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { PlayList } from '../PlayList/PlayList.js';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      playListName: 'New Playlist',
      playListTracks: [],
      searchResults: []
    }
  }

  addTrack(newTrack) {
    let tracks = this.state.playListTracks;
    if (tracks.find(savedTrack => savedTrack.id === newTrack.id)) {
      return;
    }
    tracks.push(newTrack);
    this.setState({ playListTracks: tracks });
  }

  removeTrack(trackToRemove) {
    let tracks = this.state.playListTracks;
    let newTracks = tracks.filter(track => track.id !== trackToRemove.id);
    this.setState({ playListTracks: newTracks });
  }

  savePlayList() {
    let tracks = this.state.playListTracks;
    let trackURIs = tracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playListName, trackURIs)
      .then(() => {
        this.setState({
          playListName: 'New Playlist',
          playListTracks: []
        })
      })
  }

  search(term) {
    Spotify.search(term).then(spotifyResults => {
      this.setState({ searchResults: spotifyResults })
    })
  }

  updatePlayListName(name) {
    this.setState({ playListName: name });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              SearchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <PlayList
              playListName={this.state.playListName}
              playListTracks={this.state.playListTracks}
              onNameChange={this.updatePlayListName}
              onRemove={this.removeTrack}
              onSave={this.savePlayList} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
