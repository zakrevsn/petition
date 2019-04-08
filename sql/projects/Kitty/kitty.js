(function() {
    var kitties = document.getElementsByClassName("kitty");
    var cur = 0;
    var dots = document.querySelectorAll("nav div");
    var timer = setTimeout(moveKitties, 5000, 1);

    dots.forEach(function(dot, i) {
        dot.addEventListener("click", function() {
            if (i == cur) {
                return;
            }
            clearTimeout(timer);
            moveKitties(i);
        });
    });

    function transend(e) {
        e.target.classList.remove("exit");
        e.target.removeEventListener("transitionend", transend);
        var next = cur + 1;
        if (next >= kitties.length) {
            next = 0;
        }
        clearTimeout(timer);
        timer = setTimeout(moveKitties, 5000, next);
    }

    function moveKitties(next) {
        kitties[cur].addEventListener("transitionend", transend);
        kitties[cur].classList.remove("onscreen");
        dots[cur].classList.remove("onscreen");
        kitties[cur].classList.add("exit");

        kitties[next].classList.remove("exit");
        kitties[next].classList.add("onscreen");
        dots[next].classList.add("onscreen");
        cur = next;
    }
})();
