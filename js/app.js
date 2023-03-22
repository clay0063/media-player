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
    const controls = document.querySelector('.controls');
    controls.addEventListener('click', APP.controlSwitch);

    //add event listeners for the playlist
    const playlist = document.querySelector('.playlist');
    playlist.addEventListener('click', APP.clickPlaylist);

    //add event listeners on progress bar
    const progressBar = document.querySelector(".progress");
    progressBar.addEventListener('click', APP.tracking);

    //add even listener on shuffle
    document.getElementById('btnShuffle').addEventListener('click', APP.shuffle);
    
    //add event listeners for audio
    APP.audio.addEventListener('loadedmetadata', APP.loadedmetadata);
    APP.audio.addEventListener('timeupdate', APP.displayTime);
    APP.audio.addEventListener('play', APP.play);
    APP.audio.addEventListener('pause', APP.pause);
    APP.audio.addEventListener('ended', APP.next);
    APP.audio.addEventListener('error', APP.errorHandler);

  },

  tracking: (ev) => {
    const progressBar = document.querySelector(".progress");
    const played = document.querySelector(".played");
    
    const x = ev.x;
    const width = progressBar.clientWidth;
    const progress = (x / width);
    played.style.width = (progress * 100).toFixed(2) + "vw";

    let newTime = APP.audio.duration * progress;
    APP.audio.currentTime = newTime;
    
  },

  shuffle: (ev) => {
    console.log(ev);
    APP.audio.pause();
    APP.currentTrack = 0;
    APP.loadCurrentTrack();

    MEDIA.shuffle();
    APP.tracks = MEDIA.map(songs => songs.track);
    APP.buildPlaylist();
    APP.loadCurrentTrack();
    APP.audio.play();
  },

  controlSwitch: (ev) => {
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
  },

  clickPlaylist: (ev) => {
    const li = ev.target.closest('li');
    const data = li.getAttribute('data-src');
    
    const mp3 = MEDIA.find(song => song.track === data);
    
    APP.audio.pause();
    APP.currentTrack = MEDIA.indexOf(mp3);

    APP.loadCurrentTrack();
    APP.audio.play()
  },

  buildPlaylist: () => {
    //read the contents of MEDIA and create the playlist
    const playlist = document.querySelector('.playlist');
    playlist.innerHTML = "";
    const playlistData = MEDIA.map((song) => {
      const li = document.createElement('li');
        li.classList.add('track__item');
        li.setAttribute(`data-src`, song.track)
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
        return li;
    });
    //using join('') breaks the playlist and doesn't display the lis,
    //removing join and spreading it works instead 
    playlist.append(...playlistData);
    APP.getAllTimes();
  },

  getAllTimes: () => {
    MEDIA.forEach((track) => {
      let tempAudio = new Audio(`./media/${track.track}`);
      tempAudio.addEventListener('durationchange', (ev) => {
        let duration = ev.target.duration;
        track['duration'] = duration;
        //update the display by finding the playlist item with the matching img src
        let thumbnails = document.querySelectorAll('.track__item img');
        thumbnails.forEach((thumb, index) => {
          if (thumb.src.includes(track.thumbnail)) {
            //convert the duration in seconds to a 00:00 string
            let timeString = APP.convertToMinutes(duration);
            //update the playlist display for the matching item
            thumb.closest('.track__item').querySelector('time').textContent = timeString;
          }
        });
      });
    });
  },

  loadCurrentTrack: () => {
    //remove current active class
    const allElements = document.querySelectorAll('li');
    allElements.forEach((element) => {
      element.classList.remove('active');
    });

    APP.audio.src = `./media/${APP.tracks[APP.currentTrack]}`;
    const albumArt = document.querySelector('.album_art__full');
    const img = albumArt.querySelector('img');
    img.src = `./img/${MEDIA[APP.currentTrack].large}`
    
    const li = document.querySelectorAll('.playlist li')
    let selected = li[APP.currentTrack];
    selected.classList.add('active');

  },

  loadedmetadata: ()=>{
    document.querySelector('.current-time').textContent = "00:00"
    //Set total time once its loaded
    let time = APP.audio.duration;
    let timeStamp = APP.convertToMinutes(time)
    document.querySelector('.total-time').textContent = timeStamp;
  },

  play: () => {
    //start the track loaded into APP.audio playing
    document.getElementById('btnPlay').innerHTML = `<i class="material-icons-round">pause</i>`
    document.querySelector('body').classList.add('playing');
    
  },

  next: () => {
    APP.audio.pause();
    APP.currentTrack++; 
    if (APP.currentTrack >= MEDIA.length) {
      APP.currentTrack = 0;
    };
    APP.loadCurrentTrack();
    APP.audio.play()
  },

  previous: () => {
    APP.audio.pause();
    APP.currentTrack--; 
    if (APP.currentTrack < 0) {
      APP.currentTrack = MEDIA.length - 1;
    };
    APP.loadCurrentTrack();
    APP.audio.play()
  },

  pause: () => {
    //pause the track loaded into APP.audio playing
    document.getElementById('btnPlay').innerHTML = `<i class="material-icons-round">play_arrow</i>`
    document.querySelector('body').classList.remove('playing');

  },

  displayTime: () => {
    //update seek bar here
    let time = APP.audio.currentTime;
    let timestamp = APP.convertToMinutes(time);
    document.querySelector('.current-time').textContent = timestamp;

    let duration = APP.audio.duration;
    let percentage = ((time / duration) * 100).toFixed(2);
    const played = document.querySelector(".played");
    played.style.width = percentage + "vw";

  },
  
  convertToMinutes: (time) => {
    let MM = Math.floor(time/60);
    let SS = Math.floor(time%60);
    if (MM < 10) { MM = `0${MM}` };
    if (SS < 10) { SS = `0${SS}` };
    return time = `${MM}:${SS}`;
  },

  errorHandler: (err) => {
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