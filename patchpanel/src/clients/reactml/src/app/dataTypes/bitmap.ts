import {Indata} from "./connection"
import {Data} from "./data"

export interface IPixel extends Indata {
    data: {
        r: number; g: number; b: number; a: number;
    }
}

export class Pixel extends Data { //implements Data
    type = "Pixel";
    data: {
        r: number; 
        g: number; 
        b: number;
    }
    brightness = function():number {
        return (this.r+this.g+this.b)/3
    }
    constructor(indata:IPixel, name?:string) {
        super(indata)
        this.name = name;
        this.data.r = indata.data.r
        this.data.g = indata.data.g
        this.data.b = indata.data.b
    }
}

export class Image { //image, rewrite 
    name: string = "Image"
    data: number[];
    type:string = "image";
    image: Pixel[];
    len: number;
    brightness = function():number {
        let bright = 0;
        this.image.forEach( 
            (pixel:Pixel) => bright += pixel.brightness()
        )
        return Math.round(bright/this.len);
    }
    avgColor = function():number[] {
        let rgbCount:number[] = [0,0,0]
        this.image.foreach(
            (pixel:Pixel) => {
            rgbCount[0] += pixel.data.r; 
            rgbCount[1] += pixel.data.g;
            rgbCount[2] += pixel.data.b;
            }
        )
        for (let i=0; i<3; i++) {
            rgbCount[i] /= this.len;
        }
        return rgbCount;
    }

    constructor(indata:IPixel[], name?:string) {
        this.name = name
        this.type = indata[0].type
        this.len = 0;
        for (let i = 0; i<(indata.length); i++) {
            this.image[i] = new Pixel(indata[i])
            this.len++;
        }
        //dont need opacity (a) in rgba right now
    }
}
        //if (typeof(data.data) == "object") { //for some reason typeof(number[]) == object
        //if (Array.isArray(data.data)) {     //typeguard to check that data is coming in as an array