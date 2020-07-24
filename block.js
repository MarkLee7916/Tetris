function createBlockWrapper() {
	var currentColor;

	var rowOffset; 

	var colOffset;

	var blockIndex;

	var rotationIndex;

	const square = [[[0, 0], [0, 1], [1, 0], [1, 1]],
				    [[0, 0], [0, 1], [1, 0], [1, 1]], 
				    [[0, 0], [0, 1], [1, 0], [1, 1]], 
				    [[0, 0], [0, 1], [1, 0], [1, 1]]];

	const shapeT = [[[0, 0], [0, 1], [0, 2], [1, 1]], 
			        [[0, 0], [1, 0], [2, 0], [1, 1]], 
			        [[1, 1], [1, 2], [1, 3], [0, 2]], 
			        [[1, 1], [0, 2], [1, 2], [2, 2]]];

	const line = [[[0, 0], [0, 1], [0, 2], [0, 3]], 
				  [[0, 0], [1, 0], [2, 0], [3, 0]], 
				  [[0, 0], [0, 1], [0, 2], [0, 3]], 
				  [[0, 0], [1, 0], [2, 0], [3, 0]]];

	const shapeL = [[[0, 0], [1, 0], [2, 0], [2, 1]], 
	                [[1, 1], [1, 2], [1, 3], [0, 3]], 
					[[0, 0], [0, 1], [1, 0], [2, 0]], 
					[[0, 0], [1, 0], [1, 1], [1, 2]]];

	const mirror = 	[[[0, 0], [0, 1], [1, 1], [1, 2]], 
	                 [[2, 2], [1, 2], [1, 3], [0, 3]], 
					 [[1, 1], [1, 2], [0, 2], [0, 3]], 
					 [[0, 0], [1, 0], [1, 1], [2, 1]]];

	const blockLength = 4;

	const blockTypes = [square, shapeT, line, shapeL, mirror];

	const colors = ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#FF4136", "#FFDC00"];

	return {
		newBlock() {
			blockIndex = randomIntBetween(0, blockTypes.length);
			rotationIndex = randomIntBetween(0, blockTypes[0].length);
			currentColor = colors[randomIntBetween(0, colors.length)];
			
			rowOffset = 0;
			colOffset = 0;
		},

		nextRotation() {
			if (rotationIndex === 3)
				rotationIndex = 0;
			else
				rotationIndex++;
		},

		previousRotation() {
			if (rotationIndex === 0)
				rotationIndex = 3;
			else
				rotationIndex--;
		},

		length() {
			return blockLength;
		},

		move(rowMove, colMove) {
			rowOffset += rowMove;
			colOffset += colMove;
		},

		color() {
			return currentColor;
		},

		row(index) {
			const currentBlock = blockTypes[blockIndex][rotationIndex];

			return currentBlock[index][0] + rowOffset;
		},

		col(index) {
			const currentBlock = blockTypes[blockIndex][rotationIndex];

			return currentBlock[index][1] + colOffset;
		},
	};
}