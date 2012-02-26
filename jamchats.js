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

    function getUsername(name) {
        console.log("Looking up username for "+name);
        var username = now.usernames[name];
        console.log("Found: " + username);
        if (username) {
            console.log("Found username: "+username);
            return username;
        }
        return name;
    }

    function updateUserList() {
        $('#userlist').html('');
        for (var i = 0; i < userList.length; i++) {
            //if (!$('#'+users[i])) {
                var name = getUsername(userList[i]);
                var myname = "";
                if (now) {
                    myname = getUsername(now.name);                    
                }
                console.log("My name: " + myname);
                var iAmHere = (name == myname);
                if (iAmHere) {
                    $('#namecontrols').hide();
                    $('#messagecontrols').show();
                }
                var classname = iAmHere ? "me" : "them";
                $('#userlist').append("<li id='"+userList[i]+"' class='" + classname + "'>" + name + '</li>');
            //}
        }
    }

    now.forumInfo = function(users) {   
        console.log("Received forum info.");
        userList = users;
        updateUserList();
    };

    now.userJoined = function(name) {
        console.log("Received user joined.");
        userList.push(name);
        updateUserList();
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
        var myname = getUsername(this.now.name);
        var classname = (name == myname) ? "me" : "them";
        $('#chat').append('<div class="message"><span class="' + classname + '">' + name + '</span>: ' + text + '</div>')
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

