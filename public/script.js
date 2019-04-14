var canvas = document.getElementById("canvas");
var clientX;
var clientY;
var ctx = canvas.getContext("2d");
var signature = document.getElementById("signature");

canvas.addEventListener("mousedown", function(evt) {
    clientX = evt.offsetX;
    clientY = evt.offsetY;
});
canvas.addEventListener("mouseup", function() {
    clientX = undefined;
    clientY = undefined;
});
canvas.addEventListener("mousemove", function(evt) {
    if (clientX == undefined && clientY == undefined) {
        return;
    }
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
    ctx.strokeStyle = "green";
    ctx.lineTo(evt.offsetX, evt.offsetY);
    ctx.lineWidth = 3;
    ctx.stroke();
    clientX = evt.offsetX;
    clientY = evt.offsetY;
    var dataURL = canvas.toDataURL();
    signature.value = dataURL;
});
canvas.addEventListener("touchstart", function(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    // from https://stackoverflow.com/a/18794913
    var viewportOffset = canvas.getBoundingClientRect();
    var top = viewportOffset.top;
    var left = viewportOffset.left;
    clientX = touches[0].clientX - left;
    clientY = touches[0].clientY - top;
});
canvas.addEventListener("touchend touchcancel", function(evt) {
    evt.preventDefault();
    clientX = undefined;
    clientY = undefined;
});
canvas.addEventListener("touchmove", function(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    // from https://stackoverflow.com/a/18794913
    var viewportOffset = canvas.getBoundingClientRect();
    var top = viewportOffset.top;
    var left = viewportOffset.left;
    if (clientX == undefined && clientY == undefined) {
        return;
    }
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
    ctx.strokeStyle = "green";
    ctx.lineTo(touches[0].clientX - left, touches[0].clientY - top);
    ctx.lineWidth = 3;
    ctx.stroke();
    clientX = touches[0].clientX - left;
    clientY = touches[0].clientY - top;
    var dataURL = canvas.toDataURL();
    signature.value = dataURL;
});

if (signature.value) {
    // from https://stackoverflow.com/a/4776378
    var img = new Image();
    img.addEventListener("load", function() {
        ctx.drawImage(img, 0, 0);
    });
    img.src = signature.value;
}
