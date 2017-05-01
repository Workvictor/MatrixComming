function Matrix(width, height) {
	var colsMax = 60; //максимальное количество колонок матрицы
	//для выборки символов будем использовать массив


	var str = 'QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?!@#$%^&*()_+-=1234567890';
	this.chars = str.split('');

	this.charSize = Math.ceil(width / colsMax); //определяем шрифт, в зависимости от кол-ва колонок
	this.frame = 0;
	this.state = {
		EMPTY: "EMPTY"
	};
	this.width = Math.ceil(width / this.charSize);
	this.height = Math.ceil(height / this.charSize + this.charSize);
	this.grid = [];
	for (var x = 0; x < this.width; x++) {
		this.grid.push([]);
		for (var y = 0; y < this.height; y++) {
			this.grid[x][y] = this.state.EMPTY;
		}
	}

	var msg = 'COMING SOON';
	this.msg = msg.split('');
	this.msgY = Math.floor(this.height / 3);
	this.msgX = Math.floor(this.width / 2 - this.msg.length / 2);

}

Matrix.prototype.update = function (display) {


	this.frame++;


	switch (this.frame) {
		case 1:
			this.fillGrid();
			break;
		case 2:
			this.randomize();
			break;
		case 3:
			this.dropChain();
			break;
		case 4:
			this.addShift();
			this.frame = 0;
			break;
	}

	this.draw(display);

};

Matrix.prototype.draw = function (display) {

	var img = document.createElement("canvas");
	img.width = display.width;
	img.height = display.height;
	img.ctx = img.getContext('2d');
	img.ctx.font = this.charSize + 'px Arial';

	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			if (this.grid[x][y] != this.state.EMPTY) {
				//draw char
				img.ctx.fillStyle = this.setColor(x, y);
				img.ctx.fillText(this.grid[x][y], x * this.charSize, y * this.charSize);
			}
		}
	}
	display.ctx.save();
	display.ctx.shadowColor = "#035814";
	display.ctx.shadowBlur = Math.floor(this.charSize / 2);
	display.ctx.drawImage(img, 0, 0);
	display.ctx.restore();

};

Matrix.prototype.addShift = function () {
	for (var index = 0; index < this.width; index++) {
		this.grid[index].unshift(this.state.EMPTY);
		this.grid[index].pop();
	}
};

Matrix.prototype.setColor = function (x, y) {
	var colorGreen = '#06a927';
	var colorWhite = '#C7F64F';
	var colorMsg = '#fff';
	if (y == this.msgY && x >= this.msgX && x <= this.msgX + this.msg.length - 1) {
		for (var i = 0; i < this.msg.length; i++) {
			if (this.grid[x][y] == this.msg[i]) {
				return colorMsg;
			}
		}
	}
	return ((this.grid[x][y + 1] == this.state.EMPTY) ?
		colorWhite : colorGreen);
};

Matrix.prototype.dropChain = function () {
	//максимальная длина цепочки. 0 - бесконечно
	var chainMax = 0;

	for (var x = 0; x < this.width; x++) {
		var chain = 0;
		for (var y = 0; y < this.height; y++) {
			if (this.grid[x][y] != this.state.EMPTY) {
				if (y == this.msgY && x >= this.msgX && x <= this.msgX + this.msg.length - 1) {
					this.grid[x][y] = this.msg[x - this.msgX];
					break;
				}
				if (chainMax != 0) chain++;
				if (chain <= chainMax) {
					if (this.grid[x][y + 1] == this.state.EMPTY) {
						this.grid[x][y + 1] = this.getRandomChar();
						this.grid[x][y + 2] = this.state.EMPTY;
						if (y + 2 < this.height) {
							y = y + 2;
						} else {
							chain = 0;
							break;
						}
					}
					if (chain == chainMax && chainMax != 0) {
						chain = 0;
						break;
					}
				}
			}
		}
	}
};

Matrix.prototype.fillGrid = function () {
	var random = {};
	//количество новых спавнов, добавляемых за один шаг
	var spawnMin = 6;
	var spawnMax = spawnMin * 2;
	random.count = randomRange(spawnMin, spawnMax);
	//заполненность сетки новыми символами
	var fullnessMin = 0.15;
	var fullnessMax = 0.6;
	var fullness = 0;

	for (var index = 0; index < random.count; index++) {
		//определяем новую точку спавна
		random.x = randomRange(0, this.width);
		random.y = randomRange(0, this.height);
		//определяем заполненность колонки, если в допустимых пределах, то наполняем согласно правилам
		fullness = this.columnFillPercent(random.x);
		if (fullness < fullnessMax) {
			//правило определяет будет ли новый символ в случайном месте на сетке или в начале колонки
			if (this.grid[random.x][random.y] == this.state.EMPTY && fullness < fullnessMin) {
				this.grid[random.x][random.y] = this.getRandomChar();
			} else {
				this.grid[random.x][0] = this.getRandomChar();
			}
		}
	}
};
Matrix.prototype.columnFillPercent = function (index) {
	//проверить заполненость колонки
	var count = 0;
	for (var y = 0; y < this.height; y++) {
		if (this.grid[index][y] != this.state.EMPTY) {
			count++;
		}
	}
	return (count / this.height);
};

Matrix.prototype.randomize = function () {
	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			if (this.grid[x][y] != this.state.EMPTY) {
				if (y == this.msgY && x >= this.msgX && x <= this.msgX + this.msg.length - 1) {
					this.grid[x][y] = this.msg[x - this.msgX];
				}else{
					this.grid[x][y] = this.getRandomChar();
				}
			}
		}
	}
};
Matrix.prototype.getRandomChar = function () {
	return this.chars[randomRange(0, this.chars.length - 1)];
};

