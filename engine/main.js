if (!window.requestAnimationFrame) {
	alert('Ой! Похоже Вы используете очень старый браузер. Чтобы продолжить обновите браузер.');
} else {
	document.addEventListener('DOMContentLoaded', main);
}

function main() {

	window.addEventListener('resize', onResize);

	var running = true;

	var width = window.innerWidth;
	var height = window.innerHeight;
	var displayController = new Display(width, height);
	var display = displayController.display;
	var matrix = new Matrix(display.width, display.height);

	cycle();
	function cycle() {
		displayController.clearScreen();
		if (running) {
			matrix.update(display);
			window.requestAnimationFrame(cycle);
		} else {
			window.cancelAnimationFrame(cycle);
		}
	}

	function onResize() {
		displayController.setSize(window.innerWidth, window.innerHeight);
	}

}


function randomRange(min, max) {
	return Math.floor(min + (Math.random() * (max - min)));
}