const Directions = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
};

const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");
window.addEventListener("keydown", this.handleInput);

let paused = false;

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

    draw() {
        if (this.active) {
        mainCtx.fillStyle = this.color;
        mainCtx.fillRect(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size);
        }
    }
}

const snakeBody = [];
let gameSpeed = 1;
let snakeLength = 1;

let snakeSize = 52;
for (i = 0; i < snakeSize; i++) {
    if (mainCanvas.width % snakeSize === 0) {
        break;
    }
    snakeSize--;
}

const snake = new Object(0, 0, snakeSize, "rgb(0, 0, 0)", true);

const snakeFood = new Object(0, 0, snakeSize, "rgb(150, 150, 150)", false);

snakeBody.push(new Object(snake.x, snake.y, snake.size, snake.color, true));
console.log(snakeBody[0]);

let snakeDirection = Directions.Right;

update();


function update() {
    if (snake.x + snake.y == 0)
    {
        snake.pos = {x: snakeSize * 0.5, y: snakeSize * 0.5};
    } else {
        switch (snakeDirection) {
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

    if (snakeBody.length > snakeLength) {
        snakeBody.shift();
    }  
        
    snakeFood.active ? null : spawnFood();

    checkCollision() ? null : draw();

    //check if paused otherwise update
    setTimeout(() => checkPaused() , 1000 / gameSpeed);
}

function checkPaused() {
    paused ? setTimeout(() => checkPaused(), 1000) : update();
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
    }
    else if (snake.y - snakeSize*0.5 < 0 || snake.y + snakeSize*0.5 > mainCanvas.height) {
        console.log('hit top or bottom wall');
        collided = true;
    }

    if (snake.x === snakeFood.x && snake.y === snakeFood.y) {
        snakeLength++;
        snakeFood.active = false;
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
    if (e.key === "ArrowUp" && snakeDirection !== Directions.Down) {
        snakeDirection = Directions.Up;
    }
    else if (e.key === "ArrowDown" && snakeDirection !== Directions.Up) {
        snakeDirection = Directions.Down;
    } 
    else if (e.key === "ArrowLeft" && snakeDirection !== Directions.Right) {
        snakeDirection = Directions.Left;
    }
    else if (e.key === "ArrowRight" && snakeDirection !== Directions.Left) {
        snakeDirection = Directions.Right;
    }
    else if (e.key === " ") {
        paused = !paused;
    }
    else if (e.key === "Escape") {
        //reset defualt values
        paused = false;
        snakeBody.length = 0;
        snake.pos(0, 0);
        snakeDirection = Directions.Right;
    }
}


