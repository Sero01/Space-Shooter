//create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 710;
document.getElementById("gameArea").appendChild(canvas);
ctx.font = "20px Arial";
ctx.fillStyle = "white";

//load image
var shipImage = new Image();
var bulletImage = new Image();
var enemyImage = new Image();
shipImage.src = "images/ship.png";
bulletImage.src = "images/bullet.png";
enemyImage.src = "images/enemy.png";

//create the ship game object
var ship = {
    width: 70,
    height: 70,
    x: canvas.width/2 - 35,
    y: canvas.height - 80,
    speed: 300
};

//create bullet game object
var bullet = [];

//create enemy game object
var enemy = [];

//handle keyboard input
var keysDown = {};
// Check for keys pressed where key represents the keycode captured
addEventListener("keydown", function (event) {
  keysDown[event.key] = true;
});
addEventListener("keyup", function (event) {
  delete keysDown[event.key];
});

//draw the image
function load(){
     ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
     ctx.drawImage(bulletImage, bullet.x,bullet.y,bullet.width, bullet.height);
}

//update the game every frame
var frame = 0;
var count = 0;
function update(){
    if(keysDown.ArrowLeft && ship.x > 0){
        ship.x -= ship.speed*0.02;
    }
    if(keysDown.ArrowRight && ship.x < canvas.width - ship.width){
        ship.x += ship.speed*0.02;
    }

    //shoot bullets every 20 frames
    frame++;
    if(frame%20 == 0){
        bullet.push({
            width: 10,
            height: 10,
            x: ship.x+30,
            y: ship.y});
    }

    //spawn enemies every 100 frames
    if(frame%70 == 0){
        enemy.push({
        width: 30,
        height: 30,
        x: Math.floor(Math.random()*(canvas.width-60)+15),
        y: 0});
    }

    //update bullet position and delete those which go out of frame
    bullet.forEach(function(bulletObject){
        bulletObject.y -= 10;
        ctx.drawImage(bulletImage, bulletObject.x,bulletObject.y,bulletObject.width, bulletObject.height);
        if(bulletObject.y < 0){
            bullet.splice(bullet.indexOf(bulletObject),1);
        }
    }, this);

    //update enemy position and delete those which go out of frame
    enemy.forEach(function(enemyObject){
        enemyObject.y += 1;
        ctx.drawImage(enemyImage, enemyObject.x, enemyObject.y, enemyObject.width, enemyObject.height);
        if(enemyObject.y > canvas.height){
            enemy.splice(enemy.indexOf(enemyObject),1);
        }
    }, this);
    //check for collision between bullet and enemy
    bullet.forEach(function(bulletObject){
        enemy.forEach(function(enemyObject){
            if(bulletObject.x > enemyObject.x-5 && bulletObject.x < enemyObject.x + enemyObject.width && bulletObject.y > enemyObject.y && bulletObject.y < enemyObject.y + enemyObject.height){
                bullet.splice(bullet.indexOf(bulletObject),1);
                enemy.splice(enemy.indexOf(enemyObject),1);
                count+=1;
                console.log(count);
            }
        }, this);
    } , this);
    ctx.fillText("Score: " + count, 10, 50);
}
//main driver function
var main = function(){  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    load();
    requestAnimationFrame(main);
};
main();