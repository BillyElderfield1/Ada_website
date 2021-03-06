const canvasX = 600;
const canvasY = 600;
var gameState = "menu";
var options = {spZombies: true, irSpeed: true}
var optionButtons = [new GameOption(canvasX/3 + 30, canvasY/3 - 15, "endless"), new GameOption(canvasX/3 + 155, canvasY/3 - 15, "survival"), new Option(canvasX/3 + 20, canvasY/3 + 15, "spZombies"), new Option(canvasX/3 + 20, canvasY/3 + 50, "irSpeed")];
var player = new Player(canvasX, canvasY);
var bullets = [];
var deadBullets = [];
var zombies = [new BasicZombie(canvasX, canvasY)];
var deadZombies = [];
var wave = 1;
var kills = 0;
var startTime = 0;
var currentTime = 0;
var respawnTimer = 0;
var respawnRate = 500;

function setup(){
    createCanvas(canvasX, canvasY)
  }
  
function draw(){
    let endTime = performance.now();
    background(100);
    switch(gameState){
        case "menu":
            textAlign(CENTER);
            textSize(15);
            text("Use WASD to move and the mouse to shoot.", canvasX/2, canvasY/5);
            text("Choose game mode and options:", canvasX/2, canvasY/4);
            text("Endless", canvasX/3, canvasY/3);
            text("Survival", canvasX/3 + 200, canvasY/3);
            textSize(10);
            text("special\nzombies", canvasX/3 - 5, canvasY/3 + 20);
            text("increase\nrespawn\nspeed", canvasX/3 - 5, canvasY/3 + 50);
            updateOptions();
            player.update();
            updateBullets();
            removeDeadBullets();
            deadBullets = [];
            return;
        case "endless":
            player.update();
            textAlign(LEFT);
            textSize(15);
            currentTime = endTime - startTime;
            text("Time: " + (formatTime(currentTime)), 10, 25);
            text("kills: " + kills, 10, 40);
            updateZombies();
            updateBullets();
            removeDeadBullets();
            removeDeadZombies();
            deadBullets = [];
            deadZombies = [];
            let currnetTime = performance.now();
            if(currnetTime - respawnTimer > respawnRate) spawnZombie();
            return;
        case "over":
            player.update();
            updateZombies();
            updateBullets();
            textSize(15);
            text("Time: " + (formatTime(currentTime)), 10, 25);
            text("kills: " + kills, 10, 40);
            text("Game Over", canvasX/2 - 30, canvasY/2 - 20);
            return;
    }
}

function keyPressed(){
    changeMovementState();
}

function keyReleased(){
    changeMovementState();
}

function mousePressed(){
    if (player.alive) player.shoot();
}

function changeMovementState(){
    switch(key){
        case "w":
            return player.up = !player.up;
        case "a":
            return player.left = !player.left;
        case "s":
            return player.down = !player.down;
        case "d":
            return player.right = !player.right;
    }
}

//Finds the bearing between two objects with south being 0.
function track(fromX, fromY, toX, toY){
    let relativeX = toX - fromX;
    let relativeY = fromY - toY;
    let relativeAngle = Math.asin(sqrt(relativeX ** 2) / sqrt((relativeX)**2 + ((relativeY)**2)));
    if(relativeX < 0 && relativeY <= 0){
        return relativeAngle;
    }
    else if(relativeX < 0 && relativeY > 0){
        return Math.PI - relativeAngle;
    }
    else if(relativeX > 0, relativeY > 0){
        return Math.PI + relativeAngle;
    }
    else if(relativeX > 0, relativeY <= 0){
        return Math.PI * 2 - relativeAngle;
    }
}

//Calculates the X and Y component velocities needed to go in the angle and with the resultant velocity specified.
function calculateVelocities(trackAngle,  maxVelocity){
    let velocityX = -maxVelocity * Math.sin(trackAngle);
    let velocityY = -maxVelocity * Math.cos(trackAngle);
    return [velocityX, velocityY];
}

function updateZombies(){
    for(let i = 0; i < zombies.length; i++){
        zombies[i].update(player.positionX, player.positionY);
        if (checkCollision(player, zombies[i])){
            for(let i = 0; i < zombies.length; i++){
                zombies[i].moving = false;
            }
            for(let i = 0; i < bullets.length; i++){
                bullets[i].moving = false;
            }
            player.alive = false;
            gameState = "over";
        }
    }
}

function updateBullets(){
    for(let i = 0; i < bullets.length; i++){
        if(!bullets[i].checkInBounds()) deadBullets.push(i);
        else{
            switch(gameState){
                case "endless":
                case "survival":
                    for(let zombie = 0; zombie < zombies.length; zombie++){
                        if (checkCollision(bullets[i], zombies[zombie])){
                            zombies[zombie].hp -= 1;
                            if (zombies[zombie].hp <= 0){
                                deadZombies.push(zombie);
                                kills ++;
                            }
                            deadBullets.push(i);
                        }
                    }
                    break;
                case "menu":
                    for(let option = 0; option < optionButtons.length; option++){
                        if(checkCollision(bullets[i], optionButtons[option])){
                            optionButtons[option].changeState();
                            deadBullets.push(i);
                        }
                    }
            }
        }
        bullets[i].update();
    }
}

function checkCollision(obj1, obj2){
    switch(obj2.shape){
        case "square":
            if(obj1.positionX <= (obj2.positionX + obj2.size) && obj1.positionX >= (obj2.positionX)
            && obj1.positionY >= (obj2.positionY) && obj1.positionY <= (obj2.positionY + obj2.size)) return true; else return false;
        case "circle":
            if(sqrt((obj1.positionX - obj2.positionX)**2 + (obj1.positionY - obj2.positionY)**2) <= obj2.size/2) return true; else return false;
    }
}

function spawnZombie(){
    let randNum = Math.random()
        if (!options.spZombies || randNum < 0.85){
            zombies.push(new BasicZombie(canvasX, canvasY));
        }
        else if (randNum < 0.95){
            zombies.push(new Sprinter(canvasX, canvasY));
        }
        else{
            zombies.push(new BigZombie(canvasX, canvasY));
        }
        if (options.irSpeed) respawnRate --;
        respawnTimer = performance.now();
}

function updateOptions(){
    for(let i = 0; i < optionButtons.length; i++){
        optionButtons[i].update();
    }
}

function removeDeadBullets(){
    deadBullets.sort();
    let count = 0;
    for(let i = 0; i < deadBullets.length; i++){
        bullets.splice(deadBullets[i + count], 1);
        count ++;
    }
}

function removeDeadZombies(){
    deadZombies.sort();
    let count = 0;
    for(let i = 0; i < deadZombies.length; i++){
        zombies.splice(deadZombies[i + count], 1);
        count ++;
    }
}

function formatTime(milliseconds){
    let minutesTens = Math.floor((milliseconds/600000%10));
    let minutesUnits = Math.floor((milliseconds/60000%10));
    let secondsTens = Math.floor(((milliseconds%60000)/10000)%10);
    let secondsUnits = Math.floor(((milliseconds%60000)/1000)%10);
    return `${minutesTens}${minutesUnits}:${secondsTens}${secondsUnits}`;
}
