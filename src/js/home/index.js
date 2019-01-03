import React from 'react';
import VideoJsForReact from '../../components/Videojs';

export default class Home extends React.Component {

  state = {
    playing: false,
    showFix: true,
    videoJsOptions: {
      preload: 'auto',  // 预加载
      bigPlayButton: {},  // 大按钮
      autoplay: false,   // 自动播放
      controls: true,  // 是否开启控制栏
      width: 0,   // 播放器宽度
      height: 0,  // 播放器高度
      playbackRates: [1, 1.5, 2], // 播放倍速
      sources: [  // 视频源
        {
          src: 'http://39.108.163.99:1935/live/fm918/playlist.m3u8',
          type: 'application/x-mpegURL',
          label: 'HLS1',
          withCredentials: false,
          res: 960
        }
      ]
    }
  };

  playAudio = () => {
    const {players,playing} = this.state;
    console.log(players)
    if(playing) {
      this.setState({
        playing: false
      },() => {
        players.pause();
      })
    }else {
      this.setState({
        playing: true
      },() => {
        let playPromise = players.play();
        if (playPromise) {
          playPromise.then(() => {
              // 音频加载成功
              setTimeout(() => {
                  // 后续操作
                  console.log("done");
              }, 1000); // audio.duration 为音频的时长单位为秒
          }).catch((e) => {
              console.log("Operation is too fast, audio play fails");
          });
        }
      })
    }
    
  }

  render() {
    const { videoJsOptions} = this.state;
    return <div>
        <div onClick={this.playAudio}>播放</div>
        <VideoJsForReact
          sourceChanged={(player,players) => {console.log('准备完毕', player,players);this.setState({players})}}
          onReady={(player,players) => {console.log('准备完毕', player,players);this.setState({players})}}
          {...videoJsOptions}
        />
      </div>;
  }
}