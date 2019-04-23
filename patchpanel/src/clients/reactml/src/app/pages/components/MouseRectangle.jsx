

import React, { Component } from 'react';
import ReactDOM, {render} from 'react-dom';


let colors = {
    0: 'blue',
    1: 'red',
    2: 'green',
    3: 'purple',
    4: 'powderblue',
    5: 'coral',
    6: 'brown',
    7: 'grey',
    8: 'cadetblue',
    9: 'yellow'
};


class Circle extends Component {
    constructor(props) {
        super();
    }

    render() {
        let circle = {
            position: 'relative',
            left: this.props.mouseX,
            top: this.props.mouseY,
            width: this.props.diameter,
            height: this.props.diameter,
            borderRadius: '50%',
            backgroundColor: this.props.color,
            padding: 0,
            margin: 0,
        }
        return(
            <div style={circle}>
            </div>
        );
    }
}

export class MouseRectangle extends Component{
    constructor(props){
        super();
        this.state = {
            mouseX: 0,
            mouseY: 0,
            trainX: 0,
            trainY: 0,
            circles: [],
            yAdjust: 0,
            color: 'blue',
        }
        this.mouseCoords = this.mouseCoords.bind(this);
        //this.displayCoords = this.displayCoords.bind(this);
        this.getMousePos = this.getMousePos.bind(this);
        this.addChild = this.addChild.bind(this);
        this.addClassifyPt = this.addClassifyPt.bind(this);
        this.sendGraphPoints = this.sendGraphPoints.bind(this);

        this.showCircles = this.showCircles.bind(this);

        this.boundaryState = false;
        this.numChildren = 0
        this.numCalcd = 500
        this.dataPoints = []
        this.diameter = 5
        this.classifiedPoints = []
        this.color='blue'
        
        //this.createCircle = this.createCircle.bind(this);
    }

    x = 3
    y = 0

    /** On to something here, try to run show boundary from component will receive props to create circles as props received */
    componentWillReceiveProps(nextProps) {
        if (nextProps.color) {
            this.setState({
                color: nextProps.color,
            }, () => 1
            );
        }
        
        if (nextProps.clearState) {
            this.dataPoints = [];
            this.numChildren = 0;
            this.setState({
                circles: this.dataPoints,
            }, () => 1); //console.log('cleared dataset'));
        }
        if (nextProps.boundaryState != this.boundaryState) {
                this.boundaryState = nextProps.boundaryState;
            if (this.boundaryState) {
                console.log('incoming boundaryState is: ' + nextProps.boundaryState);
                console.log('set boundarystate to ' + this.boundaryState);
                this.sendGraphPoints()
            }
            else {
                this.numCalcd = 500
                this.classifiedPoints = []
                this.setState({
                    circles: this.dataPoints
                });
            }
        }
        if (nextProps.classifiedPoints && nextProps.boundaryState && !nextProps.boundaryDone) {
            this.addClassifyPt(nextProps.classifiedPoints);
            
        }
    }

    addChild() {
        this.numChildren +=1;
        this.dataPoints.push(
            <Circle
               mouseX={this.state.mouseX} 
               mouseY={this.state.mouseY}
               diameter={this.diameter}
               key={this.numChildren}
               color={this.props.color}
            />
        );

        //this.props.handleData([event.clientX - window.innerWidth + 525, event.clientY-18 + this.numChildren*5]); 
        console.log('bg color for circle is: ' + this.state.color);
        
        this.setState({
            circles: this.dataPoints,
            //yAdjust: this.state.yAdjust + 1
        });
    }

    sendGraphPoints() {
        let xyPts = []
        for (let x=3; x<579; x+=20) {
            for (let y=0; y<464; y+=20) {
                //this.props.handleData(x,y)
                xyPts.push([x,y]);
            }
        }
        this.props.handleData(xyPts);
    }

    addClassifyPt(classifiedPoints) {
        classifiedPoints.forEach( 
            ([ [x,y], color]) => {
                //console.log( [x, y], color + ' was receieved for Circle!');
                this.numCalcd += 1
                //console.log('num calcd = ' + this.numCalcd)
                this.classifiedPoints.push(
                    <Circle
                        mouseX={x}
                        mouseY={y-(this.numCalcd-495)*this.diameter}
                        diameter={this.diameter}
                        key={this.numCalcd}
                        color={color}
                    />
                );
            }
        );
        
        this.setState({
            circles: this.classifiedPoints
        }, console.log(this.state.circles));
    }

    mouseCoords(event) {
        this.props.handleData([this.state.trainX, this.state.trainY]);
        if (this.props.recordState) {
            this.addChild();
        }
        //only add datapoints if in recordstate, otherwise just use cursor color for classifying
    }


    getMousePos(event) {

        let elem = document.getElementById('mousebox')
        
        /* old way of doing it
        this.setState({
            mouseX: event.clientX - window.innerWidth + 582,
            mouseY: event.clientY - window.innerHeight + 790 - this.numChildren*this.diameter,
            //mouse y + is either 524 or 780, not sure why
            
            //hacky way of getting the circle to be at the mouse -> come back to this later
        }, 
            //preset the training data for when mouse is clicked
            () => this.setState({
                trainX: this.state.mouseX + 8,
                trainY: this.state.mouseY + this.numChildren*this.diameter + 42 
            },
                () => 1//console.log('mouseX:' + this.state.mouseX + ', mouseY: ' + this.state.mouseY)
            )
        );
        */

        /** new way, still hacky but works on window resize */
        event = event || window.event;
        this.setState({
            mouseX: event.pageX - 863,
            mouseY: event.pageY - 90
        }, () => this.setState({
                trainX: this.state.mouseX + 8,
                trainY: this.state.mouseY + this.numChildren*this.diameter + 42 
            },
                () => 1//console.log('mouseX:' + this.state.mouseX + ', mouseY: ' + this.state.mouseY)
            )
        );

        
        
    }

    showCircles() {
        console.log(this.state.circles);
    }

    render() {
        let rectangle = {
            width:600, //was 600
            height: 500,
            borderColor: 'black',
            borderStyle: 'solid',
            margin: 'auto',
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: 5,
        }

        return (
            <div id='mousebox'
                style={rectangle} 
                onClick= {this.mouseCoords}
                onMouseMove={this.getMousePos}
            > 
                <h4> Mouse Coords: {this.state.trainX} {this.state.trainY} </h4>
                {this.state.circles}
                <Circle  //mouse circle
                    color={this.props.color || 'black'}
                    diameter={15}
                    mouseX={this.state.mouseX}
                    mouseY={this.state.mouseY}
                />
            </div>
        );
    }
}

