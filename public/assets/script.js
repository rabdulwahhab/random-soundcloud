// Client-side script

let i = -1;
let NUM_REQUESTS = 20;
const CAROUSEL_SIZE = 10;
const carousel = [];
for (let j = 0; j < CAROUSEL_SIZE; ++j) {
    carousel.push(null);
}

//let carousel = [null, null, null, null, null, null, null, null, null, null];

function logger(msg) {
    console.log(msg);
}

// Updates carousel to keep consistent state (cache + current track index)
// CALL ONLY WHEN VALID NEXT TRACK IS OBTAINED
function next(trackObj) {
    i = (i + 1) % CAROUSEL_SIZE;
    logger(i);
    carousel[i] = trackObj;
    //logger(carousel);
}

// Updates state (current track index) to previous
function back() {
    // TODO modulo bug for negative numbers
    carousel[i] = null;
    i = (((i - 1) % CAROUSEL_SIZE) + CAROUSEL_SIZE) % CAROUSEL_SIZE;
    //i = (i - 1) % CAROUSEL_SIZE;
    logger(i);
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
        $("#loading_icon").fadeIn(2000);
        // TODO return next trackObj with necessary info + stream param for howler
        $.ajax({
            type: "GET",
            url: "/next",
            data: {numRequests: NUM_REQUESTS} // TODO implement sliding window
        }).done(function (data) {
            $("#loading_icon").hide();
            logger("CLIENT ---");
            let tracks = data.tracks;
            logger("RAW TRACKS RECEIVED: ");
            logger(tracks);
            next(tracks.shift()); // load a track + update state
            logger("AFTER POP, RAW TRACKS:");
            tracks.map(e => logger(e));

            // load cache with rest of tracks received
            let j = (i + 1) % CAROUSEL_SIZE;
            while (j !== i && tracks.length > 0) {
                logger(j);
                carousel[j] = tracks.shift();
                logger("IN LOOP:");
                //logger(tracks.shift());
                j = (j + 1) % CAROUSEL_SIZE;
            }
            logger("CAROUSEL NOW:");
            logger(carousel);
            // TODO update DOM
            const curr = carousel[i];
            logger("NEXT TRACK:");
            logger(curr);
            updateDom(curr.title, curr.url, curr.artist);
            //location.reload(); // refresh page, outputs to template file
        }).fail(function () {
            alert("An error occurred. Please check your internet connection and try again.");
        });
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