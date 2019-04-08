var hamburger = document.querySelector("#hamburger");
var hamburgerMenu = document.querySelector("#hamburger-menu");
var menu = document.querySelector("#menu");
var x = document.querySelector("#x");


hamburger.addEventListener("click", function() {
    hamburgerMenu.classList.add("on");
    menu.classList.add("on");

});

x.addEventListener("click", function() {
    hamburgerMenu.classList.remove("on");
    menu.classList.remove("on");
});

hamburgerMenu.addEventListener("click", function() {
    hamburgerMenu.classList.remove("on");
    menu.classList.remove("on");
});

$(document).ready(function(){
    $("#popUpx").on('click', function(){
        $("#popUpContainer").hide();
    });

    setTimeout(function(){
        $("#popUpContainer").css("display", "grid");
    }, 1000);
});
