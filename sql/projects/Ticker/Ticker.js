$(document).ready(function() {
    var headline = $("#headlines");
    var left = headline.offset().left;

    function animate() {
        left = left - 2;
        var link = $("a").first();
        if (left <= -link.outerWidth()) {
            link.remove();
            headline.append(link);
            left = 0;
        }
        headline.css("left", left + "px");

        a = requestAnimationFrame(animate);
    }
    animate();
    var a;
    headline.on("mouseenter", function() {
        cancelAnimationFrame(a);
    });
    headline.on("mouseleave", function() {
        animate();
    });
});
