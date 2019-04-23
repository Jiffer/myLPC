interface dataRange{
    min: number;
    max: number;
}
export class data2D {
    type: string = "data2D";
    name: string;
    data: number[] = [0, 0];
    range: dataRange[] =[{min: 0, max: 1}, {min: 0, max: 1}] ;
    

    constructor(name?: string){ // data:{xIn:number, yIn:number, zIn:number, s:number}
        this.name = name;
    }

    setMin(index, newRange):void{
        this.range[index].min = newRange;
    }
    setMax(index, newRange):void{
        this.range[index].max = newRange;
    }

    setData(index, value): void{
        this.data[index] = value;

        // automatically update scale range
        if(value > this.range[index].max){
            this.range[index].max = value;
        }
        if(value < this.range[index].min){
            this.range[index].min = value;
        }
    }

    getScaled(index):number{
        var fullRange = this.range[index].max - this.range[index].min;
        return (this.data[index] - this.range[index].min) / fullRange;
    }

    getScaledData():number[]{
        
        let dataArray: number[] = []; 
        for(var i = 0; i < this.data.length; i++){
            var fullRange = this.range[i].max - this.range[i].min;
            dataArray.push((this.data[i] - this.range[i].min) / fullRange)
        }
        return dataArray;
    }
}