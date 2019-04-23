
import * as React from 'react';

let FA = require('react-fontawesome');


export default class Box extends React.Component {
    constructor(props) {
        super();
        this.state = {
            // may not need these states anymore since all is coming through in props...
            inputValue: 'None Chosen',
            outputValue: 'None Chosen',
            algorithm: 'None Chosen',
            mbitValue: 'None Chosen',
        }
        this.getComponentLayout = this.getComponentLayout.bind(this);
    }

    
    componentWillReceiveProps(newProps) {

        if (newProps.component) {
            //console.log('component received is ' + newProps.component)
        }
        if (newProps.output) {
            //console.log('output received is ' + newProps.output)
        }
        if (newProps.component == this.props.boxType) {
            console.log('component same as box')
            if (newProps.output) {
                this.setState({
                    outputValue: newProps.output
                });
            }
            if (newProps.input) {
                this.setState({
                    inputValue: newProps.input
                }, () => console.log('update inputValue to ', this.state.inputValue));
            }
            if (newProps.algorithm) {
                this.setState({
                    algorithm: newProps.algorithm
                });
            }
            if (newProps.mbitValue) {
                this.setState({
                    mbitValue: newProps.mbitValue
                });
            }
        }
    }

    getComponentLayout() {
        let layout = {
            paddingLeft: 10,
        }
        switch(this.props.boxType) {
            case('microBit'):
                return(
                    <div style={layout}>
                        <h5> Output: {this.state.outputValue} </h5>
                        <br/>
                        <h5> Sending: {this.state.mbitValue} </h5>
                    </div>
                );
                break;
            case('ml'):
                return(
                    <div style={layout}>
                        <h5> Input: {this.state.inputValue} </h5>
                        <h5> Output: {this.state.outputValue} </h5>
                        <br/>
                        <h5> Algorithm: {this.state.algorithm} </h5>
                    </div>
                );
                break;
            case('color'):
                console.log('color box receiving ', this.state.inputValue)
                return( 
                    <div style={layout}>
                        <h5> Input: {this.state.inputValue} </h5>
                    </div>
                );
                break;
            default:
                break;
        }
    }

    render() {

        let boxStyle = {
            position: 'relative',
            width: 200,
            height: 200,
            borderColor: 'black',
            borderStyle: 'solid',
            display: 'inline-block',
            verticalAlign: 'top',
            left: this.props.left,
            textAlign: 'left',
        }
        
        let label = {
            width: '100%',
            height: '25%',
            borderColor: 'black',
            borderStyle: 'solid',
            textAlign: 'center',
            marginLeft: 0,
        }

        return(
            <div 
                style={boxStyle} 
                onClick={ () => {
                    console.log('clicked ', this.props.boxType);
                    if (this.props.changeView) {
                        this.props.changeView(this.props.boxType, true) //set the specified component to true 
                    }
                }
            }>
                <div style={label}>
                    <h4>{this.props.boxType}</h4>
                </div>
                {this.getComponentLayout()}

            </div>
        );
    }
}