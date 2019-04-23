import React from "react";

// lowest level comp is Box
class Gridbox extends React.Component{
    constructor(props){
        super();
        this.state = {
            index: props.index,
            blackKey: props.blackKey,
            display: props.display,
            value: props.value,
            //TODO: add displayValue: note name or channel number
        };
    }
    
    render() { // change to pass in props rather than hold in state
        var boxColor;
        if(!this.props.blackKey){
            if(!this.props.value){
                boxColor = "#ffffff"
            }else{
                boxColor = "#555555";
            }
        }else{
            if(!this.props.value){
                boxColor = "#bbbbbb"
            }else{
                boxColor = "#000000"
            }
        }
        var margin = 1;
        if(this.state.index%4 == 0){
            margin = 2;
        }
        
        var boxStyle ={
            background: boxColor,
            margin: 1, 
            width: 25,
            borderRadius: "10%",
            float: "left", 
            height: 15
        }
        return (
        <div 
            className='grid-box' 
            style={boxStyle} 
            onClick={(e) => this.props.handleClick(e, this.state.index)}
        > 
            {this.props.display}  
        </div>
        );   //TODO: add optional display value
    }
    };
    
    export class Grid extends React.Component {
      constructor(props) {    
        // var gridState
        // if (props.gridState){
        //     console.log("got grid state: " + props.gridState);
        //     gridState = props.gridState
        // }else{
        //     gridState = Array(props.numSteps * props.channels).fill(false);
        // }

        super();
        this.state = {
            channels: props.channels,
            numSteps: props.numSteps,
            scale: props.scale,
            // gridState: gridState
        };
        this.handleClick = this.handleClick.bind(this);
      }
      
      handleClick(e, i){ // beat, note
        this.props.handleGridClick(e, i);
      }
    
      renderBox(i, nl) {
        var currentChannel = this.state.channels - Math.floor(i / this.state.numSteps) - 1;
        var keyIsBlack = false;
        if(this.props.isPiano){
            var blackKeys = [1, 3, 6, 8, 10];
            
            // if there is a scale check if current scale degree is a black key
            if(this.props.scale != null){
                for(var k = 0; k < blackKeys.length; k++){ 
                    if (this.props.scale[(currentChannel) % this.props.scale.length]  == blackKeys[k])
                    { keyIsBlack = true; }        
                }
            }
        }else{
            if (this.props.presetSaved != undefined){
                keyIsBlack = this.props.presetSaved[i];
            }
        }
        var newStep = <Gridbox
                index={i} 
                channel={currentChannel}
                value={this.props.gridState[i]}
                blackKey={keyIsBlack}
                handleClick={(e, i) => this.handleClick(e, i)}
                key={i}
            />
        if(nl){return(
                <div key={i}>
                {newStep}
                </div> )
        }else return (
            newStep
        );
      }
      
      render() {
        var gridContainerStyle = {
                padding: 10, 
                marginTop: 10, 
                display: "inline-block",
                float: "left",
                backgroundColor: "#aaabbb",
                borderRadius: "1%",
                width: this.state.numSteps * 30 + 10,
                
                height: this.state.channels * 17 + 20,
            };
        
        var numSteps= [];
        {
            var newLine = false;
            for(var j = 0; j < this.state.channels; j++){
                for (var i = 0; i < this.state.numSteps; i++){
                    numSteps.push(this.renderBox(j*this.state.numSteps + i, newLine));
                    if(i == 0){newLine = false;}
                }
                newLine = true;
            }
        }

        var gridStyle = {
            float: "left",
         }
        return (
            
            <div className="grid-container" style ={gridContainerStyle}> 
                
                <div className="grid" style={gridStyle}>
                {numSteps}
                </div>
                <br/>

            </div>
            
        );
      }
    }
    