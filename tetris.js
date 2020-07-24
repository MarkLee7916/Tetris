"use-strict";

const WALL_COLOR = "#AAAAAA";
const HEIGHT = 20;
const WIDTH = 20;
const pause = createPauseWrapper();
const block = createBlockWrapper();
const grid = createGrid();

initialiseGame();

function initialiseGame() {
	grid.initialiseEmptyGrid();
	initialiseGridInDOM();
	addEventListeners();

	runGame();
}

async function runGame() {
	var running = true;

	while (running) 
		await fallingBlock(gameOver);	

	function gameOver() {
		alert("Game over!");
		running = false;
	}
}

async function fallingBlock(gameOver) {
	createBlock();

	while (canMoveDown()) {
		if (!pause.isPaused())
			moveDown();

		await wait();
	}

	renderBlockInGrid();
	handleLineClears();
	
	if (isGameOver())
		gameOver();
}

function createBlock() {
	block.newBlock();
	moveBlockToMiddle();
}

function moveBlockToMiddle() {
	shiftBlock(0, parseInt(WIDTH / 2));
}

function isGameOver() {
	for (let i = 0; i < WIDTH; i++) 
		if (grid.isFilled(0, i)) 
			return true;	

	return false;
}

function addEventListeners() {
	document.addEventListener("keydown", dealWithKeyPress);
	document.querySelector("#reset").addEventListener("click", refreshBrowser);
	document.querySelector("#pause").addEventListener("click", pauseGame);
}

function refreshBrowser() {
	 location = location;
}

function pauseGame(clickable) {
	const pauseButton = clickable.target;

	if (pause.isPaused()) {
		pause.resume();
		pauseButton.innerHTML = "Pause";
	}
	else {
		pause.pause();
		pauseButton.innerHTML = "Resume";
	}
}

// Map key press onto action
function dealWithKeyPress(keyPress) {
	const leftArrow = 37;
	const upArrow = 38;
	const rightArrow = 39;
	const downArrow = 40;

	if (!pause.isPaused()) {
		switch (keyPress.keyCode) {
			case upArrow:
				rotatePiece();
				break;
			case leftArrow:
				moveLeft();
				break;
			case rightArrow:
				moveRight();
				break;
			case downArrow:
				moveDown();
				break;
		}
	}
}

// Rotate piece and backtrack if rotation results in piece being out of bounds
function rotatePiece() {
	eraseBlockInDOM();
	block.nextRotation();

	if (!noCollisions())
		block.previousRotation();

	renderBlockInDOM();
}

function noCollisions() {
	return canMoveBlock(0, 0, i => block.row(i) >= HEIGHT || block.col(i) < 0 || block.col(i) >= HEIGHT);
}

function canMoveDown() {
	return canMoveBlock(1, 0, i => block.row(i) >= HEIGHT - 1);
}

function moveLeft() {
	moveBlock(0, -1, i => block.col(i) <= 0);
}

function moveRight() {
	moveBlock(0, 1, i => block.col(i) >= WIDTH - 1);
}

function moveDown() {
	moveBlock(1, 0, i => block.row(i) >= HEIGHT - 1);
}

function moveBlock(rowMove, colMove, edgeGridCondition) {
	if (canMoveBlock(rowMove, colMove, edgeGridCondition)) 
		shiftBlock(rowMove, colMove);
}

function canMoveBlock(rowMove, colMove, edgeGridCondition) {
	for (let i = 0; i < block.length(); i++) 
		if (edgeGridCondition(i) || grid.isFilled(block.row(i) + rowMove, block.col(i) + colMove))
			return false;		

	return true;
}

// Dynamically generate HTML for a plain grid
function initialiseGridInDOM() {
	const gridDOM = document.querySelector("#grid");
	var newRow;

	for (let row = 0; row < HEIGHT; row++) {
		newRow = createEmptyRowInDOM(row);
		gridDOM.append(newRow);
	}
}	

function createEmptyRowInDOM(row) {
	const newRow = document.createElement("tr");
	newRow.className = "row";

	for (let col = 0; col < WIDTH; col++)  {
		let newTile = createEmptyTileInDOM(row, col);
		newRow.append(newTile);
	}

	return newRow;
}

function createEmptyTileInDOM(row, col) {
	const newTile = document.createElement("td");

	newTile.className = "tile";
	newTile.style.backgroundColor = WALL_COLOR;

	return newTile;
}

function shiftBlock(rowMove, colMove) {
	eraseBlockInDOM();
	
	block.move(rowMove, colMove);

	renderBlockInDOM();
}

function eraseBlockInDOM() {
	for (let i = 0; i < block.length(); i++) 
		eraseTileInDOM(block.row(i), block.col(i));
}

function renderBlockInDOM() {
	for (let i = 0; i < block.length(); i++) 
		renderTileInDOM(block.color(), block.row(i), block.col(i));
}

function renderBlockInGrid() {
	for (let i = 0; i < block.length(); i++)
		grid.setFilled(block.row(i), block.col(i));
}

async function wait() {
	const waitingTime = 500;

	return new Promise(resolve => { 
		setTimeout(resolve, waitingTime);
	});	
}

function handleLineClears() {
	for (let row = 0; row < HEIGHT; row++) 
		if (isFilledLine(row)) 
			clearLine(row);
}

function isFilledLine(row) {
	for (let col = 0; col < WIDTH; col++) 
		if (!grid.isFilled(row, col))
			return false;
		
	return true;
}

function clearLine(row) {
	grid.deleteRow(row);
	deleteRowInDOM(row);
}

function deleteRowInDOM(row) {
	const gridDOM = document.querySelector("#grid");

	gridDOM.deleteRow(row);
	gridDOM.insertBefore(createEmptyRowInDOM(), gridDOM.rows[0]);
}

function eraseTileInDOM(row, col) {
	 renderTileInDOM(WALL_COLOR, row, col);
}

function renderTileInDOM(color, row, col) {
	const tileDOM = getTileInDOM(row, col);

	tileDOM.style.backgroundColor = color;
}

function getTileInDOM(row, col) {
	const gridDOM = document.querySelector("#grid");
	const rowDOM = gridDOM.rows[row];
	const tileDOM = rowDOM.cells[col];

	return tileDOM;
}

// Generates a random integer whose value lies between lower and upper
function randomIntBetween(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
}