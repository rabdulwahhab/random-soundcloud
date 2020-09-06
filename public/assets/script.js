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

    // const updateDom = (title, permalink_url, artist) => {
    //     $("#title").text(title);
    //     $("#artist").text(artist);
    //     $("#track").attr("href", permalink_url);
    // };

    // Handle forward button
    $("#next").click(() => {
        logger("clicked next button");
        //getNextTrack(updateDom);
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
});