function Display(width, height) {
	var parent = document.getElementsByTagName("body")[0];
	this.display = document.createElement("canvas");
	this.display.id = 'display';
	this.display.width = width;
	this.display.height = height;
	this.display.ctx = this.display.getContext('2d');
	this.display.ctx.globalAlpha = 1;
	this.display.ctx.textBaseline = "top";
	this.display.ctx.textAlign = "start";
	parent.appendChild(this.display);
}

Display.prototype.clearScreen = function () {
	this.display.ctx.fillStyle = 'hsla(120, 50%, 2%, 0.15)';
	this.display.ctx.fillRect(0, 0, this.display.width, this.display.height);
};

Display.prototype.setSize = function (width, height) {
	this.display.width = width;
	this.display.height = height;
};
