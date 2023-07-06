import React, {useState} from 'react';
const uuid = "51ad213f-e568-4e35-84e4-67af89c79ef0";
const ConnectBluetooth = () => {
    const [success, setSuccess] = useState(false);
    /*useEffect(() => {
        
    }, []);*/

    const connect = async () => {


  console.log('Requesting Bluetooth Device...');
  let conn = await navigator.bluetooth.requestDevice({filters: [{name: "Cato"}]})
  .then(device => {
    console.log('Connecting to GATT Server...', device);
    return device.gatt.connect().then(server => {
        console.log('Getting Service...', server);
        return server.getPrimaryServices(uuid);
      })
    ;
  })
//   .then(server => {
//     console.log('Getting Service...', server);
//     return server.getPrimaryServices(uuid);
//   })
//   .then(service => {
//     console.log('Getting Characteristic...');
//     return service.getCharacteristic(characteristicUuid);
//   })
//   .then(characteristic => {
//     console.log('> Characteristic UUID:  ' + characteristic.uuid);
//     console.log('> Broadcast:            ' + characteristic.properties.broadcast);
//     console.log('> Read:                 ' + characteristic.properties.read);
//     console.log('> Write w/o response:   ' +
//       characteristic.properties.writeWithoutResponse);
//     console.log('> Write:                ' + characteristic.properties.write);
//     console.log('> Notify:               ' + characteristic.properties.notify);
//     console.log('> Indicate:             ' + characteristic.properties.indicate);
//     console.log('> Signed Write:         ' +
//       characteristic.properties.authenticatedSignedWrites);
//     console.log('> Queued Write:         ' + characteristic.properties.reliableWrite);
//     console.log('> Writable Auxiliaries: ' +
//       characteristic.properties.writableAuxiliaries);
//   })
  .catch(error => {
    console.log('Argh! ' + error);
  });







        // console.log("getService:", BluetoothUUID.getService("Cato"));
        // const device = await navigator.bluetooth.requestDevice({
        //     filters: [{
        //         name: "Cato"
        //     }]
        // })
        // .then(cato => {
        //     console.log("cato:", cato);
        //     cato.gatt.connect().then(cato => {
        //         console.log("connected cato", cato, cato.device.id);
        //         cato.gatt.getPrimaryServices(cato.gatt.uuid);
        //     });
        // })
        // .catch(error => {
        //     console.log(error);
        // })
        // console.log("device:", device);
        // console.log(device.get("gatt"));

        //const gatt = await device.gatt.connect();
        //console.log(gatt);

    }

    return(
        <div>
            <p>Connect Cato via Bluetooth</p>
            <button onClick={connect} onKeyDown={() => {}}>Connect</button>
        </div>
    )
}

export default ConnectBluetooth;