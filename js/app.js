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
            UTILS.warningP.innerText = 'There is no audio to play.';
            UTILS.popup();
          }
          break;

        case "pause":
          APP.audio.pause();
          break;

        case "skip_previous":
          APP.previous();
          break;

        case "skip_next":
          APP.next();
          break;

        default:
          break;
      }
    })
    
    //add event listeners for audio
    APP.audio.addEventListener('loadedmetadata', APP.loadedmetadata);
    APP.audio.addEventListener('timeupdate', APP.displayTime);
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
    function one() {
      MEDIA.forEach((track) => {
        //create a temporary audio element to open the audio file
        let tempAudio = new Audio(`./media/${track.track}`);
        //listen for the event
        tempAudio.addEventListener('durationchange', (ev) => {
          //`tempAudio` and `track` are both accessible from inside this function
          //update the array item with the duration value
          let duration = ev.target.duration;
          // track['duration'] = duration;
          // let timeString = APP.convertToMinutes(duration);
          
          track['duration'] = duration;
          //update the display by finding the playlist item with the matching img src
          //or track title or track id...
          let thumbnails = document.querySelectorAll('.track__item img');
          thumbnails.forEach((thumb, index) => {
            if (thumb.src.includes(track.thumbnail)) {
              //convert the duration in seconds to a 00:00 string
              let timeString = APP.convertToMinutes(duration);
              //update the playlist display for the matching item
              thumb.closest('.track__item').querySelector('datetime').innerHTML = timeString;
            }
          });

        });
      });
    }
    one();
  },

  loadCurrentTrack: () => {
    //remove current active 
    const allElements = document.querySelectorAll('li');
    allElements.forEach((element) => {
      element.classList.remove('active');
    });

    
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

  next: () => {
    APP.audio.pause(); //stop the current track playing
    APP.currentTrack++; //increment the value
    if (APP.currentTrack >= MEDIA.length) {
      APP.currentTrack = 0;
    };
    APP.loadCurrentTrack();
    APP.audio.play();
  },

  previous: () => {
    APP.audio.pause(); //stop the current track playing
    APP.currentTrack--; //increment the value
    if (APP.currentTrack < 0) {
      APP.currentTrack = MEDIA.length - 1;
    };
    APP.loadCurrentTrack();
    //call the function to load the MEDIA[APP.currentTrack] src into APP.audio.src
    //then call your function to play the prev track
  },

  pause: () => {
    //pause the track loaded into APP.audio playing
    document.getElementById('btnPlay').innerHTML = `<i class="material-icons-round">play_arrow</i>`
  },
  
  convertToMinutes: (time) => {
    let MM = Math.floor(time/60);
    let SS = Math.floor(time%60);
    if (MM < 10) {
      MM = `0${MM}`
    }
    if (SS < 10) {
      SS = `0${SS}`
    }
    time = `${MM}:${SS}`;
    return time;
  },

  displayTime: () => {
    let time = APP.audio.currentTime;
    let timestamp = APP.convertToMinutes(time);
    document.getElementsByClassName('current-time')[0].textContent = timestamp;
  },

  errorHandler: (err) => {
    // console.warn(`Error code: ${err.target.error.code} | Error message: ${err.target.error.message}`)
    UTILS.popup();

    switch (err.target.error.code) {
      case 1:
        UTILS.warningP.innerText = `User has cancelled fetching this track's audio.`;
        break;
        
      case 2:
        UTILS.warningP.innerText = `An error has occurred while downloading - check network connection.`;
        break;
        
      case 3:
        UTILS.warningP.innerText = `An error has occurred while decoding this track's file.`;
        break;
          
      case 4:
        UTILS.warningP.innerText = `This track's file is not supported or cannot be found.`
        break;
    }
  }
};

document.addEventListener('DOMContentLoaded', APP.init);