import {getDataConnection} from '../client'

function init ():void {
  var haveJoinedRoom = false

  // Elements
  var privateButton = <HTMLInputElement> document.getElementById('private')
  var form = document.getElementById('msg-form')
  var messageBox = <HTMLInputElement> document.getElementById('msg-box')
  var boxFile = <HTMLInputElement> document.getElementById('msg-file')
  var msgList = document.getElementById('msg-list')
  var upgradeMsg = document.getElementById('upgrade-msg')
  var msgSubmitButton = <HTMLInputElement> document.getElementById('msg-submit')

  var roomForm = <HTMLFormElement> document.getElementById('room-form')
  var roomBox = <HTMLInputElement> document.getElementById('room-box')
  var roomSubmitButton = <HTMLInputElement> document.getElementById('room-button') 

  //don't allow people to send stuff until they choose a room
  msgSubmitButton.disabled = true

  var connection = null;

  
  roomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + roomBox.value)
    connection = getDataConnection(roomBox.value)
    msgSubmitButton.disabled = false
    roomBox.disabled = true
    roomSubmitButton.disabled = true
    haveJoinedRoom = true

    connection.onDataReceived((key:string, value:any)=>{
      if (haveJoinedRoom){
        var li = document.createElement('li')
        li.appendChild(document.createTextNode(key + ": " + value ))
        msgList.appendChild(li)
      }
    })
  })


  form.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(messageBox.value))
    msgList.appendChild(li)

    connection.send("chat", messageBox.value );

    messageBox.value = ''
    boxFile.value = ''
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
