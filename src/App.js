import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [ { name: '', artist: '', album: ''}],
      playlistName: 'Rob',
      playlistTracks: [{ name: '', artist: '', album: ''}]
    }
    this.addTrack.bind(this);
    this.removeTrack.bind(this);
    this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    let currentTracks = this.state.playlistTracks;
    if (!(track.id in currentTracks)) {
      currentTracks.push(track);
      this.setState({ playlistTracks: currentTracks });
    }
  }

  removeTrack(track) {
    let newTracks = this.state.playlistTracks.filter(e => e.id !== track.id)
    this.setState({ playlistTracks: newTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* <!-- Add a SearchBar component --> */}
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
