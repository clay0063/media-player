import MEDIA from './media.js'; //the data file import
import {UTILS} from './utils.js';
const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  tracks: MEDIA.map(songs => songs.track),
  init: () => {
    //called when DOMContentLoaded is triggered
    APP.buildPlaylist();
    APP.addListeners();
    APP.loadCurrentTrack();
    
  },
  addListeners: () => {
    //add event listeners for interface elements
    const controls = document.getElementsByClassName('controls')[0];
    controls.addEventListener('click', (ev)=>{
      switch (ev.target.innerText) {
        case "play_arrow":
          if (APP.audio.src){
            APP.audio.play();
          } else {
            UTILS.warningP.innerText = 'There is no audio to play';
            UTILS.popup();
          }
          break;

        case "pause":
          APP.audio.pause();
          break;

        case "skip_previous":
          break;

        case "skip_next":
          break;

        default:
          break;
      }
    })
    UTILS.popup();
    
    //add event listeners for audio
    APP.audio.addEventListener('loadedmetadata', APP.loadedmetadata);
    APP.audio.addEventListener('timeupdate', APP.convertTimeDisplay);
    APP.audio.addEventListener('play', APP.play);
    APP.audio.addEventListener('pause', APP.pause);
    APP.audio.addEventListener('error', APP.errorHandler);

  },

  buildPlaylist: () => {
    //read the contents of MEDIA and create the playlist
    const playlist = document.getElementsByClassName('playlist')[0];
    MEDIA.forEach(song => {
        const li = document.createElement('li');
        li.classList.add('track__item');
        li.innerHTML =
        `
        <div class="track__thumb">
            <img src="./img/${song.thumbnail}" alt="artist album art thumbnail" />
        </div>
        <div class="track__details">
            <p class="track__title">${song.title}</p>
            <p class="track__artist">${song.artist}</p>
        </div>
            <div class="track__time">
            <time datetime="">00:00</time>
        </div>
        `
        playlist.appendChild(li);
        //APP.audio.duration
    })
  },
  loadCurrentTrack: () => {
    //use the currentTrack value to set the src of the APP.audio element
    APP.audio.src = `./media/${APP.tracks[APP.currentTrack]}`;
    console.log(`Loaded ${APP.audio.src}`);
    const albumArt = document.getElementsByClassName('album_art__full')[0];
    const img = albumArt.querySelector('img');
    img.src = `./img/${MEDIA[APP.currentTrack].large}`
    
    const li = Array.from(document.getElementsByClassName('playlist')[0].children);
    let selected = li[APP.currentTrack];
    selected.classList.add('active');

  },

  loadedmetadata: ()=>{
    document.getElementsByClassName('current-time')[0].textContent = "00:00"
    //Set total time once its loaded
    let time = APP.audio.duration;
    let MM = Math.floor(time/60);
    let SS = Math.floor(time%60);
    if (MM < 10) {
      MM = `0${MM}`
    }
    if (SS < 10) {
      SS = `0${SS}`
    }
    document.getElementsByClassName('total-time')[0].textContent = `${MM}:${SS}`;
  },

  play: () => {
    //start the track loaded into APP.audio playing
    document.getElementById('btnPlay').innerHTML = `<i class="material-icons-round">pause</i>`
    
  },
  
  pause: () => {
    //pause the track loaded into APP.audio playing
    document.getElementById('btnPlay').innerHTML = `<i class="material-icons-round">play_arrow</i>`
  },
  
  convertTimeDisplay: () => {
    //update time while playing
    let time = APP.audio.currentTime;
    let MM = Math.floor(time/60);
    let SS = Math.floor(time%60);
    if (MM < 10) {
      MM = `0${MM}`
    }
    if (SS < 10) {
      SS = `0${SS}`
    }
    document.getElementsByClassName('current-time')[0].textContent = `${MM}:${SS}`;
  },

  errorHandler: (err) => {
    console.warn(`Error code: ${err.target.error.code} | Error message: ${err.target.error.message}`)
    
    switch (err.target.error.code) {
      case 1:
        // window.alert(`User has cancelled fetching this track's audio.`);
        UTILS.warningP.innerText = `User has cancelled fetching this track's audio.`;
        break;
        
      case 2:
        // window.alert(`An error has occurred while downloading - check network connection.`);
        UTILS.warningP.innerText = `An error has occurred while downloading - check network connection.`;
        break;
        
      case 3:
        // window.alert(`An error has occurred while decoding this track's file.`);
        UTILS.warningP.innerText = `An error has occurred while decoding this track's file.`;
        break;
          
      case 4:
        // window.alert(`This track's file is not supported or cannot be found.`);
        UTILS.warningP.innerText = `This track's file is not supported or cannot be found.`
        break;
    }
    
    UTILS.warning.classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', APP.init);