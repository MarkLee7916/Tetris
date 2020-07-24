function createGrid() {
	var grid = [];

	return {
		initialiseEmptyGrid() {
			for (let row = 0; row < HEIGHT; row++) {
				grid.push([]);
				for (let col = 0; col < WIDTH; col++) 
					grid[row].push(false);		
			}
		},

		deleteRow(row) {
			const emptyRow = new Array(WIDTH).map(elem => elem = false);
			const beforeRow = grid.slice(0, row);
			const afterRow = grid.slice(row + 1, HEIGHT);

			grid = [emptyRow].concat(beforeRow.concat(afterRow));
		},

		isFilled(row, col) {
			return grid[row][col];
		},

		setFilled(row, col) {
			grid[row][col] = true;
		},
	};
}