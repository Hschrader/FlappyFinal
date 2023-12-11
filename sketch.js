let bird;
let pipes = [];
let score = 0;
let highScore = 0;
let gameState = 'play'; 
let img;
let img2;
let music;
let pointSound;

function preload(){
  img = loadImage('assets/Background.png');
  img2 = loadImage('assets/Birdy.png');  
  music = loadSound('sounds/Music.mp3');
  pointSound = loadSound('sounds/Blingg.mp3');
  myFont = loadFont('assets/Silkscreen-Bold.ttf');
} 

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("sketch-holder");
  bird = new Bird();  
  pipes.push(new Pipe());
  music.loop();
  music.setVolume(0.3);
  textFont(myFont);


  let saveButton = createButton('Save Screen');
  saveButton.position(700, 555);
  saveButton.mousePressed(saveCanvasAsImage);
  saveButton.size(100,30);
  saveButton.style('background-color', 'lightyellow'); 
  saveButton.style('border'); 
  saveButton.style('border-radius', '20px');
  saveButton.style('color', 'black');
  
function saveCanvasAsImage() {
  saveCanvas('myCanvas', 'png'); 
}
  
}

function draw() {
  background(img);

  //DISPLAY
  if (gameState === 'play') {
 
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].display();

      if (pipes[i].hits(bird)) {
        gameState = 'gameover';
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.update();
    bird.show();
    
    if (frameCount % 100 === 0) {
      pipes.push(new Pipe());
    }

    for (let i = 0; i < pipes.length; i++) {
      if (pipes[i].x + pipes[i].w < bird.x && !pipes[i].scored) {
        score++;
        pointSound.play();
        pipes[i].scored = true;
      }
    }

    //SCORE DISPLAY
    textSize(20);
    fill(0);
    text('Score: ' + score, 70, 30);
  } else if (gameState === 'gameover') {  
    if (score > highScore) {
      highScore = score;
    }
    gameState = 'highscore';
  } else if (gameState === 'highscore') {
    textSize(64); 
    fill(0);
    textAlign(CENTER, CENTER);
    text('High Score', 300, 180);
    textSize(50);
    text(highScore, 300, 240);
    textSize(25);
    text('Press Space to Play Again', 300, 350);
    
  }
}

function keyPressed() {
  if (key === ' ' && (gameState === 'play' || gameState === 'gameover')) {
    bird.up();
  } else if (key === ' ' && gameState === 'highscore') {
    resetGame();
  }
}

function resetGame() {
  pipes = [];
  bird = new Bird();
  score = 0;
  gameState = 'play';
}

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.velocity = 0;
    this.gravity = 1;
    this.lift = -25;
  }

  show() {
    image(img2, this.x, this.y, 50, 40);
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  up() {
    this.velocity += this.lift;
  }
}

class Pipe {
  constructor() {
    this.spacing = 133;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 50;
    this.speed = 2;
    this.scored = false;
  }
 
  display() {
    stroke(0) 
    fill(17, 51, 120);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  } 

  offscreen() {
    return this.x < -this.w;
  }
 
  hits(bird) {
  if (
    bird.x + 40 > this.x && bird.x - 1 < this.x + this.w &&
    (bird.y + 5 < this.top || bird.y + 30 > height - this.bottom)
  ) {
    return true;
  } 
  return false;
}
}
