var five = require("johnny-five"),
    board, tempSensor;
board = new five.Board();
board.on("ready", function() {
  // Confuguração do Sensor
  tempSensor = new five.Sensor({
    pin: 'A0',
    controller: "TMP36"
  });
  // Sensor function
  tempSensor.on("change", function(err, reading) {
    var voltage = reading * .004882814;
    // Em Celsius
    var temp = ((voltage - .5) * 100);
    // ou Fahrenheit
    // var temp = (((voltage - .5) * 100)*1.8) + 32;
    console.log("Temp: " + temp );
  });
});
