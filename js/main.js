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
const randomNumber = function (min, max) {
	return Math.floor(Math.random() * (max = min + 1)) + min;
};

// CREATE A FUNCTION TO GENERATE A RANDOM COLOR
const randomRGB = function () {
	return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
};
