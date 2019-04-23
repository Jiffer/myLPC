Audio Components readme

The compoents are expected to be connected in as follows:
Conductor -> SequencerWrapper -> SynthWrapper
or
Conductor -> SequencerWrapper -> SamplerWrapper


To use:
Conductor: name the connection that it will send out "pulse" on

Sequencers: name the input connection to match the Conductor output
name the output to control either sampler or Synth - as currently instantiated the 13 channel seq should to go the synth and 4 channel to the sampler

Sampler
real time controls:
volume
rate  - how fast to playback audio file (0: 2x) default is 1x
startPercentage
stopPercentage


The Machine Learning Component can control the preset on a sequencer(s) (use classifier) or the filter cutoff frequency in the Synthesizer (use regression)


SequencerWrapper 
This component includes the logic to keep track of what beat is next. It listens for a pulse from the Conductor. I believe the "current beat" count should be moved to the conductor so multiple sequencers will always be syncrhonized. If desired different sequencers could still be triggered on arbitrary beats with some additional logic blocks to manipulate the conductor counter. For instance, adding/subtracting an offset, a slower counter that increments every time the main counter counts 4, or a delay object.

Sustain Consecutive Notes - when unchecked a "note off" message is sent at the end of the step. When checked adjacent notes become one longer note, that is if adjacent notes are on a "note off" is not sent every step, but only after the last step of a channel is turned off
Presets: Grid of 16. Hold shift and click to store a value
-- Note: The number of "channels" in the sequencer need to match the number of voices in the synth or sampler


SynthWrapper
-- has a SubtractiveSynth object and corresonding GUI component in SynthControls
-- It uses a Grid that turns on and off each voice
SubtractiveSynth contains a web Audio oscillatorNode connected to a Bi-Quad Filter configured as a Low-Pass, and two gain Nodes. One gain node is used for an ADSR envelope and the other is the synth master volume.
Controls are:
Oscillator:
-- Waveform: sine, triangle, square, sawtooth
-- Note / Frequency
Filter: 
-- Cutoff, 
-- Q (quality factor, large values create a more peaky filter, aka resonance)
Envelope:
-- ADSR: Attack time, Decay time, Sustain level, Release time

SamplerWrapper
-- has a Sampler object and corresponding GUI component SamplerControls
Sampler uses webaudio buffer object to load a sound file with a URL. Currently there are 4 sound files that are included with the build that are hard coded into the 4 Sampler channels.
Controls:
Play Sample
Volume
Playback Rate: between 0:2x 
Sample Start: where to start playback in the file. This is a number between 0 and 1 that represents a percentage of the sound file.
Sample Stop

Grid 
-- lower level component used in seq and synth
-- specify number of channels (rows) and steps (columns) 
-- click handler needs to be passed in from above



TODO:
Fix the CSS 

Move counter back to Conductor - the "current step" is kept in the 
sequencer but this runs the risk that multiple sequencers could get 
out of sync with each other.

Enable entering different values of notes in the sequencer e.g. quarter note, eighth note, etc.

Conductor should use a different scheduling scheme that will use the 
audio clock instead of a javascript timeout
see: https://www.html5rocks.com/en/tutorials/audio/scheduling/ 

Add color prop for background of grid so it can be differentiated in its different uses

fix how keyboard note colors are assigned - it should be based on the current scale and notes

Display what notes are being used 

Make conductor stepsize use BPM instead of ms per step