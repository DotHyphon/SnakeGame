const Directions = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
};

class Object {
    constructor(x, y, size, color, active) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.active = active;
    }

    get pos() {
        return { x: this.x, y: this.y };
    }

    set pos(newPos) {
        this.x = newPos.x;
        this.y = newPos.y;
    }

    padding = 2;

    draw() {
        if (this.active) {
        mainCtx.fillStyle = this.color;
        mainCtx.fillRect(this.x - (this.size - this.padding) * 0.5, this.y - (this.size - this.padding) * 0.5, this.size - this.padding, this.size - this.padding);
        }
    }
}

const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");
window.addEventListener("keydown", this.handleInput);
document.getElementById("play").addEventListener("click", startGame);
document.getElementById("retry").addEventListener("click", reset);

let paused = true;
//frame delay in ms - set in reset()
let updateTime = 0;
let snakeSize = 30;
for (i = 0; i < snakeSize; i++) {
    if (mainCanvas.width % snakeSize === 0) {
        break;
    }
    snakeSize--;
}

const snakeBody = [];
const snake = new Object(0, 0, snakeSize, "rgb(0, 0, 0)", true);
const snakeFood = new Object(0, 0, snakeSize, "rgb(255, 0, 0)", false);


function update() {
    if (snake.x + snake.y == 0)
    {
        snake.pos = {x: snakeSize * 0.5, y: snakeSize * 0.5};
    } else {
        switch (snake.direction) {
            case Directions.Up:
                snake.y -= snakeSize;
                break;
            case Directions.Down:
                snake.y += snakeSize;
                break;
            case Directions.Left:
                snake.x -= snakeSize;
                break;
            case Directions.Right:
                snake.x += snakeSize;
                break;
        }
    }

    snakeBody.push(new Object(snake.x, snake.y, snake.size, snake.color, true));

    if (snakeBody.length > snake.length) {
        snakeBody.shift();
        console.log(snakeBody.length);
    }  
        
    snakeFood.active ? null : spawnFood();

    checkCollision() ? null : draw();

    //check if paused otherwise update
    setTimeout(() => checkPaused() , updateTime);
}

function checkPaused() {
    paused ? setTimeout(() => checkPaused(), 1000) : update();
}

function startGame() {
    reset();
    update();
    document.getElementById("play").style.display = "none";
}

function endGame() {
    paused = true;
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("retry").style.display = "block";
}

//all default values
function reset() {
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("retry").style.display = "none";

    paused = false;
    updateTime = 200;
    snake.length = 1;
    snake.pos = {x: 0, y: 0};
    snake.direction = Directions.Right;
    snakeFood.active = false;
    snakeBody.splice(0,snakeBody.length);
    snakeBody.push(new Object(snake.x, snake.y, snake.size, snake.color, true));
}

function spawnFood() {
    snakeFood.x = Math.floor(Math.random() * mainCanvas.width / snakeSize) * snakeSize + snakeSize * 0.5;
    snakeFood.y = Math.floor(Math.random() * mainCanvas.height / snakeSize) * snakeSize + snakeSize * 0.5;

    snakeBody.forEach((bodyPart) => {
        if (bodyPart.x === snakeFood.x && bodyPart.y === snakeFood.y) {
            console.log('food spawned on snake');
            spawnFood();
        }
    });
    snakeFood.active = true;
}

function checkCollision() {
    let collided = false;
    if (snake.x - snakeSize*0.5 < 0 || snake.x + snakeSize*0.5 > mainCanvas.width) {
        console.log('hit left or right wall');
        collided = true;
        endGame();
    }
    else if (snake.y - snakeSize*0.5 < 0 || snake.y + snakeSize*0.5 > mainCanvas.height) {
        console.log('hit top or bottom wall');
        collided = true;
        endGame();
    }

    if (snake.x === snakeFood.x && snake.y === snakeFood.y) {
        snake.length++;
        snakeFood.active = false;
        updateTime *= 0.9;
    }

    paused = collided;
    return collided;
}

function draw() {
    //clear canvas
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    //draw snake
    snakeBody.forEach((bodyPart, index) => {
        snakeBody[index].draw();
    });
    

    //draw snakefood
    snakeFood.draw();
}

function drawObject(object) {
    mainCtx.fillRect(object.x - snakeSize*0.5, object.y - snakeSize*0.5, snakeSize, snakeSize);
}

function handleInput(e) {
    if (e.key === "ArrowUp" && snake.direction !== Directions.Down) {
        snake.direction = Directions.Up;
    }
    else if (e.key === "ArrowDown" && snake.direction !== Directions.Up) {
        snake.direction = Directions.Down;
    } 
    else if (e.key === "ArrowLeft" && snake.direction !== Directions.Right) {
        snake.direction = Directions.Left;
    }
    else if (e.key === "ArrowRight" && snake.direction !== Directions.Left) {
        snake.direction = Directions.Right;
    }
    else if (e.key === " ") {
        paused = !paused;
    }

    //add touch controls for mobile
}




