function createPauseWrapper() {
	var paused = false;

	return {
		isPaused() {
			return paused;
		},

		pause() {
			paused = true;
		},

		resume() {
			paused = false;
		}
	};
}