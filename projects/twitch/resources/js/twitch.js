var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "MedryBW", "brunofin", "comster404"];

$(document).ready(function() {
    $("#all-users").on("click", function() {
        $(".tear-tab li").removeClass("active");
        $("#all-users").addClass("active");
        $("tr").show();
    });

    $("#online-users").on("click", function() {
        $(".tear-tab li").removeClass("active");
        $("#online-users").addClass("active");
        $("tr.success").show();
        $("tr.active,tr.danger").hide();
    });
    
    $("#offline-users").on("click", function() {
        $(".tear-tab li").removeClass("active");
        $("#offline-users").addClass("active");
        $("tr.success").hide();
        $("tr.active,tr.danger").show();
    });
    
    $("#search-users").on("click", function() {
        filterTable();
        $("#search").focus();
    });
    
    $("#search").on("keyup", function() {
        filterTable();
    });
    
    var baseURL = "https://api.twitch.tv/kraken/streams/";
    var callback = "?callback=?";
    var unknownImage = "/twitch/img/unknown.jpg";
    var statusClass = "";
    var imgLink = "";
    var streamData = "";
    var statusDisplay = "";
    var anchorStart = "";
    var anchorEnd = "";
    var userName = "";
    
    for (var i = 0; i < twitchUsers.length; i++) {
        twitchUsers[i] = twitchUsers[i].toLowerCase();
    }

    twitchUsers.sort();
    
    for (var i = 0; i < twitchUsers.length; i++) {
        $("tbody").append("<tr id=\"" + twitchUsers[i] + "\"><td class=\"logo-column\"><img class=\"streamer-logo\" src=\"" + unknownImage + "\"></td><td class=\"info-column\"><div class=\"streamer-info\"><p class=\"name\">" + twitchUsers[i] + "</p><p class=\"stream-data\"></p></div></td><td class=\"status-column\"><p></p></td></tr>");
        $.getJSON(baseURL + twitchUsers[i] + callback, function(data) {
            if (data.hasOwnProperty("error")) {
                var found = data.message.match(/'([^']*)'/);
                var id = "#" + found[1];
                $(id).addClass("danger");
                $(id + " .status-column p").text("Invalid");
            } else if (data.stream) {
                var id = "#" + data.stream.channel.name;
                $(id).addClass("success");
                $(id + " .streamer-logo").prop("src", data.stream.channel.logo);
                $(id + " .streamer-info .name").text(data.stream.channel.display_name);
                $(id + " .stream-data").text(data.stream.game);
                $(id + " .streamer-info").wrap("<a href=\"https://www.twitch.tv/" + data.stream.channel.name + "\" target=\"_blank\"></a>");
                $(id + " .status-column p").text("Online");
            } else if (data._links.channel) {
                $.getJSON(data._links.channel + "?callback=?", function(data) {
                    var id = "#" + data.name;
                    $(id).addClass("active");
                    $(id + " .streamer-logo").prop("src", data.logo);
                    $(id + " .streamer-info .name").text(data.display_name);
                    $(id + " .stream-data").text(data.status);
                    $(id + " .streamer-info").wrap("<a href=\"https://www.twitch.tv/" + data.name + "\" target=\"_blank\"></a>");
                    $(id + " .status-column p").text("Offline");
                });
            }
        });
    }
});

function filterTable() {
    var filter = new RegExp($("#search").val(),"i");
    
    $(".tear-tab li").removeClass("active");
    $("#search-users").addClass("active");
    
    $("tbody tr").each(function() {
        if ($(this).prop("id").search(filter) < 0)
            $(this).hide();
        else
            $(this).show();
    });
}