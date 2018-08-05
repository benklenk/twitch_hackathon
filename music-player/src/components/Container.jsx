import React from 'react';
import Sound from 'react-sound'
import Search from './Search'
import Info from './Info'
import Player from './Player'
import Progress from './Progress'
var parser = new DOMParser()

// AppContainer class
class AppContainer extends React.Component {
  // AppContainer constructor
  constructor(props) {
    super(props);
    this.client_id = ''
    this.state = {
      // What ever is returned, we just need these 3 values
      track: {stream_url: '', title: '', artwork_url: '', id:''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: []
    }
  }
  // MUSIC PLAYER
  // how to handle position of song
  handleSongPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    })
  }

  handleSongFinished () {
    // Call random Track
    // this.randomTrack();
    console.log('finished')
  }

  // SEARCH BOX
  // handle search selection NEED TO CHANGE
  handleSelect(value, item){
    this.setState({ autoCompleteValue: value, track: item });
  }

  // handle input box change NEED TO CHANGE
  handleChange(event, value) {
    // Update input box
    // this.setState({autoCompleteValue: event.target.value});
    // let _this = this;
    //
    // //Search for song with entered value
    // Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
    //   .then(function (response) {
    //     // Update track state
    //     _this.setState({tracks: response.data});
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
    console.log('change')
  }

  // MORE SOUND STUFF
  // format time
  formatMilliseconds(milliseconds) {
    // Format hours
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    // Format minutes
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    // Format seconds
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);

    // Return as string
    return (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds;
  }

  // add client_id and return the string here
  prepareUrl(url) {
      // Attach client id to stream url
      return `${url}?client_id=${this.client_id}`
  }

  // need to add fetch request and set the state equal to the result
  getTrack () {
    let _this = this;
    var doc;
    fetch('http://api.7digital.com/1.2/artist/toptracks?shopId=2020&oauth_consumer_key=7d4vr6cgb392&artistId=1448&usageTypes=adsupportedstreaming', {
      method: 'GET',
      mode: 'cors',
      headers: {
        accept: 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      var id = json.tracks.track[5].id;
      var title = json.tracks.track[5].title;
      console.log(id)
      this.setState({
        track: {stream_url: 'https://stream.svc.7digital.net/stream/catalogue?oauth_consumer_key=7d4vr6cgb392&oauth_nonce=252196489&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1533443238&oauth_version=1.0&shopid=2020&trackid=792983&oauth_signature=Fgc2PW3t2xMSwWyj24PBsFNwNM4%3D', title: title, artwork_url: '', id: id}
      })
    })
  }

  // changes state based on event trigger
  togglePlay(){
    // Check current playing state
    if(this.state.playStatus === Sound.status.PLAYING){
      // Pause if playing
      this.setState({playStatus: Sound.status.PAUSED})
    } else {
      // Resume if paused
      this.setState({playStatus: Sound.status.PLAYING})
    }
  }

  // stop!
  stop(){
    // Stop sound
   this.setState({playStatus: Sound.status.STOPPED});
  }

  // rewind and fast forward
  forward(){
    this.setState({playFromPosition: this.state.playFromPosition+=1000*10});
  }

  backward(){
    this.setState({playFromPosition: this.state.playFromPosition-=1000*10});
  }

  // componentDidMount lifecycle method. Called once a component is loaded
  componentDidMount() {
    this.getTrack();
  }

  // Render method
  render () {
    return (
      <div className="turntable">
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}
        />
        <Info
          title={this.state.track.title}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          random={this.getTrack.bind(this)}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}
        />
        <Sound
         url={this.state.track.stream_url}
         playStatus={this.state.playStatus}
         onPlaying={this.handleSongPlaying.bind(this)}
         playFromPosition={this.state.playFromPosition}
         onFinishedPlaying={this.handleSongFinished.bind(this)}
        />
      </div>
    );
  }
}

// Export AppContainer Component
export default AppContainer
