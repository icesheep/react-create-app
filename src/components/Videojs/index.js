import React, { Component } from 'react';
import videojs from 'video.js';
import { HlsSourceHandler } from 'videojs-contrib-hls';

export default class VideoJsForReact extends Component {
  constructor(props) {
    super(props);
    this.options = {}
    this.sources = [];
    // 判断是否是多码流，来修改播放器的播放方式
    if (props.sources.length > 1) {
      // 若存在多个流地址，则开启videoJsResolutionSwitcher 
      this.sources = props.sources
    } else {
      this.options.source = props.sources
    }
  }

  componentDidMount() {
    videojs.getTech('html5').registerSourceHandler(HlsSourceHandler('html5'), 0);
    let _this = this
    this.player = videojs(this.videoContainer, {
      ...this.props,
      ...this.options,
      // flash: {
      //   swf: Swf,
      // },
    }, function () {
      let player = this
      let props = _this.props
      let sources = _this.sources

      // 播放器加载成功的回调
      if (!!props.onReady) {
        props.onReady(props,player)
      }

      // 修正使用多码流播放时自动播放失效的BUG
      // if (!!props.autoplay) {
      //   setInterval(() => {
      //     player.play();
      //   }, 100)
      // }

      // 判断是否是多码流，单码流调用video.js播放器播放，多码流使用插件播放
      if (sources.length > 1) {
        player.updateSrc([...sources])
        player.on('resolutionchange', function () {
          // 切换成功的回调
          if (!!props.sourceChanged) {
            props.sourceChanged(player)
          }
        })
      }
    })
  }

  componentWillUnmount() {
    // 销毁播放器
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    return (
      <div>
        <audio
          style={{display:'none'}}
          ref={node => this.videoContainer = node}
          className="video-js"
        ></audio>
      </div>
    )
  }
}

