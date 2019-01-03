import React, {Component} from 'react';
import Music from '../../static/1.mp3';
import './index.less';

export default class Page1 extends Component {

  state = {
    playingtime: 0,   //播放时间 
    buffertime: 0,   //缓冲时间
    duration: 0,   //总时长
    playing: false,   //播放状态
    showFix: false,   //下载提示状态
    playIndex: 0,   //当前播放曲目index
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.requestRef);
  }

  // 播放时间刷新
  PlayingMusic = () => {
    this.requestRef = requestAnimationFrame(() => {
      this.timer = setTimeout(() => {
        if(this.videoContainer) {
          let timeRages = this.videoContainer.buffered;
          let bufferedTime = 0
          if(timeRages.length !== 0){
              bufferedTime = timeRages.end(timeRages.length-1);
          }
          if(this.videoContainer.currentTime === this.videoContainer.duration) {
            this.setState(
              {
                playingtime: this.videoContainer.currentTime,
                duration: this.videoContainer.duration,
                buffertime: bufferedTime,
              },
              () => {
                this.videoContainer.play();
                this.PlayingMusic();
              }
            );
          }else {
            this.setState(
              {
                playingtime: this.videoContainer.currentTime,
                duration: this.videoContainer.duration,
                buffertime: bufferedTime,
              },
              () => {
                this.PlayingMusic();
              }
            );
          }
        }
      }, 1000);
    });
  };

  // 格式化时间
  formatterTime = (time) => {
    let minutes = Math.floor(Math.round(time)/60);
    let seconds = Math.floor(Math.round(time)%60);
    minutes = `0${minutes}`.substr(-2);
    seconds = `0${seconds}`.substr(-2);
    return `${minutes}:${seconds}`
  }

  // 播放、暂停功能
  playAudio = () => {
    const {playing,playIndex} = this.state;
    if(playing) {
      this.setState({
        playing: false,
      }, ()=>{
        this.videoContainer.pause();
        clearTimeout(this.timer);
        cancelAnimationFrame(this.requestRef);
      })
    }else {
      this.setState({
        playIndex : playIndex===-1 ? 0 : playIndex,
        playing: true,
      }, ()=>{
        this.videoContainer.play();
        this.PlayingMusic();
      })
    }
  }

  // 停止播放
  stopPlay = () => {
    this.setState({
      playIndex: -1,
      playing: false,
    })
    this.videoContainer.pause();
  }
  //设置进度条
  setTimeOnPc = (time) =>{
    let audio = this.videoContainer;
    if(audio.currentTime !== 0) {
        audio.currentTime = time;
        this.setState(
          {
            playingtime: time,
          }
        );
    }
  }

  //点击事件
  clickChangeTime = (e) =>{
    const {duration} = this.state;
    if(!e.pageX&& !duration){
        return
    }
    this.setTimeOnPc((e.pageX-this.progressDiv.offsetLeft)/(this.progressDiv.clientWidth)*duration)
  }
  // 开始拖动
  startChangeTime = (e) =>{
    clearTimeout(this.timer);
    cancelAnimationFrame(this.requestRef);
  }
  // 拖动播放条
  moveProgress = (e) =>{
    var point = this.getPoint(e);
    const {duration} = this.state;
    if(!point.pageX&& !duration){
        return
    }
    this.setState(
      {
        playingtime: (point.pageX-this.progressDiv.offsetLeft)/(this.progressDiv.clientWidth)*duration,
      }
    );
    // this.setTimeOnPc()
  }

  moveEnd = () => {
    let audio = this.videoContainer;
    const {playingtime} = this.state;
    if(audio.currentTime !== 0 && playingtime <= audio.duration) {
        audio.currentTime = playingtime;
    }
    this.PlayingMusic();
  }
  //默认以第一个手指的位置计算
  getPoint =(e) =>{
    return e.touches ? e.touches[0] : e;
  };


  render() {
    const {buffertime, duration, playingtime} = this.state;
    return <div className="music">
        <div className="row">
          <div className="time right">{this.formatterTime(playingtime)}</div>
          <div className="progress" ref={node => this.progressDiv = node} onClick={this.clickChangeTime}>
            <div 
              className="playing"
              style={{width: (duration) ? `${playingtime/duration*100}%` : duration}}
            />
            <div 
              onTouchStart={this.startChangeTime}
              onTouchMove={this.moveProgress}
              onTouchEnd={this.moveEnd}
              // onMouseDown={this.startChangeTime}
              // onMouseMove={this.moveProgress}
              // onMouseUp={this.moveEnd}
              className="dot"
              style={{left: (duration) ? `${playingtime/duration*100}%` : duration}}
            />
            <div 
              className="buffer"
              style={{width: (buffertime) ? `${buffertime/duration*100}%` : 0}}
            />
          </div>
          <div className="time">{this.formatterTime(duration)}</div>
        </div>
        <audio
          id="player"
          src={Music}
          style={{display:'none'}}
          ref={node => this.videoContainer = node}
          preload="none" controlsList="nodownload"
          onEnded={this.stopPlay}
        ></audio>
      </div>;
  }
}