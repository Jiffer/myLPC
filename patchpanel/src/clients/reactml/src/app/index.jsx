
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MlPage from './pages/MlPage.jsx';
//import {MbitInterface} from './pages/components/MbitInterface.tsx';
//import DtwInterface from './pages/components/DtwInterface.jsx'

import DynamicView from './pages/DynamicView.jsx';
import MbitPage from './pages/MbitPage.tsx';

import Conductor from './pages/AudioComponents/Conductor';
import SynthWrapper from './pages/AudioComponents/SynthWrapper';
import SequencerWrapper from './pages/AudioComponents/SequencerWrapper';
import SamplerWrapper from './pages/AudioComponents/SamplerWrapper';



/*
class App extends React.Component {
    
    render() {
        return (
            <div className="container" style={{float: 'left'}}>
                <MbitPage/>
            </div>
        );
    }
}
*/



/*<DynamicView/>*/
class App extends React.Component {
    render() {
        return (
            <div className="container" style={{width:'100%'}}>
                <DynamicView/>
                <div style={{position:'absolute', top: 600}}>
                    <Conductor/>
                    <br/>
                    
                    <SequencerWrapper
                        numSteps = {16}
                        numChannels = {13}/>
                    
                    <SynthWrapper/>
                    
                    <SequencerWrapper
                        numSteps = {16}
                        numChannels = {4}/>
                    <SamplerWrapper/>
                    
                </div>
            </div>
        );
    }
}



ReactDOM.render(
    <App/>, 
    document.getElementById("render-target")
);