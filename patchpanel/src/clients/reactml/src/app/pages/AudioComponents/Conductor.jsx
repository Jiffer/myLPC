// Conductor.ts
import React from "react";
import ReactDOM from 'react-dom';
import {getDataConnection} from '../../client';

let outputConnection;

export default class Conductor extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            tempo: 150,
            isRunning: false,
            intervalID: null,
            connectionFormValue: '',
            connectionName: ''
        }
        this.handleRunButton = this.handleRunButton.bind(this)
        this.handleOutputSubmit = this.handleOutputSubmit.bind(this)
        this.handleConnectionInput = this.handleConnectionInput.bind(this)
        this.sendPulse = this.sendPulse.bind(this)
    }
    
    render(){
        let conductorContainerStyle = {
            padding: 10, 
        marginTop: 10, 
        display: "inline-block",
        float: "left",
        backgroundColor: "#cccccc",
        borderRadius: "5%",
        width: 200,
        height: 200,
        webkitFilter: "drop-shadow(0px 0px 5px #666)",
        filter: "drop-shadow(0px 0px 5px #666)"

        }
        // add style for div to show pulse
        return(
            <div style= {conductorContainerStyle}>
                <input 
                    type="checkbox"
                    /* checked={this.state.runChecked} */
                    onClick={this.handleRunButton}
                /> Run

                <input type="range" 
                    min="50" max="300" step="0.01"
                    defaultValue="150"
                    onChange={(e) => this.setTempo(e)}
                /> timeStep: {this.state.tempo}
                <div>  
                </div>
                <div>
                    <form 
                        onSubmit={this.handleOutputSubmit}
                        >
                        <label>
                            <input 
                                type="text" 
                                value={this.state.connectionFormValue}
                                onChange={this.handleConnectionInput}
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                    sending to: {this.state.connectionName}
                </div>
            </div>
        );

    }

    handleRunButton(e){
        console.log("set running: " + e.target.checked);
        if(e.target.checked)
        {   
            this.state.intervalID = setTimeout(this.sendPulse, this.state.tempo);
            // setinterval
        }else{
            // cancel intervals
            clearTimeout(this.state.intervalID);
        }

        if(this.outputConnection != null){
            this.outputConnection.send("runStop", e.target.checked);
        }

        this.setState({
            isRunning: e.target.checked,
        });
    }

    handleOutputSubmit(event){
        console.log("setting connection to: " + this.state.connectionFormValue);
        if(this.outputConnection){
            this.outputConnection.p2pConnection.disconnect();
        }
        this.outputConnection  = getDataConnection(this.state.connectionFormValue);
        this.setState({
            connectionFormValue: '',
            connectionName:this.state.connectionFormValue
        })
        event.preventDefault();
    }
    handleConnectionInput(event){
        this.setState({
            connectionFormValue: event.target.value
        })
    }
    
    setTempo(e){
        this.setState({
            tempo: e.target.value
        })
    }
    
    sendPulse(){
        let intervalID  = setTimeout(this.sendPulse, this.state.tempo)
        this.setState({
            intervalID: intervalID
        });

        if(this.outputConnection != null){
            this.outputConnection.send("pulse", "click")
        }

    }
    
  
}