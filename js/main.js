// CREATE PAGE HEADING ELEMENT
const heading = document.createElement('h1');
heading.innerText = 'bouncing balls';
document.body.appendChild(heading);

// CREATE PAGE CANVAS ELEMENT
const canvasElement = document.createElement('canvas');
document.body.appendChild(canvasElement);

// GET THE CANVAS ELEMENT AND USE THE getContext METHOD, IN THIS CASE FOR 2D RENDERING
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// CREATE A FUNCTION TO RETURN A RANDOM NUMBER BETWEEN A MIN AND MAX RANGE
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max = min + 1)) + min;
}

// CREATE A FUNCTION TO GENERATE A RANDOM COLOR
function randomRGB() {
	return `rgb(${randomNumber(0, 255)},${randomNumber(0, 255)}, ${randomNumber(
		0,
		255
	)})`;
}

// CREATE BALL CLASS WITH ITS PROPERTIES, FUNCTIONS WILL BE CREATED AS METHODS OF THE CLASS
class Ball {
	constructor(x, y, velX, velY, color, size) {
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
		this.color = color;
		this.size = size;
	}

	draw() {
		ctx.beginPath(); // CREATES A NEW PATH / DRAWING
		ctx.fillStyle = this.color; // FILL COLOR
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // DETERMINES SHAPE, THIS CASE ROUND
		ctx.fill; // FILLS THE SHAPE IN COMPLETELY
	}

	update() {
		// IF THE BALL HITS THE RIGHT SIDE IT WILL GO BACK LEFT
		if (this.x + this.size >= width) {
			this.velX = -this.velX;
		}

		// IF THE BALL HITS THE LEFT SIDE IT WILL GO BACK RIGHT
		if (this.x - this.size <= 0) {
			this.velX = -this.velX;
		}

		// IF THE BALL HITS THE TOP SIDE IT WILL GO BACK DOWN
		if (this.velY + this.size >= width) {
			this.velY = -this.velY;
		}

		// IF THE BALL HITS THE BOTTOM SIDE IT WILL GO BACK UP
		if (this.velY - this.size <= 0) {
			this.velY = -this.velY;
		}

		// THE LAST TWO LINES CAUSE THE BALL TO MOVE WHEN THE METHOD IS CALLED
		this.x += this.velX;
		this.y += this.velY;
	}
}

// CREATE AN ARRAY TO STORE THE BALLS ONCE THEY ARE ADDED TO THE CANVAS
const ballsArray = [];

// CREATE A WHILE LOOP TO CREATE RANDOM BALL SIZES AND COLORS
while (ballsArray.length < 25) {
	const size = randomNumber(10, 20);
	const ball = new Ball(
		randomNumber(0 + size, width - size), // BALL POSITION DRAWN ONE BALL WIDTH AWAY FROM EDGE AND OTHER BALL
		randomNumber(0 + size, height - size),
		randomNumber(-7, 7),
		randomNumber(-7, 7),
		randomRGB(),
		size
	);
	ballsArray.push(ball);
}

// CREATE AN ANIMATION LOOP, TO UPDATE THE VIEW  FOR EACH ANIMATION FRAME
const loop = function () {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; // PRODUCES TRAILS BEHIND THE BALLS
	ctx.fillRect(0, 0, width, height); // CANVAS COLOR TO SEMI-TRANSPARENT BLACK

	// FOR LOOP, LOOPS THROUGH THE ballsArray FOR SMOOTH ANIMATION
	for (const ball of ballsArray) {
		ball.draw();
		ball.update();
	}

	requestAnimationFrame(loop);
};

loop();
