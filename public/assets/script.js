// Client-side script

let i = -1;
let NUM_REQUESTS = 50;
const CAROUSEL_SIZE = 30;
let NUM_CACHED = 0;
const carousel = [];
for (let j = 0; j < CAROUSEL_SIZE; ++j) {
    carousel.push(null);
}

//let carousel = [null, null, null, null, null, null, null, null, null, null];

function logger(msg) {
    console.log(msg);
}

// Updates carousel to keep consistent state (current track index)
// NOTE: CALL ONLY WHEN VALID NEXT TRACK IS OBTAINED
function next() {
    i = (i + 1) % CAROUSEL_SIZE;
    logger("CURRENT i: " + i);
    //carousel[i] = trackObj;
    //logger(carousel);
}

// Updates state (current track index) to previous
function back() {
    // TODO modulo bug for negative numbers
    carousel[i] = null;
    i = (((i - 1) % CAROUSEL_SIZE) + CAROUSEL_SIZE) % CAROUSEL_SIZE;
    //i = (i - 1) % CAROUSEL_SIZE;
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
        if (NUM_CACHED < Math.round(CAROUSEL_SIZE / 3)) {
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
                $("#loading_icon").toggle();
                let tracks = data.tracks;
                logger("RECEIVED " + tracks.length + " TRACKS");
                // TODO will return undef if no tracks found
                next(); // update state
                carousel[i] = tracks.shift(); // load a track
                logger("AFTER POP, " + tracks.length + " RAW TRACKS:");
                tracks.map(e => logger(e));

                // load cache with rest of tracks received
                let j = (i + 1) % CAROUSEL_SIZE;
                while (j !== i && tracks.length > 0) {
                    //logger(j);
                    carousel[j] = tracks.shift();
                    //logger("IN LOOP:");
                    NUM_CACHED = NUM_CACHED + 1;
                    //logger(tracks.shift());
                    j = (j + 1) % CAROUSEL_SIZE;
                }
                // TODO update DOM
                const curr = carousel[i];
                logger("NEXT TRACK:");
                logger(curr);
                logger(NUM_CACHED + " TRACKS IN CACHE");
                logger("CAROUSEL NOW:");
                logger(carousel);
                updateDom(curr.title, curr.url, curr.artist);
                $("#next").prop('disabled', false);
            }).fail(function () {
                alert("An error occurred. Please check your internet connection and try again.");
            });
        } else {
            logger("CLIENT --- GET NEXT FROM CACHE");
            // TODO get next from cache
            next(); // advance state
            while (!carousel[i]) {
                next();
            }
            const curr = carousel[i];
            logger("NEXT TRACK:");
            logger(curr);
            NUM_CACHED = NUM_CACHED - 1;
            logger(NUM_CACHED + " TRACKS LEFT IN CACHE");
            logger("CAROUSEL NOW:");
            logger(carousel);
            updateDom(curr.title, curr.url, curr.artist);
            //$("#next").prop('disabled', false);
        }
    });

    // Handle back button
    $("#back").click(() => {
        logger("clicked back button");
        back();
        // TODO check if works properly
        const prev = carousel[i]; // get prev track obj
        if (prev) {
            updateDom(prev.title, prev.permalink_url, prev.artist);
        } else {
            logger("NO MORE TRACKS");
        }
    });
});