import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

var osc, fft;
var freq = 60;
var amp = .5;

function setupDataConnectionStuff() {
  // Elements
  var roomForm = <HTMLFormElement> document.getElementById('room-form')
  var roomBox = <HTMLInputElement> document.getElementById('room-box')
  var roomSubmitButton = <HTMLInputElement> document.getElementById('room-button') 

  var connection = null;

  let handleDataReceived = (key:string, value:any)=> {
    if (key == "volume"){
        amp = value/100.0;  //will arrive as 1-100
    }else if (key == "freq"){
        freq = value;
    }else{
        console.log("received unknown data key: " + key )
    }
  }

  roomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + roomBox.value)
    connection = getDataConnection(roomBox.value)
    roomBox.disabled = true
    roomSubmitButton.disabled = true

    connection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })
}

var ourSketch = new p5( (sketch) => {
    sketch.setup = () => {
        setupDataConnectionStuff();

        sketch.createCanvas(720, 256);

        osc = new p5.TriOsc(); // set frequency and type
        osc.amp(.5);

        fft = new p5.FFT();
        osc.start();
    }

    sketch.draw = () => {
        sketch.background(255);

        var waveform = fft.waveform();  // analyze the waveform
        sketch.beginShape();
        sketch.strokeWeight(5);
        for (var i = 0; i < waveform.length; i++){
            var x = sketch.map(i, 0, waveform.length, 0, sketch.width);
            var y = sketch.map(waveform[i], -1, 1, sketch.height, 0);
            sketch.vertex(x, y);
        }
        sketch.endShape();

        osc.freq(freq);
        osc.amp(amp);
    }
});

