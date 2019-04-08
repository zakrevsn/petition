var currentPlayer = "player1";
$(document).ready(function() {
    $(".column").on("click", function(e) {
        var currentSlot = getCurrentSlot($(e.currentTarget));
        if (currentSlot == null) {
            return;
        }
        currentSlot.addClass(currentPlayer);
        currentSlot.removeClass(currentPlayer + "-preview");
        if (checkGameOver()) {
            var winText;
            if (currentPlayer == "player1") {
                winText = "It's 🍕 time!";
            } else {
                winText = "It's 🍔 time!";
            }
            $("#result").html(winText);
            $(".winnerM").fadeIn();
        } else if (checkDraw()) {
            winText = "It's a draw!";
            $("#result").html(winText);
            $(".winnerM").fadeIn();
        }
        switchPlayer();
    });
    $("button").on("click", function() {
        resetGame();
    });
    $(".winnerM").on("click", function() {
        $(".winnerM").fadeOut();
        resetGame();
    });
    $(".column").on("mouseenter", function(e) {
        var currentSlot = getCurrentSlot($(e.currentTarget));
        if (currentSlot == null) {
            return;
        }
        currentSlot.addClass(currentPlayer + "-preview");
    });
    $(".column").on("mouseleave", function(e) {
        var currentSlot = getCurrentSlot($(e.currentTarget));
        if (currentSlot == null) {
            return;
        }
        currentSlot.removeClass(currentPlayer + "-preview");
    });
});
function switchPlayer() {
    if (currentPlayer == "player1") {
        currentPlayer = "player2";
    } else {
        currentPlayer = "player1";
    }
}
function getSlot(c, r) {
    var slot = $(".column")
        .eq(c)
        .find(".slot")
        .eq(r);
    if (slot.length == 0 || c < 0 || r < 0) {
        return null;
    }
    if (slot.hasClass("player1")) {
        return "player1";
    }
    if (slot.hasClass("player2")) {
        return "player2";
    }
    return "empty";
}
function checkLine(c, r, stepX, stepY) {
    var start = getSlot(c, r);
    if (start == null || start == "empty") {
        return false;
    }
    for (var i = 0; i <= 2; i++) {
        c = c + stepX;
        r = r + stepY;
        if (start != getSlot(c, r)) {
            return false;
        }
    }
    return true;
}
function checkGameOverH() {
    for (var i = 0; i <= 5; i++) {
        for (var j = 0; j <= 3; j++) {
            if (checkLine(j, i, 1, 0)) {
                return true;
            }
        }
    }
    return false;
}
function checkGameOverV() {
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 6; j++) {
            if (checkLine(j, i, 0, 1)) {
                return true;
            }
        }
    }
    return false;
}
function checkGameOverDdown() {
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 3; j++) {
            if (checkLine(j, i, 1, 1)) {
                return true;
            }
        }
    }
    return false;
}
function checkGameOverDup() {
    for (var i = 3; i <= 5; i++) {
        for (var j = 0; j <= 3; j++) {
            if (checkLine(j, i, 1, -1)) {
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    return (
        checkGameOverH() ||
        checkGameOverV() ||
        checkGameOverDdown() ||
        checkGameOverDup()
    );
}
function checkDraw() {
    if ($(".player1").length + $(".player2").length == 42) {
        return true;
    }
    return false;
}
function resetGame() {
    $(".player1").removeClass("player1");
    $(".player2").removeClass("player2");
    currentPlayer = "player1";
}
function getCurrentSlot(column) {
    var curSlots = column.find(".slot");
    for (var i = 5; i >= 0; i--) {
        if (
            !curSlots.eq(i).hasClass("player1") &&
            !curSlots.eq(i).hasClass("player2")
        ) {
            return curSlots.eq(i);
        }
    }
    return null;
}
