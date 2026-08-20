import {startDeviceDiscovery} from './discovery.js'
import {strartTcpServer} from './tcp-server.js'
import { connectToDevice } from './tcp-client.js';
import { getDevices } from './discovery-registery.js';


const UDP_PORT = Number(process.argv[2]) ?? 4242;
const TCP_PORT = Number(process.argv[3]) ?? 8080;

startDeviceDiscovery(UDP_PORT, TCP_PORT);
strartTcpServer(TCP_PORT);

export const connections = new Map();

setInterval(() => {
    
    const devices = getDevices();

    console.log("Discovered devices : ", devices);

    devices?.forEach(device=>{
        if (!connections.has(device.sessionId)) {
    const client = connectToDevice(device);
    connections.set(device.sessionId, client);
}
    })
    
}, 3000);