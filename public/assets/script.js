// Client-side script

let i = -1;
let NUM_REQUESTS = 50;
//const CACHE_SIZE = 30;
//let NUM_CACHED = 0;
const CACHE = [];
const HISTORY = [null, null, null, null, null];
let CURRENT = null;
//for (let j = 0; j < CACHE_SIZE; ++j) {
//    cache.push(null);
//}

//let cache = [null, null, null, null, null, null, null, null, null, null];

function logger(msg) {
    console.log(msg);
}

// Updates carousel to keep consistent state (current track index)
// NOTE: CALL ONLY WHEN VALID NEXT TRACK IS OBTAINED
function next() {
    i = (i + 1) % CACHE_SIZE;
    logger("CURRENT i: " + i);
    //carousel[i] = trackObj;
    //logger(carousel);
}

// Updates state (current track index) to previous
function back() {
    // TODO modulo bug for negative numbers
    carousel[i] = null;
    i = (((i - 1) % CACHE_SIZE) + CACHE_SIZE) % CACHE_SIZE;
    //i = (i - 1) % CACHE_SIZE;
    logger("CURRENT: " + i);
    logger(carousel);
    // const prev = carousel[i];
    // if (prev) {
    //     return prev;
    // } else {
    //     logger("NO MORE TRACKS");
    //     return null;
    // }
}

$(document).ready(() => {
    alert("Hi, jQuery is enabled");

    // Handle play button
    $("#play").click(() => {
        logger("clicked play button");
        // TODO play button event handling
    });

    const updateDom = (title, permalink_url, artist) => {
        $("#title").text(title);
        $("#artist").text(artist);
        $("#track_url").attr("href", permalink_url);
    };

    // Handle forward button
    // TODO handle cases where cache is already loaded
    $("#next").click(() => {
        logger("clicked next button");
        // Page handling

        // Make request for more tracks
        if (CACHE.length <= 7) { // TODO define threshold
            logger("CLIENT --- MAKING REQUESTS");
            $("#next").prop('disabled', true);
            $("#loading_icon").fadeIn(2000);
            // TODO stream param for howler???
            $.ajax({
                type: "GET",
                url: "/next",
                data: {numRequests: NUM_REQUESTS} // TODO implement sliding window
            }).done(function (data) {
                logger("CLIENT --- RESPONSE RECEIVED");
                let tracks = data.tracks;
                logger("RECEIVED " + tracks.length + " TRACKS");
                while (tracks.length > 0) {
                    //logger(j);
                    CACHE.push(tracks.shift());
                    //logger("IN LOOP:");
                    //NUM_CACHED = NUM_CACHED + 1;
                    //logger(tracks.shift());
                    //j = (j + 1) % CACHE_SIZE;
                }

                // TODO update DOM
                // store in history
                HISTORY.push(CURRENT);
                HISTORY.shift();
                CURRENT = CACHE.shift(); // TODO will return undef if no tracks found
                logger("NEXT TRACK:");
                logger(CURRENT);
                logger(CACHE.length + " TRACKS IN CACHE");
                logger("CACHE CONTAINS:");
                logger(CACHE);
                updateDom(CURRENT.title, CURRENT.url, CURRENT.artist);

                $("#loading_icon").toggle();
                $("#next").prop('disabled', false);
                //
                //next(); // update state
                //carousel[i] = tracks.shift(); // load a track
                //logger("AFTER POP, " + tracks.length + " RAW TRACKS:");
                //tracks.map(e => logger(e));

                // load cache with rest of tracks received
                // let j = (i + 1) % CACHE_SIZE;
                // while (j !== i && tracks.length > 0) {
                //     //logger(j);
                //     carousel[j] = tracks.shift();
                //     //logger("IN LOOP:");
                //     NUM_CACHED = NUM_CACHED + 1;
                //     //logger(tracks.shift());
                //     j = (j + 1) % CACHE_SIZE;
                // }
            }).fail(function () {
                alert("An error occurred. Please check your internet connection and try again.");
            });
        } else {
            logger("CLIENT --- GET NEXT TRACK FROM CACHE");
            // TODO update DOM
            // store in history
            HISTORY.push(CURRENT);
            HISTORY.shift();
            CURRENT = CACHE.shift(); // TODO will return undef if no tracks found
            logger("NEXT TRACK:");
            logger(CURRENT);
            logger(CACHE.length + " TRACKS IN CACHE");
            logger("CACHE CONTAINS:");
            logger(CACHE);
            updateDom(CURRENT.title, CURRENT.url, CURRENT.artist)
            //$("#next").prop('disabled', false);
        }
    });

    // Handle back button
    $("#back").click(() => {
        logger("clicked back button");
        //back();
        // TODO check if works properly
        //const prev = carousel[i]; // get prev track obj
        const prev = HISTORY.pop();
        if (prev) {
            CURRENT = prev;
            HISTORY.unshift(null);
            updateDom(CURRENT.title, CURRENT.permalink_url, CURRENT.artist);
        } else {
            logger("NO MORE TRACKS");
            HISTORY.unshift(null);
        }
    });
});