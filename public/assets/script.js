// Client-side script

let i = -1;
let carousel = [null, null, null, null, null, null, null, null, null, null];

function logger(msg) {
    console.log(msg);
}

// Updates carousel to keep consistent state (cache + current track index)
// CALL ONLY WHEN VALID NEXT TRACK IS OBTAINED
function next(trackObj) {
    logger(i);
    i = (i + 1) % 10;
    carousel[i] = trackObj;
    logger(carousel);
}

// Returns previous track JSON obj from cache and updates state (current track index)
function back() {
    i = i - 1;
    if (i <= 0) i = 0;
    logger(i);
    logger(carousel);
    return carousel[i % 10];
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
    $("#next").click(() => {
        logger("clicked next button");
        // TODO return next trackObj with necessary info + stream param for howler
        $.ajax({
            type: "GET",
            url: "/next",
            data: {dummy: "dummy"}
        }).done(function (data) {
            // TODO call next() with new trackObj from server
            logger(data);
            updateDom(data.title, data.url, data.artist);
            // TODO update DOM
            //location.reload(); //outputs to template file
        }).fail(function () {
            alert("An error occurred.");
        });
    });

    // Handle back button
    $("#back").click(() => {
        logger("clicked back button");
        // TODO check if works properly
        // const obj = back(); // Return prev track obj (effect: update current index state)
        // if (obj) {
        //     const title = obj.title;
        //     const artist = obj.user.username;
        //     const permalink_url = obj.permalink_url;
        //     updateDom(title, permalink_url, artist);
        // }
    });
})
;