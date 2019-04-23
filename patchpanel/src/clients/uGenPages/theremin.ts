import {getDataConnection} from '../client'
import * as mbit from '../../../dataTypes/myMbitData'
import * as bt from '../bt'
import * as midi from '../../../dataTypes/midi'
//////////////////////////////
var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

let makeVoice = function(freq:number){
 
  this.osc = new p5.Oscillator('sine');
  //this.osc.setType('triangle');  
  this.osc.freq(freq);
  
 // create an envelope to structure each note
  //this.attackLevel = 0.8;
  //this.releaseLevel = 0;
  //this.attackTime = 0.001; // 
  //this.decayTime = 0.3;
  //this.susPercent = 0.5; // no sustain
  //this.releaseTime = 1.0;
  /*
  this.env = new p5.Env();
  this.env.setExp(true);
  this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
  this.env.setRange(this.attackLevel, this.releaseLevel);
  
  this.osc.amp(this.env);
  this.osc.start();
  */
  
  /* 
  this.playEnv = function() {
    //this.env.play();
    this.env.triggerAttack();
  }
  this.releaseEnv = function() {
    //this.env.play();
    this.env.triggerRelease();
  }
  */
}

let newfrequency:number = 220;
let oldfrequency:number = 220;
let movingavgfrequency:number;
let inputConnection = null;   //type DataConnection
let carrier: typeof p5.Oscillator; // = new p5.Oscillator('sine')
let modampval:number = 0;
//carrier.freq(220);
//carrier.amp(0.3);

let analyzer: typeof p5.FFT;

let modulator: typeof p5.Oscillator; // = new p5.Oscillator('sine');
console.log('up here');
//modulator.freq(5);
//modulator.amp(-4.5);

//carrier.osc.amp(0.3);
//carrier.amp(0);
//console.log('after settings');

let togglevibrato = false

function setupDataConnectionStuff() {
  // Elements
  // input room stuff
    let inputRoomForm = <HTMLFormElement> document.getElementById('input-room-form')
    let inputRoomBox = <HTMLInputElement> document.getElementById('input-room-box')
    let inputRoomSubmitButton = <HTMLInputElement> document.getElementById('input-room-button') 


    let handleDataReceived = (key:string, value:any)=> {
        //console.log('key: ' + key + ', value: ' + value + ', valtyp' + typeof(value));
        if (key == 'midi' && value == typeof(midi.JifferSeqMidi)) {
            //value is an object here
        }
        else if (key == 'note' && typeof(value) == 'number') {

            newfrequency = paramToFreq(value) + 40;    //range is 40 to 880
            movingavgfrequency = oldfrequency*0.5+newfrequency*0.5;
            carrier.freq(movingavgfrequency, 0.2);
            oldfrequency=movingavgfrequency;
        }

        else if (key == 'vibrato' && typeof(value) == 'number' ) {
            // may need to put in a check to value is between 0 and 1 (Scaled)
            if (togglevibrato){
                modampval = (value-0.5)*100;
                console.log('vibrato value: ' + value + ', modampval :' + modampval);
            }
        }
        else if (key == 'toggle vibrato' && (value.type == 'abutton' || value.type == 'bbutton')) {
            if (value.data) {
                console.log('vibrato on')
                togglevibrato = true
            }
            else {
                togglevibrato = false
                modulator.amp(0);
            }
        }
        else if (key == 'volume' && typeof(value) == 'number') {
            console.log('volume is ' + value);
            carrier.osc.amp(value);
        }
        else {
            //console.log('error, key: ' + key + ' value: ' + value + 'w/typeof: ' + typeof(value))
            //throw new Error('value passed is type: ' + typeof(value) + ', must be of type midi or number')
        }
    }

    inputRoomForm.addEventListener('submit', function (e:Event) {
        e.preventDefault()
        console.log("joining room " + inputRoomBox.value)
        inputConnection = getDataConnection(inputRoomBox.value)
        inputRoomBox.disabled = true
        inputRoomSubmitButton.disabled = true

        inputConnection.onDataReceived((key:string, value:any) => {
            handleDataReceived(key, value)
        })
    });

}


let ourSketch = new p5( (sketch) => {

    sketch.setup = () => {
        setupDataConnectionStuff();
        carrier = new p5.Oscillator('sine');
        carrier.amp(0.3);
        carrier.freq(220);
        carrier.start();

        modulator = new p5.Oscillator('sine')
        modulator.start();
        modulator.disconnect();
        carrier.freq(modulator);

        let canvas = sketch.createCanvas(800, 400);
        sketch.background(100);

        analyzer = new p5.FFT();

        modulator.freq(4.4);
        modulator.amp(7.8);

        toggleAudio(canvas);

    }

    sketch.draw = () => {

        if (togglevibrato) {
            modulator.amp(modampval);
            carrier.freq(modulator);
        }
        else {
            //console.log('carrier freq normal');
        }
                

    }
})

let paramToFreq = function(param:number):number {
    let scaled_exp = ((param*100)-69)/12
    return 440 * Math.pow(2, scaled_exp)
}

let getFrequency = function(midi_code:number):number {
    let offset_code = midi_code - 69;
    if (offset_code > 0) {
        return (440 * Math.pow(2, offset_code / 12)) as number;
    } else {
        return (440 / Math.pow(2, -offset_code / 12)) as number;
    }
}

function toggleAudio(cnv) {
  cnv.mouseOver(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 1.0);
  });
}


