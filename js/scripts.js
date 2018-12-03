$(document).ready(function () {
    /* Search function*/
    $(function () {
        $("input").keyup(function () {
            var val = $(this)
                .val()
                .toLowerCase();
            $("#content a").hide();
            $("#content a").each(function () {
                var text = $(this)
                    .text()
                    .toLowerCase();
                if (text.indexOf(val) != -1) {
                    $(this).show();
                }
            });
        });
    });

    //My array of streamers
    var streamers = [
        "ESL_SC2",
        "OgamingSC2",
        "cretetion",
        "freecodecamp",
        "storbeck",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas"
    ];
    //declaring all my variables
    var urlFCC =
        "https://api.twitch.tv/kraken/streams/freecodecamp/?client_id=fbkdfnm20rhhsmselhhm9r2zmx1yp7&callback";
    var missingLogo =
        "https://image.shutterstock.com/z/stock-vector-male-profile-picture-placeholder-vector-illustration-design-social-profile-template-avatar-228952297.jpg";
    var url;
    var status;
    var logo;
    var game;
    var availability;
    var urlName;
    var tab;

    function onlineHTML() {
        //function to add html data
        $(
            "<a id = 'online' href='" +
            url +
            "' target='_blank'><div id ='All'><div class='availability'>" +
            availability +
            "</div><div class= 'pic'><img class='img-thumbnail'src='" +
            logo +
            "'></div><div class='name'>" +
            name +
            "</div><div class='status'>" +
            status +
            "</div><div class='game'>" +
            game +
            "</div></div></a>"
        ).appendTo("#content");
    }

    function offlineHTML() {
        //function to add html data
        $(
            "<a id = 'offline' href='" +
            url +
            "' target='_blank'><div id ='All'><div class='availability'>" +
            availability +
            "</div><div class= 'pic'><img class='img-thumbnail'src='" +
            logo +
            "'></div><div class='name'>" +
            name +
            "</div><div class='status'>" +
            status +
            "</div><div class='game'>" +
            game +
            "</div></div></a>"
        ).appendTo("content");
    }

    /* Getting the status of Free Code Camp*/
    $.getJSON(urlFCC, function (data) {
        if (data.stream === null) {
            $("#FCC").html("Free Code Camp is currently offline.");
        } else {
            $("#FCC").html("Free Code Camp is currently ONLINE!");
        }
        // console.log(data)
    });
    /* Getting the status of Free Code Camp*/

    for (i = 0; i < streamers.length; i++) {
        /*use to iterate through my array of streamers*/
        ajax();
        // console.log(streamers[i]);
    }

    function ajax() {
        /*pulls all the data from Stremers*/
        $.ajax({
            url: "https://api.twitch.tv/kraken/streams/" + streamers[i],
            type: "GET",
            dataType: "json",
            async: false,
            headers: {
                "Client-ID": "fbkdfnm20rhhsmselhhm9r2zmx1yp7"
            },
            success: function (streamData) {
                getStreamData(streamData); /*With success this function would be called*/
                // console.log(streamData._links.channel.substr(38));
            },
            error: function (err) {
                console.log("unable to access json streams");
            }

            //console.log(streamers[i]);
        });
    }

    function getStreamData(streamData) {
        /*determines whether you are online or offline*/
        if (streamData.stream === null) {
            tab = "offline";
            urlName = streamData._links.channel.substr(38);
            offlineUsers();
            // console.log(urlName);
        } else if (
            streamData.error ||
            streamData.status == 404 ||
            streamData == 422
        ) {
            tab = "closed";
            status = "Account Closed";
            availability = "Account Closed!";
            logo = missingLogo;
            url = "https://www.twitch.tv/";
            game = "No game currently playing";
            $(".availability").css("font-color", "#D80303");
            offlineHTML();
        } else {
            if (streamData.stream.channel.logo !== null) {
                logo = streamData.stream.channel.logo;
            } else {
                logo = missingLogo;
            }
            if (streamData.stream.channel.status !== null) {
                status = streamData.stream.channel.status;
            } else {
                status = "....";
            }
            url = streamData.stream.channel.url;
            name = streamData.stream.channel.display_name;
            game = streamData.stream.channel.game;
            availability = "<i style ='color:green'class='fa fa-check'></i>";
            tab = "online";
        }

        onlineHTML();
    }

    function offlineUsers() {
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: "https://api.twitch.tv/kraken/channels/" + urlName,
            headers: {
                "Client-ID": "fbkdfnm20rhhsmselhhm9r2zmx1yp7"
            },
            error: function (err) {
                console.log("unable to access json channels");
            },
            success: function (channelData) {
                url = channelData.url;
                name = channelData.display_name;
                game = channelData.game;
                availability = "<i style ='color:red' class='fa fa-times'></i>";
                if (channelData.status === null) {
                    status = " ";
                } else {
                    status = channelData.status;
                }
                if (channelData.game === null) {
                    game = " ";
                } else {
                    game = channelData.game;
                }

                if (channelData.logo !== null || channelData.logo !== undefine) {
                    logo = channelData.logo;
                } else {
                    logo = missingLogo;
                }
                offlineHTML();
            }
        });
    }
    //toggle the All button

    //toggle the online button
    /*$("#onlineButton").click(function() {
      $("#offline").hide();
      $("#online").show();
    });
      
    $("#allButton").click(function() {
      $("#online").show();
      $("#offline").show();
    });
    //toggle the offline button
    $("#offlineButton").click(function() {
      $("#online").hide();
      $("#offline").show();
    });*/

    //Clicking on tabs changes the color of the tabs
    $("nav ul li a").click(function () {
        $("nav ul li a").removeClass("active");
        $(this).addClass("active");
    });

    $('#navButton li a').click(function () {
        // fetch the class of the clicked item
        var ourClass = $(this).attr('class');
        if (ourClass == 'active') {
            // show all our items
            $('#content').children('a.item').show();
        } else {
            // hide all elements that don't share ourClass
            $('#content').children('a:not(.' + ourClass + ')').hide();
            // show all elements that do share ourClass
            $('#ourHolder').children('a.' + ourClass).show();
        }
        return false;
    });
});