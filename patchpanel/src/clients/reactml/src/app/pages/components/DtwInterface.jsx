
import React, {Component} from 'react';
import {render} from 'react-dom';


export class DtwDraw extends Component {

    constructor(props) {
        super();
    }


    render() {
        let rectangle = {
            width:400,
            height: 300,
            borderColor: 'black',
            borderStyle: 'solid',
            margin: 'auto',
            paddingLeft: 5,
        }

        return(
            <div style={rectangle}>
            
            </div>
        )
    }
}


export default class DtwInterface extends Component {

    constructor(props) {
        super();
    }


    rapidMix =  window.RapidLib();
    myDTW = new this.rapidMix.SeriesClassification();


    shape1 = document.getElementById("shape1");
    context1 = this.shape1.getContext("2d");
    shape1TrainingSet = [];

    shape2 = document.getElementById("shape2");
    context2 = this.shape1.getContext("2d");
    shape2TrainingSet = [];

    shapeTest = document.getElementById("shapeTest");
    contextTest = this.shape1.getContext("2d");
    testSet = [];

    recordState = 0

    costs = [-1, -1]
    

    getMouse(mousePosition) {
        if (mousePosition.layerX || mousePosition.layerX === 0) {
            mouseX = mousePosition.layerX;
            mouseY = mousePosition.layerY;
        } else if (mousePosition.offsetX || mousePosition.offsetX === 0) { 
            mouseX = mousePosition.offsetX; 
            mouseY = mousePosition.offsetY;
        }
        var rapidInput = [mouseX, mouseY];
        recorder(rapidInput);
    }

    changeRecordState(e, shapeNumber) {
        switch(shapeNumber) {
            case 1:
                shape1TrainingSet = []
                this.recordState = 1 
                match = -1
                break;
            case 2:
                shape2TrainingSet =[]
                this.recordState = 2
                match = -1
                break;
            case 3:
                this.recordState = 3
        }

        testSet = []

    }

    recorder(trainExample) {
        switch(this.recordState) {
            case 1:
                this.shape1TrainingSet.push({
                    input: trainExample 
                });
                break;
            case 2:
                this.shape2TrainingSet.push({
                    input: trainExample
                });
                break;
            case 3:
                this.testSet.push({
                    input: trainExample
                });
                break;
        }

    }

    finishRecord(e, shapeNumber) {
        recordState = 0

        if (shapeNumber == 3) {
            myDTW.reset();
            myDTW.train([shape1TrainingSet, shape2TrainingSet]);
        }
        match = myDTW.run(testTrainingSet);
        costs = myDTW.getCosts();

    }

    drawInContext(context, tSet) {
        context.clearRect(0,0, 400, 400);
         
        //mouse coordinates
        context.font="16px Verdana";
        context.fillStyle="#859900";
        context.fillText('mouse position: (' + mouseX + ', ' + mouseY + ')' , 20, 390);
        
        context.strokeStyle="#FFFF00";
        context.lineWidth=2;
        if ((context === context1 && match === 0) || (context === context2 && match === 1)) {
            context.lineWidth=10;
            context.strokeStyle="#FF9933";
        } 
        var x = 0;
        var y = 0;
        if (tSet[0]) {
            x = tSet[0].input[0];
            y = tSet[0].input[1];
            context.beginPath();
            context.moveTo(x, y);
            for (let i = 1; i < tSet.length; ++i) {
                x = tSet[i].input[0];
                y = tSet[i].input[1];
                context.lineTo(x,y);
            }
            context.stroke();
            context.closePath();
        }
    }

    draw() {
        
        drawInContext(this.context1, this.shape1TrainingSet);
        drawInContext(this.context2, this.shape2TrainingSet);
        drawInContext(this.contextTest, this.testTrainingSet);
        
        this.contextTest.font="16px Verdana";
        this.contextTest.fillStyle="#859900";
        let matchText = "no match yet";
        switch (match) {
            case -1:
                matchText = "no match yet";
                break;
            case 0:
                matchText = "matches left shape";
                break;
            case 1:
                matchText = "matches right shape";
                break;
        }
        
        this.contextTest.fillText(matchText , 20, 20);
        if (costs[0] > 0) {
        this.contextTest.fillText("match costs:", 20, 40);
        this.contextTest.fillText("left " + costs[0], 25, 60);
        this.contextTest.fillText("right " + costs[1], 25, 80);

        }
        window.requestAnimationFrame(this.draw);
    }

    render() {
        return (
            <div style={{
                    position: 'absolute',
                    left: 10,
                    
                    top: 400,
                    height: 600,
                    width: 1500,
                }}>
                    <h3> Dynamic Type Warping Interface </h3>
                        
                    <h4 style={{textAlign:'center'}}> Draw Two Different Shapes Here </h4>

                    <div style={{display: 'flex'}}>
                        <DtwDraw>
                            <canvas
                                style={{
                                    width:400,
                                    height: 300,
                                }}
                                id='shape1'
                                shape={1} 
                                onMouseMove={this.getMouse} 
                                onMouseDown={this.changeRecordState(1)}
                                onMouseUp={this.finishRecord(1)}
                            />
                        </DtwDraw>
                        <DtwDraw>
                            <canvas
                                style={{
                                    width:400,
                                    height: 300,
                                }}
                                id='shape2' 
                                shape={2}
                                onMouseMove={this.getMouse} 
                                onMouseDown={this.changeRecordState(2)}
                                onMouseUp={this.finishRecord(2)}
                            />
                        </DtwDraw>

                    </div>

                    <h4 style={{textAlign:'center'}}> Classify the shape here </h4>

                    <div >
                        <DtwDraw>
                            <canvas
                                style={{
                                    width:400,
                                    height: 300,
                                }}
                                id='shapeTest' 
                                shape={3} 
                                onMouseMove={this.getMouse}
                                onMouseMove={this.getMouse} 
                                onMouseDown={this.changeRecordState(3)}
                                onMouseUp={this.finishRecord(3)}
                            />
                        </DtwDraw>
                    </div>
                </div>
        )
    }
}