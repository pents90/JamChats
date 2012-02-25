var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var currentArtist = null;
var nowReady = false;

exports.init = init;

function init() {

    console.log('Init from spotify.');
    updatePageWithTrackDetails();

    player.observe(models.EVENT.CHANGE, function (e) {

        // Only update the page if the track changed
        if (e.data.curtrack == true) {
            updatePageWithTrackDetails();
        }
    });
}

function updatePageWithTrackDetails() {

    console.log('New track.');
    var header = document.getElementById("roomname");

    // This will be null if nothing is playing.
    var playerTrackInfo = player.track;

    if (playerTrackInfo == null) {
        header.innerText = "Nothing playing!";        
    } else {
        var track = playerTrackInfo.data;
        //header.innerHTML = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
        var artist = track.album.artist.name.toUpperCase();
        // Clear old chat
        if (artist != currentArtist) {
            $('#chat').html('');
        }
        currentArtist = artist;
        header.innerHTML = currentArtist;
        if (nowReady) {
            console.log("About to join '" + currentArtist + "'.");
            now.join(currentArtist);
        }
    }
}

//// NOW stuff

    now.forumInfo = function(users) {   
        console.log("Received forum info.");
        $('#userlist').html('');
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
        $("#chat").animate({ scrollTop: $("#chat").attr("scrollHeight") }, 1000);
    };

    now.ready(function(){
        console.log('Init from nowjs.');
        console.log("Logging in...");
        now.name = "Test #" + Math.random();
        if (currentArtist != null) {
            now.join(currentArtist);
        }

        $('#text').keypress(function(e) {
            if(e.which == 13) {
                jQuery('#send').click();
                $('#text').val('');
            }
        });
        nowReady = true;
    });

