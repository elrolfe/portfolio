/************** Global variables *************************/

var pollsLoaded = 0;    // The number of polls that have been loaded
                        // on the various poll display pages that allow
                        // infinite scrolling.  This will be used as an
                        // offset for subsequent calls to the loadPolls
                        // function to facilitate the infinite scroll.
                        
var goodPassword = false;   // Indicates if the password and verification
                            // fields match on the user registration page
                            
var goodUsername = false;   // Indicates if the chosen username on the
                            // user registration page is available

var getAnswersCallback = null;
var getResultsCallback = null;
var searchTerm = null;

/************** User Profile Functions ******************/

var changeName = function() {
    // Performs an ajax call to allow the user to
    // change their display name form their profile
    // page.  Displays an alert box indicating success
    // or failure.  On success, the page is reloaded
    // to reflect the changes.
    
    // Display a message to let the user know something is happening
    $("#message").text("(Updating...)");

    $.ajax({
        type: "POST",
        url: window.location.pathname + "/update",
        data: {
            displayName: $("#displayName").val()
        },
        success: function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.success);
                location.reload(true);
            }
        }
    })
};

/*************** Poll Display Functions *****************/

var loadPolls = function() {
    // Load another batch of up to 50 polls,
    // and add them to the page's poll columns

    // Prevent the event from being triggered again    
    $(window).off("scroll");
    
    // Display a loading message and graphic
    $(".loading").show();
    
    // If an author's user id is given, limit results
    // to polls by that author only.  Default value of
    // null returns polls from all authors.
    var author = null;
    $("#user-id").each(function() {
        author = $(this).val();
    });

    // Retrieve the polls via an ajax call
    $.ajax({
        type: "POST",
        url: "/vote/polls",
        data: {
            offset: pollsLoaded,
            maxpolls: 50,
            author: author
        },
        success: function(data) {
            if (data.error) {
                // Replace the loading text and graphic with the
                // returned error, and turn off the infinite scroll.
                $(".loading").html("<strong>" + data.error + "</strong>");
            } else {
                var polls = data.polls;
                
                // If the number of polls returned were less than
                // 50, there are no more polls to retrieve from the
                // system.  Turn off the endless scroll.
                if (polls.length == 0) {
                    if (pollsLoaded == 0)
                        $(".loading").html("<h4>No polls have been created yet</h4>");
                    else
                        $(".loading").html("<h4>There are no more polls to load</h4>");
                    return;
                }
                    
                // Add the number of polls received to the
                // pollsLoaded offset variable
                pollsLoaded += polls.length; 
                
                // Hide the loading message
                $(".loading").hide();
                
                for (var i = 0; i < polls.length; i++) {
                    // Determine the shortest column height
                    var minColumn = 1;
                    var minHeight = $("#poll-col-1").height();
                    
                    if ($("#poll-col-2").height() < minHeight) {
                        minHeight = $("#poll-col-2").height();
                        minColumn = 2;
                    }
                    
                    if ($("#poll-col-3").height() < minHeight) {
                        minHeight = $("#poll-col-3").height();
                        minColumn = 3;
                    }
                    
                    // Place the new poll into the shortest column
                    // var contents = $("#poll-col-" + minColumn).html() + pollbox(polls[i], data.editable);
                    // $("#poll-col-" + minColumn).html(contents);
                    $("#poll-col-" + minColumn).append(pollbox(polls[i], data.editable));
                }
                
                $(".poll-remove").off("click");
                $(".poll-remove").on("click", function() { return confirm("Are you sure you want to delete your poll?"); });
                $(window).on("scroll", scrollPolls);
            }
        }
    });
};

/***************** Top Polls Functions *****************************/
var loadTopPolls = function() {
    // Load up to the top 10 polls,

    // Display a loading message and graphic
    $(".loading").show();
    

    // Retrieve the polls via an ajax call
    $.ajax({
        type: "POST",
        url: "/vote/polls/top",
        success: function(data) {
            if (data.error) {
                // Replace the loading text and graphic with the
                // returned error, and turn off the infinite scroll.
                $(".loading").html("<strong>" + data.error + "</strong>");
            } else {
                var polls = data.polls;
                
                if (polls.length == 0) {
                    // If there aren't any polls answered yet,
                    // change the loading message to reflect that
                    $(".loading").html("<h4>No polls have been answered yet</h4>");
                    return;
                }
                
                // Hide the loading message
                $(".loading").hide();
                
                var contents = "";
                for (var i = 0; i < polls.length; i++) {
                    contents += pollbox(polls[i], false); // False indicates these polls should not be editable
                }
                
                $("#top-polls").html(contents);
            }
        }
    });
};

/***************** Search Polls Function ***************************/

var searchPolls = function(term) {
    // Load up to the top 10 polls,

    // Display a loading message and graphic
    $(".loading").show();
    

    // Retrieve the polls via an ajax call
    $.ajax({
        type: "POST",
        url: "/vote/polls/search",
        data: {
            searchTerm: term
        },
        success: function(data) {
            if (data.error) {
                // Replace the loading text and graphic with the
                // returned error, and turn off the infinite scroll.
                $(".loading").html("<strong>" + data.error + "</strong>");
            } else {
                var polls = data.polls;
                
                if (polls.length == 0) {
                    // If there aren't any polls answered yet,
                    // change the loading message to reflect that
                    $(".loading").html("<h4>No polls were found matching your search</h4>");
                    return;
                }
                
                // Hide the loading message
                $(".loading").hide();
                
                for (var i = 0; i < polls.length; i++) {
                    // Determine the shortest column height
                    var minColumn = 1;
                    var minHeight = $("#poll-col-1").height();
                    
                    if ($("#poll-col-2").height() < minHeight) {
                        minHeight = $("#poll-col-2").height();
                        minColumn = 2;
                    }
                    
                    if ($("#poll-col-3").height() < minHeight) {
                        minHeight = $("#poll-col-3").height();
                        minColumn = 3;
                    }
                    
                    // Place the new poll into the shortest column
                    var contents = $("#poll-col-" + minColumn).html() + pollbox(polls[i], data.editable);
                    $("#poll-col-" + minColumn).html(contents);
                }
            }
        }
    });
};

/***************** User Registration Functions *********************/

var checkUsername = function() {
    // See if the given username is already in use in the system
    // console.log("Ajax check to see if the username is available");
    // goodUsername = true;
    // checkValidData();
    
    if ($("#vote-username").val().trim() == "") {
        goodUsername = false;
        $("#username-error").html("");
        return;
    }
    
    $("#username-error").html("");
    $(".updating").show();
    $.ajax({
       type: "POST",
       url: "/vote/user/check",
       data: {
           name: $("#vote-username").val().trim()
       },
       success: function(data) {
           $(".updating").hide();
           if (data.error) {
                goodUsername = false;
                $("#username-error").html("<strong>Error:</strong> " + data.error);
           } else {
                goodUsername = data.available;
                if (!goodUsername)
                    $("#username-error").html("That username is not available");
                else
                    $("#username-error").html("Username available");
           }
           
           checkValidData();
       }
    });
};

var checkPasswordsEqual = function() {
    // Verify that the password and verification fields match
    if ($("#vote-password").val() == "" || $("#vote-verify").val() == "") {
        $("#password-error").text("");
        goodPassword = false;
    } else if ($("#vote-password").val() !== $("#vote-verify").val()) {
        $("#password-error").text("The passwords do not match!");
        goodPassword = false;
    } else {
        $("#password-error").text("");
        goodPassword = true;
    }
    
    checkValidData();
};

var checkValidData = function() {
    // Enable the registration button if the username and password are good
    $("#register-btn").prop("disabled", !(goodUsername && goodPassword));
};

/******************* Edit Poll Functions *********************/

var addAnswers = function() {
    if ($("#newAnswers").val().trim() == "")
        return;
        
    var url = window.location.pathname.slice(0, window.location.pathname.length - 5) + "/answers/add";

    $(".updating").show();
    $(".loading").show();
    $.ajax({
        type: "POST",
        url: url,
        data: {
            newAnswers: $("#newAnswers").val()
        },
        success: getResults
    });
};

var removeAnswer = function(id) {
    // Make an ajax call to remove the answer with the given id.
    // On return, call getAnswersCallback to process the returned 
    // list of answers still available on the poll

    var url = window.location.pathname.slice(0, window.location.pathname.length - 5) + "/answers/remove";
    
    $(".loading").show();
    $.ajax({
        type: "POST",
        url: url,
        data: {
            id: id
        },
        success: getResults
    });
};

var getAnswersCallbackEditPoll = function(data) {
    if (data.error) {
        $(".answers-wrapper").html("<p><strong>" + data.error + "</strong></p>" + $(".answers").html());
    } else {
        var newHTML = "";
        data.answers.forEach(function(answer) {
            newHTML += "<div class=\"answer\"><a class=\"answer-remove\" onclick=\"removeAnswer(" + answer._id + ");\">X</a>";
            newHTML += "<p>" + answer.answer + "</p>";
            if (answer.user !== data.author)
                for (var i = 0; i < data.users.length; i++)
                    if (data.users[i]._id == data.author) {
                        newHTML += "<p class=\"other-user\">Added by " + data.users[i].displayName + "</p>";
                        break;
                    }
            newHTML += "</div>";
        });
        
        $(".answers-wrapper").html(newHTML);
        $("#newAnswers").val("");
    }
    
    $(".loading").hide();
    $(".updating").hide();
};

var getResultsCallbackEditPoll = function(data) {
    $(".results-wrapper").html("<canvas id=\"chart\"></canvas><div class=\"chart-key\"></div>");
    var chart = $("#chart");
    
    getAnswers();

    if (data.error) {
        chart.height(0);
        $(".chart-key").html(data.error);
        return;
    }
    
    $(".vote-wrapper").html("<div class=\"alert alert-info\"><p>You voted for <strong>" + data.answers[data.userAnswer] + "</strong></div>")

    generateChart(data);    
}

/******************** Single Poll Functions **************************/

var checkAnswer = function() {
    if ($("#vote-dropdown").val() < 0)
        $(".custom-answer-wrapper").show();
    else
        $(".custom-answer-wrapper").hide();
};

var getAnswersCallbackSinglePoll = function(data) {
    if (data.error) {
        $(".vote-wrapper").html("<p><strong>" + data.error + "</strong></p>" + $(".vote-wrapper").html());
    } else {
        var answers = data.answers;
        
        var html = "<p>Choose Your Answer</p><div class=\"form-group\"><select class=\"form-control\" id=\"vote-dropdown\" name=\"vote\">";
        answers.forEach(function(a) {
            html += "<option value=\"" + a._id + "\">" + a.answer + "</option>"
        });
        if (data.canAdd)
            html += "<option value=\"" + (data.canAdd * -1) + "\">Create your own answer</option>";
        html += "</select></div>";
        if (data.canAdd)
            html += "<div class=\"custom-answer-wrapper\">" +
                    "<div class=\"form-group\">" + 
                    "<label for=\"#custom-answer\">Enter your answer:</label>" + 
                    "<input class=\"form-control\" id=\"custom-answer\" type=\"text\" name=\"customAnswer\" />" + 
                    "</div></div>";
        html += "</div><button class=\"btn btn-default\" id=\"submit-vote\">Submit</button>";
        $(".vote-wrapper").html(html);
        $("#vote-dropdown").on("change", checkAnswer);
        $("#submit-vote").on("click", submitVote);
    }
}

var getResultsCallbackSinglePoll = function(data) {
    $(".results-wrapper").html("<canvas id=\"chart\"></canvas><div class=\"chart-key\"></div>");
    var chart = $("#chart");

    if (data.error) {
        chart.height(0);
        $(".chart-key").html(data.error);
        return;
    }
    
    // The user hasn't answered this poll yet.
    // Get the answer info, and don't show the results yet
    if (data.userAnswer == -1) {
        chart.height(0);
        $(".chart-key").html("<p>Cast your vote to see the results</p>");
        getAnswers();
        return;
    }
    
    $(".vote-wrapper").html("<div class=\"alert alert-info\"><p>You voted for <strong>" + data.answers[data.userAnswer] + "</strong></div>")

    generateChart(data);    
}

var submitVote = function() {
    var vote = $("#vote-dropdown").val();
    var custom = $("#custom-answer").val();
    
    $(".vote-wrapper").html("<img src=\"/vote/img/loading.gif\"><h4>Updating...</h4>");
    $(".results-wrapper").html("<img src=\"/vote/img/loading.gif\"><h4>Updating...</h4>");
    $.ajax({
        type: "POST",
        url: window.location.pathname + "/vote",
        data: {
            pollID: $("#pollID").val(),
            vote: vote,
            customAnswer: custom
        },
        success: function(data) {
            if (data.error) {
                $(".vote-wrapper").html(data.error);
                $(".results-wrapper").html("");
                setTimeout(getResults, 2000);
            } else {
                // $(".vote-wrapper").html(data.answer);
                getResults();
            }
        }
    });
};

/***************** Utility Functions ***********************/

var generateChart = function(data) {
    var type = data.type;
    var labels = data.labels;
    var answers = data.answers;
    var results = data.results;
    var chart = $("#chart");

    var colors = ["#284abc", "#e1105a", "#e19f10", "#9ef42f", "#2ff4e8"];
    var chartColors = [];

    for (var i = 0; i < data.labels.length; i++) {
        chartColors.push(colors[i % 5]);
    }
    
    chart.width($(".results-wrapper").width());
    chart.height($(".results-wrapper").width());
    
    var dataSet = {
        labels: labels,
        datasets: [{
            backgroundColor: chartColors,
            label: "Results",
            data: results
        }]
    };
    
    var options = {};
    if (type == "bar")
        options.scales = {
            yAxes: [{
                ticks: {
                    min: 0
                }
            }]
        };
        
    options.legend = {
        display: (type !== "bar"),
        position: "bottom"
    };
        
    var resultChart = new Chart(chart, {
        type: type,
        data: dataSet,
        options: options
    });
    
    var keyString = "<ol>";
    answers.forEach(function(a) {
        keyString += "<li>" + a + "</li>";
    });
    keyString += "</ol>";
    $(".chart-key").html(keyString);
}

var getAnswers = function() {
    var url = window.location.pathname;
    if (url.slice(url.length - 5) == "/edit")
        url = url.slice(0, url.length - 5);
    if (url.slice(url.length - 1) == "/")
        url = url.slice(0, url.length - 1);
    url += "/answers";

    $(".loading").show();
    $.ajax({
        type: "POST",
        url: url,
        success: getAnswersCallback
    });
}

var getResults = function() {
    var url = window.location.pathname;
    if (url.slice(url.length - 5) == "/edit")
        url = url.slice(0, url.length - 5);
    if (url.slice(url.length - 1) == "/")
        url = url.slice(0, url.length - 1);
    url += "/results";
    
    $.ajax({
        type: "POST",
        url: url,
        data: {
            pollID: $("#pollID").val()
        },
        success: getResultsCallback
    });
};

var pollbox = function(poll, editable) {
    // Generate and return the correct pollbox divs for display
    // Parameters:
    //      poll: An object containing the poll retrieved from the database
    //      editable: A boolean set to true if the current user is the poll's
    //                author, thus giving them the ability to remove the poll
    
    return (editable ? "<div class=\"edit-poll-wrapper\">" +
        "<a class=\"poll-remove\" href=\"/vote/polls/" + poll._id + "/remove?p=profile\");\">X</a>" : "") +
        "<a class=\"pollbox-link\" href=\"/vote/polls/" + poll._id + "\"><div class=\"pollbox\">" +
        "<p class=\"question\">" + poll.question + "</p>" +
        (editable ? "" : "<p class=\"byline\">Created by " + poll.author + "</p>") +
        "<p class=\"responses\">" + poll.responses + " Responders</p>" +
        "<p class=\"answers\">" + poll.answers + " Answers</p>" +
        "</div></a>" +
        (editable ? "</div>" : "");
};

var scrollPolls = function() {
    if ($(document).height() - $(window).height() <= $(window).scrollTop() + 50)
        loadPolls();
}

/******************** Document Ready Function ************************/

$(document).ready(function() {
    // Poll Display setup
    if ($(".infinite-scroll").length) {
        // Initialize the infinite scroll capability if it is available on this page
        $(window).on("scroll", scrollPolls);
        loadPolls();
    }
    
    // Top Polls setup
    if ($("#top-polls").length) {
        loadTopPolls();
    }
    
    // User Profile setup
    if ($("#displayName").length) {
        // Attach an on change handler to allow the user to change their display name
        $("#displayName").on("change", changeName);
    }
    
    // User Registration setup
    if ($("#vote-username").length) {
        // Attach validation handlers to verify user registration information
        $("#vote-username").on("change", checkUsername);
        $("#vote-password").on("change", checkPasswordsEqual);
        $("#vote-verify").on("change", checkPasswordsEqual);
    }
    
    // Edit Polls setup
    if ($("#editID").length) {
        // Attach a click handler to the submit button for new answers
        $("#sendNewAnswers").on("click", addAnswers);
        $(".loading").show();
        getAnswersCallback = getAnswersCallbackEditPoll;
        getResultsCallback = getResultsCallbackEditPoll;
        getResults();
    }
    
    // Single Poll Setup
    if ($("#pollID").length) {
        getAnswersCallback = getAnswersCallbackSinglePoll;
        getResultsCallback = getResultsCallbackSinglePoll;
        getResults();
    }
    
    // Search Results Setup
    if (searchTerm) {
        searchPolls(searchTerm);
    }
});