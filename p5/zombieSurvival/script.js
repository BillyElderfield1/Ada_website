class Player{
    constructor(){
        this.positionX = canvasX / 2;
        this.positionY = canvasY / 2;
        this.size = 20;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.velocity = 2;
        this.lookAngle = 0;
        this.relativeX = 0;
        this.relativeY = 0;
    }

    update(){
        this.turn();
        this.move();
        this.render();
    }

    render(){
        push();
        translate(this.positionX, this.positionY);
        rotate(this.lookAngle);
        fill("black");
        stroke("black");
        ellipse(0, 0, this.size, this.size);
        rect(0 - (this.size / 6), 0, 5, 15);
        pop();
    }

    move(){
        if(this.up){
            this.positionY -= this.velocity;
        }
        if(this.down){
            this.positionY += this.velocity;
        }
        if(this.left){
            this.positionX -= this.velocity;
        }
        if(this.right){
            this.positionX += this.velocity;
        }
    }

    turn(){
        this.relativeX = mouseX - this.positionX;
        this.relativeY = this.positionY - mouseY;
        let relativeAngle = Math.asin(sqrt(this.relativeX ** 2) / sqrt((this.relativeX)**2 + ((this.relativeY)**2)))
        if(this.relativeX < 0 && this.relativeY < 0){
            this.lookAngle = relativeAngle;
        }
        else if(this.relativeX < 0 && this.relativeY > 0){
            this.lookAngle = Math.PI - relativeAngle;
        }
        else if(this.relativeX > 0, this.relativeY > 0){
            this.lookAngle = Math.PI + relativeAngle;
        }
        else if(this.relativeX > 0, this.relativeY < 0){
            this.lookAngle = Math.PI * 2 - relativeAngle;
        }
    }

    shoot(){
        let lookAngleDeg = this.lookAngle * (180 / Math.PI);
        if(lookAngleDeg >= 22.5 && lookAngleDeg < 67.5){
            var velocityX = -5;
            var velocityY = -5;
        }
        else if(lookAngleDeg >= 67.5 && lookAngleDeg < 112.5){
            var velocityX = -5;
            var velocityY = 0;
        }
        else if(lookAngleDeg >= 112.5 && lookAngleDeg < 157.5){
            var velocityX = -5;
            var velocityY = 5;
        }
        else if(lookAngleDeg >= 157.5 && lookAngleDeg < 202.5){
            var velocityX = 0;
            var velocityY = 5;
        }
        else if(lookAngleDeg >= 202.5 && lookAngleDeg < 247.5){
            var velocityX = 5;
            var velocityY = 5;
        }
        else if(lookAngleDeg >= 247.5 && lookAngleDeg < 292.5){
            var velocityX = 5;
            var velocityY = 0;
        }
        else if(lookAngleDeg >= 112.5 && lookAngleDeg < 337.5){
            var velocityX = 5;
            var velocityY = -5;
        }
        else if(lookAngleDeg >= 337.5 && lookAngleDeg <= 360 || lookAngleDeg >= 0 && lookAngleDeg <= 22.5 ){
            var velocityX = 0;
            var velocityY = -5;
        }
        bullets.push(new Bullet(this.positionX, this.positionY, velocityX, velocityY));
    }
}

class Bullet{
    constructor(positionX, positionY, velocityX, velocityY){
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    update(){
        this.move();
        this.render();
    }

    render(){
        ellipse(this.positionX, this.positionY, 5, 5);
        fill("black");
    }

    move(){
        this.positionX += this.velocityX;
        this.positionY -= this.velocityY;
    }
}

const canvasX = 600;
const canvasY = 600;
var player = new Player();
var bullets = [];

function setup(){
    createCanvas(canvasX, canvasY)
  }
  
function draw(){
    background(100);
    player.update();
    for(let i = 0; i < bullets.length; i++){
        bullets[i].update();
    }
}

function keyPressed(){
    changeMovementState();
}


function keyReleased(){
    changeMovementState();
}

function mousePressed(){
    player.shoot();
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
