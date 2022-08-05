//create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d", {alpha: false});
canvas.width = 400;
canvas.height = 710;
document.getElementById("gameArea").appendChild(canvas);
ctx.font = "20px Arial";
ctx.fillStyle = "white";

//load image
var shipImage = new Image();
var bulletImage = new Image();
var enemyImage = new Image();
var enemy2Image = new Image();
var lifeImage = new Image();
shipImage.src = "images/ship.png";
bulletImage.src = "images/bullet.png";
enemyImage.src = "images/enemy.png";
lifeImage.src = "images/lives.png";
enemy2Image.src = "images/enemy2.png";

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
var enemy2 = [];

//create life object
var life = [];

//handle keyboard input
var keysDown = {};
// Check for keys pressed where key represents the keycode captured
addEventListener("keydown", function (event) {
  keysDown[event.key] = true;
});
addEventListener("keyup", function (event) {
  delete keysDown[event.key];
});
addEventListener("click", function(){
    enemy.y=0;
});

//draw lives
for(let i=deathCount;i<4;i++){
    life.push({
        x: canvas.width - i*50,
        y: 0,
        width: 50,
        height: 50});
    }
 life.forEach(function(lifeObject){
    ctx.drawImage(lifeImage, lifeObject.x, lifeObject.y, lifeObject.width, lifeObject.height);
 },this);

//draw the image
function load(){
     ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
}
//update the game every frame
var frame = 0;
var count = 0;
var deathCount = 0;
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

    //spawn enemies every 70 frames
    if(frame%70 == 0){
        enemy.push({
        width: 30,
        height: 30,
        speed:1,
        x: Math.floor(Math.random()*(canvas.width-60)+15),
        y: 0});
    }

    //spawn big enemies every 150 frames
    if(frame%150 == 0){
        enemy.push({
        width: 50,
        height: 50,
        speed: 2,
        x: Math.floor(Math.random()*(canvas.width-60)+15),
        y: 0});
    }
    //update bullet position and delete those which go out of frame
    bullet.forEach(function(bulletObject){
        bulletObject.y -= 10;
        ctx.drawImage(bulletImage, bulletObject.x,bulletObject.y,bulletObject.width, bulletObject.height);
        if(bulletObject.y < 50){
            bullet.splice(bullet.indexOf(bulletObject),1);
        }
    }, this); 
 
    //update enemy position and delete those which go out of frame
    enemy.forEach(function(enemyObject){
        enemyObject.y += enemyObject.speed;
        ctx.drawImage(enemyImage, enemyObject.x, enemyObject.y, enemyObject.width, enemyObject.height);
        if(enemyObject.y > canvas.height){
            enemy.splice(enemy.indexOf(enemyObject),1);
            //if enemy goes out of frame, increase death count and remove a life
            deathCount++;
            if(deathCount==1){
                document.getElementById("life1").remove();
            }
            if(deathCount==2){
                document.getElementById("life2").remove();
            }
            if(deathCount==3){
                document.getElementById("life3").remove();
            }
        }
    }, this);
    
    //check for collision between bullet and enemy
    bullet.forEach(function(bulletObject){
        enemy.forEach(function(enemyObject){
            if(bulletObject.x > enemyObject.x-5 && bulletObject.x < enemyObject.x + enemyObject.width && bulletObject.y > enemyObject.y && bulletObject.y < enemyObject.y + enemyObject.height){
                bullet.splice(bullet.indexOf(bulletObject),1);
                enemy.splice(enemy.indexOf(enemyObject),1);
                count++;
            }
        }, this);
    } , this);
    document.getElementById("score").innerHTML = "Score:" + count;


    //delete all bullets and enemies when game is over
    if(deathCount == 3){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("Game Over", canvas.width/2 - 50, canvas.height/2);
    }
    else{
        window.requestAnimationFrame(main);
    }
}
//main driver function
var main = function(){  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    load();
};
main();