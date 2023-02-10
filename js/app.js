import MEDIA from './media.js'; //the data file import
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
    const playBtn = document.getElementById('btnPlay');
    
    playBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const txt = playBtn.textContent;
        
        if (txt === 'play_arrow') {
            APP.play();
            console.log('pressed');
            playBtn.innerHTML = `<i class="material-icons-round">pause</i>`
        } else {
            console.log('pressed');
            APP.pause();
            playBtn.innerHTML = `<i class="material-icons-round">play_arrow</i>`
        }
    });
    //add event listeners for APP.audio

    // APP.audio.addEventListener('ended', APP.ended);
    // APP.audio.addEventListener('loadstart', APP.loadstart);
    APP.audio.addEventListener('loadedmetadata', APP.loadedmetadata);
    // APP.audio.addEventListener('canplay', APP.canplay);
    // APP.audio.addEventListener('durationchange', APP.durationchange);
    APP.audio.addEventListener('timeupdate', APP.convertTimeDisplay);
    // APP.audio.addEventListener('play', APP.play);
    // APP.audio.addEventListener('pause', APP.pause);
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
    if (APP.audio.src){
        APP.audio.play();
    } else {
        console.warn('Nothing loaded yet');
    }
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
    if (APP.audio){
        APP.audio.pause();
    }
  },
  convertTimeDisplay: () => {
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
    console.warn(err);
  }
};

document.addEventListener('DOMContentLoaded', APP.init);