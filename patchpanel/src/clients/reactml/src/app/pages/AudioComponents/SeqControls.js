import React from "react";
import {Grid} from "./Grid";
    
export class SeqControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedScale: props.selectedScale,
        }
        this.handleScaleChange = this.handleScaleChange.bind(this);
    }
    
    handleScaleChange(changeEvent){
        // pass through onChange event to handleScaleChange and set state
        this.props.handleScaleChange(changeEvent);
        this.setState({
            selectedScale:changeEvent.target.value
        });
    }

    render() {
    var controlsContainerStyle  = {
        padding: 10, 
        marginTop: 10, 
        marginRight: 20,
        display: "inline-block",
        float: "left",
        backgroundColor: "#bbbbbb",
        borderRadius: "1%",
        width: 150,
        height: 500,
    };
    var sliderStyle = {
        type: "range"
    }

    return (        
        <div className="controls-container" style = {controlsContainerStyle}> 
            <div>
                <form action="#" id="scale-form">
                    <div className="scale-radio">
                        <label><input type="radio" 
                                value="scale01" 
                                checked = {this.state.selectedScale === 'scale01'}
                                onChange={this.handleScaleChange}/> Keyboard </label> <br/>
                    </div>
                    <div className="scale-radio">
                        <label><input type="radio" 
                                value="scale02" 
                                checked = {this.state.selectedScale === 'scale02'}
                                onChange={this.handleScaleChange}/> Grid </label> <br/>
                    </div>
                    
                </form>
                <input 
                    type="checkbox"
                    onClick={this.props.handleSustainNote}
                /> Sustain consecutive notes
            </div>
            <Grid 
                channels={4}
                numSteps={4}
                scale={[0,2,4,5,7,9,11]} 
                isPiano={false}
                presetSaved={this.props.presetSaved}
                gridState={this.props.presetState}
                handleGridClick={this.props.handlePresetClick}
            />
            presets (shift click to save)
            <br/>
            <button onClick={(e) => this.props.handleClear(e)} /> clear<br/>
            <button onClick={(e) => this.props.handleScramble(e)} /> scramble<br/>
             
        </div>
        
        
    );
    }
}
