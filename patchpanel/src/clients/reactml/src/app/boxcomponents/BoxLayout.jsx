
import * as React from 'react';

import Box from './Box.jsx';

let FA = require('react-fontawesome');


export default class BoxLayout extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let boxLayoutStyle = {
            display: this.props.visibilityState,
            position: 'relative',
            width: '100%',
            minWidth: 1000,
            top: 200
        }
        return (
            <div 
                className="container" 
                style={boxLayoutStyle}
            >
            {console.log('visibility state of boxLayout is ', this.props.visibilityState)}
                <Box 
                    left={'10%'} 
                    boxType={'microBit'} 
                    changeView={this.props.changeView} 
                    component={this.props.component}
                    input={this.props.input}
                    output={this.props.output}
                    algorithm={this.props.algorithm}
                    mbitValue={this.props.mbitValue}
                />
                <div style={{position: 'relative', display: 'inline-block', left: '20%', top:50}}>
                    <FA name='long-arrow-right' size='5x' />
                </div>
                <Box 
                    left={'30%'} 
                    boxType={'ml'} 
                    changeView={this.props.changeView} 
                    component={this.props.component}
                    input={this.props.input}
                    output={this.props.output}
                    algorithm={this.props.algorithm}
                    mbitValue={this.props.mbitValue}
                />
                <div style={{position: 'relative', display: 'inline-block', left: '40%', top:50}}>
                    <FA name='long-arrow-right' size='5x' />
                </div>
                <Box 
                    left={'50%'} 
                    boxType={'color'} 
                    changeView={this.props.changeView}
                    component={this.props.component}
                    input={this.props.input}
                    output={this.props.output}
                    algorithm={this.props.algorithm}
                    mbitValue={this.props.mbitValue}
                />

            </div>
        );
    }
}