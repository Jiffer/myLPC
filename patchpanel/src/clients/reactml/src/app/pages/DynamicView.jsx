
import * as React from 'react';

import MbitPage from './MbitPage.tsx';
import MlPage from './MlPage.jsx';
import ColorPage from './ColorPage.jsx';
import BoxLayout from '../boxcomponents/BoxLayout.jsx';

export default class DynamicView extends React.Component {
    constructor(props) {
        super();

        this.state = {
            microBitVisibility: 'none',
            mlGuiVisibility: 'none',
            colorPageVisibility: 'none',
            boxLayoutVisibility: 'inline',
            component: 'none',
            output: null,
            input: null,
            algorithm: null,
            mbitValue: null,
            //have to dynamically add output and input state for each component
            //(i.e. have input for ml and color)

        }
        console.log('initialized color page state as ', this.state.colorPageVisibility)

        this.boolToDisplayStatus = this.boolToDisplayStatus.bind(this);
    
    }

    boolToDisplayStatus(boolean) {
        if (boolean) return 'inline';
        else return 'none';
    }

    //relays the type of change (i.e. input room, algorithm, etc. to the correct state change)
    relayValue(component, type, newValue) {  //component:string, type:string, value:string
        console.log('component is: ' + component + ', type is: ' + type + ', newValue is ' + newValue)
        this.setState({
            component: component,
            [type]: newValue
        }, () => {
            console.log('state of component updated to ' + this.state.component);
            console.log('state of ' + type + ' updated to ' + this.state[type]);
        });
    }

    changeView(component, currentState) {  //component:string, currentState:string
        console.log('component: ' + component + ', currentState: ' + currentState);
        switch (component) {
            case 'microBit':
                //if make mbitpage opposite of current, make boxLayout current
                this.setState({
                    microBitVisibility: this.boolToDisplayStatus(currentState), 
                    boxLayoutVisibility: this.boolToDisplayStatus(!currentState)
                }, () => 1);
                break;

            case 'ml':
                this.setState({
                    mlGuiVisibility: this.boolToDisplayStatus(currentState),
                    boxLayoutVisibility: this.boolToDisplayStatus(!currentState)
                }, () => 1); 
                break;

            case 'color':
                this.setState({
                    colorPageVisibility: this.boolToDisplayStatus(currentState),
                    boxLayoutVisibility: this.boolToDisplayStatus(!currentState)
                }, () => 1);
                break;

            case 'boxLayout':
                console.log('in boxlayout');
                this.setState({
                    boxLayoutVisibility: this.boolToDisplayStatus(!currentState),
                    microBitVisibility: this.boolToDisplayStatus(currentState),
                    mlGuiVisibility: this.boolToDisplayStatus(currentState),
                    colorPageVisibility: this.boolToDisplayStatus(currentState),
                }, () => 1);
                break;
        }
    }

    render() {
        return (
            <div className="container" style={{width:'100%', height:'100%'}}>
                <MbitPage 
                    changeView={this.changeView.bind(this)} 
                    visibilityState={this.state.microBitVisibility}
                    relayValue={this.relayValue.bind(this)}
                />

                <MlPage 
                    changeView={this.changeView.bind(this)} 
                    visibilityState={this.state.mlGuiVisibility}
                    relayValue={this.relayValue.bind(this)}
                />

                <ColorPage
                    changeView={this.changeView.bind(this)}
                    visibilityState={this.state.colorPageVisibility}
                    relayValue={this.relayValue.bind(this)}
                />

                <BoxLayout 
                    changeView={this.changeView.bind(this)} 
                    visibilityState={this.state.boxLayoutVisibility} 
                    component={this.state.component}
                    input={this.state.input}
                    output={this.state.output}
                    algorithm={this.state.algorithm}
                    mbitValue={this.state.mbitValue}
                />

            </div>
        );
    }
}