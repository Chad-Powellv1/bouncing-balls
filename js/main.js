// CREATE DOM HEADING ELEMENT
const heading = document.createElement('h1');
heading.textContent = 'bouncing balls';
document.body.appendChild(heading);

// CREATE DOM CANVAS ELEMENT
const canvasElement = document.createElement('canvas');
document.body.appendChild(canvasElement);

// GET THE CANVAS ELEMENT AND USE THE getContext METHOD, IN THIS CASE FOR 2D RENDERING
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// CREATE DOM PARAGRAPH ELEMENT
const pTag = document.createElement('p');
pTag.id = 'score';
document.body.appendChild(pTag);

// CREATE A COUNT VARIABLE TO KEEP TRACK OF SCORE
let count = 0;

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// CREATE A FUNCTION TO RETURN A RANDOM NUMBER BETWEEN A MIN AND MAX RANGE
const randomNumber = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

// CREATE A FUNCTION TO GENERATE A RANDOM COLOR
const randomRGB = () =>
	`rgb(${randomNumber(0, 255)},${randomNumber(0, 255)},${randomNumber(
		0,
		255
	)})`;

// CREATE A SHAPE CLASS
class Shape {
	constructor(x, y, velX, velY) {
		this.x = x;
		this.y = y;
		this.velX = velX;
		this.velY = velY;
	}
}

// CREATE BALL CLASS WITH ITS PROPERTIES, FUNCTIONS WILL BE CREATED AS METHODS OF THE CLASS
class Ball extends Shape {
	constructor(x, y, velX, velY, color, size) {
		super(x, y, velX, velY);

		this.color = color;
		this.size = size;
		this.exists = true;
	}

	draw() {
		ctx.beginPath(); // CREATES A NEW PATH FOR DRAWING
		ctx.fillStyle = this.color; // FILL COLOR
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // DETERMINES SHAPE, THIS CASE ROUND
		ctx.fill(); // FILLS THE SHAPE IN COMPLETELY
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
		if (this.y + this.size >= height) {
			this.velY = -this.velY;
		}

		// IF THE BALL HITS THE BOTTOM SIDE IT WILL GO BACK UP
		if (this.y - this.size <= 0) {
			this.velY = -this.velY;
		}

		// THE LAST TWO LINES CAUSE THE BALL TO MOVE WHEN THE METHOD IS CALLED
		this.x += this.velX;
		this.y += this.velY;
	}

	collisionDetect() {
		// FOR LOOP, TO LOOP THROUGH THE ballsArray
		for (const ball of ballsArray)
			if (!(this === ball)) {
				const dx = this.x - ball.x;
				const dy = this.y - ball.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				// CONDITION IF COLLISION IS DETECTED RANDOMLY CHANGE BALL COLOR
				if (distance < this.size + ball.size) {
					ball.color = this.color = randomRGB();
				}
			}
	}
}

// CREATE EVIL CIRCLE CLASS
class EvilCircle extends Ball {
	constructor(x, y) {
		super(x, y, 20, 20);

		this.color = 'red';
		this.size = 10;

		window.addEventListener('keydown', e => {
			switch (e.key) {
				case 'a':
					this.x -= this.velX;
					break;
				case 'd':
					this.x += this.velX;
					break;
				case 'w':
					this.y -= this.velY;
					break;
				case 's':
					this.y += this.velY;
					break;
			}
		});
	}

	draw() {
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.color;
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.stroke();
	}

	checkBounds() {
		if (this.x + this.size >= width) {
			this.velX -= this.velX;
		}

		if (this.x - this.size <= 0) {
			this.velX += this.velX;
		}

		if (this.y + this.size >= height) {
			this.velY -= this.velY;
		}

		if (this.y - this.size <= 0) {
			this.velY += this.velY;
		}
	}

	collisionDetect() {
		for (const ball of ballsArray) {
			if (ball.exists) {
				const dx = this.x - ball.x;
				const dy = this.y - ball.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < this.size + ball.size) {
					ball.exists = false;
					count--;
					pTag.textContent = `Ball Count = ${count}`;
				}
			}
		}
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
	count++;
	pTag.textContent = `Ball Count: ${count}`;
}

const evilRedCircle = new EvilCircle(
	randomNumber(0, width),
	randomNumber(0, height)
);

// CREATE AN ANIMATION LOOP, TO UPDATE THE VIEW  FOR EACH ANIMATION FRAME
const loop = function () {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; // PRODUCES TRAILS BEHIND THE BALLS
	ctx.fillRect(0, 0, width, height); // CANVAS COLOR TO SEMI-TRANSPARENT BLACK

	// FOR LOOP, LOOPS THROUGH THE ballsArray FOR SMOOTH ANIMATION
	for (const ball of ballsArray) {
		if (ball.exists) {
			ball.draw();
			ball.update();
			ball.collisionDetect();
		}
	}

	evilRedCircle.draw();
	evilRedCircle.checkBounds();
	evilRedCircle.collisionDetect();

	requestAnimationFrame(loop);
};

loop();
