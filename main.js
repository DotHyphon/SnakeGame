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
const snakePosition = { x: 5, y: 15 };
const snakeBody = [];
let gameSpeed = 10;
let snakeLength = 1;
let snakeSpeed = 10;
let snakeSize = 10;
const snakeFood = { x: 0, y: 0, active: false };

snakeBody.push({x: snakePosition.x, y: snakePosition.y});

let snakeDirection = Directions.Right;

update();


function update() {
    if (!paused) {
        switch (snakeDirection) {
            case Directions.Up:
                snakePosition.y -= snakeSpeed;
                break;
            case Directions.Down:
                snakePosition.y += snakeSpeed;
                break;
            case Directions.Left:
                snakePosition.x -= snakeSpeed;
                break;
            case Directions.Right:
                snakePosition.x += snakeSpeed;
                break;
        }

        snakeBody.push({x: snakePosition.x, y: snakePosition.y});

        if (snakeBody.length > snakeLength) {
            snakeBody.shift();
        }  

        checkCollision();
        
        snakeFood.active ? null : spawnFood();

        draw();
    }
    setTimeout(() => { update(); }, 1000 / gameSpeed);
}

function spawnFood() {
    snakeFood.x = Math.floor(Math.random() * mainCanvas.width / snakeSize) * snakeSize + 5;
    snakeFood.y = Math.floor(Math.random() * mainCanvas.height / snakeSize) * snakeSize + 5;
    snakeFood.active = true;
}

function checkCollision() {
    if (snakePosition.x - snakeSize*0.5 < 0 || snakePosition.x + snakeSize*0.5 > mainCanvas.width) {
        console.log('hit left or right wall');
        paused = true;
    }
    else if (snakePosition.y - snakeSize*0.5 < 0 || snakePosition.y + snakeSize*0.5 > mainCanvas.height) {
        console.log('hit top or bottom wall');
        paused = true;
    }

    if (snakePosition.x === snakeFood.x && snakePosition.y === snakeFood.y) {
        snakeLength++;
        snakeFood.active = false;
    }
}

function draw() {
    //clear canvas
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);


    //draw snake
    mainCtx.lineWidth = 2;
    mainCtx.strokeStyle = "black";
    snakeBody.forEach((bodyPart, index) => {
        mainCtx.fillRect(bodyPart.x - snakeSize*0.5, bodyPart.y - snakeSize*0.5, snakeSize, snakeSize)
    });

    //draw snakefood
    mainCtx.strokeStyle = "red";
    snakeFood.active ? mainCtx.fillRect(snakeFood.x - snakeSize*0.5, snakeFood.y - snakeSize*0.5, snakeSize, snakeSize) : null;
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
        snakePosition.x = 5;
        snakePosition.y = 15;
        snakeDirection = Directions.Right;
        console.log(snakePosition);
    }
}


