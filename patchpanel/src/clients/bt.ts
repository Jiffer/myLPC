

export let MBIT_UART_SERVICE  = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); //to send TO the microbit
export let MBIT_UART_RX_CHARACTERISTIC = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); //to send TO the microbit
export let MBIT_UART_TX_CHARACTERISTIC = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); //to receive data FROM the microbit

export let bluetoothSearchOptions:RequestDeviceOptions = {
    filters: [{ 
        namePrefix: "BBC micro:bit",
    }],
    optionalServices: [MBIT_UART_SERVICE]
};

export interface MessageSubscriber{
    (message:string):void;
}

export class MicroBitUART{
    rxCharacteristic:BluetoothRemoteGATTCharacteristic;
    txCharacteristic:BluetoothRemoteGATTCharacteristic;

    private messageSubscribers:Array<MessageSubscriber> = []; 
    private decoder: TextEncoding.TextDecoder;

    constructor(rxCharacteristic:BluetoothRemoteGATTCharacteristic, txCharacteristic:BluetoothRemoteGATTCharacteristic){
        this.rxCharacteristic = rxCharacteristic;
        this.txCharacteristic = txCharacteristic;

        this.decoder = new TextDecoder();

        this.txCharacteristic.startNotifications().then(characteristic =>{
            characteristic.addEventListener('characteristicvaluechanged', ev => {
                let value:ArrayBufferView = (<any>(event.target)).value;
                let valueAsString:string = new TextDecoder().decode(value);
                this.handleNewMessage(valueAsString);
            } );
        });
    }

    subscribeToMessages(receiver:MessageSubscriber):void{
        this.messageSubscribers.push(receiver);
    }

    private handleNewMessage(message:string):void{
        this.messageSubscribers.forEach(subscriber => {
            subscriber(message);
        })
    }

}

