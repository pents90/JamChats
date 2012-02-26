var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var currentArtist = null;
var nowReady = false;
var userList = [];

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

function doArtistImage(artist) {
    var url = "http://developer.echonest.com/api/v4/artist/images?api_key=WXPZI2UHOB3XPBUE6&name=" + artist + "&format=json&results=1&start=0&license=unknown";
    $.get(url, function(data) {
        var src = data.response.images[0].url;
        //$('#image').html('<img src"' + src + '">');
    })
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
        console.log("Image " + track.album.cover);
        //$('#image').html('<img src="' + track.album.cover + '">');
        $('#background').attr("style", "background-image: url('" + track.album.cover + "');");

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

    function updateUserList() {
        $('#userlist').html('');
        for (var i = 0; i < userList.length; i++) {
            $('#userlist').append('<li>' + userList[i] + '</li>');
        }
    }

    now.forumInfo = function(users) {   
        console.log("Received forum info.");
        userList = users;
        updateUserList();
    };

    now.userJoined = function(name) {
        console.log("Received user joined.");
        $('#userlist').append("<li>" + name + "</li>");
        userList.push(name);
    };

    now.userLeft = function(name) {
        console.log("Received user left.");
        var index = userList.indexOf(name);
        if (index >= 0) {
            userList.splice(index, 1);
        }
        updateUserList();
    }

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

