import {Image, Pixel} from "./bitmap"
//import {Input, createDataObject} from "./connection"
import {Data} from "./data"

/*
if (Pixel typeof(Data) {
    console.log("it is")
}
else console.log("it isn't")
*/

let mydata =  [50, 65, 155, 0, 204, 10, 50, 0]


let myarray = [ [5], [1], [6], [8]]


let flattened = (array:number[][]) => array.reduce( 
    (a, b) => {
        return a.concat(b);
    }, 
    
)

console.log(flattened(myarray));



let ndarr = [[2, 5]]

console.log(ndarr[0].length)



/*let data:Input = {
    data: mydata
}

let pixArr = new Array<Pixel>()

console.log(pixArr)
console.log(pixArr[0])



let yesss = createDataObject(data, "image")

console.log(yesss)

for (let i = 0; i<(mydata.length/4); i++) {
                console.log(i)
                let j = i*4  //use to access correct place
                pixArr[i] = new Pixel(mydata[j], mydata[j+1], mydata[j+2])
                //pixArr[i].r = mydata[j];
                //pixArr[i].g = mydata[j+1];
                //pixArr[i].b = mydata[j+2];
                console.log("pixel " + i + " = " + pixArr[i])
}
*/


//console.log(pixArr)
//console.log(pixArr[0])
//console.log(pixArr[1])


/*
console.log(data.data)
let myPixel = new Pixel(50, 40, 102)
console.log(myPixel)
console.log(myPixel.brightness())
*/

/*
let pixArr:Pixel[]

let length = 2

pixArr[0] = new Pixel(4, 5, 6)
//pixArr[0].b 

console.log("pixArr 0 = " + pixArr[0])
console.log("blue of pix0 = " + pixArr[0].b)
*/
/*
for (let i = 0; i<data.data.length-3; i+=4) {
                let j = i*4  //use to access correct place
                pixArr[i].r = data.data[j];
                pixArr[i].g = data.data[j+1];
                pixArr[i].b = data.data[j+2];
}
*/

//let myImage = new Image(data, "image")
//console.log(myImage)


/*
class MimeDeclaration {
    mimeType:MimeType;
    humanReadableType:string;

    constructor(mimeType:MimeType, humanReadableType:string) {
        this.mimeType = mimeType;
        this.humanReadableType = humanReadableType;
    }
}

class Mid {
    static theMime:MimeType = new MimeType;
    static mime:MimeDeclaration = new MimeDeclaration(
        Mid.theMime, "audio")
}
*/

//let hello = new Mid()

//console.log(hello.theMime);



/*
console.log("hello");


let arr:number[] = [3,5,8,14, 34.2, 23.6];


let udat:Uint8Array = new Uint8Array(arr);



console.log(arr)
console.log(udat)

interface AccelMBit {
    x: number;
    y: number;
    z: number;
    s: number;
}

let testaccel:AccelMBit = {x:0, y:2, z:4, s:3}

let num = 5
let tester:number[] = [2,4,5,6]

let isNumArr = (input):input is number[] => {
    //return (<number[]>input) !== undefined
    return Array.isArray(input);    //predefined for number[]
}

    //console.log((input as number) !== undefined)
    //return false //(<number>input) !== undefined


let str = "hello world"
//console.log(parseInt(str))
/*
console.log(isNumArr(tester));
console.log(isNumArr(num));
console.log(isNumArr(str));
console.log(isNumArr(testaccel));

*/

/*
console.log(Array.isArray(tester))
console.log(Array.isArray(num))
console.log(Array.isArray(str))
console.log(Array.isArray(testaccel))




let listoflists: number[][] = [[2,4], [3,5], [1,4,6]]


console.log(listoflists.length) 

//console.log("str : " + Array.isArray(str))

//console.log(typeof(str))


//console.log(typeof(tester))

//console.log(tester instanceof Array);

/*
let listoflists: number[][] = [[2,4], [3,5]]

console.log(typeof(listoflists));
console.log(listoflists);

interface AccelMBit {
    x: number;
    y: number;
    z: number;
    s: number;
}

let testaccel:AccelMBit = {x:0, y:2, z:4, s:3}

console.log(testaccel);
console.log(typeof(testaccel));

function isAccelMBit(data:any): data is AccelMBit {
    return (<AccelMBit>data).x !== undefined;
}

console.log(isAccelMBit(testaccel));
console.log(isAccelMBit(tester));

let isAMBit = (data):data is AccelMBit => (<AccelMBit>data).x !== undefined;
//console.log((tester):tester is AccelMBit => (<AccelMBit>tester).x !== undefined)

console.log(isAMBit(tester));
console.log(isAMBit(testaccel));
//let inc = (x) => (x+1)


//type Accel<T> = AccelMBit

//console.log(typeof(testaccel));
*/