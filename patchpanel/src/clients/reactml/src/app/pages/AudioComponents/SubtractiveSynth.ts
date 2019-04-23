// SubtractiveSynth.ts

export class SubtractiveSynth{
    // patch
    // oscillator => filter => envelope => volume => output
    private context: AudioContext;
    private synthOscillators: OscillatorNode[]; // "sine" || "square" || "sawtooth" || "triangle" || "custom"
    private numVoices: number;
    private lowPassFilter: BiquadFilterNode;
    private envelopes: GainNode[];
    private volume: GainNode;
    private glide: number; // sometimes called portamento
    private attackTime: number; // time to max level
    private decayTime: number; // time to sustain level
    private sustain: number;  // level
    private releaseTime: number; // time to 0
    private noteIsOn: boolean;
    
    
    constructor(theContext:AudioContext, numVoices:number){
        // initial settings
        this.glide = 0.01;
        this.attackTime = 0.01;
        this.decayTime = 0.3;
        this.sustain = .2;
        this.releaseTime = .5; 

        this.numVoices = 13;
        // oscillator waveform
        this.context = theContext;

        let oscillatorArray=[];
        
        for(let i = 0; i<this.numVoices; i++){
            let anOscillator = this.context.createOscillator();
            oscillatorArray.push(anOscillator);
        }
        
        // this.synthOscillator = [this.context.createOscillator(), this.context.createOscillator()];
        this.synthOscillators = oscillatorArray;
        
        // initialize notes:
        for(let i = 0; i<this.numVoices; i++){
            this.synthOscillators[i].frequency.value = this.midiToFrequency(6*12-i); // starts at the top note
        }
        
        // this.synthOscillator.type = waveform;
        // filter
        this.lowPassFilter = this.context.createBiquadFilter();
        this.lowPassFilter.type = "lowpass";
        this.lowPassFilter.frequency.value = 5000;
        this.lowPassFilter.Q.value = 5;
        // create envelop (one per voice) and single volume gain nodes
        let envArray = []
        for(let i = 0; i<this.numVoices; i++){
            let anEnvelope = this.context.createGain();
            envArray.push(anEnvelope);
        }

        this.envelopes = envArray;
        this.volume = this.context.createGain();
        // connect
        for(let i = 0; i<this.numVoices; i++){
            // all the voices go through a shared filter, envelope, and volume control
            this.synthOscillators[i].connect(this.envelopes[i]);
            this.envelopes[i].connect(this.lowPassFilter);
        }
        // this.synthOscillator.connect(this.lowPassFilter);
        
        this.lowPassFilter.connect(this.volume);
        this.volume.connect(this.context.destination);
        
        // initial vals
        this.noteIsOn = false;
        for(let i = 0; i<this.numVoices; i++){
            this.envelopes[i].gain.value = 0.0;
        }
        this.volume.gain.value = 0.5;
        // calculate!
        
        for(let i = 0; i<this.numVoices; i++){
            this.synthOscillators[i].start();
        }
        // this.synthOscillator.start();
    }

    noteOn(voice: number, value:boolean){
        if(value){
            let now = this.context.currentTime;
            this.envelopes[voice].gain.cancelScheduledValues(now);
            
            // attack time on (exponential ramp was not working here)
            this.envelopes[voice].gain.linearRampToValueAtTime(1.0, now + this.attackTime)
            // go to sustain level in decayTime after attackTime
            this.envelopes[voice].gain.setTargetAtTime(this.sustain, now + this.attackTime, this.getTimeConstant(this.decayTime))
            this.noteIsOn = true;
        }else{
            let now = this.context.currentTime;
            this.envelopes[voice].gain.exponentialRampToValueAtTime(0.001, now + this.releaseTime)
            this.noteIsOn = false;
        }

    }

    checkNoteOn(){
        return this.noteIsOn;
    }

    noteOff(voice: number){
        let now = this.context.currentTime;
        this.envelopes[voice].gain.exponentialRampToValueAtTime(0.001, now + this.releaseTime)
        this.noteIsOn = false;
    }

    setVolume(level:number){
        this.volume.gain.value = level;
    }
    // set synth frequency (Hz)
    setFrequency(voice:number, freq:number){
        let now = this.context.currentTime;
        
        this.synthOscillators[voice].frequency.value = freq;
        
        // this.synthOscillator.frequency.cancelScheduledValues(now); 
        // this.synthOscillator.frequency.setValueAtTime(freq, now + glide?);
        // this.synthOscillator.frequency.value = freq;
    }
    // set synth frequency using MIDI note numbers
    setNote(voice: number, note:number){ 
        this.setFrequency(voice, this.midiToFrequency(note));
        // this.synthOscillator.frequency.linearRampToValueAtTime(this.getFrequency(note), now + this.glide);
    }
    setGlide(newGlide:number){ 
        this.glide = newGlide;
    }
    setWaveform(waveform: OscillatorType){
        for(let i = 0; i<this.numVoices; i++){
            this.synthOscillators[i].type = waveform;
        }
        
    }
    // Filter
    setFilterCutoff(freq:number){
        this.lowPassFilter.frequency.value = freq;
    }
    setFilterQ(newQ:number){
        this.lowPassFilter.Q.value = newQ;
    }
    setEnvA(newA:number){
        this.attackTime = newA;
    }
    setEnvD(newD:number){
        this.decayTime = newD;
    }
    setEnvS(newS:number){
        this.sustain = newS;
    }
    setEnvR(newR:number){
        this.releaseTime = newR;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////
    // calculate time constant to use with .setTargetAtTime()
    ////////////////////////////////////////////////////////////////////////////////////
    private getTimeConstant(time){
        return Math.log(time+1)/Math.log(100)
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // getFrequency()
    // converts a MIDI note number to Frequency
    // math from:
    // https://sigusrone.com/articles/building-a-synth-with-the-web-audio-api-part-two 
    ////////////////////////////////////////////////////////////////////////////////////
    private midiToFrequency = function(midi_code:number):number {
        let offset_code = midi_code - 69;
        if (offset_code > 0) {
            //return Number(440 * Math.pow(2, offset_code / 12));
            return (440 * Math.pow(2, offset_code / 12)) as number;
        } else {
            //return Number(440 / Math.pow(2, -offset_code / 12));
            return (440 / Math.pow(2, -offset_code / 12)) as number;
        }
    }   
}