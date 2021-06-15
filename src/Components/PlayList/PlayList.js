import React from 'react';
import { TrackList } from '../TrackList/TrackList.js';
import './PlayList.css';

export class PlayList extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }

  render() {
    return (
      <div className="Playlist" onChange={this.handleNameChange}>
        <input defaultValue={'New Playlist'} />
        <TrackList
          tracks={this.props.playListTracks}
          onRemove={this.props.onRemove}
          isRemoval={true} />
        <button onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
 
    )
  }
}
