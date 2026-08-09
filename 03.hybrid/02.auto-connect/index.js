import {startDeviceDiscovery} from './discovery.js'
import {strartTcpServer} from './tcp-server.js'
import { connectToDevice } from './tcp-client.js';
import { getDevices } from './discovery-registery.js';

startDeviceDiscovery()
strartTcpServer();

setInterval(() => {
    
    const devices = getDevices();

    console.log("Discovered devices : ", devices);

    devices?.forEach(device=>{
        connectToDevice(device)
    })
    
}, 3000);