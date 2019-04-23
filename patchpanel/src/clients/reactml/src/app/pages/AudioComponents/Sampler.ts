// SubtractiveSynth.ts
// import {BufferLoader} from './buffer-loader' 

export class Sampler{
    // patch
    // oscillator => filter => envelope => volume => output
    private context: AudioContext;
    private bufferNode: AudioBufferSourceNode; // fire and forget... 
    private loader; // BufferLoader()
    
    private loop: boolean = false;
    private audioSamplePath: string[];

    // just a reference to a sample file?

    private envelope: GainNode;
    private volume: GainNode;

    private play: boolean;
    
    private rate: number;
    private startPercentage: number; 
    private stopPercentage: number;

    private attackTime: number; // time to max level
    private releaseTime: number; // time to sustain level
    
    constructor(theContext:AudioContext){
        this.context = theContext;
        
        this.audioSamplePath  = ["./samples/kick.wav"]; 
        this.rate = 1.0; // -1 will play backward
        
        this.startPercentage = 0.0;
        this.stopPercentage = 1.0;

        this.attackTime = 0.01;
        this.releaseTime = 0.3; 
        
        // create envelope and volume gain nodes
        this.envelope = this.context.createGain();
        this.volume = this.context.createGain();
        // connect
        this.envelope.connect(this.volume);
        this.volume.connect(this.context.destination);
        
        // initial vals
        this.play = false;
        
        this.envelope.gain.value = 1.0;
        this.volume.gain.value = 0.5;
    }

    noteOn() {
        let now = this.context.currentTime;
        this.envelope.gain.cancelScheduledValues(now);
        
        // attack time on (exponential ramp was not working here)
        // this will get rid of clicks from starting playing files in the middle of a sound
        this.envelope.gain.linearRampToValueAtTime(1.0, now + this.attackTime) 
        // the loader is called everytime
        this.loader = new BufferLoader(this.context,this.audioSamplePath,this.createBufferAndPlay);
        this.loader.load();
        this.play = true; 
    }

    // createBufferAndPlay()
    // called when loader.load() finishes
    createBufferAndPlay = (bufferList) => {
        if(this.bufferNode != undefined){
            this.bufferNode.loop = false; // stop any currently looping sound
        }

        // bufferList could be an array of many sound files
        // only handling the first here:
        this.bufferNode = this.context.createBufferSource(); //create instance of audiobuffersourceNode
        this.bufferNode.buffer = bufferList[0];
        // connect to output...
        this.bufferNode.connect(this.volume)
        
        // any other modifications need to happen here  (looping mode, playback rate, start/stop time etc)
        this.bufferNode.buffer.duration
        this.bufferNode.playbackRate.value = this.rate;
        this.bufferNode.loop = this.loop;
        if (this.loop){
            this.bufferNode.loopStart = this.getStartTime();
            this.bufferNode.loopEnd = this.getStopTime();
            this.bufferNode.start(this.context.currentTime, this.getStartTime());
        }else{
            this.bufferNode.start(this.context.currentTime, this.getStartTime(), this.getStopTime());
        }
        
    }
    
    noteOff = () => { // for loop mode?
        // let now = this.context.currentTime;
        // this.envelope.gain.cancelScheduledValues(now);
        // this.envelope.gain.exponentialRampToValueAtTime(0.001, now + this.releaseTime)

        this.bufferNode.stop();
        this.envelope.gain.setValueAtTime(0, this.context.currentTime); // now!
        this.play = false;
    }


    loadSample(newSample: string){
        console.log(newSample);
        this.audioSamplePath = [newSample];
    }

    setLoop(loopValue:boolean){
        this.loop = loopValue;
        // if we're currently looping this will go to false and stop the current loop. 
        // without this the bufferNode.buffer would continue to loop with no way to stop
        if(this.bufferNode != undefined){
            this.bufferNode.loop = this.loop;
        }
    }

    setVolume(level:number){
        this.volume.gain.value = level;
    }
    
    setRate(newRate:number){ 
        this.rate = newRate;
        if(this.bufferNode != undefined){
            this.bufferNode.playbackRate.value = this.rate;
        }
    }
    
    // setStartPercentage()
    // start plahead at
    // 0 = beginning; 1 = end of sample
    setStartPercentage(newStartPercentage:number){ 
        this.startPercentage = newStartPercentage;
        // in case we're looping
        if(this.bufferNode != undefined){
            this.bufferNode.loopStart = this.getStartTime();
        }
    }

    getStartTime(){
        return this.startPercentage * this.bufferNode.buffer.duration;
    }

    setStopPercentage(newStopPercentage:number) // play/loop til // 0 = beginning 1 = end
    {
        this.stopPercentage = newStopPercentage;
        // in case we're looping
        if(this.bufferNode != undefined){
            this.bufferNode.loopEnd = this.getStopTime();
        }
    }

    getStopTime(){
        return this.stopPercentage * this.bufferNode.buffer.duration;
    }

    record(setState:boolean){
        if(setState){
            console.log("start recording from mic");
        }
        else{
            console.log("stop recording and load new sample")
        }
    }

    setEnvA(newA:number){
        this.attackTime = newA;
    }
    setEnvR(newR:number){
        this.releaseTime = newR;
    }
}

// ***************************************
// BufferLoader()
//
// helper functions to deal with loading the audio file into a buffer
// based on this: http://middleearmedia.com/web-audio-api-bufferloader/
// ***************************************
function BufferLoader(context, urlList, callback) {
	this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    var request = new XMLHttpRequest(); 
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            }    
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');        
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
    return this;
}