// Client-side script

$(document).ready(() => {
  let NUM_REQUESTS = 50;
  const THRESH = 7;
  const CACHE = [];
  const HISTORY = [null, null, null, null, null];
  let CURRENT = null;
  let AUDIO;
  let PLAYING = false;

  const updateDom = () => {
    if (CURRENT) {
      $(".track").text(CURRENT.title).attr("title", CURRENT.title).attr("href", CURRENT.track_url);
      $(".artist").text(CURRENT.artist).attr("title", CURRENT.artist).attr("href", CURRENT.artist_url);
      $("#player").attr("src", CURRENT.stream);
    }
  };

  const playTrackhandler = () => {
    if (!CURRENT) {
      return;
    }
    AUDIO.play();
    $('#play').text('pause');
    PLAYING = true;
  };

  const pauseTrackHandler = () => {
    AUDIO.pause();
    $('#play').text('play');
    PLAYING = false;
  };

  const nextTrackHandler = () => {
    const loading_icon = $("#loading_icon");

    // Make request for more tracks
    if (CACHE.length <= THRESH) { // TODO define threshold
      loading_icon.fadeToggle(500);
      $("#next").prop('disabled', true);
      $.ajax({
        type: "GET",
        url: "/next",
        data: {numRequests: NUM_REQUESTS} // TODO implement sliding window
      }).done(function (data) {
        let tracks = data.tracks;
        while (tracks.length > 0) {
          CACHE.push(tracks.shift());
        }

        // TODO refactor for duplicate code
        // store in history + update current
        HISTORY.push(CURRENT);
        HISTORY.shift();
        CURRENT = CACHE.shift(); // TODO will return undef if no tracks found
        updateDom();
        loading_icon.fadeToggle();
        //$("#loading_icon").toggle();
        $("#next").prop('disabled', false);
      }).fail(function () {
        alert("An error occurred. Please check your internet connection and" +
            " refresh the page.");
      });
    } else {
      // store in history
      HISTORY.push(CURRENT);
      HISTORY.shift();
      CURRENT = CACHE.shift(); // TODO will return undef if no tracks found
      updateDom();
      //$("#next").prop('disabled', false);
    }
  }

  const backTrackHandler = () => {
    // TODO check if works properly
    const prev = HISTORY.pop();
    if (prev) {
      CURRENT = prev;
      HISTORY.unshift(null); // retain HISTORY size
      updateDom(CURRENT.title, CURRENT.track_url, CURRENT.artist);
    } else {
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

  // TODO move to file
  // Choose environment
  const bg = $("body");
  $("#plain").on("click tap", () => {
    bg.css("background-image", "none");
    bg.css("background-color", "white");
  });
  $("#cozy").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/cozy.jpg)");
    bg.css("background-position", "initial");
  });
  $("#cubicle").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/cubicle.jpg)");
    bg.css("background-position", "center center");
  });
  $("#wealth").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/wealth.jpg)");
    bg.css("background-position", "initial");
  });
  $("#clouds").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/clouds.jpg)");
    bg.css("background-position", "center center");
  });
  $("#water_cycle").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/water_cycle.jpg)");
    bg.css("background-position", "initial");
  });
  $("#tropical").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/tropical.jpg)");
    bg.css("background-position", "center center");
  });
  $("#brown").on("click tap", () => {
    bg.css("background-image", "none");
    bg.css("background-color", "#7B3933");
  });
  $("#corduroy1").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/corduroy1.jpg)");
    bg.css("background-position", "initial");
  });
  $("#corduroy2").on("click tap", () => {
    bg.css("background-image", "url(../assets/images/corduroy2.jpg)");
    bg.css("background-position", "center center");
  });

  // show bg selector if not on mobile (default hidden)
  const onMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  if (!onMobile) {
    $(".bg-select").show();
  }

});
