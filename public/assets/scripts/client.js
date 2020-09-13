// Client-side script

let NUM_REQUESTS = 50;
const THRESH = 7;
const CACHE = [];
const HISTORY = [null, null, null, null, null];
let CURRENT = null;
let AUDIO;
let PLAYING = false;
window.onplay = () => logger("PLAYING");
function logger(msg) {
  console.log(msg);
}

$(document).ready(() => {
  //alert("Hi, jQuery is enabled");

  const updateDom = () => {
    if (CURRENT) {
      $(".track").text(CURRENT.title).attr("title", CURRENT.title).attr("href", CURRENT.track_url);
      $(".artist").text(CURRENT.artist).attr("title", CURRENT.artist).attr("href", CURRENT.artist_url);
      $("#player").attr("src", CURRENT.stream);
    }
  };

  const playTrackhandler = () => {
    logger("clicked play button");
    if (!CURRENT) {
      return;
    }
    AUDIO.play();
    $('#play').text('pause');
    PLAYING = true;
  };

  const pauseTrackHandler = () => {
    logger("clicked pause button");
    AUDIO.pause();
    $('#play').text('play');
    PLAYING = false;
  };

  const nextTrackHandler = () => {
    logger("clicked next button");
    logger($('#next').attr('id'));
    // if (PLAYING) {
    //   CURRENT.howl.stop();
    // }
    const loading_icon = $("#loading_icon");

    // Make request for more tracks
    if (CACHE.length <= THRESH) { // TODO define threshold
      logger("CLIENT --- MAKING REQUESTS");
      loading_icon.fadeToggle(500);
      $("#next").prop('disabled', true);
      $.ajax({
        type: "GET",
        url: "/next",
        data: {numRequests: NUM_REQUESTS} // TODO implement sliding window
      }).done(function (data) {
        logger("CLIENT --- RESPONSE RECEIVED");
        let tracks = data.tracks;
        logger("RECEIVED " + tracks.length + " TRACKS");
        while (tracks.length > 0) {
          CACHE.push(tracks.shift());
        }

        // TODO refactor for duplicate code
        // store in history + update current
        HISTORY.push(CURRENT);
        HISTORY.shift();
        CURRENT = CACHE.shift(); // TODO will return undef if no tracks found
        logger("NEXT TRACK:");
        logger(CURRENT);
        logger(CACHE.length + " TRACKS IN CACHE");
        logger("CACHE CONTAINS:");
        logger(CACHE);
        updateDom();
        loading_icon.fadeToggle();
        //$("#loading_icon").toggle();
        $("#next").prop('disabled', false);
      }).fail(function () {
        alert("An error occurred. Please check your internet connection and" +
            " refresh the page.");
      });
    } else {
      logger("CLIENT --- GET NEXT TRACK FROM CACHE");
      // store in history
      HISTORY.push(CURRENT);
      HISTORY.shift();
      CURRENT = CACHE.shift(); // TODO will return undef if no tracks found
      logger("NEXT TRACK:");
      logger(CURRENT);
      logger(CACHE.length + " TRACKS IN CACHE");
      logger("CACHE CONTAINS:");
      logger(CACHE);
      updateDom();
      //$("#next").prop('disabled', false);
    }
  }

  const backTrackHandler = () => {
    logger("clicked back button");
    // TODO check if works properly
    const prev = HISTORY.pop();
    logger(prev);
    if (prev) {
      CURRENT = prev;
      HISTORY.unshift(null); // retain HISTORY size
      updateDom(CURRENT.title, CURRENT.track_url, CURRENT.artist);
    } else {
      logger("NO MORE TRACKS");
      HISTORY.unshift(null);
    }
  };

  // init
  AUDIO = new Audio();
  //TODO remove
  if (!AUDIO.canPlayType('audio/mpeg;')) {
    alert("It appears your browser is too outdated to handle HTML audio" +
        " :-(\n\nPlease consider upgrading to use this app.");
    return;
  }
  AUDIO.autoplay = true;
  AUDIO.addEventListener('ended', nextTrackHandler);

  // Handle play button
  $("#play").click(() => {
    !PLAYING ? playTrackhandler() : pauseTrackHandler();
  });

  // Handle forward button
  $("#next").click(nextTrackHandler);

  // Handle back button
  $("#back").click(backTrackHandler);

  // Start
  nextTrackHandler();


});
