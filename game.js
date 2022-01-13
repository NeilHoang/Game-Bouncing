let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let paddle = {
    width: 70,
    height: 10,
    x: 0,
    y: canvas.height - 10,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false,
};

let ball = {
    x: 20,
    y: 20,
    dx: 5,
    dy: 2,
    radius: 15
}

let BrickConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5
};
let BrickList = [];
for (let i = 0; i < BrickConfig.totalRow; i++) {
    for (let j = 0; j < BrickConfig.totalCol; j++) {
        BrickList.push({
            x: BrickConfig.offsetX + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offsetY + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false,
        })
    }
}
let gameIsOver = false;
let gameIsWin = false;
let UserScore = 0;
let MaxScore = BrickConfig.totalCol * BrickConfig.totalRow;

// setInterval(function () {
//     // xoa du anh cua bong
//     context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
// //    ve qua bong
//     drawBall();
//     x += 2;
//     y += 2;
// }, 50);
// document.addEventListener('keypress',function (event){
//     console.log(event);
// });w
document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = false;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight = false;
    }
    console.log(event);

});
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = true;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight = true;
    }
    console.log(event);

});

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

// (2 * offset) + (5 * width) + (4 * margin) - 500 = 0
// offset = margin = 25
// => width = 25;
//row = 3
// col = 5

function drawBricks() {
    BrickList.forEach(function (brick) {
        if (!brick.isBroken) {
            context.beginPath();
            context.rect(brick.x, brick.y, BrickConfig.width, BrickConfig.height);
            context.fill();
            context.closePath();
        }
    })
}

function handBallCollideBounds() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

function handBallCollidePaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width
        && ball.y + ball.radius > canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
}

function handeBallCollideBricks() {
    BrickList.forEach(function (brick) {
        if (!brick.isBroken) {
            if (ball.x >= brick.x && ball.x < brick.x + BrickConfig.width
                && ball.y + ball.radius >= brick.y && ball.y - ball.radius <= brick.y + BrickConfig.height) {
                ball.dy = -ball.dy;
                brick.isBroken = true;
                UserScore += 1;
                if (UserScore >= MaxScore) {
                    gameIsOver = true;
                    gameIsWin = true;
                }
            }
        }
    });
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosition() {
    if (paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    } else if (paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }
    if (paddle.x < 0) {
        paddle.x = 0
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width
    }

}

function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        gameIsOver = true;
    }
}

function handleGameOver() {
    if (gameIsWin) {
        context.beginPath();
        context.font = "30px arial";
        context.fillText("Your score : " + MaxScore, 140, 250, 300);
        context.closePath();
    } else {
        context.beginPath();
        context.font = "30px arial";
        context.fillText('You die :' + UserScore, 140, 250, 300);
        context.closePath();
    }
}

function draw() {
    if (!gameIsOver) {
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        drawBall();
        drawPaddle();
        drawBricks();

        handBallCollideBounds();
        handBallCollidePaddle();
        handeBallCollideBricks();

        updatePaddlePosition();
        updateBallPosition();

        checkGameOver();

        requestAnimationFrame(draw);
    } else {
        handleGameOver();
    }

}

draw();
