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
		super(x, y, velX, velY); // SUPER KEYWORD, ACCESSES & CALLS METHODS FROM THE PARENT OBJECT SHAPE

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
		// KEEPS BALL FROM GOING OFF RIGHT SIDE OF SCREEN
		if (this.x + this.size >= width) {
			this.velX = -this.velX;
		}

		// KEEPS BALL FROM GOING OFF LEFT SIDE OF SCREEN
		if (this.x - this.size <= 0) {
			this.velX = -this.velX;
		}

		// KEEPS BALL FROM GOING OFF TOP OF SCREEN
		if (this.y + this.size >= height) {
			this.velY = -this.velY;
		}

		// KEEPS BALL FROM GOING OFF BOTTOM OF SCREEN
		if (this.y - this.size <= 0) {
			this.velY = -this.velY;
		}

		// THE LAST TWO LINES CAUSE THE BALL TO MOVE WHEN THE METHOD IS CALLED
		this.x += this.velX;
		this.y += this.velY;
	}

	collisionDetect() {
		// FOR LOOP, TO LOOP THROUGH THE ballsArray AND DETECT WHEN BALL OBJECTS COLLIDE
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

		// CREATE KEYBOARD INPUTS ALLOWING PLAYER TO CONTROL EVIL CIRCLE
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
		ctx.beginPath(); // CREATES A NEW PATH FOR DRAWING
		ctx.lineWidth = 3; // SETS THE LINE WIDTH FOR THE EVIL CIRCLE OUTLINE
		ctx.strokeStyle = this.color; // SETS THE COLOR OF CIRCLE BASED ON OBJECT PROPERTY SET IN CLASS OBJECT
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // DETERMINES SHAPE, THIS CASE ROUND
		ctx.stroke(); // SETS THE COLOR ONLY TO MAKE A CIRCLE AND LEAVING THE CENTER VOID OF COLOR
	}

	// FOR LOOP, TO LOOP THROUGH THE ballsArray AND DETECT WHEN BALL OBJECTS COLLIDE
	collisionDetect() {
		for (const ball of ballsArray) {

		// ADDED THE EXISTS PROPERTY TO CONDITIONAL STATEMENT
			if (!(this === ball) && ball.exists) {
				const dx = this.x - ball.x;
				const dy = this.y - ball.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
			
			// CONDITIONAL STATEMENT REMOVES BALL AFTER COLLISION AND ADDS COUNT TO pTag ELEMENT IN DOM
				if (distance < this.size + ball.size) {
					ball.exists = false;
					count--;
					pTag.textContent = `Ball Count = ${count}`;
				}
			}
		}
	}


	checkBounds() {
		// KEEPS BALL FROM GOING OFF RIGHT SIDE OF SCREEN
		if (this.x + this.size >= width) {
			this.velX -= this.velX;
		}

		// KEEPS BALL FROM GOING OFF LEFT SIDE OF SCREEN
		if (this.x - this.size <= 0) {
			this.velX += this.velX;
		}

		// KEEPS BALL FROM GOING OFF TOP SIDE OF SCREEN
		if (this.y + this.size >= height) {
			this.velY -= this.velY;
		}

		// KEEPS BALL FROM GOING OFF BOTTOM SIDE OF SCREEN
		if (this.y - this.size <= 0) {
			this.velY += this.velY;
		}
	}
}

// CREATE AN ARRAY TO STORE THE BALLS ONCE THEY ARE ADDED TO THE CANVAS
const ballsArray = [];

/* CREATE A WHILE LOOP TO CREATE RANDOM BALL SIZES, COLORS, AND ENSURE THEY ARE DRAWN ONE BALL
WIDTH AWAY FROM THE EDGE AND ANOTHER BALL */
while (ballsArray.length < 25) {
	const size = randomNumber(10, 20);
	const ball = new Ball(
		randomNumber(0 + size, width - size),
		randomNumber(0 + size, height - size),
		randomNumber(-7, 7),
		randomNumber(-7, 7),
		randomRGB(),
		size
	);
	// PUSH CREATED BALLS TO THE ballsArray, UPDATE TOTAL BALL COUNT AND ADD TO pTAG in DOM
	ballsArray.push(ball);
	count++;
	pTag.textContent = `Ball Count: ${count}`;
}

// CREATE THE EVIL CIRCLE AT THE SPECIFIED DIMENSIONS, BUT RANDOM LOCATION ACCORDING TO CLASS PROPERTIES
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

	// EVIL CIRCLE CLASS METHODS ADDED TO LOOP FOR SMOOTH ANIMATION
	evilRedCircle.draw();
	evilRedCircle.checkBounds();
	evilRedCircle.collisionDetect();

	requestAnimationFrame(loop);
};

// CALL THE LOOP FUNCTION TO START THE APP
loop();
