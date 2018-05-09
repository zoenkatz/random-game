var Ball = function(){
  this.x = 480 * (Math.random() + 0.02);
  this.y = 380 * (Math.random() + 0.02);
  this.dx = 5;
  this.dy = 5;
  this.prevX = 480 * (Math.random() + 0.02) - 5;
  this.prevY = 380 * (Math.random() + 0.02) - 5;
};

Ball.prototype.clearRect = function(context, ball){
    context.clearRect(ball.prevX, ball.prevY, 17, 17);
    context.clearRect(ball.prevX - 16, ball.prevY - 16, 50, 50);
    context.clearRect(ball.prevX + 16, ball.prevY - 16, 50, 50);
    context.clearRect(ball.prevX - 16, ball.prevY, 40, 40);
    context.clearRect(ball.prevX + 16, ball.prevY + 16, 40, 40);

};

Ball.prototype.isMin = function(ball, balls){
    var min = ball.x;
    for(var i = 0; i < balls.length; i++){
        if(balls[i].x < min){
            return false;
        }

    }

    return true;
};

Ball.prototype.isMax = function(ball, balls){
    var max = ball.x;
    for(var i = 0; i < balls.length; i++){
        if(balls[i].x > max){
            return false;
        }

    }
    return true;
};

Ball.prototype.draw = function(context, ball, balls){
        ball.clearRect(context, ball);
        context.beginPath();

        if(ball.isMax(ball, balls)){
            context.fillStyle="#f00";
        }

        else if(ball.isMin(ball, balls)){
            context.fillStyle="#0f0";
        }
        else {
            context.fillStyle = "#ff0";
        }

        context.arc(ball.x, ball.y , 8 , 0 ,Math.PI*2 ,true); context.closePath();
        context.fill();

        ball.prevX = ball.x;
        ball.prevY = ball.y;

        if( ball.x < 0 || ball.x > 500) {ball.dx =- ball.dx};
        if( ball.y < 0 || ball.y > 370) {ball.dy =- ball.dy};
        ball.x += ball.dx;
        ball.y += ball.dy;
};

function Model(){
    this.run = "";
    this.numberOfBalls = 0;
    this.balls = [];
    this.interval = {};
}

function Controller(model){
    var self = this;
    this.model = model;
    this.handleEvent = function(e){
        e.stopPropagation();
        e.preventDefault();
        switch(e.type){
            case "click":
                self.clickHandler(e.target);
                break;
            default:
        }
    };


    this.drawBalls = function(){
        if(self.model.balls.length){
            for(var i = 0; i < self.model.balls.length; i++) {
                self.model.balls[i] = null;
                delete self.model.balls[i];
            }

            self.model.balls = [];
        }

        var ball;
        var context;
        var canvasElem = document.getElementById('canvas');

        context = canvasElem.getContext('2d');
        context.clearRect(0,0, 500,400);

        if(self.model.interval && Object.keys(self.model.interval).length){
            for(let i = 0; i < Object.keys(self.model.interval).length; i++) {
                clearInterval(self.model.interval[i]);
                self.model.interval[i] = null;
            }
        }

        for(let i = 0; i < Number(self.model.numberOfBalls); i++) {
            ball = new Ball();
            self.model.balls.push(ball);
        }

        for(let j = 0; j < self.model.balls.length; j++) {
            if(self.model.balls[j]) {
                self.model.interval[j] = setInterval(function(){self.model.balls[j].draw(context, self.model.balls[j], self.model.balls)}, 10);
            }
       }
    };

    this.clickHandler = function(target){
        if(target.id === 'run'){
            self.model.numberOfBalls = target.parentElement.previousElementSibling.value;
            this.drawBalls();
        }
    };
}

function View(controller){
    this.controller = controller;
    this.run = document.getElementById('run');
    this.run.addEventListener('click', controller);
}

function main(){
    var model = new Model();
    var controller = new Controller(model);
    var view = new View(controller);
}

document.addEventListener("DOMContentLoaded", function() {
   main();
});