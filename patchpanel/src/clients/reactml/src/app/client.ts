//module PatchboardClient {
    let socketiop2p = require('socket.io-p2p')
    var io = require('socket.io-client')

    export interface DataConnection {      
        //contains the onDataReceived and send functions
        onDataReceived(handler: (key:string, value:any)=>void);  
        send(key:string, value:any);
    }

    class WebRTCDataConnection implements DataConnection{
        socketIOconnection:any;
        p2pConnection:any;
        dataHandler:(key:string, value:any)=>void;

        constructor(roomName:string){
            let newConnection = io('localhost:4000');
            this.socketIOconnection = newConnection;
            let newP2Pconnection = new socketiop2p(newConnection);
            this.p2pConnection = newP2Pconnection;

            //console.log('newConnection is ', newConnection);
            //console.log('newP2Pconnection is ', newP2Pconnection);

            //on the regular websocket
            newConnection.on('connect', function() {
                newConnection.emit('join-room', roomName)
            });
            
            this.p2pConnection.on('ready', function(){
                console.log("new socketiop2p ready!")
            });
        } 

        onDataReceived(handler:(key:string, value:any)=>void):void{
            this.dataHandler = handler;
            this.p2pConnection.on('peer-msg', (data:{key:string, value:any})=>{
                this.dataHandler(data.key, data.value);
            })

        }

        send(key:string, value:any){
            this.p2pConnection.emit('peer-msg', {key: key, value:value });
        }
    }

    export function getDataConnection(roomName:string):DataConnection {
        return new WebRTCDataConnection(roomName);
    }