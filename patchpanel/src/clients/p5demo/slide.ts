import {getDataConnection} from '../client'

function init ():void {
  var haveJoinedRoom = false

  // Elements
  var roomForm = <HTMLFormElement> document.getElementById('room-form')
  var roomBox = <HTMLInputElement> document.getElementById('room-box')
  var roomSubmitButton = <HTMLInputElement> document.getElementById('room-button') 

  var soundForm = <HTMLFormElement> document.getElementById('sound-form')
  var volumeSlider = <HTMLInputElement> document.getElementById('volume-slider')
  var pitchSlider = <HTMLInputElement> document.getElementById('pitch-slider') 


  //don't allow people to send stuff until they choose a room
  volumeSlider.disabled = true
  pitchSlider.disabled = true

  var connection = null;

  //might as well sync our sliders with others in the room
  let handleDataReceived = (key:string, value:any)=> {
    if (key == "volume"){
        volumeSlider.value = value;
    }else if (key == "pitch"){
        pitchSlider.value = value;
    }else{
        console.log("received unknown data key: " + key )
    }
  }

  roomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + roomBox.value)
    connection = getDataConnection(roomBox.value)
    roomBox.disabled = true
    roomSubmitButton.disabled = true
    haveJoinedRoom = true
    volumeSlider.disabled = false
    pitchSlider.disabled = false

    connection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })

  volumeSlider.addEventListener('input', function (e:Event) {
      connection.send("volume", volumeSlider.value)
  })

  pitchSlider.addEventListener('input', function (e:Event) {
      connection.send("pitch", pitchSlider.value)
  })


  // privateButton.addEventListener('click', function (e) {
  //   goPrivate()
  //   p2psocket.emit('go-private', true)
  // })

  // p2psocket.on('go-private', function () {
  //   goPrivate()
  // })

  // function goPrivate () {
  //   p2psocket.useSockets = false
  //   upgradeMsg.innerHTML = 'WebRTC connection established!'
  //   privateButton.disabled = true
  // }
}

document.addEventListener('DOMContentLoaded', init, false)