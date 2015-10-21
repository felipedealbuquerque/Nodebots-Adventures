var five = require("johnny-five");
var songs = require("j5-songs");
var keypress = require("keypress");
var Oled = require('oled-js');
var font = require('oled-font-5x7');

keypress(process.stdin);

var opts = {};
opts.port = process.argv[2] || "COM3";
var board = new five.Board(opts);

board.on("ready", function() {
	console.log('Olá JSday, eu sou o Robô do Felipe!');
	console.log('Eu sou feito com o framework Johnny-five');
	console.log('Use o teclado para me controlar!');
/***
* Bot vars Config
***/

	// Oled Config
	var optsOled = {
    width: 128,
    height: 64,
    address: 0x3C
  };
	// Nova instancia do Oled
	var oled = new Oled(board, five, optsOled);

	// Songs
	var piezo = new five.Piezo(5);
	// var trackSong;

	// Led: heart
	var led = new five.Led(11);

	// Temperature Sensor
	var temperatureSensor = new five.Sensor({
		controller: "TMP36",
		pin: "A0"
	});

	// Servo
	var servo = new five.Servo({
		pin: 3,
		center: true,
		range: [45, 135]
	});

	var servoHead = new five.Servo({
		pin: 4,
		center: true,
		range: [45, 155]
	});

	// Sonar
	var sonar = new five.Ping(2);

	// Configurações do Motor
  var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;
  var left_wheel = new five.Motor(configs.M1);
 	var right_wheel = new five.Motor(configs.M2);
	var botVelocity = 255; // max speed

	// Songs
	function playSong(track){
		var song = songs.load(track);
		piezo.play(song);
	}
	function stopSong(){
		piezo.stop();
	}

	// Check Temperature
	function checkTemperature(){
			temperatureSensor.on("change", function(err, reading) {
			var voltage = reading * .004882814;
			// For Celsius
			var temperature = ((voltage - .5) * 100);
			console.log("Temp: " + parseInt(temperature));
			// For Fahrenheit
			// var temperature = (((voltage - .5) * 100)*1.8) + 32;
		});
	};

/***
* Wheels functions control
***/
	function runForword(botVelocity){
		console.log('**** Andar para frente! ****');
		left_wheel.forward(botVelocity);
		// Invertido propositalmente
		right_wheel.reverse(botVelocity);
	}

	function runReverse(botVelocity){
		console.log('**** Andra para trás ****');
		left_wheel.reverse(botVelocity);
		right_wheel.forward(botVelocity);
	}

	function runLeft(botVelocity){
		console.log('**** Andar para esquerda ****');
		left_wheel.forward(botVelocity);
		right_wheel.reverse(100);
	}

	function runRight(botVelocity){
		console.log('**** Andar para direita ***');
		left_wheel.forward(100);
		right_wheel.reverse(botVelocity);
	}

	function stopBot(){
		console.log('**** Parar o robô ***');
		// servo stop
		servo.stop();
		servoHead.stop();
		// wheels stopping
		left_wheel.stop();
		right_wheel.stop();
	}

/*** Sonar on ***/
function activeSonar(){
	sonar.on("change", function(err,val) {
		var proximity = parseInt(this.cm);
		console.log("Objeto identificado em: " + proximity + " cm");
		// Crash identify, stop bot
		if(proximity < 20){
			console.log("*** Objeto muito proximo, colisão estima em: " + proximity + " cm ****");
			led.on();
			stopBot();
			playSong('mario-intro');
		} else {
			led.off();
		}
	});
}

/***
* Keyboard Control
* Controle do Robô
***/

	// configure stdin for the keyboard controller
	process.stdin.resume();
	process.stdin.setEncoding("utf8");
	process.stdin.setRawMode(true);
 	process.stdin.on("keypress", function(ch, key){
 		if(!key){
 			return;
 		}

 		if(key.name == 'q'){
 			console.log('quitting');
 			process.exit();
 		} else if(key.name == 'up'){
			runForword(botVelocity);
 		} else if(key.name == 'down'){
			runReverse(botVelocity);
 		} else if(key.name == 'left'){
			runLeft(botVelocity);
 		} else if(key.name == 'right'){
			runRight(botVelocity);
 		} else if(key.name == 'space'){
			stopBot(botVelocity);
 		} else if(key.name == 'e'){
			console.log('Movimenta horizontalmente a cabeça do robo');
			servo.sweep();
		} else if(key.name == 't'){
			console.log('Movimenta horizontalmente a cabeça do robo');
			servoHead.sweep();
 		} else if(key.name == 'r'){
			console.log('Para a cabeça do robo');
			servo.stop();
			servoHead.stop();
 		} else if(key.name == 'a'){
			playSong('beethovens-fifth');
		} else if(key.name == 's'){
			playSong('mario-intro');
		} else if(key.name == 'd'){
			playSong('tetris-theme');
		} else if(key.name == 'f'){
			playSong('starwars-theme');
		} else if(key.name == 'g'){
			piezo.play('beethovens-fifth');
		} else if(key.name == 'm'){
			activeSonar();
		} else if(key.name == 't'){
			checkTemperature();
		}else if(key.name == 'o'){
			oled.setCursor(1, 1);
			oled.writeString(font, 3, 'Meetup', 1, true);
		}

 	});

	// Repl inject
			board.repl.inject({
				left_wheel: left_wheel,
				right_wheel: right_wheel,
				temperatureSensor: temperatureSensor,
				sonar: sonar
			});
});
