var canvas;
var context;
var centerX;
var centerY;
var radius;
var lastText;
var currentTimer;
var paused;
var loadTime;
var totalTime;
var remainingTime;
var timerID;

var lastRemainingTime;
var displayTimerID;
var fpsOffset;

function timerInit() {
    currentTimer = "activity";
    paused = true;
    loadTime = true;
    canvas = document.getElementById("timer");
    canvas.height = canvas.width;
    context = canvas.getContext("2d");
    context.font = "bold 60pt Play";
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    radius = centerX * 0.9;
    totalTime = 0;
    lastRemainingTime = -1;
    lastText = "";
    
    placeText("x"); // For some reason, this is necessary to get the corret font displayed initially.
    placeText("Start");    
    drawTimingRing();
}

function clearLastText() {
    var textMetrics = context.measureText(lastText);
    var textWidth = textMetrics.width;
    var x1 = centerX - (textWidth / 2);
    var x2 = textWidth;
    var y1 = centerY - 30;
    var y2 = 60;

    context.clearRect(x1, y1, x2, y2);
}

function drawTimingRing() {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.lineWidth = 20;
    context.strokeStyle = "#808080";
    context.stroke();  
    
    if (!loadTime) {
        var ringColor;
        if (paused)
            ringColor = "#ffffff";
        else
            ringColor = currentTimer == "activity" ? "#80ff80" : "#ff8080";
        
        if (lastRemainingTime != remainingTime) {
            fpsOffset = 0;
            lastRemainingTime = remainingTime;
        } else
            fpsOffset += (1 / totalTime) / 30;
        
        context.beginPath();
        context.arc(centerX, centerY, radius, -0.5 * Math.PI, 2 * Math.PI * (1 -(remainingTime / totalTime - fpsOffset)) - (0.5 * Math.PI), false);
        context.lineWidth = 15;
        context.strokeStyle = ringColor;
        context.stroke();
    }
}

function loadTimer() {
    var t = $("#" + currentTimer + "-time").text()
    totalTime = parseInt(t) * 60;
    remainingTime = totalTime;
    
    placeText(t + ":00");
}

function placeText(text) {
    if (lastText !== "")
        clearLastText();
    
    lastText = text;
    console.log(context.font);
    var textMetrics = context.measureText(text);
    var textWidth = textMetrics.width;
    var textX = centerX - (textWidth / 2);
    context.textBaseline = "middle";
    context.fillStyle = "#dddddd";
    context.fillText(text, textX, centerY);  
}

function reduceTimer() {
    remainingTime--;
    if (remainingTime === 0) {
        var x = document.getElementById("alert");
        x.play();
    }

    if (remainingTime == -1) {
        currentTimer = (currentTimer == "activity" ? "break" : "activity");
        $("body").removeClass().addClass(currentTimer);
        loadTimer();
    } else {
        var minutes = parseInt(remainingTime / 60);
        var seconds = remainingTime % 60;
        placeText((minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }
}

function toggleTimer() {
    if (paused) {  
        if (loadTime) {
            loadTimer();
            loadTime = false;
        } else {
            var minutes = parseInt(remainingTime / 60);
            var seconds = remainingTime % 60;
            placeText((minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
        }
        
        $("body").addClass(currentTimer);
        $("button").prop("disabled", true);
        
        paused = false;

        timerID = setInterval(reduceTimer, 1000);
        displayTimerID = setInterval(drawTimingRing, 33);
    } else {
        clearInterval(timerID);
        clearInterval(displayTimerID);
        lastRemainingTime = remainingTime - 1;
        
        $("body").removeClass();
        $("button").prop("disabled", false);
        
        paused = true;
        drawTimingRing();
        placeText("Paused");
    }
}

$(document).ready(function() {
  WebFont.load({
    google: {
      families: ['Play']
    },
    active: function() {
        $(".overlay").on("click", function() {
            $(".overlay").removeClass("active");
        });
        
        $(".decrement, .increment").on("click", function() {
            $(this).blur();
            var operation = $(this).prop("id").substring(0,3);
            var selector = "#" + $(this).prop("id").substring(4);
            var value = parseInt($(selector).text());
            if (operation == "dec") {
                value--;
                if (value == 0)
                    value = 1;
            } else {
                value++;
                if (value > 99)
                    value = 99;
            }
            
            $(selector).text(value);
            loadTime = true;
            currentTimer = "activity";
            placeText("Start");
            drawTimingRing();
        });
        
        timerInit();
        
        $("#timer").on("click", toggleTimer);
    }
  });
});

