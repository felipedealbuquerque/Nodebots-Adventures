var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function(){
	// Working
	console.log("asdasd");
	  var ping = new five.Ping(7);     // digital pin 4
	  ping.on("change", function(err,val) {
		console.log("Distance " + this.cm + " cm");
	  });
	  
 /* var sonar = new five.Sonar(7);

  function display(type, value, unit) {
    console.log("%s event: object is %d %s away", type, value, unit);
  }

  sonar.on("data", function() {
    display("data", this.inches, "inches");
  });

  sonar.on("change", function() {
    display("data", this.inches, "inches");
  });*/
	 
});