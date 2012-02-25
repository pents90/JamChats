var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;

exports.init = init;

function init() {

    updatePageWithTrackDetails();

    player.observe(models.EVENT.CHANGE, function (e) {

        // Only update the page if the track changed
        if (e.data.curtrack == true) {
            updatePageWithTrackDetails();
        }
    });
}

function updatePageWithTrackDetails() {

    var header = document.getElementById("roomname");

    // This will be null if nothing is playing.
    var playerTrackInfo = player.track;

    if (playerTrackInfo == null) {
        header.innerText = "Nothing playing!";
    } else {
        var track = playerTrackInfo.data;
        //header.innerHTML = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
        header.innerHTML = track.album.artist.name.toUpperCase();
    }
}

//// NOW stuff

    now.forumInfo = function(users) {   
        console.log("Received forum info.");
        for (var i = 0; i < users.length; i++) {
            $('#userlist').append('<li>' + users[i] + '</li>');
        }
    };

    now.userJoined = function(name) {
        console.log("Received user joined.");
        $('#userlist').append("<li>" + name + "</li>");
    };

    now.receiveMessage = function(name, text) {
        $('#chat').append('<p><b>' + name + '</b> - ' + text + '</p>');
    };

    now.ready(function(){
        console.log("Logging in...");
        now.name = "Test #" + Math.random();
        now.join("M83");

        $('#text').keypress(function(e) {
            if(e.which == 13) {
                jQuery('#send').click();
                //jQuery(this).blur();
            }
        });
    });

