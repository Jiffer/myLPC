// Microbit DataTypes

// *** Contains Temperature, Brightness, Compass, and Acceleration Data Types   

export class aButton {
    type: string = "abutton"
    name: string;
    data: number = 0;

    constructor(name?:string) {
        this.name = name;
    }
    setData = function(pressed:number) {
        this.data = pressed
    }
}

export class bButton extends aButton {
    type: string = "bbutton"
}

export class temperatureData {
    type: string = "temperature"
    name: string;
    data: number = 21  //default temp - in Celsius

    constructor(name?: string) {
        this.name = name
    }

    getTemp = function():number {
        return this.data
    }

    getTempInF = function():number {
        return (this.data)*1.8 + 32
    }

    getTempInK = function():number {
        return this.data + 273.15
    }

    //temperature range is from -5 to 50 C for microbit

    getScaledTemp = function():number {
        return (this.data + 5)/55
    }

    setTemp = function(temp:number, metric?:string):void {
        if (metric) {
            if (metric.toLowerCase() == 'c' || metric.toLowerCase() == 'celsius') {
                this.data = temp
            }
            else if (metric.toLowerCase() == 'f' || metric.toLowerCase() == 'farenheit') {
                this.data = (temp - 32)*0.556
            }
            else if (metric.toLowerCase() == 'k' || metric.toLowerCase() == 'kelvin') {
                this.data = temp - 273.15
            }
            else {
                throw new Error("the temperature metric parameter must be empty, or take the following strings: 'Celsius', 'C', 'Farenheit', 'F', or 'Kelvin', 'K'")
            }
        }
        else {
            this.data = temp
        }
    }

}

export class brightnessData {
    type: string = "brightness";
    name: string;
    data: number = 0;   //default brightness

    constructor(name?:string) {
        this.name = name
    }

    getBrightness = function():number {
        return this.data
    }

    setBrightness = function(lightlevel:number):void {
        this.data = lightlevel
    }

    getScaledBrightness = function():number {
       return this.data/255 
    }
}

export class directionData {
    type: string = "direction";
    name: string;
    data: number = 0;

    constructor(name?:string) {
        this.name = name
    }

    getDirection = function():number {
        return this.data
    }

    setDirection = function(direction:number):void {
        this.data = direction
    }

    getScaledDirection = function():number {
        return this.data/360
    }
}


export class accelerometerData {
    type: string = "accelerometer";
    name: string;
    data: number[] = [0,0,0,0];

    constructor(name?: string){ // data:{xIn:number, yIn:number, zIn:number, s:number}
        this.name = name;

    }

    getX():number{
        return this.data[0];
    }
    getY():number{
        return this.data[1];
    }
    getZ():number{
        return this.data[2];
    }
    getS():number{
        return this.data[3];
    }

    getScaledX():number{
        return (this.data[0] + 2048)/4096;
    }
    getScaledY():number{
        return (this.data[1] + 2048)/4096;
    }
    getScaledZ():number{
        return (this.data[2] + 2048)/4096;
    }
    getScaledS():number{
        return (this.data[3])/2048;
    }

    getScaledData(): number[]{
        return [this.getScaledX(), this.getScaledY(), this.getScaledZ(), this.getScaledS()];
    }

    setX(x){
        this.data[0] = x;
    }
    setY(y){
        this.data[1] = y;
    }
    setZ(z){
        this.data[2] = z;
    }
    setS(s){
        this.data[3] = s;
    }
}

