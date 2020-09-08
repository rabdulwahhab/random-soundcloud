// Client-side script

let NUM_REQUESTS = 50;
const CACHE = [];
const HISTORY = [null, null, null, null, null];
let CURRENT = null;

function logger(msg) {
    console.log(msg);
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
                updateDom(CURRENT.title, CURRENT.url, CURRENT.artist);

                $("#loading_icon").toggle();
                $("#next").prop('disabled', false);
            }).fail(function () {
                alert("An error occurred. Please check your internet connection and try again.");
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
            updateDom(CURRENT.title, CURRENT.url, CURRENT.artist)
            //$("#next").prop('disabled', false);
        }
    });

    // Handle back button
    $("#back").click(() => {
        logger("clicked back button");
        // TODO check if works properly
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