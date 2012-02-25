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
            if (!$('#'+users[i])) {
                $('#userlist').append("<li id='"+users[i]+"'>" + users[i] + '</li>');
            }
        }
    };

    now.userJoined = function(name) {
        console.log("Received user joined.");
        if (!$('#'+name)) {
            $('#userlist').append("<li id='"+name+"'>" + name + "</li>");
        }
    };

    now.receiveMessage = function(name, text) {
        $('#chat').append('<p><b>' + name + '</b> - ' + text + '</p>');
        $("#chat").animate({ scrollTop: $("#chat").attr("scrollHeight") }, 1000);
    };

    now.nameUpdate = function(name, username) {
        console.log("Received name update: "+name+" to "+username);
        var userObj = $('#'+name);
        console.log("user: "+userObj);
        userObj.text(username);
    }

    now.ready(function(){        
        var anonUserId = sp.core.getAnonymousUserId();
        anonUserId.replace(/#/g,'');
        console.log("Logging in "+anonUserId);
        now.name = anonUserId;
        now.join("M83");

        $('#text').keypress(function(e) {
            if(e.which == 13) {
                jQuery('#send').click();
                $('#text').val('');
                //jQuery(this).blur();
            }
        });
    });

