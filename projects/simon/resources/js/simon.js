$(document).ready(function() {
    init();
    $("#power").on("click", powerButtonClicked);
});

var audContext;
var tones = {
    error: {gain: null, oscillator: null},
    blue: {gain: null, oscillator: null},
    green: {gain: null, oscillator: null},
    red: {gain: null, oscillator: null},
    yellow: {gain: null, oscillator: null}
};

var toneMap = ["yellow", "green", "red", "blue"];

var powerOn;
var acceptInput;
var sequence;
var strictMode;
var playerIndex;

var baseToneLength, baseDelay, errorDelay;

var activeTimer;

function init() {
    if (window.AudioContext)
        audContext = new window.AudioContext();
    else
        audContext = new window.webkitAudioContext();
    
    // Set yellow button to C4 (261.63 Hz)
    tones.yellow.gain = audContext.createGain();
    tones.yellow.gain.gain.value = 0;
    tones.yellow.gain.connect(audContext.destination);
    
    tones.yellow.oscillator = audContext.createOscillator();
    tones.yellow.oscillator.type = "triangle";
    tones.yellow.oscillator.frequency.value = 261.63;
    tones.yellow.oscillator.connect(tones.yellow.gain);
    tones.yellow.oscillator.start();
    
    
    // Set green button to E4 (329.63)
    tones.green.gain = audContext.createGain();
    tones.green.gain.gain.value = 0;
    tones.green.gain.connect(audContext.destination);
    
    tones.green.oscillator = audContext.createOscillator();
    tones.green.oscillator.type = "triangle";
    tones.green.oscillator.frequency.value = 329.63;
    tones.green.oscillator.connect(tones.green.gain);
    tones.green.oscillator.start();
    
    // Set blue button to G4 (392.0)
    tones.blue.gain = audContext.createGain();
    tones.blue.gain.gain.value = 0;
    tones.blue.gain.connect(audContext.destination);
    
    tones.blue.oscillator = audContext.createOscillator();
    tones.blue.oscillator.type = "triangle";
    tones.blue.oscillator.frequency.value = 392.0;
    tones.blue.oscillator.connect(tones.blue.gain);
    tones.blue.oscillator.start();
    
    // Set red button to C5 (523.25)
    tones.red.gain = audContext.createGain();
    tones.red.gain.gain.value = 0;
    tones.red.gain.connect(audContext.destination);
    
    tones.red.oscillator = audContext.createOscillator();
    tones.red.oscillator.type = "triangle";
    tones.red.oscillator.frequency.value = 523.25;
    tones.red.oscillator.connect(tones.red.gain);
    tones.red.oscillator.start();
    
    // Set the error oscillator to C2 (65.41) square
    tones.error.gain = audContext.createGain();
    tones.error.gain.gain.value = 0;
    tones.error.gain.connect(audContext.destination);
    
    tones.error.oscillator = audContext.createOscillator();
    tones.error.oscillator.type = "square";
    tones.error.oscillator.frequency.value = 65.41;
    tones.error.oscillator.connect(tones.error.gain);
    tones.error.oscillator.start();
    
    powerOn = false;
}

function powerButtonClicked() {
    if (powerOn) {
        clearTimeout(activeTimer);
        stopAllTones();
        $("#controls").removeClass("power-on");
        $("#start").off("click");
        $("#strict").off("click");
        $(".button").off("mousedown");
        $(".button").off("mouseup");
    } else {
        strictMode = false;
        acceptInput = false;
        baseToneLength = 1000;
        baseDelay = 500;
        errorDelay = 3000;
        
        $("#counter").removeClass("off").text("--");
        $("#strict").removeClass("on");
        $("#controls").addClass("power-on");
        $(".button").on("mousedown", mouseDownOn);
        $(".button").on("mouseup", mouseUpOn);
        $("#start").on("click", startGame);
        $("#strict").on("click", toggleStrict);
    }
    powerOn = !powerOn;
} 

function blinkCounter(times, callAfter = null) {
    if (times == 0) {
        if (callAfter)
            callAfter();
        return;
    }

    times--;
    $("#counter").addClass("off");
    activeTimer = setTimeout(function(times, callAfter) {
        $("#counter").removeClass("off");
        activeTimer = setTimeout(blinkCounter, 500, times, callAfter);
    }, 500, times, callAfter);
}

function errorMade() {
    acceptInput = false;
    $("#counter").text("**");
    tones.error.gain.gain.value = 0.1;
    activeTimer = setTimeout(function() {
        $(".button").removeClass("lit");
        tones.error.gain.gain.value = 0;
        if (strictMode) {
            sequence = [];
            acceptInput = true;
            incrementSequence();
        } else {
            var modifier = Math.floor(sequence.length / 5);
            var toneLength = baseToneLength * (1 - (modifier * 0.2));
            var delay = baseDelay * (1 - (modifier * 0.2));
            $("#counter").text((sequence.length < 10 ? "0" : "") + sequence.length);
    
            activeTimer = setTimeout(playTone, 1000, 0, toneLength, delay);
        }
    }, 2000);
}

function gameWon(repeat = 8) {
    var color = sequence[sequence.length - 1];
    $("#counter").text("!!");
    if (repeat > 0) {
        $("#" + color).addClass("lit");
        tones[color].gain.gain.value = 0.2;
        activeTimer = setTimeout(function(repeat) {
            var color = sequence[sequence.length - 1];
            $("#" + color).removeClass("lit");
            tones[color].gain.gain.value = 0;
            activeTimer = setTimeout(gameWon, 75, repeat - 1);
        }, 75, repeat);
    }
}

function incrementSequence() {
    if (sequence.length == 20) {
        gameWon();
        return;
    }

    sequence.push(toneMap[Math.floor(Math.random() * 4)]);
    $("#counter").text((sequence.length < 10 ? "0" : "") + sequence.length);
    
    var modifier = Math.floor(sequence.length / 5);
    var toneLength = baseToneLength * (1 - (modifier * 0.2));
    var delay = baseDelay * (1 - (modifier * 0.2));
    
    activeTimer = setTimeout(playTone, 1000, 0, toneLength, delay);
}

function playTone(index, length, delay) {  
    var color = sequence[index];
    $("#" + color).addClass("lit");
    tones[color].gain.gain.value = 0.2;
    activeTimer = setTimeout(function(index, length, delay) {
        var color = sequence[index];
        $("#" + color).removeClass("lit");
        tones[color].gain.gain.value = 0;
        index++;
        
        if (index < sequence.length) {
            activeTimer = setTimeout(playTone, delay, index, length, delay);
        } else {
            playerIndex = 0;
            acceptInput = true;
            activeTimer = setTimeout(errorMade, 3000);
        }
    }, length, index, length, delay);
}

function startGame() {
    clearTimeout(activeTimer);
    stopAllTones();
    sequence = [];
    $("#counter").text("--");
    blinkCounter(3, incrementSequence);
}

function stopAllTones() {
    tones.error.gain.gain.value = 0;
    tones.yellow.gain.gain.value = 0;
    tones.green.gain.gain.value = 0;
    tones.blue.gain.gain.value = 0;
    tones.red.gain.gain.value = 0;
    $(".button").removeClass("lit");
}

function toggleStrict() {
    if (strictMode)
        $("#strict").removeClass("on");
    else
        $("#strict").addClass("on");
    
    strictMode = !strictMode;
}

function mouseDownOn() {
    if (acceptInput) {
        clearTimeout(activeTimer);
    
        var color = $(this).prop("id");
        $(this).addClass("lit");
        
        if (sequence[playerIndex] == color) {
            tones[color].gain.gain.value = 0.2;
        }
        else {
            acceptInput = false;
            errorMade();
        }
    }
}

function mouseUpOn() {
    if (acceptInput) {
        var color = $(this).prop("id");
        $(this).removeClass("lit");
        tones[color].gain.gain.value = 0;
        playerIndex++;
        
        if (playerIndex == sequence.length) {
            acceptInput = false;
            activeTimer = setTimeout(incrementSequence, 1000);
        } else {
            activeTimer = setTimeout(errorMade, 3000);
        }
    }
}