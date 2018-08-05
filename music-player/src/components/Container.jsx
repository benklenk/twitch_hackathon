import React from 'react';
import Sound from 'react-sound';
import Search from './Search'
import Info from './Info'
import Player from './Player'
import Progress from './Progress'
//import OAuth from './oauth'
import oauthSignature from 'oauth-signature'
// import queue from 'queue'
//import ui from './ui'
//import oauth from './oauth'
var consumerKey = "7d4vr6cgb392"
var consumerSecret = 'm4ntskavq56rddsa'
var signatureMethod = "HMAC-SHA1"
var oauthVersion = "1.0"
var shopId = "2020"
var streamURL = "https://stream.svc.7digital.net/stream/catalogue"
var apiURL = "http://api.7digital.com/1.2"
var searchType = "/track/search"
var urlKeys = "?shopId=2020&oauth_consumer_key=7d4vr6cgb392&"
var fields = {shopId: "2020", trackId: ""}

// AppContainer class
class AppContainer extends React.Component {
  // AppContainer constructor
  constructor(props) {
    super(props);
    this.client_id = ''
    this.state = {
      // What ever is returned, we just need these 3 values
      track: {stream_url: '', artist: '', title: '', artwork_url: '', id:''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: [],
      search: []
    }
  }
  // MUSIC PLAYER
  // how to handle position of song
  handleSongPlaying(audio) {
    console.log(audio,'d')
    let elapsed = this.formatMilliseconds(audio.position)
    let total = this.formatMilliseconds(audio.duration)
    let position = audio.position / audio.duration
    console.log(elapsed,total,position)

    this.setState({
      elapsed: elapsed,
      total: total,
      position: position
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
    console.log(item)
    this.setState({ autoCompleteValue: value});
    this.getTrack(item)
  }

  // handle input box change NEED TO CHANGE
  handleChange(event, value) {
    let search = []
    this.setState({autoCompleteValue: event.target.value});
    let _this = this;
    //Search for song with entered value
    var trackUrl = apiURL + searchType + urlKeys + "q=" + value + "&usageTypes=adsupportedstreaming"
    fetch(trackUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        accept: 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.searchResults && json.searchResults.totalItems > 0) {
        if (json.searchResults.totalItems < 5) {
          for (let i = 0; i < json.searchResults.totalItems; i++) {
            console.log(i)
            var trackId = json.searchResults.searchResult[i].track.id;
            var title = json.searchResults.searchResult[i].track.title;
            search = search.concat({title: title, id: trackId})
          }
          console.log(search)
          this.setState({
            search: search
          }, console.log(this.state.search))
        } else {
          for (let i = 0; i < 5; i++) {
            console.log(i)
            var trackId = json.searchResults.searchResult[i].track.id;
            var title = json.searchResults.searchResult[i].track.title;
            var artist = json.searchResults.searchResult[i].track.artist;
            search = search.concat({artist: artist.name, title: title, id: trackId})
          }
          console.log(search)
          this.setState({
            search: search
          })
        }
      } else {
        this.setState({
          search: search
        })
      }
    })
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

  prepareOauthUrl(trackId) {
    var randomString = function(length) {
        var text = "";
        var possible = "0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    var parameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: randomString(9),
        oauth_timestamp: Math.floor((new Date()).getTime() / 1000),
        oauth_signature_method: "HMAC-SHA1",
        oauth_version: '1.0',
        shopId: '2020',
        trackId: trackId.toString()
    }
    //console.log(parameters.oauth_nonce)
    //console.log(parameters.oauth_timestamp)
    var preppedURL = streamURL + "?oauth_consumer_key=" + consumerKey + "&oauth_nonce=" + parameters.oauth_nonce + "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + parameters.oauth_timestamp + "&oauth_version=1.0&shopId=2020&trackId=" + trackId;
    var signature = oauthSignature.generate("GET", streamURL, parameters, consumerSecret)
    return preppedURL + '&oauth_signature=' + signature.toString();
  }
  // need to add fetch request and set the state equal to the result
  getTrack (track) {
    //console.log(signature.queryString)
    //
    // var trackUrl = "http://api.7digital.com/1.2/artist/toptracks?shopId=2020&oauth_consumer_key=7d4vr6cgb392&artistId=" +  track.id + "&usageTypes=adsupportedstreaming"
    // fetch(trackUrl, {
    //   method: 'GET',
    //   mode: 'cors',
    //   headers: {
    //     accept: 'application/json'
    //   }
    // })
    // .then(res => res.json())
    // .then(json => {
    //   var trackId = json.tracks.track[5].id;
    //   var title = json.tracks.track[5].title;
    //   var url = this.prepareOauthUrl(id)
    //   this.setState({
    //     track: {stream_url: url, title: title, artwork_url: '', id: id}
    //   })
    // })
    var url = this.prepareOauthUrl(track.id)

    this.setState({
      track: {stream_url: url, artist: track.artist, title: track.title, artwork_url: '', id: track.id}
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

  enqueue(trackId) {
    var tracks = this.state.tracks.concat(trackId)
    this.setState({
      tracks: tracks
    })
  }
  // componentDidMount lifecycle method. Called once a component is loaded
  // componentDidMount() {
  //   this.getTrack();
  // }

  // Render method
  render () {
    return (
      <div className="turntable">
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.search}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}
        />
        <Info
          artist={this.state.track.artist}
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
