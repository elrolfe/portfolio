var computerTurn = false;
var playerMark;
var computerMark;
var grid;
var aiLevel;

$(document).ready(function() {
    $("#start").on("click", startGame);
});

function startGame() {
    grid = [["", "", ""],
            ["", "", ""],
            ["", "", ""]];
    playerMark = $("input[name='player-choice']:checked").val();
    aiLevel = parseInt($("input[name='ai-level']:checked").val());
    computerMark = playerMark == "x" ? "o" : "x";

    $(".game-cell").removeClass("x-square").removeClass("o-square").addClass("empty").css("cursor", "pointer");
    $(".header p").css("opacity", 0.5);
    $(".header button").prop("disabled", true);
    $(".header input[type='radio']").prop("disabled", true);

    if (computerMark == "x") {
        computerTurn = true;
        showMessage("X Starts", 1500, "#44e", play);
    } else
        showMessage("X Starts", 1500, "#44e");

    $(".game-cell").on("click", cellClicked);   
}

function showMessage(msg, delay, color = "#f33", callback = null) {
    $(".overlay").addClass("active");
    $(".overlay.active .message-box p").css("color", color).text(msg);
    setTimeout(closeMessage, delay, callback);
}

function closeMessage(callback) {
    $(".overlay").removeClass("active");
    if (callback)
        callback();
}

function resetControls() {
    $(".game-cell").off("click").css("cursor", "default");
    $(".header p").css("opacity", 1);
    $(".header button").prop("disabled", false);
    $(".header input[type='radio']").prop("disabled", false);   
}

function cellClicked() {
    if (computerTurn)
        return;

    if ($(this).hasClass("empty")) {
        $(this).removeClass("empty").addClass(playerMark + "-square").off("click").css("cursor", "default");
        var row = $(this).parent().hasClass("top") ? 0 : $(this).parent().hasClass("middle") ? 1 : 2;
        var col = $(this).hasClass("left") ? 0 : $(this).hasClass("center") ? 1 : 2;
        grid[row][col] = playerMark;
    }

    if (gameWon(playerMark)) {
        showMessage("You Win!!", 2000, "#3333aa");
        resetControls();
    } else if (gameTied()) {
        showMessage("You Tied!!", 2000, "#33aa33");
        resetControls();
    } else {
        play();
    }
}

function pickSquare(move) {
    var row = move[0] == 0 ? "top" : move[0] == 1 ? "middle" : "bottom";
    var col = move[1] == 0 ? "left" : move[1] == 1 ? "center" : "right";
    var selector = "." + row + " ." + col;
    $(selector).removeClass("empty").addClass(computerMark + "-square").off("click").css("cursor", "default");
    grid[move[0]][move[1]] = computerMark;

    if (gameWon(computerMark)) {
        showMessage("You Lost!", 2000, "#aa3333");
        resetControls();
    } else if (gameTied()) {
        showMessage("You Tied!", 2000, "#33aa33");
        resetControls();
    }
    computerTurn = false;
}

function play() {
    var move;

    computerTurn = true;

    move = findWins(computerMark);

    if (!move)
        move = findWins(playerMark); // Find player win spots to block them

    if (!move)
        move = findBest();

    pickSquare(move);
}

function findWins(mark) {
    // Check rows and columns
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (grid[i][j] == "") {
                if ((grid[i][(j + 1) % 3] == mark && grid[i][(j + 2) % 3] == mark) ||
                    (grid[(i + 1) % 3][j] == mark && grid[(i + 2) % 3][j] == mark)) {
                    return [i, j];
                }
            }         
        }
    }

    // Check diagonals
    for (i = 0; i < 3; i++) {
        if (grid[i][i] == "") {
            if (grid[(i + 1) % 3][(i + 1) % 3] == mark &&
                grid[(i + 2) % 3][(i + 2) % 3] == mark)
                return [i, i];
        }

        if (grid[i][2 - i] == "") {
            if (grid[(i + 1) % 3][(4 - i) % 3] == mark &&
                grid[(i + 2) % 3][(3 - i) % 3] == mark)
                return [i, 2 - i];
        }
    }

    return null;
}

function findBest() {
    var cm = computerMark;
    var pm = playerMark;
    var wins = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

    if (aiLevel == 0) {
        while (true) {
            var square = Math.floor(Math.random() * 9);
            if (grid[parseInt(square / 3)][square % 3] == "")
                return [parseInt(square / 3), (square % 3)];
        }
    }

    // Calculate number of potential wins for the following move
    // Upper Left
    if (grid[0][0] == "") {
        wins[0]++;
        if ((grid[0][1] == cm && grid[0][2] == "") ||
            (grid[0][1] == "" && grid[0][2] == cm))
            wins[0]++;
        if ((grid[1][1] == cm && grid[2][2] == "") ||
            (grid[1][1] == "" && grid[2][2] == cm))
            wins[0]++;
        if ((grid[1][0] == cm && grid[2][0] == "") ||
            (grid[1][0] == "" && grid[2][0] == cm))
            wins[0]++;
    }

    // Upper Center
    if (grid[0][1] == "") {
        wins[1]++;
        if ((grid[0][0] == cm && grid[0][2] == "") ||
            (grid[0][0] == "" && grid[0][2] == cm))
            wins[1]++;
        if ((grid[1][1] == cm && grid[2][1] == "") ||
            (grid[1][1] == "" && grid[2][1] == cm))
            wins[1]++;
    }

    // Upper Right
    if (grid[0][2] == "") {
        wins[2]++;
        if ((grid[0][1] == cm && grid[0][0] == "") ||
            (grid[0][1] == "" && grid[0][0] == cm))
            wins[2]++;
        if ((grid[1][1] == cm && grid[2][0] == "") ||
            (grid[1][1] == "" && grid[2][0] == cm))
            wins[2]++;
        if ((grid[1][2] == cm && grid[2][2] == "") ||
            (grid[1][2] == "" && grid[2][2] == cm))
            wins[2]++;
    }

    // Center Left
    if (grid[1][0] == "") {
        wins[3]++;
        if ((grid[0][0] == cm && grid[2][0] == "") ||
            (grid[0][0] == "" && grid[2][0] == cm))
            wins[3]++;
        if ((grid[1][1] == cm && grid[1][2] == "") ||
            (grid[1][1] == "" && grid[1][2] == cm))
            wins[3]++;
    }

    // Center
    if (grid[1][1] == "") {
        wins[4]++;
        if ((grid[1][0] == cm && grid[1][2] == "") ||
            (grid[1][0] == "" && grid[1][2] == cm))
            wins[4]++;
        if ((grid[0][1] == cm && grid[2][1] == "") ||
            (grid[0][1] == "" && grid[2][1] == cm))
            wins[4]++;
        if ((grid[0][0] == cm && grid[2][2] == "") ||
            (grid[0][0] == "" && grid[2][2] == cm))
            wins[4]++;
        if ((grid[0][2] == cm && grid[2][0] == "") ||
            (grid[0][2] == "" && grid[2][0] == cm))
            wins[4]++;      
    }

    // Center Right
    if (grid[1][2] == "") {
        wins[5]++;
        if ((grid[0][2] == cm && grid[2][2] == "") ||
            (grid[0][2] == "" && grid[2][2] == cm))
            wins[5]++;
        if ((grid[1][0] == cm && grid[1][1] == "") ||
            (grid[1][0] == "" && grid[1][1] == cm))
            wins[5]++;
    }

    // Lower Left
    if (grid[2][0] == "") {
        wins[6]++;
        if ((grid[2][1] == cm && grid[2][2] == "") ||
            (grid[2][1] == "" && grid[2][2] == cm))
            wins[6]++;
        if ((grid[1][1] == cm && grid[0][2] == "") ||
            (grid[1][1] == "" && grid[0][2] == cm))
            wins[6]++;
        if ((grid[1][0] == cm && grid[0][0] == "") ||
            (grid[1][0] == "" && grid[0][0] == cm))
        wins[6]++;
    }

    // Lower Center
    if (grid[2][1] == "") {
        wins[7]++;
        if ((grid[2][0] == cm && grid[2][2] == "") ||
            (grid[2][0] == "" && grid[2][2] == cm))
            wins[7]++;
        if ((grid[0][1] == cm && grid[1][1] == "") ||
            (grid[0][1] == "" && grid[1][1] == cm))
            wins[7]++;
    }

    // Lower Right
    if (grid[2][2] == "") {
        wins[8]++;
        if ((grid[1][2] == cm && grid[0][2] == "") ||
            (grid[1][2] == "" && grid[0][2] == cm))
            wins[8]++;
        if ((grid[1][1] == cm && grid[0][0] == "") ||
            (grid[1][1] == "" && grid[0][0] == cm))
            wins[8]++;
        if ((grid[2][1] == cm && grid[2][0] == "") ||
            (grid[2][1] == "" && grid[2][0] == cm))
            wins[8]++;
    }

    // if any square gives us more than one potential win, take it
    for (var i = 0; i < 9; i++) {
        if (wins[i] > 1)
            return [parseInt(i / 3), (i % 3)];
    }

    // if center is open, take it
    if (grid[1][1] == "")
        return [1, 1];

    // if opponent has taken a corner, take the opposite corner
    if (grid[0][0] == pm && grid[2][2] == "")
        return [2, 2];

    if (grid[0][2] == pm && grid[2][0] == "")
        return [2, 0];

    if (grid[2][0] == pm && grid[0][2] == "")
        return [0, 2];

    if (grid[2][2] == pm && grid[0][0] == "")
        return [0, 0];

    // if opponent has the center and we have a corner, take the opposite corner
    if (grid[1][1] == pm) {
        if (grid[0][0] == cm && grid[2][2] == "")
            return [2, 2];
        if (grid[2][2] == cm && grid[0][0] == "")
            return [0, 0];
        if (grid[0][2] == cm && grid[2][0] == "")
            return [2, 0];
        if (grid[2][0] == cm && grid[0][2] == "")
            return [0, 2];
    }

    // if opponent has center and a corner, take a corner (top ai level)
    if (aiLevel == 2) {
        if (grid[1][1] == pm) {
            if (grid[0][0] == pm || grid[0][2] == pm || grid[2][0] == pm || grid[2][2] == pm) {
                if (grid[0][0] == "")
                    return [0, 0];
                if (grid[0][2] == "")
                    return [0, 2];
                if (grid[2][0] == "")
                    return [2, 0];
                if (grid[2][2] == "")
                    return [2, 2];
            }
        }
    }

    // if opponent has taken two adjacent middle sides, take the corner between
    if (grid[0][1] == pm && grid[1][0] == pm && grid[0][0] == "")
        return [0, 0];

    if (grid[1][0] == pm && grid[2][1] == pm && grid[2][0] == "")
        return [2, 0];

    if (grid[1][2] == pm && grid[2][1] == pm && grid[2][2] == "")
        return [2, 2];

    if (grid[0][1] == pm && grid [1][2] == pm && grid[0][2] == "")
        return [0, 2];

    // Take any square with a win possibility
    for (i = 0; i < 9; i++)
        if (wins[i] > 0)
            return [parseInt(i / 3), (i % 3)];

    // Take the first open square
    for (i = 0; i < 9; i++)
        if (grid[parseInt(i / 3)][(i % 3)] == "")
            return [parseInt(i / 3), (i % 3)];
}

function gameWon(mark) {
    for (var i = 0; i < 3; i++) {
        if (grid[i][0] == mark && grid[i][1] == mark && grid[i][2] == mark)
            return true;

        if (grid[0][i] == mark && grid[1][i] == mark && grid[2][i] == mark)
            return true;
    }

    if (grid[0][0] == mark && grid[1][1] == mark && grid[2][2] == mark)
        return true;

    if (grid[0][2] == mark && grid[1][1] == mark && grid[2][0] == mark)
        return true;

    return false;
}

function gameTied() {
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            if (grid[i][j] == "")
                return false;
    return true;
}