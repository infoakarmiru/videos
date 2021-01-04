// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var videoID;
var startSec;
var stopTimer;
var playVideo=false;
var playerReady=false;
var timerDone = false;
var timerObject;



function setVideoID(video) {
    videoID = video;
}
function setVideoTime(start, len) {
    startSec = start;
    stopTimer = len*1000;
}
function nextVideo(start, len) {
    startSec = start;
    stopTimer = len*1000;
    restartVideo(true);
}

function onYouTubeIframeAPIReady() {
    timerDone = false;
    playerReady=true;
    newPlayer();
}

function newPlayer() {
    timerDone = false;
    player = new YT.Player('youtubePlayer', {
        videoId: videoID,
        playerVars: {
            'start': startSec,
            'controls': 0,
            'playsinline': 1,
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    if (playVideo) {event.target.playVideo();}
    playerReady=true;
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var timerDone = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !timerDone) {
        if (typeof timerObject !== "undefined") {
            clearTimeout(timerObject);
        }
        timerObject=setTimeout(function(){ restartVideo(false); }, stopTimer);
        timerDone = true;
    }
    if (event.data == YT.PlayerState.PAUSED) {
        event.target.playVideo();
    }
}
function restartVideo(play) {
    if (playerReady) {
        player.stopVideo();
        player.destroy();
        playerReady=false;
        newPlayer();
        playVideo=play;
    }
}
