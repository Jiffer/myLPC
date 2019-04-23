
Note: I will be updating this readme as the repo is updated

To install, start by cloning the repo in the reactml branch directory in patchpanel 

    1. git clone git@github.com:LaboratoryForPlayfulComputation/patchpanel.git

Then Type the following in terminal in the patchpanel folder:

    2. cd patchpanel (you should now be in the patchpanel folder)
    3. git fetch origin feature/reactideas (this will fetch the branch that you will be using from github)
    4. git checkout feature/reactideas (this will switch us over to the feature/reactideas branch)
    5. cd src/clients/reactml (you should now be in the reactml folder)
        - Note: everything you will need is in the reactml folder (the .hex file is in the reactml folder titled
        mbit-accelerometer.hex)
    6. npm install 

After this, the app should be installed....

    Continuing on, 

    7. Type npm start to start the application ... wait until your terminal says webpack: Compiled successfully.
        (this should take roughly 20-40 seconds)
    8. Open up your browser and go to localhost:9000
    9. You should see the basic application with three different "boxes"

    Wooooo! Now about the app...


    To see each of the GUI elements, click on the boxes.


The Elements

    1. microBit

        a. The Microbit Connect Button - this will open up the option to connect your microbit via bluetooth, upon which
        once finished the microbit will be running whatever code on it to the page
        b. Below the MicroBit are values that let you know once data is coming in (the values will change)
        c. RoutableValues - when a box is checked, you will be sending that value to a particular socketconnection once 
        the corresponding connection is selected from the dropdown

    2. MLpage
    
        First off, this page is organized into three sections, 
        
        a. The Connection and Algorithm Dropdown Selections on the left
            i) Input Connection Type - this currently supported dataTypes that you can receive data from and that have
            various 'filters' you can pass the data through.
            ii) "Type" Connections - Upon selection of an input dataType, you will see the available named connections that 
            serve that dataType. Currently, these connections are hardcoded in, but eventually they will be stored on a
            server. Make sure you choose an input connection that has data coming to it (i.e. from an output connection)
            iii) Output Connection Type - the same idea but for an output
            iv) "Type" Connections - Upon selection of an output dataTypes, these are the avaiable rooms that will be
            looking for data of that particular type.
            v) ml (Machine Learning) - Here you will select the type of machine learning algorithm you will use on your
            data. There are three types of Algorithms supported currently: Classification, Regression, and Temporal 
            Classification. Standard Classification Algorithms produce discrete outputs from static data, Regression 
            Algorithms produce continuous outputs from static data, and Temporal Classification Algorithms look at data
            over time and attempt to categorize patterns in the temporal data.
            vi) Type of Algorithm - these will be the supported algorithms for that class of machine learning algorithms.
            Currently there is only one algorithm supported for each algorithm type.

        b. The Training Interface in the middle
            i) Toggle Data Input - By Default, the training interface is set to grab data from the "mouse rectangle". If you
            wish to send it data from somewhere else (i.e. a microbit), you need to set up an output and input connection, so
            toggle the 'Connection as Input' so it appears green.
            ii) Training Options - To be able to use machine learning, it needs training examples (i.e. recorded data), it 
            needs to train the algorithm on those examples, and then can run the algorithm on new incoming examples. The
            following options are provided:

                - Click to record | Recording   (recording options)
                - Click to train | Trained (lets you know if the algorithm is trained or not)
                - Click to run | Running! (running options)
                - Clear training data | Cleared! (Maybe you aren't getting great results and want to add a better/more 
                concise training example => clear the training set and redo!)
                - Show Train Set => show the training set in the console (for debugging/seeing what values you are sending)
                - Click to Show Boundaries => only works with the Mouse Rectangle interface
                - Select Length of Inputs => Used to specify the length of inputs coming into the machine learning 
                component. This will send an alert and automatically set the right number if not preset, so don't feel the
                need to set this... it figures it out itself.
                - *****Select Training Output*****
                    => this is important to understand!
                        -> each time you record a training example (press record, data is sent, then press the record button 
                        again), the data, plus output values are sent to the training set. This is how training data is 
                        labelled with a specific output and trained on that data. By default, the training output is set to
                        0, but it can be set from 0 to 9 to produce any of those outputs.
                - Classification Output => this is where you will the calcuated output of the trained, running algorithm in 
                response to incoming data. It will take that data, run it through the algorithm, get an output, and show it
                on the right side of the colon (:)

        c. The machine learning mouse interface on the right.
            - This interface is used with the 'Mouse as Input' option from the Training Interface. If recording, each click
            records a training data point to the training set. Once Trained and running, clicks will produce a Classification
            output and the expected color of the data point. Once can click the 'Click to Show Boundaries' to show the 
            Boundaries of the dataset (cool visualization to try once the algorithm is trained). Make sure the algorithm is
            not running when you press 'Click to Show Boundaries'


Overview of how I would go about using the interface.

    - First play with the mouse rectangle, recording, training, running, and clearning data. Make sure to set a machine
    learning algorithm before you train, otherwise you will see an alert reminding you to do so. As an aside, Dynamic Time
    Warping will may not work well with the Mouse Interface (I haven't tried it yet, but if you're curious let me know if 
    there are any bugs there). Once you feel comfortable with the Training Interface, upload the hex file I've included to
    your microbit, and use the microbit page to set up a connection between the microbit page and machine learning page
    using a connection with the same name on the output as input (otherwise data will not be sent to the correct place).
    Here I would recommend playing with the Dynamic Time Warping (DTW) Algorithm. 
    
    Some tips on using DTW:

        - Only record 3-4 Training Example MAX each time you train and run. Currently, the program is not optimized, and may
        tax your browser if you training examples are too long (longer than 3-4 seconds), you may need to exit out and reopen
        a browser if this happens, but nothing bad or harmful will happen! If you have 3-4 training examples and want to
        record more, I recommend clearning the training set and starting over.
        - Try to make the examples distinct from one another in how they start and/or finish
        - Try to start recording (press the record button) as close as you can to the start of the motion, and stop recording
        as close as you can to the finish of the motion (this is where two people would come in handy later).
        

I'm excited to hear how it goes and get more feedback, feel free to ping me or put your feedback on BaseCamp in The Lab in a
folder called Webinator Feedback under a doc called Feedback.


        
    connection and using







_______------------------------------------------------


