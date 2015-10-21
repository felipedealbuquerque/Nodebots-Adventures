// Oled js para o DevFestNe
// Draft my litle oled
// 17/10/2015

// Todos os Requires
// foram importados e instalados com o Node.js
// Linha de comando: npm install nomedomodulo

// Importa o framework Johnny-five.io
var five = require("johnny-five");

/* Configurações para a placa */
// cria um objeto
var opts = {};
// Passa os valores para a porta COM6
opts.port = process.argv[2] || "COM6";

// Cria a placa passando as configurações
var board = new five.Board(opts);

/* libs npm */
// Habilita interações com teclado
var keypress = require("keypress");
// Componente eletrônico de tela oled
var Oled = require('oled-js');
// Lib para escrever textos "strings"
var font = require('oled-font-5x7');
// para desenhar um PNG
var pngparse = require('pngparse');
// outra lib para desenhar na tela
var pngtolcd = require('png-to-lcd');

/* O Johnny-five permite metodos parecidos
		com o jQuery e pode ser orientado a eventos
*/

// Quando a placa estiver pronta
board.on("ready", function() {
	/***
	* Configurações do Oled
	***/
	var optsOled = {
		  // Largura da tela
	    width: 128,
			// Altura
	    height: 64,
			// Drive do componete eletrônico
	    address: 0x3C
	  };
		/***
		* Cria a Tela
		***/
	var oled = new Oled(board, five, optsOled);
	// Seta o cursor de X e Y dos pixels que serão escritos na tela Oled
	oled.setCursor(1, 1);
	// Metodo da lib "oled-font-5x7" para escrever strings
	oled.writeString(font, 2, 'JavaScript no Hardware!', 1, true);

	/* Configurações para controlar pelo teclado */
 	// configure stdin for the keyboard controller
 	process.stdin.resume();
 	process.stdin.setEncoding("utf8");
 	process.stdin.setRawMode(true);

/***
* Ao apertar uma tecla
***/
 	process.stdin.on("keypress", function(ch, key){
 		if(!key){
 			return;
 		}

		// Metodo do oled-js para limpar a tela
		oled.clearDisplay(true);

 		if(key.name == 'q'){
			// printar no console
 			console.log('Desligando :( ');
			// Move os ponteiros do X e Y
			oled.setCursor(1, 1);
			// Escreve a string
			oled.writeString(font, 2, 'Desligando :( ', 1, true);
			// Desliga a tela
			oled.turnOffDisplay();
			// Desliga o programa
 		 	process.exit();
 		} else if(key.name == 'u'){
			oled.update(); // Atualiza a tela
 		} else if(key.name == 'd'){
			// devfeste png
			pngtolcd('img/DevFestNe.png', true, function(err, bitmap) {
				oled.buffer = bitmap;
				oled.update();
			});
	 } else if(key.name == 'f'){
			// brasil png
			pngtolcd('img/brasil.png', true, function(err, bitmap) {
				oled.buffer = bitmap;
				oled.update();
			});
 		} else if(key.name == 'g'){
			// google png
			pngtolcd('img/google.png', true, function(err, bitmap) {
				oled.buffer = bitmap;
				oled.update();
			});
 		} else if(key.name == 'h'){
			// rino png
			pngtolcd('img/rino.png', true, function(err, bitmap) {
				oled.buffer = bitmap;
				oled.update();
			});
	 	} else if(key.name == 'j'){
			// logo javascript
			pngtolcd('img/js.png', true, function(err, bitmap) {
				oled.buffer = bitmap;
				oled.update();
			});
 		}	else if(key.name == 'c'){
			// limpa a tela
			oled.clearDisplay(true);
		} else if(key.name == 'o'){
			oled.turnOffDisplay();
		} else if(key.name == 'l'){
			oled.turnOnDisplay();
			oled.setCursor(1, 1);
			oled.writeString(font, 2, 'Ligado :) ', 1, true);
		} else if(key.name == 'i'){
			oled.invertDisplay(true);
		}	else if(key.name == 'n'){
			oled.invertDisplay(false);
		}
 	});
});
