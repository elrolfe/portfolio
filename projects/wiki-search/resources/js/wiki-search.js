var windowHeight = $(window).height();
var windowWidth = $(window).width();
var titleHeight = $("#page-title").height();
var titleWidth = $("#page-title").width();
var randomWidth = $("#random-button").width();
var randomHeight = $("#random-button").height();
var searchWidth = $("#search-bar").width();
var searchHeight = $("#search-bar").height();
var elementTops = 20;

$(document).ready(function() {
    var totalHeight = titleHeight + randomHeight + searchHeight + 40;
    var titleTop = (windowHeight - totalHeight) / 2;
    var randomTop = (titleTop + titleHeight + 10);
    var searchTop = (randomTop + randomHeight + 30);
    
    $("#page-title").css("left", (windowWidth - titleWidth) / 2);
    $("#page-title").css("top", (titleTop));
    $("#random-button").css("left", (windowWidth - randomWidth) / 2);
    $("#random-button").css("top", randomTop);
    $("#search-bar").css("left", (windowWidth - searchWidth) / 2);
    $("#search-bar").css("top", searchTop);
    $("#result").css("margin-top", elementTops + randomHeight + 30);
    
    $("#search").on("search", initialSearch);
    $("#search-button").on("click", initialSearch);
    $("#clear-search").on("click", clearSearch);
});

function clearSearch() {
    $("#search").val("");
    resetElements();
}

function initialSearch() {
    if ($("#search").val() != "") {
        var totalWidth = randomWidth + searchWidth + 30 + 110;
        var randomLeft = (windowWidth - totalWidth) / 2;
        var searchLeft = randomLeft + randomWidth + 30;
        
        $("#page-title").animate({
            top: elementTops,
            opacity: "0"
        }, 750);
        $("#random-button").animate({
            top: elementTops,
            left: randomLeft
        }, 750);
        $("#search-bar").animate({
            top: elementTops,
            left: searchLeft
        }, 750, doSearch);
        $("#clear-search").fadeIn(750);
        
        $("#search").off().on("search", secondarySearches);
        $("#search-button").off().on("click", secondarySearches);    
    }
}

function secondarySearches() {
    if ($("#search").val() == "")
        resetElements();
    else
        doSearch();
}

function resetElements() {
    var totalHeight = titleHeight + randomHeight + searchHeight + 40;
    var titleTop = (windowHeight - totalHeight) / 2;
    var randomTop = (titleTop + titleHeight + 10);
    var searchTop = (randomTop + randomHeight + 30);
    
    $("#result").fadeOut("fast");
    $("#page-title").animate({
        top: titleTop,
        opacity: "1"
    }, 750);
    $("#random-button").animate({
        top: randomTop,
        left: (windowWidth - randomWidth) / 2
    }, 750);
    $("#search-bar").animate({
        top: searchTop,
        left: (windowWidth - searchWidth) / 2
    }, 750);
    $("#clear-search").fadeOut(750);
    
    $("#search").off().on("search", initialSearch);
    $("#search-button").off().on("click", initialSearch);          
}

function doSearch() {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        type: "GET",
        dataType: "jsonp",
        data: {
            "action": "query",
            "format": "json",
            "prop": "extracts",
            "indexpageids": "1",
            "generator": "search",
            "exsentences": "10",
            "exlimit": "10",
            "exintro": "1",
            "gsrsearch": $("#search").val(),
            "gsrwhat": "text"
        },
        success: function(data) {
            var keys = data.query.pageids;
            var resultStr;
            var results = [];
            
            $("#result").fadeOut("fast", function() {
                $("#result").html("<h1 class=\"text-center\">Wikipedia Search Results for " + $("#search").val() + "</h1>");
                
                for (var i = 0; i < keys.length; i++) {
                    var title = data.query.pages[keys[i]].title;
                    var href = "https://en.wikipedia.org/wiki/" + title.replace(/\s/g,"_");
                    resultStr = "<a href=\"" + href + "\" target=\"_blank\"><div class=\"entry\"><div class=\"entry-title\"><p>" + title + "</p></div>";
                    resultStr += "<div class=\"entry-extract\">" + data.query.pages[keys[i]].extract + "</div></div></a>";
                    results[parseInt(data.query.pages[keys[i]].index)] = resultStr;
                }
                
                resultStr = "";
                for (var i = 1; i <= keys.length; i++) {
                    $("#result").append(results[i]);
                }
                
                $("#result").fadeIn();
            });
        }
    });
}