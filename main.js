//create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d", {alpha: false});
var game;
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

//handle keyboard input
var keysDown = {};
var keyPress = {};
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

//draw the image
function load(){
    ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height);
}

//update the game every frame
var frame = 0;
var count = 0;
var deathCount = 0;
var enemyspeedmodifier = 0;
function update(){
    if(game){
        window.cancelAnimationFrame(game);
    }
    if(keysDown.ArrowLeft && ship.x > 0){
        ship.x -= ship.speed*0.02;
    }
    if(keysDown.ArrowRight && ship.x < canvas.width - ship.width){
        ship.x += ship.speed*0.02;
    }

    //increase speed modifier every 200 frames
    if(frame%200 == 0){
        enemyspeedmodifier+=0.1;
    }

    //shoot bullets every 20 frames
    frame++;
    if(frame%20==0){
        bullet.push({
            width: 10,
            height: 10,
            x: ship.x+30,
            y: ship.y});
            document.getElementById("shoot").play();
    }

    //spawn enemies every 70 frames
    if(frame%(70) == 0){
        enemy.push({
        width: 30,
        height: 30,
        speed:1+enemyspeedmodifier,
        x: Math.floor(Math.random()*(canvas.width-60)+15),
        y: 0});
    }

    //spawn big enemies every 150 frames
    if(frame%(150) == 0){
        enemy.push({
        width: 50,
        height: 50,
        speed: 2+enemyspeedmodifier,
        x: Math.floor(Math.random()*(canvas.width-60)+15),
        y: 0});
    }

    //increase speed of enemies every 200 frames
    if(frame%10 == 0){
        enemy.speed=10;
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
                document.getElementById("life3").style.opacity="0.2";
            }
            if(deathCount==2){
                document.getElementById("life2").style.opacity="0.2";
            }
            if(deathCount==3){
                document.getElementById("life1").style.opacity="0.2";
            }
        }
    }, this);
    
    //check for collision between bullet and enemy
    var highscore = localStorage.getItem("highscore");
    bullet.forEach(function(bulletObject){
        enemy.forEach(function(enemyObject){
            if(bulletObject.x > enemyObject.x-5 && bulletObject.x < enemyObject.x + enemyObject.width && bulletObject.y > enemyObject.y && bulletObject.y < enemyObject.y + enemyObject.height){
                bullet.splice(bullet.indexOf(bulletObject),1);
                enemy.splice(enemy.indexOf(enemyObject),1);
                count++;
                //check for highscore
                if(count>highscore){
                    highscore = count;
                    localStorage.setItem("highscore", highscore);
                }
                document.getElementById("explosion").play();
            }
        }, this);
    } , this);
    document.getElementById("highscore").innerHTML = "HighScore:" + highscore;
    document.getElementById("score").innerHTML = "Score:" + count;

    //delete all bullets and enemies when game is over
    if(deathCount == 3){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("Game Over!", canvas.width/2 - 50, canvas.height/2);
        ctx.fillText("Click Replay to Play Again", canvas.width/2 - 100, canvas.height/2+50);
    }
    else{
        game = window.requestAnimationFrame(main);
    }
}
//replay function
function replay(){  
    deathCount = 0;
    ship.x = canvas.width/2 - 35;
    ship.y = canvas.height - 80;
    enemy.length = 0;
    bullet.length = 0;
    count = 0;
    enemyspeedmodifier = 0;
    document.getElementById("life1").style.visibility="visible";
    document.getElementById("life2").style.visibility="visible";
    document.getElementById("life3").style.visibility="visible";
    game = window.requestAnimationFrame(main);
}
//main driver function
var main = function(){  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    load();
};
localStorage.setItem("highscore", highscore);
main();