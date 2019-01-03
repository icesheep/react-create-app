import React from 'react';
import Audio from '../audio';

export default class PlayList extends React.Component {

  state = {
    
  };

  playAudio = () => {
    console.log(this.audio)
    this.audio.playAudio();
  }

  render() {
    return <div>
        <div onClick={this.playAudio}>播放</div>
        <Audio
          ref = {e => {this.audio = e}}
        />
      </div>;
  }
}