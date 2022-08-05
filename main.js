var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");

var shipReady = false;
var shipImage = new Image();
shipImage.onload = function () {
    shipReady = true;
};
shipImage.src = "images/ship.png";