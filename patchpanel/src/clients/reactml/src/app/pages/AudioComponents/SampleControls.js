import React from "react";
import {Grid} from "./Grid";


export class SampleControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
            index: this.props.index,
            key: this.props.key
        }
        
    }
    
    render() {
    var controlsContainerStyle  = {
        padding: 10, 
        marginTop: 10, 
        marginRight: 20,
        display: "inline-block",
        float: "left",
        backgroundColor: "#cccccc",
        borderRadius: "1%",
        width: 300,
        height: 170,
    };
    var sliderStyle = {
        type: "range"
    }

    return (        
        <div className="controls-container" style = {controlsContainerStyle}> 
            
            <button onClick={(e) => this.props.handleSamplePlayClick(e, this.props.index)} />
            {this.props.name}
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue="0.5"
                    onChange={(e) =>this.props.handleVolumeChange(e, this.props.index)}/> Volume
            <input type="range" 
                    min="0.01" max="2" step="0.01"
                    defaultValue="1.0"
                    onChange={(e) =>this.props.handleSampleRate(e, this.props.index)}/> Playback Rate
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue="0"
                    onChange={(e) =>this.props.handleStartPercentage(e, this.props.index)}/> Sample Start
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue="1"
                    onChange={(e) =>this.props.handleStopPercentage(e, this.props.index)}/> Sample Stop
        </div>
        
        
    );
    }
}
